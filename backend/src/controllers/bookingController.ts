import { Request, Response } from 'express';
import { Booking, Customer } from '../models';
import { BookingStatus, AppointmentType } from '../models/Booking';
import { Op } from 'sequelize';
import { calculatePrice } from '../utils/priceCalculator';

export const bookingController = {
  // Create a new booking
  async createBooking(req: Request, res: Response) {
    try {
      const {
        customerName,
        customerEmail,
        phone,
        date,
        time,
        serviceType,
        vehicleType,
        vehicleYear,
        vehicleMake,
        vehicleModel,
        condition,
        extras,
        appointmentType,
        notes,
        paymentMethod
      } = req.body;

      // Validate required fields
      if (!customerEmail || !date || !time || !serviceType || !vehicleType) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: customerEmail, date, time, serviceType, vehicleType'
        });
      }

      // Find or create customer
      let customer = await Customer.findOne({ where: { email: customerEmail } });
      if (!customer) {
        customer = await Customer.create({
          name: customerName || 'Guest Customer',
          email: customerEmail,
          phone: phone || undefined,
        });
      }

      // Calculate price
      const price = await calculatePrice({
        serviceType,
        vehicleType,
        extras: extras || [],
        condition: condition || 'good',
      });

      // Generate reference number
      const referenceNumber = `AG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create booking
      const booking = await Booking.create({
        customerId: customer.id,
        date: new Date(date),
        time,
        serviceType,
        vehicleType,
        vehicleYear: vehicleYear || undefined,
        vehicleMake: vehicleMake || undefined,
        vehicleModel: vehicleModel || undefined,
        condition: condition || undefined,
        extras: extras || [],
        appointmentType: appointmentType || AppointmentType.STUDIO,
        totalPrice: price,
        status: BookingStatus.PENDING,
        paymentMethod: paymentMethod || undefined,
        paymentStatus: 'pending',
        notes: notes || undefined,
        referenceNumber,
      });

      // Populate customer info
      const bookingWithCustomer = await Booking.findByPk(booking.id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.status(201).json({
        success: true,
        data: bookingWithCustomer,
        message: 'Booking created successfully'
      });
    } catch (error: any) {
      console.error('❌ Create booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating booking',
        error: error.message
      });
    }
  },

  // Get all bookings (with pagination and filtering)
  async getAllBookings(req: Request, res: Response) {
    try {
      const {
        page = '1',
        limit = '20',
        status,
        dateFrom,
        dateTo,
        customerEmail
      } = req.query;

      const pageNum = parseInt(page as string);
      const limitNum = parseInt(limit as string);
      const offset = (pageNum - 1) * limitNum;

      const where: any = {};
      
      if (status) {
        where.status = status;
      }
      
      if (dateFrom && dateTo) {
        where.date = {
          [Op.between]: [new Date(dateFrom as string), new Date(dateTo as string)]
        };
      }

      const include: any[] = [{ 
        model: Customer, 
        as: 'customer',
        ...(customerEmail && { where: { email: customerEmail } })
      }];

      const { count, rows } = await Booking.findAndCountAll({
        where,
        include,
        limit: limitNum,
        offset,
        order: [['date', 'DESC'], ['time', 'DESC']]
      });

      res.json({
        success: true,
        data: rows,
        pagination: {
          total: count,
          page: pageNum,
          pages: Math.ceil(count / limitNum),
          limit: limitNum
        }
      });
    } catch (error: any) {
      console.error('❌ Get all bookings error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching bookings',
        error: error.message
      });
    }
  },

  // Get booking by ID
  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const booking = await Booking.findByPk(id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      console.error('❌ Get booking by ID error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Get booking by reference number
  async getBookingByReference(req: Request, res: Response) {
    try {
      const { reference } = req.params;
      
      const booking = await Booking.findOne({
        where: { referenceNumber: reference },
        include: [{ model: Customer, as: 'customer' }]
      });

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      res.json({
        success: true,
        data: booking
      });
    } catch (error: any) {
      console.error('❌ Get booking by reference error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking',
        error: error.message
      });
    }
  },

  // Update booking status
  async updateBookingStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      // Validate status
      if (!Object.values(BookingStatus).includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${Object.values(BookingStatus).join(', ')}`
        });
      }

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.update({
        status,
        notes: notes || booking.notes
      });

      // If completed, update customer loyalty points
      if (status === BookingStatus.COMPLETED && booking.paymentStatus === 'paid') {
        const customer = await Customer.findByPk(booking.customerId);
        if (customer) {
          const pointsToAdd = Math.floor(Number(booking.totalPrice) / 100); // 1 point per R100
          await customer.update({
            loyaltyPoints: customer.loyaltyPoints + pointsToAdd,
            totalSpent: Number(customer.totalSpent) + Number(booking.totalPrice)
          });
        }
      }

      // Fetch updated booking with customer
      const updatedBooking = await Booking.findByPk(id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.json({
        success: true,
        data: updatedBooking,
        message: 'Booking status updated successfully'
      });
    } catch (error: any) {
      console.error('❌ Update booking status error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating booking',
        error: error.message
      });
    }
  },

  // Update payment status
  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { paymentStatus, paymentMethod } = req.body;

      // Validate payment status
      const validStatuses = ['pending', 'paid', 'failed'];
      if (!validStatuses.includes(paymentStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      await booking.update({
        paymentStatus,
        paymentMethod: paymentMethod || booking.paymentMethod
      });

      // If payment is successful, update booking status to confirmed
      if (paymentStatus === 'paid' && booking.status === BookingStatus.PENDING) {
        await booking.update({ status: BookingStatus.CONFIRMED });
      }

      const updatedBooking = await Booking.findByPk(id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.json({
        success: true,
        data: updatedBooking,
        message: 'Payment status updated successfully'
      });
    } catch (error: any) {
      console.error('❌ Update payment status error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating payment status',
        error: error.message
      });
    }
  },

  // Get available time slots for a date
  async getAvailableSlots(req: Request, res: Response) {
    try {
      // FIX: Changed from req.params to req.query to match your Postman GET request
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({
          success: false,
          message: 'Date parameter is required. Use ?date=YYYY-MM-DD'
        });
      }

      // Validate date format
      const requestedDate = new Date(date as string);
      if (isNaN(requestedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format. Use YYYY-MM-DD'
        });
      }

      const bookings = await Booking.findAll({
        where: {
          date: requestedDate,
          status: {
            [Op.in]: [BookingStatus.PENDING, BookingStatus.CONFIRMED]
          }
        },
        attributes: ['time']
      });

      const bookedSlots = bookings.map(b => b.time);
      
      const allSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
      const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));

      res.json({
        success: true,
        data: {
          date: date,
          availableSlots,
          bookedSlots,
          totalSlots: allSlots.length,
          availableCount: availableSlots.length
        }
      });
    } catch (error: any) {
      console.error('❌ Get available slots error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching available slots',
        error: error.message
      });
    }
  },

  // Cancel booking
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const booking = await Booking.findByPk(id);
      
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
      }

      // Check if booking can be cancelled
      if (booking.status === BookingStatus.CANCELLED) {
        return res.status(400).json({
          success: false,
          message: 'Booking is already cancelled'
        });
      }

      if (booking.status === BookingStatus.COMPLETED) {
        return res.status(400).json({
          success: false,
          message: 'Completed bookings cannot be cancelled'
        });
      }

      const cancellationNote = reason 
        ? `${booking.notes || ''}\n[Cancelled: ${reason}]` 
        : `${booking.notes || ''}\n[Cancelled by user]`;

      await booking.update({
        status: BookingStatus.CANCELLED,
        notes: cancellationNote.trim()
      });

      const cancelledBooking = await Booking.findByPk(id, {
        include: [{ model: Customer, as: 'customer' }]
      });

      res.json({
        success: true,
        data: cancelledBooking,
        message: 'Booking cancelled successfully'
      });
    } catch (error: any) {
      console.error('❌ Cancel booking error:', error);
      res.status(500).json({
        success: false,
        message: 'Error cancelling booking',
        error: error.message
      });
    }
  },

  // Get booking statistics
  async getBookingStats(req: Request, res: Response) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        cancelledBookings,
        monthlyRevenue,
        weeklyBookings,
        todayBookings
      ] = await Promise.all([
        Booking.count(),
        Booking.count({ where: { status: BookingStatus.PENDING } }),
        Booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        Booking.count({ where: { status: BookingStatus.COMPLETED } }),
        Booking.count({ where: { status: BookingStatus.CANCELLED } }),
        Booking.sum('totalPrice', {
          where: {
            status: BookingStatus.COMPLETED,
            paymentStatus: 'paid',
            date: { [Op.gte]: startOfMonth }
          }
        }),
        Booking.count({
          where: {
            date: { [Op.gte]: startOfWeek }
          }
        }),
        Booking.count({
          where: {
            date: today
          }
        })
      ]);

      res.json({
        success: true,
        data: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          cancelledBookings,
          monthlyRevenue: monthlyRevenue || 0,
          weeklyBookings,
          todayBookings,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error: any) {
      console.error('❌ Get booking stats error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching booking statistics',
        error: error.message
      });
    }
  }
};