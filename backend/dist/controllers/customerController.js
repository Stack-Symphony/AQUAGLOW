"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerController = void 0;
const models_1 = require("../models");
const Booking_1 = require("../models/Booking");
const sequelize_1 = require("sequelize");
exports.customerController = {
    // Get all customers
    async getAllCustomers(req, res) {
        try {
            const { page = 1, limit = 20, search } = req.query;
            const pageNum = parseInt(page);
            const limitNum = parseInt(limit);
            const offset = (pageNum - 1) * limitNum;
            const where = {};
            if (search) {
                where[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.iLike]: `%${search}%` } },
                    { email: { [sequelize_1.Op.iLike]: `%${search}%` } },
                    { phone: { [sequelize_1.Op.iLike]: `%${search}%` } }
                ];
            }
            const { count, rows } = await models_1.Customer.findAndCountAll({
                where,
                limit: limitNum,
                offset,
                order: [['totalSpent', 'DESC']]
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
                message: 'Error fetching customers',
                error: error.message
            });
        }
    },
    // Get customer by ID
    async getCustomerById(req, res) {
        try {
            const { id } = req.params;
            const customer = await models_1.Customer.findByPk(id, {
                include: [{
                        model: models_1.Booking,
                        as: 'bookings',
                        order: [['date', 'DESC']],
                        limit: 10
                    }]
            });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            res.json({
                success: true,
                data: customer
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching customer',
                error: error.message
            });
        }
    },
    // Get customer by email
    async getCustomerByEmail(req, res) {
        try {
            const { email } = req.params;
            const customer = await models_1.Customer.findOne({
                where: { email },
                include: [{
                        model: models_1.Booking,
                        as: 'bookings',
                        where: {
                            status: {
                                [sequelize_1.Op.ne]: Booking_1.BookingStatus.CANCELLED
                            }
                        },
                        order: [['date', 'DESC']],
                        required: false
                    }]
            });
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            res.json({
                success: true,
                data: customer
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching customer',
                error: error.message
            });
        }
    },
    // Update customer
    async updateCustomer(req, res) {
        try {
            const { id } = req.params;
            const customer = await models_1.Customer.findByPk(id);
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            await customer.update(req.body);
            res.json({
                success: true,
                data: customer,
                message: 'Customer updated successfully'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating customer',
                error: error.message
            });
        }
    },
    // Get customer statistics
    async getCustomerStats(req, res) {
        try {
            const { id } = req.params;
            const customer = await models_1.Customer.findByPk(id);
            if (!customer) {
                return res.status(404).json({
                    success: false,
                    message: 'Customer not found'
                });
            }
            const bookings = await models_1.Booking.findAll({
                where: { customerId: id }
            });
            const completedBookings = bookings.filter(b => b.status === Booking_1.BookingStatus.COMPLETED);
            const pendingBookings = bookings.filter(b => b.status === Booking_1.BookingStatus.PENDING);
            const cancelledBookings = bookings.filter(b => b.status === Booking_1.BookingStatus.CANCELLED);
            const totalSpent = completedBookings.reduce((sum, booking) => {
                return sum + parseFloat(booking.totalPrice.toString());
            }, 0);
            const averageSpent = completedBookings.length > 0
                ? totalSpent / completedBookings.length
                : 0;
            const lastBooking = bookings.length > 0
                ? bookings.reduce((latest, booking) => {
                    return new Date(booking.date) > new Date(latest.date) ? booking : latest;
                })
                : null;
            res.json({
                success: true,
                data: {
                    customer: {
                        name: customer.name,
                        email: customer.email,
                        loyaltyPoints: customer.loyaltyPoints,
                        totalSpent: customer.totalSpent
                    },
                    statistics: {
                        totalBookings: bookings.length,
                        completedBookings: completedBookings.length,
                        pendingBookings: pendingBookings.length,
                        cancelledBookings: cancelledBookings.length,
                        averageSpent: Math.round(averageSpent * 100) / 100,
                        lastBooking: lastBooking ? {
                            date: lastBooking.date,
                            service: lastBooking.serviceType,
                            amount: lastBooking.totalPrice
                        } : null
                    }
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error fetching customer statistics',
                error: error.message
            });
        }
    },
    // Search customers
    async searchCustomers(req, res) {
        try {
            const { query } = req.query;
            if (!query || query.toString().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: 'Search query must be at least 2 characters'
                });
            }
            const customers = await models_1.Customer.findAll({
                where: {
                    [sequelize_1.Op.or]: [
                        { name: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { email: { [sequelize_1.Op.iLike]: `%${query}%` } },
                        { phone: { [sequelize_1.Op.iLike]: `%${query}%` } }
                    ]
                },
                limit: 20,
                order: [['name', 'ASC']]
            });
            res.json({
                success: true,
                data: customers
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error searching customers',
                error: error.message
            });
        }
    }
};
//# sourceMappingURL=customerController.js.map