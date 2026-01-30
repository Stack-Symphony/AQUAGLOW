import { Booking } from '../models';
import { BookingStatus } from '../models/Booking';
export declare class EmailService {
    private transporter;
    constructor();
    sendBookingConfirmation(booking: Booking): Promise<void>;
    sendStatusUpdate(booking: Booking, oldStatus: BookingStatus): Promise<void>;
    sendPaymentReceipt(booking: Booking): Promise<void>;
}
export declare const emailService: EmailService;
//# sourceMappingURL=emailService.d.ts.map