import { CarType, CarCondition, ExtraService, AppointmentType, BookingStatus } from '../types';
/**
 * Generate a unique reference number for bookings
 */
export declare function generateReferenceNumber(prefix?: string): string;
/**
 * Generate a short booking ID for display purposes
 */
export declare function generateShortId(): string;
/**
 * Format price to South African Rand
 */
export declare function formatPrice(amount: number): string;
/**
 * Calculate total price based on vehicle type, condition, and extras
 */
export declare function calculateTotalPrice(basePrice: number, vehicleType: CarType, condition?: CarCondition, extras?: ExtraService[]): number;
/**
 * Format date to display format
 */
export declare function formatDate(date: Date | string, includeTime?: boolean): string;
/**
 * Check if a date is valid for booking (not in past, within 90 days)
 */
export declare function isValidBookingDate(date: Date | string): {
    valid: boolean;
    message?: string;
};
/**
 * Check if a time slot is valid
 */
export declare function isValidTimeSlot(time: string): boolean;
/**
 * Get available time slots for a given date
 */
export declare function getAvailableTimeSlots(): string[];
/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Compare password with hash
 */
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
/**
 * Generate JWT token
 */
export declare function generateToken(payload: object, expiresIn?: string): string;
/**
 * Verify JWT token
 */
export declare function verifyToken(token: string): any;
/**
 * Sanitize user input to prevent XSS
 */
export declare function sanitizeInput(input: string): string;
/**
 * Generate a random color for UI elements
 */
export declare function generateRandomColor(): string;
/**
 * Debounce function for limiting API calls
 */
export declare function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void;
/**
 * Throttle function for limiting API calls
 */
export declare function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void;
/**
 * Generate a progress percentage for booking status
 */
export declare function getBookingProgress(status: BookingStatus): number;
/**
 * Get status color for UI
 */
export declare function getStatusColor(status: BookingStatus): string;
/**
 * Calculate estimated completion time
 */
export declare function calculateCompletionTime(startTime: string, duration: number, // in minutes
appointmentType: AppointmentType): string;
/**
 * Generate a friendly greeting based on time of day
 */
export declare function getTimeBasedGreeting(): string;
/**
 * Truncate text with ellipsis
 */
export declare function truncateText(text: string, maxLength: number): string;
/**
 * Format phone number
 */
export declare function formatPhoneNumber(phone: string): string;
/**
 * Validate email address
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Generate a CSV string from data
 */
export declare function generateCSV(data: any[], headers?: string[]): string;
/**
 * Parse query parameters to filters
 */
export declare function parseQueryParams(query: any): any;
/**
 * Sleep/wait function for async operations
 */
export declare function sleep(ms: number): Promise<void>;
/**
 * Retry function with exponential backoff
 */
export declare function retry<T>(fn: () => Promise<T>, maxRetries?: number, delay?: number): Promise<T>;
/**
 * Generate a password reset token
 */
export declare function generateResetToken(): string;
/**
 * Calculate loyalty points based on purchase amount
 */
export declare function calculateLoyaltyPoints(amount: number): number;
/**
 * Get the next available booking date
 */
export declare function getNextAvailableDate(): Date;
/**
 * Group bookings by date for calendar view
 */
export declare function groupBookingsByDate(bookings: any[]): Record<string, any[]>;
export { generateReferenceNumber, generateShortId, formatPrice, calculateTotalPrice, formatDate, isValidBookingDate, isValidTimeSlot, getAvailableTimeSlots, hashPassword, comparePassword, generateToken, verifyToken, sanitizeInput, generateRandomColor, debounce, throttle, getBookingProgress, getStatusColor, calculateCompletionTime, getTimeBasedGreeting, truncateText, formatPhoneNumber, isValidEmail, generateCSV, parseQueryParams, sleep, retry, generateResetToken, calculateLoyaltyPoints, getNextAvailableDate, groupBookingsByDate };
//# sourceMappingURL=helpers.d.ts.map