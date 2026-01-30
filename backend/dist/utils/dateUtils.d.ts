/**
 * Date utility functions
 */
/**
 * Format date to YYYY-MM-DD
 */
export declare function formatDateYYYYMMDD(date: Date | string): string;
/**
 * Format date to DD/MM/YYYY
 */
export declare function formatDateDDMMYYYY(date: Date | string): string;
/**
 * Add days to a date
 */
export declare function addDays(date: Date | string, days: number): Date;
/**
 * Get start of week (Monday)
 */
export declare function getStartOfWeek(date?: Date): Date;
/**
 * Get end of week (Sunday)
 */
export declare function getEndOfWeek(date?: Date): Date;
/**
 * Get start of month
 */
export declare function getStartOfMonth(date?: Date): Date;
/**
 * Get end of month
 */
export declare function getEndOfMonth(date?: Date): Date;
/**
 * Check if two dates are the same day
 */
export declare function isSameDay(date1: Date, date2: Date): boolean;
/**
 * Check if date is today
 */
export declare function isToday(date: Date | string): boolean;
/**
 * Check if date is in the past
 */
export declare function isPastDate(date: Date | string): boolean;
/**
 * Get difference in days between two dates
 */
export declare function getDaysDifference(date1: Date, date2: Date): number;
/**
 * Get human readable time difference
 */
export declare function getTimeDifference(from: Date, to?: Date): string;
/**
 * Get business days between two dates (excluding weekends)
 */
export declare function getBusinessDays(startDate: Date, endDate: Date): number;
/**
 * Generate array of dates between two dates
 */
export declare function getDateRange(startDate: Date, endDate: Date): Date[];
/**
 * Check if date is a weekend
 */
export declare function isWeekend(date: Date): boolean;
/**
 * Check if date is a public holiday (South Africa)
 */
export declare function isPublicHoliday(date: Date): boolean;
/**
 * Check if date is valid for business (not weekend or holiday)
 */
export declare function isBusinessDay(date: Date): boolean;
/**
 * Get next business day
 */
export declare function getNextBusinessDay(date?: Date): Date;
/**
 * Format time from 24h to 12h format
 */
export declare function formatTime12h(time: string): string;
/**
 * Format time from 12h to 24h format
 */
export declare function formatTime24h(time: string): string;
/**
 * Get current timestamp in ISO format
 */
export declare function getCurrentTimestamp(): string;
/**
 * Parse date string to Date object with validation
 */
export declare function parseDate(dateString: string): Date | null;
declare const _default: {
    formatDateYYYYMMDD: typeof formatDateYYYYMMDD;
    formatDateDDMMYYYY: typeof formatDateDDMMYYYY;
    addDays: typeof addDays;
    getStartOfWeek: typeof getStartOfWeek;
    getEndOfWeek: typeof getEndOfWeek;
    getStartOfMonth: typeof getStartOfMonth;
    getEndOfMonth: typeof getEndOfMonth;
    isSameDay: typeof isSameDay;
    isToday: typeof isToday;
    isPastDate: typeof isPastDate;
    getDaysDifference: typeof getDaysDifference;
    getTimeDifference: typeof getTimeDifference;
    getBusinessDays: typeof getBusinessDays;
    getDateRange: typeof getDateRange;
    isWeekend: typeof isWeekend;
    isPublicHoliday: typeof isPublicHoliday;
    isBusinessDay: typeof isBusinessDay;
    getNextBusinessDay: typeof getNextBusinessDay;
    formatTime12h: typeof formatTime12h;
    formatTime24h: typeof formatTime24h;
    getCurrentTimestamp: typeof getCurrentTimestamp;
    parseDate: typeof parseDate;
};
export default _default;
//# sourceMappingURL=dateUtils.d.ts.map