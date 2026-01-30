"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCustomer = exports.validateService = exports.validateBooking = void 0;
const joi_1 = __importDefault(require("joi"));
const validateBooking = (req, res, next) => {
    const schema = joi_1.default.object({
        customerName: joi_1.default.string().min(2).max(100).required(),
        customerEmail: joi_1.default.string().email().required(),
        phone: joi_1.default.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
        date: joi_1.default.date().min('now').required(),
        time: joi_1.default.string().pattern(/^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/).required(),
        serviceType: joi_1.default.string().required(),
        vehicleType: joi_1.default.string().valid('SEDAN', 'COUPE', 'HATCHBACK', 'SUV', 'TRUCK', 'LUXURY').required(),
        vehicleYear: joi_1.default.string().pattern(/^[0-9]{4}$/).optional(),
        vehicleMake: joi_1.default.string().optional(),
        vehicleModel: joi_1.default.string().optional(),
        condition: joi_1.default.string().valid('LIGHT', 'MODERATE', 'HEAVY').optional(),
        extras: joi_1.default.array().items(joi_1.default.string()).default([]),
        appointmentType: joi_1.default.string().valid('studio', 'mobile').default('studio'),
        notes: joi_1.default.string().optional(),
        paymentMethod: joi_1.default.string().valid('card', 'cash').optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }
    next();
};
exports.validateBooking = validateBooking;
const validateService = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        description: joi_1.default.string().min(10).required(),
        basePrice: joi_1.default.number().min(0).required(),
        duration: joi_1.default.number().min(15).required(),
        vehicleTypes: joi_1.default.array().items(joi_1.default.string()).default([]),
        category: joi_1.default.string().valid('basic', 'deluxe', 'premium').required(),
        features: joi_1.default.array().items(joi_1.default.string()).default([]),
        imageUrl: joi_1.default.string().uri().optional(),
        active: joi_1.default.boolean().default(true)
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }
    next();
};
exports.validateService = validateService;
const validateCustomer = (req, res, next) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
        address: joi_1.default.string().optional(),
        loyaltyPoints: joi_1.default.number().min(0).optional(),
        totalSpent: joi_1.default.number().min(0).optional()
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            error: error.details[0].message
        });
    }
    next();
};
exports.validateCustomer = validateCustomer;
//# sourceMappingURL=validation.js.map