"use strict";
/**
 * Date utility functions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDateYYYYMMDD = formatDateYYYYMMDD;
exports.formatDateDDMMYYYY = formatDateDDMMYYYY;
exports.addDays = addDays;
exports.getStartOfWeek = getStartOfWeek;
exports.getEndOfWeek = getEndOfWeek;
exports.getStartOfMonth = getStartOfMonth;
exports.getEndOfMonth = getEndOfMonth;
exports.isSameDay = isSameDay;
exports.isToday = isToday;
exports.isPastDate = isPastDate;
exports.getDaysDifference = getDaysDifference;
exports.getTimeDifference = getTimeDifference;
exports.getBusinessDays = getBusinessDays;
exports.getDateRange = getDateRange;
exports.isWeekend = isWeekend;
exports.isPublicHoliday = isPublicHoliday;
exports.isBusinessDay = isBusinessDay;
exports.getNextBusinessDay = getNextBusinessDay;
exports.formatTime12h = formatTime12h;
exports.formatTime24h = formatTime24h;
exports.getCurrentTimestamp = getCurrentTimestamp;
exports.parseDate = parseDate;
/**
 * Format date to YYYY-MM-DD
 */
function formatDateYYYYMMDD(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
}
/**
 * Format date to DD/MM/YYYY
 */
function formatDateDDMMYYYY(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}
/**
 * Add days to a date
 */
function addDays(date, days) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const result = new Date(d);
    result.setDate(result.getDate() + days);
    return result;
}
/**
 * Get start of week (Monday)
 */
function getStartOfWeek(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
}
/**
 * Get end of week (Sunday)
 */
function getEndOfWeek(date = new Date()) {
    const start = getStartOfWeek(date);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return end;
}
/**
 * Get start of month
 */
function getStartOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}
/**
 * Get end of month
 */
function getEndOfMonth(date = new Date()) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
/**
 * Check if two dates are the same day
 */
function isSameDay(date1, date2) {
    return (date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate());
}
/**
 * Check if date is today
 */
function isToday(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    return isSameDay(d, today);
}
/**
 * Check if date is in the past
 */
function isPastDate(date) {
    const d = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
}
/**
 * Get difference in days between two dates
 */
function getDaysDifference(date1, date2) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
/**
 * Get human readable time difference
 */
function getTimeDifference(from, to = new Date()) {
    const diff = Math.abs(to.getTime() - from.getTime());
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    if (years > 0)
        return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0)
        return `${months} month${months > 1 ? 's' : ''} ago`;
    if (days > 0)
        return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0)
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0)
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
}
/**
 * Get business days between two dates (excluding weekends)
 */
function getBusinessDays(startDate, endDate) {
    let count = 0;
    const curDate = new Date(startDate.getTime());
    while (curDate <= endDate) {
        const dayOfWeek = curDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6)
            count++;
        curDate.setDate(curDate.getDate() + 1);
    }
    return count;
}
/**
 * Generate array of dates between two dates
 */
function getDateRange(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
/**
 * Check if date is a weekend
 */
function isWeekend(date) {
    const day = date.getDay();
    return day === 0 || day === 6;
}
/**
 * Check if date is a public holiday (South Africa)
 */
function isPublicHoliday(date) {
    const holidays = [
        '01-01', // New Year's Day
        '03-21', // Human Rights Day
        '04-19', // Good Friday (example)
        '04-22', // Family Day (example)
        '04-27', // Freedom Day
        '05-01', // Workers' Day
        '06-16', // Youth Day
        '08-09', // National Women's Day
        '09-24', // Heritage Day
        '12-16', // Day of Reconciliation
        '12-25', // Christmas Day
        '12-26', // Day of Goodwill
    ];
    const monthDay = `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    return holidays.includes(monthDay);
}
/**
 * Check if date is valid for business (not weekend or holiday)
 */
function isBusinessDay(date) {
    return !isWeekend(date) && !isPublicHoliday(date);
}
/**
 * Get next business day
 */
function getNextBusinessDay(date = new Date()) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    while (!isBusinessDay(nextDay)) {
        nextDay.setDate(nextDay.getDate() + 1);
    }
    return nextDay;
}
/**
 * Format time from 24h to 12h format
 */
function formatTime12h(time) {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
/**
 * Format time from 12h to 24h format
 */
function formatTime24h(time) {
    const [timePart, period] = time.split(' ');
    const [hours, minutes] = timePart.split(':').map(Number);
    let militaryHours = hours;
    if (period === 'PM' && hours !== 12)
        militaryHours += 12;
    if (period === 'AM' && hours === 12)
        militaryHours = 0;
    return `${militaryHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}
/**
 * Get current timestamp in ISO format
 */
function getCurrentTimestamp() {
    return new Date().toISOString();
}
/**
 * Parse date string to Date object with validation
 */
function parseDate(dateString) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
}
exports.default = {
    formatDateYYYYMMDD,
    formatDateDDMMYYYY,
    addDays,
    getStartOfWeek,
    getEndOfWeek,
    getStartOfMonth,
    getEndOfMonth,
    isSameDay,
    isToday,
    isPastDate,
    getDaysDifference,
    getTimeDifference,
    getBusinessDays,
    getDateRange,
    isWeekend,
    isPublicHoliday,
    isBusinessDay,
    getNextBusinessDay,
    formatTime12h,
    formatTime24h,
    getCurrentTimestamp,
    parseDate
};
//# sourceMappingURL=dateUtils.js.map