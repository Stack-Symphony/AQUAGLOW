"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingController = void 0;
const models_1 = require("../models");
const Booking_1 = require("../models/Booking");
const sequelize_1 = require("sequelize");
const priceCalculator_1 = require("../utils/priceCalculator");
exports.bookingController = {
    // Create a new booking
    async createBooking(req, res) {
        try {
            const { customerName, customerEmail, phone, date, time, serviceType, vehicleType, vehicleYear, vehicleMake, vehicleModel, condition, extras, appointmentType, notes, paymentMethod } = req.body;
            // Find or create customer
            let customer = await models_1.Customer.findOne({ where: { email: customerEmail } });
            if (!customer) {
                customer = await models_1.Customer.create({
                    name: customerName,
                    email: customerEmail,
                    phone,
                });
            }
            // Calculate price
            const price = await (0, priceCalculator_1.calculatePrice)({
                serviceType,
                vehicleType,
                extras,
                condition,
            });
            // Generate reference number
            const referenceNumber = `AG-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
            // Create booking
            const booking = await models_1.Booking.create({
                customerId: customer.id,
                date,
                time,
                serviceType,
                vehicleType,
                vehicleYear,
                vehicleMake,
                vehicleModel,
                condition,
                extras: extras || [],
                appointmentType: appointmentType || Booking_1.AppointmentType.STUDIO,
                totalPrice: price,
                status: Booking_1.BookingStatus.PENDING,
                paymentMethod,
                paymentStatus: 'pending',
                notes,
                referenceNumber,
            });
            // Populate customer info
            const bookingWithCustomer = await models_1.Booking.findByPk(booking.id, {
                include: [{ model: models_1.Customer, as: 'customer' }]
            });
            res.status(201).json({
                success: true,
                data: bookingWithCustomer,
                message: 'Booking created successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating booking',
                error: error.message
            });
        }
    },
    // Get all bookings (with pagination and filtering)
    async getAllBookings(req, res) {
        try {
            const { page = 1, limit = 20, status, dateFrom, dateTo, customerEmail } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const where = {};
            if (status)
                where.status = status;
            if (dateFrom && dateTo) {
                where.date = {
                    [sequelize_1.Op.between]: [new Date(dateFrom), new Date(dateTo)]
                };
            }
            const include = [{ model: models_1.Customer, as: 'customer' }];
            if (customerEmail) {
                include[0].where = { email: customerEmail };
            }
            const { count, rows } = await models_1.Booking.findAndCountAll({
                where,
                include,
                limit: limitNum,
                offset,
                order: [['date', 'DESC']]
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching bookings',
                error: error.message
            });
        }
    },
    // Get booking by ID
    async getBookingById(req, res) {
        try {
            const { id } = req.params;
            const booking = await models_1.Booking.findByPk(id, {
                include: [{ model: models_1.Customer, as: 'customer' }]
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching booking',
                error: error.message
            });
        }
    },
    // Get booking by reference number
    async getBookingByReference(req, res) {
        try {
            const { reference } = req.params;
            const booking = await models_1.Booking.findOne({
                where: { referenceNumber: reference },
                include: [{ model: models_1.Customer, as: 'customer' }]
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching booking',
                error: error.message
            });
        }
    },
    // Update booking status
    async updateBookingStatus(req, res) {
        try {
            const { id } = req.params;
            const { status, notes } = req.body;
            const booking = await models_1.Booking.findByPk(id);
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
            if (status === Booking_1.BookingStatus.COMPLETED && booking.paymentStatus === 'paid') {
                const customer = await models_1.Customer.findByPk(booking.customerId);
                if (customer) {
                    const pointsToAdd = Math.floor(booking.totalPrice / 100); // 1 point per R100
                    await customer.update({
                        loyaltyPoints: customer.loyaltyPoints + pointsToAdd,
                        totalSpent: parseFloat(customer.totalSpent.toString()) + parseFloat(booking.totalPrice.toString())
                    });
                }
            }
            res.json({
                success: true,
                data: booking,
                message: 'Booking status updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating booking',
                error: error.message
            });
        }
    },
    // Update payment status
    async updatePaymentStatus(req, res) {
        try {
            const { id } = req.params;
            const { paymentStatus, paymentMethod } = req.body;
            const booking = await models_1.Booking.findByPk(id);
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
            if (paymentStatus === 'paid' && booking.status === Booking_1.BookingStatus.PENDING) {
                await booking.update({ status: Booking_1.BookingStatus.CONFIRMED });
            }
            res.json({
                success: true,
                data: booking,
                message: 'Payment status updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating payment status',
                error: error.message
            });
        }
    },
    // Get available time slots for a date
    async getAvailableSlots(req, res) {
        try {
            const { date } = req.params;
            const bookings = await models_1.Booking.findAll({
                where: {
                    date: new Date(date),
                    status: {
                        [sequelize_1.Op.in]: [Booking_1.BookingStatus.PENDING, Booking_1.BookingStatus.CONFIRMED]
                    }
                },
                attributes: ['time']
            });
            const bookedSlots = bookings.map(b => b.time);
            // Define available slots (9 AM to 5 PM, every 2 hours)
            const allSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
            const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
            res.json({
                success: true,
                data: {
                    date,
                    availableSlots,
                    bookedSlots
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching available slots',
                error: error.message
            });
        }
    },
    // Cancel booking
    async cancelBooking(req, res) {
        try {
            const { id } = req.params;
            const { reason } = req.body;
            const booking = await models_1.Booking.findByPk(id);
            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
            // Check if booking can be cancelled
            if (booking.status === Booking_1.BookingStatus.CANCELLED) {
                return res.status(400).json({
                    success: false,
                    message: 'Booking is already cancelled'
                });
            }
            if (booking.status === Booking_1.BookingStatus.COMPLETED) {
                return res.status(400).json({
                    success: false,
                    message: 'Completed bookings cannot be cancelled'
                });
            }
            await booking.update({
                status: Booking_1.BookingStatus.CANCELLED,
                notes: reason ? `${booking.notes || ''}\nCancelled: ${reason}` : booking.notes
            });
            res.json({
                success: true,
                data: booking,
                message: 'Booking cancelled successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error cancelling booking',
                error: error.message
            });
        }
    },
    // Get booking statistics
    async getBookingStats(req, res) {
        try {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay());
            const [totalBookings, pendingBookings, confirmedBookings, completedBookings, monthlyRevenue, weeklyBookings, todayBookings] = await Promise.all([
                models_1.Booking.count(),
                models_1.Booking.count({ where: { status: Booking_1.BookingStatus.PENDING } }),
                models_1.Booking.count({ where: { status: Booking_1.BookingStatus.CONFIRMED } }),
                models_1.Booking.count({ where: { status: Booking_1.BookingStatus.COMPLETED } }),
                models_1.Booking.sum('totalPrice', {
                    where: {
                        status: Booking_1.BookingStatus.COMPLETED,
                        date: { [sequelize_1.Op.gte]: startOfMonth }
                    }
                }),
                models_1.Booking.count({
                    where: {
                        date: { [sequelize_1.Op.gte]: startOfWeek }
                    }
                }),
                models_1.Booking.count({
                    where: {
                        date: today.toISOString().split('T')[0]
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
                    monthlyRevenue: monthlyRevenue || 0,
                    weeklyBookings,
                    todayBookings
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching booking statistics',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=bookingController.js.map