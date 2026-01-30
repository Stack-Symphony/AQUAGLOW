"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.customValidators = exports.validationSchemas = void 0;
exports.validate = validate;
exports.sanitizeAndValidate = sanitizeAndValidate;
const joi_1 = __importDefault(require("joi"));
const types_1 = require("../types");
exports.validationSchemas = {
    // Booking validation
    createBooking: joi_1.default.object({
        customerName: joi_1.default.string().min(2).max(100).required().messages({
            'string.empty': 'Customer name is required',
            'string.min': 'Customer name must be at least 2 characters',
            'string.max': 'Customer name must be less than 100 characters'
        }),
        customerEmail: joi_1.default.string().email().required().messages({
            'string.empty': 'Customer email is required',
            'string.email': 'Please enter a valid email address'
        }),
        phone: joi_1.default.string().pattern(/^[0-9\-\+\(\) ]+$/).optional().messages({
            'string.pattern.base': 'Please enter a valid phone number'
        }),
        date: joi_1.default.date().min('now').required().messages({
            'date.base': 'Please enter a valid date',
            'date.min': 'Booking date cannot be in the past'
        }),
        time: joi_1.default.string().pattern(/^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/).required().messages({
            'string.empty': 'Time slot is required',
            'string.pattern.base': 'Please select a valid time slot'
        }),
        serviceType: joi_1.default.string().required().messages({
            'string.empty': 'Service type is required'
        }),
        vehicleType: joi_1.default.string().valid(...Object.values(types_1.CarType)).required().messages({
            'any.only': 'Please select a valid vehicle type',
            'string.empty': 'Vehicle type is required'
        }),
        vehicleYear: joi_1.default.string().pattern(/^[0-9]{4}$/).optional().messages({
            'string.pattern.base': 'Please enter a valid year (YYYY)'
        }),
        vehicleMake: joi_1.default.string().optional(),
        vehicleModel: joi_1.default.string().optional(),
        condition: joi_1.default.string().valid(...Object.values(types_1.CarCondition)).optional().messages({
            'any.only': 'Please select a valid condition'
        }),
        extras: joi_1.default.array().items(joi_1.default.string().valid(...Object.values(types_1.ExtraService))).default([]),
        appointmentType: joi_1.default.string().valid(...Object.values(types_1.AppointmentType)).default(types_1.AppointmentType.STUDIO),
        notes: joi_1.default.string().optional().max(500).messages({
            'string.max': 'Notes must be less than 500 characters'
        }),
        paymentMethod: joi_1.default.string().valid('card', 'cash').optional()
    }),
    // Update booking status
    updateBookingStatus: joi_1.default.object({
        status: joi_1.default.string().valid(...Object.values(types_1.BookingStatus)).required(),
        notes: joi_1.default.string().optional().max(500)
    }),
    // Update payment status
    updatePaymentStatus: joi_1.default.object({
        paymentStatus: joi_1.default.string().valid('pending', 'paid', 'failed').required(),
        paymentMethod: joi_1.default.string().valid('card', 'cash').optional()
    }),
    // Service validation
    createService: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        description: joi_1.default.string().min(10).required(),
        basePrice: joi_1.default.number().min(0).required(),
        duration: joi_1.default.number().min(15).required(),
        vehicleTypes: joi_1.default.array().items(joi_1.default.string().valid(...Object.values(types_1.CarType))).default([]),
        category: joi_1.default.string().valid('basic', 'deluxe', 'premium').required(),
        features: joi_1.default.array().items(joi_1.default.string()).default([]),
        imageUrl: joi_1.default.string().uri().optional(),
        active: joi_1.default.boolean().default(true)
    }),
    // Customer validation
    createCustomer: joi_1.default.object({
        name: joi_1.default.string().min(2).max(100).required(),
        email: joi_1.default.string().email().required(),
        phone: joi_1.default.string().pattern(/^[0-9\-\+\(\) ]+$/).optional(),
        address: joi_1.default.string().optional(),
        loyaltyPoints: joi_1.default.number().min(0).optional(),
        totalSpent: joi_1.default.number().min(0).optional()
    }),
    // Price calculation
    calculatePrice: joi_1.default.object({
        serviceType: joi_1.default.string().required(),
        vehicleType: joi_1.default.string().valid(...Object.values(types_1.CarType)).required(),
        extras: joi_1.default.array().items(joi_1.default.string().valid(...Object.values(types_1.ExtraService))).default([]),
        condition: joi_1.default.string().valid(...Object.values(types_1.CarCondition)).optional()
    }),
    // Pagination
    pagination: joi_1.default.object({
        page: joi_1.default.number().min(1).default(1),
        limit: joi_1.default.number().min(1).max(100).default(20),
        sortBy: joi_1.default.string().optional(),
        sortOrder: joi_1.default.string().valid('asc', 'desc').default('desc')
    }),
    // Date range
    dateRange: joi_1.default.object({
        startDate: joi_1.default.date().required(),
        endDate: joi_1.default.date().required().greater(joi_1.default.ref('startDate'))
    }),
    // Search query
    searchQuery: joi_1.default.object({
        query: joi_1.default.string().min(2).required(),
        fields: joi_1.default.array().items(joi_1.default.string()).default(['name', 'email'])
    }),
    // Email validation
    email: joi_1.default.string().email().required(),
    // Phone validation (South Africa)
    phoneSA: joi_1.default.string().pattern(/^(\+27|27|0)[0-9]{9}$/).required(),
    // Password validation
    password: joi_1.default.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .required()
        .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
        'string.min': 'Password must be at least 8 characters long',
        'string.max': 'Password must be less than 30 characters long'
    }),
    // URL validation
    url: joi_1.default.string().uri().required(),
    // ID validation (UUID)
    uuid: joi_1.default.string().uuid().required(),
    // Reference number validation
    referenceNumber: joi_1.default.string().pattern(/^AG-[A-Z0-9]+-[A-Z0-9]+$/).required()
};
/**
 * Validate data against a schema
 */
function validate(data, schema) {
    const { error, value } = schema.validate(data, { abortEarly: false });
    if (error) {
        const errors = error.details.map(detail => detail.message);
        return { valid: false, errors };
    }
    return { valid: true, data: value };
}
/**
 * Sanitize and validate input
 */
function sanitizeAndValidate(input, schema) {
    const sanitized = JSON.parse(JSON.stringify(input)); // Deep clone
    const result = validate(sanitized, schema);
    if (!result.valid) {
        throw new Error(result.errors?.join(', ') || 'Validation failed');
    }
    return result.data;
}
/**
 * Custom validators
 */
exports.customValidators = {
    // Validate South African ID number
    isValidSAId(id) {
        // Basic validation - in production use a proper library
        if (!/^\d{13}$/.test(id))
            return false;
        // Check date part
        const year = parseInt(id.substring(0, 2));
        const month = parseInt(id.substring(2, 4));
        const day = parseInt(id.substring(4, 6));
        if (month < 1 || month > 12)
            return false;
        if (day < 1 || day > 31)
            return false;
        return true;
    },
    // Validate credit card number (basic Luhn check)
    isValidCreditCard(cardNumber) {
        // Remove all non-digit characters
        const cleaned = cardNumber.replace(/\D/g, '');
        // Check if it's a valid length
        if (cleaned.length < 13 || cleaned.length > 19)
            return false;
        // Luhn algorithm
        let sum = 0;
        let isEven = false;
        for (let i = cleaned.length - 1; i >= 0; i--) {
            let digit = parseInt(cleaned.charAt(i), 10);
            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }
            sum += digit;
            isEven = !isEven;
        }
        return sum % 10 === 0;
    },
    // Validate expiry date (MM/YY format)
    isValidExpiryDate(expiry) {
        const match = expiry.match(/^(\d{2})\/(\d{2})$/);
        if (!match)
            return false;
        const month = parseInt(match[1], 10);
        const year = parseInt('20' + match[2], 10); // Assuming 21st century
        if (month < 1 || month > 12)
            return false;
        const now = new Date();
        const expiryDate = new Date(year, month - 1); // Last day of expiry month
        return expiryDate >= now;
    },
    // Validate CVV
    isValidCVV(cvv, cardType) {
        const length = cvv.length;
        const isNumeric = /^\d+$/.test(cvv);
        if (!isNumeric)
            return false;
        // American Express CVV is 4 digits, others are 3
        if (cardType === 'amex') {
            return length === 4;
        }
        return length === 3;
    },
    // Validate vehicle registration (South Africa)
    isValidVehicleRegistration(reg) {
        // Basic pattern for South African registrations
        const patterns = [
            /^[A-Z]{2}\s?\d{2}\s?[A-Z]{2}\s?\d{4}$/, // CA 123 AB 1234
            /^[A-Z]{3}\s?\d{3}\s?\d{3}$/, // ABC 123 456
            /^[A-Z]{2}\s?\d{3}\s?-\s?\d{3}$/, // CA 123 - 456
        ];
        return patterns.some(pattern => pattern.test(reg.toUpperCase()));
    },
    // Validate VIN (Vehicle Identification Number)
    isValidVIN(vin) {
        // Basic VIN validation - in production use a proper library
        if (vin.length !== 17)
            return false;
        // Should not contain I, O, or Q
        if (/[IOQ]/.test(vin.toUpperCase()))
            return false;
        return true;
    }
};
exports.default = {
    validationSchemas: exports.validationSchemas,
    validate,
    sanitizeAndValidate,
    customValidators: exports.customValidators
};
//# sourceMappingURL=validation.js.map