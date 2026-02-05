import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { 
  CarType, 
  CarCondition, 
  ExtraService, 
  AppointmentType,
  BookingStatus 
} from '../types';
import logger from './logger';

/**
 * Generate a unique reference number for bookings
 */
export function generateReferenceNumber(prefix: string = 'AG'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Generate a short booking ID for display purposes
 */
export function generateShortId(): string {
  return Math.random().toString(36).substring(2, 9).toUpperCase();
}

/**
 * Format price to South African Rand
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Calculate total price based on vehicle type, condition, and extras
 */
export function calculateTotalPrice(
  basePrice: number,
  vehicleType: CarType,
  condition: CarCondition = CarCondition.LIGHT,
  extras: ExtraService[] = []
): number {
  // Vehicle type multipliers
  const vehicleMultipliers: Record<CarType, number> = {
    [CarType.SEDAN]: 1.0,
    [CarType.COUPE]: 1.1,
    [CarType.HATCHBACK]: 1.0,
    [CarType.SUV]: 1.3,
    [CarType.TRUCK]: 1.5,
    [CarType.LUXURY]: 1.8,
  };

  // Condition multipliers
  const conditionMultipliers: Record<CarCondition, number> = {
    [CarCondition.LIGHT]: 1.0,
    [CarCondition.MODERATE]: 1.2,
    [CarCondition.HEAVY]: 1.5,
  };

  // Extra service prices
  const extraPrices: Record<ExtraService, number> = {
    [ExtraService.INTERIOR]: 150,
    [ExtraService.WAX]: 200,
    [ExtraService.ENGINE]: 300,
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
export function formatDate(date: Date | string, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
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
export function isValidBookingDate(date: Date | string): { valid: boolean; message?: string } {
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
export function isValidTimeSlot(time: string): boolean {
  const timeRegex = /^(0[9]|1[0-7]):[0-5][0-9] (AM|PM)$/;
  return timeRegex.test(time);
}

/**
 * Get available time slots for a given date
 */
export function getAvailableTimeSlots(): string[] {
  return ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM'];
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(
  payload: object,
  expiresIn: string = config.JWT_EXPIRY
): string {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: expiresIn as any,   // ← Fixes the strict typing issue
  });
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
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
export function generateRandomColor(): string {
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#EF4444', '#F59E0B',
    '#EC4899', '#06B6D4', '#F97316',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Get booking progress percentage
 */
export function getBookingProgress(status: BookingStatus): number {
  const progressMap: Record<BookingStatus, number> = {
    [BookingStatus.PENDING]: 25,
    [BookingStatus.CONFIRMED]: 50,
    [BookingStatus.COMPLETED]: 100,
    [BookingStatus.CANCELLED]: 0,
  };
  return progressMap[status] || 0;
}

/**
 * Get status color class
 */
export function getStatusColor(status: BookingStatus): string {
  const colorMap: Record<BookingStatus, string> = {
    [BookingStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [BookingStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
    [BookingStatus.COMPLETED]: 'bg-green-100 text-green-800',
    [BookingStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Group bookings by date
 */
export function groupBookingsByDate(bookings: any[]): Record<string, any[]> {
  return bookings.reduce((groups, booking) => {
    const date = new Date(booking.date).toISOString().split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(booking);
    return groups;
  }, {} as Record<string, any[]>);
}