"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateReferenceNumber = generateReferenceNumber;
exports.generateShortId = generateShortId;
exports.formatPrice = formatPrice;
exports.calculateTotalPrice = calculateTotalPrice;
exports.formatDate = formatDate;
exports.isValidBookingDate = isValidBookingDate;
exports.isValidTimeSlot = isValidTimeSlot;
exports.getAvailableTimeSlots = getAvailableTimeSlots;
exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
exports.generateToken = generateToken;
exports.verifyToken = verifyToken;
exports.sanitizeInput = sanitizeInput;
exports.generateRandomColor = generateRandomColor;
exports.debounce = debounce;
exports.throttle = throttle;
exports.getBookingProgress = getBookingProgress;
exports.getStatusColor = getStatusColor;
exports.calculateCompletionTime = calculateCompletionTime;
exports.getTimeBasedGreeting = getTimeBasedGreeting;
exports.truncateText = truncateText;
exports.formatPhoneNumber = formatPhoneNumber;
exports.isValidEmail = isValidEmail;
exports.generateCSV = generateCSV;
exports.parseQueryParams = parseQueryParams;
exports.sleep = sleep;
exports.retry = retry;
exports.generateResetToken = generateResetToken;
exports.calculateLoyaltyPoints = calculateLoyaltyPoints;
exports.getNextAvailableDate = getNextAvailableDate;
exports.groupBookingsByDate = groupBookingsByDate;
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const types_1 = require("../types");
const logger_1 = __importDefault(require("./logger"));
/**
 * Generate a unique reference number for bookings
 */
function generateReferenceNumber(prefix = 'AG') {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
/**
 * Generate a short booking ID for display purposes
 */
function generateShortId() {
    return Math.random().toString(36).substring(2, 9).toUpperCase();
}
/**
 * Format price to South African Rand
 */
function formatPrice(amount) {
    return new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 2,
    }).format(amount);
}
/**
 * Calculate total price based on vehicle type, condition, and extras
 */
function calculateTotalPrice(basePrice, vehicleType, condition = types_1.CarCondition.LIGHT, extras = []) {
    // Vehicle type multipliers
    const vehicleMultipliers = {
        [types_1.CarType.SEDAN]: 1.0,
        [types_1.CarType.COUPE]: 1.1,
        [types_1.CarType.HATCHBACK]: 1.0,
        [types_1.CarType.SUV]: 1.3,
        [types_1.CarType.TRUCK]: 1.5,
        [types_1.CarType.LUXURY]: 1.8,
    };
    // Condition multipliers
    const conditionMultipliers = {
        [types_1.CarCondition.LIGHT]: 1.0,
        [types_1.CarCondition.MODERATE]: 1.2,
        [types_1.CarCondition.HEAVY]: 1.5,
    };
    // Extra service prices
    const extraPrices = {
        [types_1.ExtraService.INTERIOR]: 150,
        [types_1.ExtraService.WAX]: 200,
        [types_1.ExtraService.ENGINE]: 300,
    };
    let totalPrice = basePrice;
    // Apply vehicle type multiplier
    const vehicleMultiplier = vehicleMultipliers[vehicleType] || 1.0;
    totalPrice *= vehicleMultiplier;
    // Apply condition multiplier
    const conditionMultiplier = conditionMultipliers[condition] || 1.0;
    totalPrice *= conditionMultiplier;
    // Add extra services
    const extrasTotal = extras.reduce((sum, extra) => {
        return sum + (extraPrices[extra] || 0);
    }, 0);
    totalPrice += extrasTotal;
    // Round to 2 decimal places
    return Math.round(totalPrice * 100) / 100;
}
/**
 * Format date to display format
 */
function formatDate(date, includeTime = false) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    return dateObj.toLocaleDateString('en-ZA', options);
}
/**
 * Check if a date is valid for booking (not in past, within 90 days)
 */
function isValidBookingDate(date) {
    const bookingDate = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 90);
    if (bookingDate < today) {
        return { valid: false, message: 'Booking date cannot be in the past' };
    }
    if (bookingDate > maxDate) {
        return { valid: false, message: 'Booking date cannot be more than 90 days in the future' };
    }
    return { valid: true };
}
/**
 * Check if a time slot is valid
 */
function isValidTimeSlot(time) {
    const timeRegex = /^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/;
    return timeRegex.test(time);
}
/**
 * Get available time slots for a given date
 */
function getAvailableTimeSlots() {
    return ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
}
/**
 * Hash a password using bcrypt
 */
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt_1.default.hash(password, saltRounds);
}
/**
 * Compare password with hash
 */
async function comparePassword(password, hash) {
    return await bcrypt_1.default.compare(password, hash);
}
/**
 * Generate JWT token
 */
function generateToken(payload, expiresIn = env_1.config.JWT_EXPIRY) {
    return jsonwebtoken_1.default.sign(payload, env_1.config.JWT_SECRET, { expiresIn });
}
/**
 * Verify JWT token
 */
function verifyToken(token) {
    try {
        return jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRET);
    }
    catch (error) {
        logger_1.default.error('Token verification failed:', error);
        return null;
    }
}
/**
 * Sanitize user input to prevent XSS
 */
function sanitizeInput(input) {
    return input
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
}
/**
 * Generate a random color for UI elements
 */
function generateRandomColor() {
    const colors = [
        '#3B82F6', // Blue
        '#10B981', // Green
        '#8B5CF6', // Purple
        '#EF4444', // Red
        '#F59E0B', // Amber
        '#EC4899', // Pink
        '#06B6D4', // Cyan
        '#F97316', // Orange
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
/**
 * Debounce function for limiting API calls
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
/**
 * Throttle function for limiting API calls
 */
function throttle(func, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}
/**
 * Generate a progress percentage for booking status
 */
function getBookingProgress(status) {
    const progressMap = {
        [types_1.BookingStatus.PENDING]: 25,
        [types_1.BookingStatus.CONFIRMED]: 50,
        [types_1.BookingStatus.COMPLETED]: 100,
        [types_1.BookingStatus.CANCELLED]: 0,
    };
    return progressMap[status] || 0;
}
/**
 * Get status color for UI
 */
function getStatusColor(status) {
    const colorMap = {
        [types_1.BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
        [types_1.BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
        [types_1.BookingStatus.COMPLETED]: 'bg-green-100 text-green-800',
        [types_1.BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
}
/**
 * Calculate estimated completion time
 */
function calculateCompletionTime(startTime, duration, // in minutes
appointmentType) {
    const [time, period] = startTime.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    let totalHours = hours;
    if (period === 'PM' && hours !== 12)
        totalHours += 12;
    if (period === 'AM' && hours === 12)
        totalHours = 0;
    const startDate = new Date();
    startDate.setHours(totalHours, minutes, 0, 0);
    // Add buffer based on appointment type
    const buffer = appointmentType === types_1.AppointmentType.MOBILE ? 30 : 15;
    const totalDuration = duration + buffer;
    const endDate = new Date(startDate.getTime() + totalDuration * 60000);
    const endHours = endDate.getHours();
    const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
    const endPeriod = endHours >= 12 ? 'PM' : 'AM';
    const displayHours = endHours % 12 || 12;
    return `${displayHours}:${endMinutes} ${endPeriod}`;
}
/**
 * Generate a friendly greeting based on time of day
 */
function getTimeBasedGreeting() {
    const hour = new Date().getHours();
    if (hour < 12)
        return 'Good morning';
    if (hour < 17)
        return 'Good afternoon';
    return 'Good evening';
}
/**
 * Truncate text with ellipsis
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength)
        return text;
    return text.substring(0, maxLength - 3) + '...';
}
/**
 * Format phone number
 */
function formatPhoneNumber(phone) {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    // Check if it's a South African number
    if (cleaned.startsWith('27') && cleaned.length === 11) {
        return `+${cleaned.substring(0, 2)} ${cleaned.substring(2, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7)}`;
    }
    // Default formatting
    return phone;
}
/**
 * Validate email address
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
/**
 * Generate a CSV string from data
 */
function generateCSV(data, headers) {
    if (!data.length)
        return '';
    const csvHeaders = headers || Object.keys(data[0]);
    const csvRows = data.map(row => csvHeaders.map(header => {
        const value = row[header];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
    }).join(','));
    return [csvHeaders.join(','), ...csvRows].join('\n');
}
/**
 * Parse query parameters to filters
 */
function parseQueryParams(query) {
    const filters = {};
    Object.keys(query).forEach(key => {
        const value = query[key];
        // Handle pagination
        if (key === 'page' || key === 'limit') {
            filters[key] = parseInt(value, 10);
        }
        // Handle booleans
        else if (value === 'true' || value === 'false') {
            filters[key] = value === 'true';
        }
        // Handle arrays (comma-separated)
        else if (value.includes(',')) {
            filters[key] = value.split(',').map((v) => v.trim());
        }
        // Handle dates
        else if (key.includes('date') || key.includes('Date')) {
            filters[key] = new Date(value);
        }
        // Default to string
        else {
            filters[key] = value;
        }
    });
    return filters;
}
/**
 * Sleep/wait function for async operations
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
/**
 * Retry function with exponential backoff
 */
async function retry(fn, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        }
        catch (error) {
            lastError = error;
            logger_1.default.warn(`Attempt ${i + 1} failed:`, error);
            if (i < maxRetries - 1) {
                const waitTime = delay * Math.pow(2, i); // Exponential backoff
                await sleep(waitTime);
            }
        }
    }
    throw lastError;
}
/**
 * Generate a password reset token
 */
function generateResetToken() {
    return (0, uuid_1.v4)().replace(/-/g, '');
}
/**
 * Calculate loyalty points based on purchase amount
 */
function calculateLoyaltyPoints(amount) {
    return Math.floor(amount / 100); // 1 point per R100
}
/**
 * Get the next available booking date
 */
function getNextAvailableDate() {
    const date = new Date();
    date.setDate(date.getDate() + 1); // Tomorrow
    // Skip weekends if needed (optional)
    while (date.getDay() === 0 || date.getDay() === 6) {
        date.setDate(date.getDate() + 1);
    }
    return date;
}
/**
 * Group bookings by date for calendar view
 */
function groupBookingsByDate(bookings) {
    return bookings.reduce((groups, booking) => {
        const date = new Date(booking.date).toISOString().split('T')[0];
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(booking);
        return groups;
    }, {});
}
//# sourceMappingURL=helpers.js.map