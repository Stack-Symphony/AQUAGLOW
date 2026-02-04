import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { validateBooking } from '../middleware/validation';

const router = Router();

// Booking routes
// Note: More specific routes MUST come before generic :id routes to avoid conflicts
router.post('/', validateBooking, bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.get('/stats', bookingController.getBookingStats);
router.get('/available-slots', bookingController.getAvailableSlots);
router.get('/reference/:reference', bookingController.getBookingByReference);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/payment', bookingController.updatePaymentStatus);
router.delete('/:id/cancel', bookingController.cancelBooking);

// TODO: implement these in bookingController.ts then uncomment
// router.get('/search', bookingController.searchBookings);
// router.get('/debug/fields', bookingController.debugModelFields);

export default router;