export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
declare class ApiService {
    private request;
    healthCheck(): Promise<ApiResponse>;
    getServices(): Promise<ApiResponse>;
    createBooking(bookingData: any): Promise<ApiResponse>;
    getAvailableSlots(date: string): Promise<ApiResponse>;
    calculatePrice(priceData: any): Promise<ApiResponse>;
}
export declare const apiService: ApiService;
export {};
//# sourceMappingURL=api.d.ts.map