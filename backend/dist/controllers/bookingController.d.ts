import { Request, Response } from 'express';
export declare const bookingController: {
    createBooking(req: Request, res: Response): Promise<void>;
    getAllBookings(req: Request, res: Response): Promise<void>;
    getBookingById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBookingByReference(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateBookingStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updatePaymentStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getAvailableSlots(req: Request, res: Response): Promise<void>;
    cancelBooking(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getBookingStats(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=bookingController.d.ts.map