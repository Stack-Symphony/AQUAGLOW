import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { validateBooking } from '../middleware/validation';

const router = Router();

router.post('/', validateBooking, bookingController.createBooking);
router.get('/stats', bookingController.getBookingStats);
router.get('/available-slots', bookingController.getAvailableSlots);
router.get('/reference/:reference', bookingController.getBookingByReference);
router.get('/', bookingController.getAllBookings);
router.get('/:id', bookingController.getBookingById);
router.patch('/:id/status', bookingController.updateBookingStatus);
router.patch('/:id/payment', bookingController.updatePaymentStatus);
router.delete('/:id/cancel', bookingController.cancelBooking);

export default router;