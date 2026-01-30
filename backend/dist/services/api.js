"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiService = void 0;
// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
class ApiService {
    async request(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            // Debug logging
            console.log(`🌐 API ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : '');
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                console.error(`❌ API Error:`, data);
                return {
                    success: false,
                    error: data.error || `HTTP ${response.status}`,
                    message: data.message
                };
            }
            console.log(`✅ API Success:`, data);
            return {
                success: true,
                ...data
            };
        }
        catch (error) {
            console.error(`❌ Network Error:`, error);
            return {
                success: false,
                error: error.message || 'Cannot connect to server',
                message: 'Please check if backend is running'
            };
        }
    }
    // Health check
    async healthCheck() {
        return this.request('/health');
    }
    // Get services
    async getServices() {
        return this.request('/services');
    }
    // Create booking
    async createBooking(bookingData) {
        return this.request('/bookings', {
            method: 'POST',
            body: JSON.stringify(bookingData),
        });
    }
    // Get available slots
    async getAvailableSlots(date) {
        return this.request(`/bookings/slots/${date}`);
    }
    // Calculate price
    async calculatePrice(priceData) {
        return this.request('/services/calculate-price', {
            method: 'POST',
            body: JSON.stringify(priceData),
        });
    }
}
exports.apiService = new ApiService();
//# sourceMappingURL=api.js.map