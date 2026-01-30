import { Booking } from '../models';
export declare class PaymentService {
    private stripe;
    constructor();
    createPaymentIntent(booking: Booking): Promise<{
        clientSecret: string | null;
        paymentIntentId: string;
        amount: number;
    }>;
    handleWebhook(payload: any, signature: string): Promise<{
        success: boolean;
    }>;
    private handlePaymentSuccess;
    private handlePaymentFailure;
}
export declare const paymentService: PaymentService;
//# sourceMappingURL=paymentService.d.ts.map