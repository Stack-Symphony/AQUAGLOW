"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentService = exports.PaymentService = void 0;
const stripe_1 = __importDefault(require("stripe"));
const env_1 = require("../config/env");
const models_1 = require("../models");
class PaymentService {
    constructor() {
        this.stripe = new stripe_1.default(env_1.config.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(booking) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(booking.totalPrice * 100), // Convert to cents
                currency: 'zar',
                metadata: {
                    bookingId: booking.id,
                    referenceNumber: booking.referenceNumber,
                    customerEmail: booking.customer?.email || '',
                },
                description: `AquaGlow Booking: ${booking.referenceNumber}`,
            });
            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
                amount: booking.totalPrice,
            };
        }
        catch (error) {
            console.error('Error creating payment intent:', error);
            throw error;
        }
    }
    async handleWebhook(payload, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(payload, signature, env_1.config.STRIPE_WEBHOOK_SECRET);
            switch (event.type) {
                case 'payment_intent.succeeded':
                    await this.handlePaymentSuccess(event.data.object);
                    break;
                case 'payment_intent.payment_failed':
                    await this.handlePaymentFailure(event.data.object);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
            return { success: true };
        }
        catch (error) {
            console.error('Error handling webhook:', error);
            throw error;
        }
    }
    async handlePaymentSuccess(paymentIntent) {
        const bookingId = paymentIntent.metadata?.bookingId;
        if (!bookingId) {
            console.error('No booking ID in payment intent metadata');
            return;
        }
        try {
            const booking = await models_1.Booking.findByPk(bookingId);
            if (booking) {
                await booking.update({
                    paymentStatus: 'paid',
                    status: 'confirmed',
                });
                // Send confirmation email
                // emailService.sendPaymentReceipt(booking);
            }
        }
        catch (error) {
            console.error('Error updating booking after payment:', error);
        }
    }
    async handlePaymentFailure(paymentIntent) {
        const bookingId = paymentIntent.metadata?.bookingId;
        if (!bookingId) {
            console.error('No booking ID in payment intent metadata');
            return;
        }
        try {
            const booking = await models_1.Booking.findByPk(bookingId);
            if (booking) {
                await booking.update({
                    paymentStatus: 'failed',
                });
            }
        }
        catch (error) {
            console.error('Error updating booking after payment failure:', error);
        }
    }
}
exports.PaymentService = PaymentService;
exports.paymentService = new PaymentService();
//# sourceMappingURL=paymentService.js.map