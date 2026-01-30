"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bookingController_1 = require("../controllers/bookingController");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Booking routes
router.post('/', validation_1.validateBooking, bookingController_1.bookingController.createBooking);
router.get('/', bookingController_1.bookingController.getAllBookings);
router.get('/stats', bookingController_1.bookingController.getBookingStats);
router.get('/slots/:date', bookingController_1.bookingController.getAvailableSlots);
router.get('/:id', bookingController_1.bookingController.getBookingById);
router.get('/reference/:reference', bookingController_1.bookingController.getBookingByReference);
router.patch('/:id/status', bookingController_1.bookingController.updateBookingStatus);
router.patch('/:id/payment', bookingController_1.bookingController.updatePaymentStatus);
router.delete('/:id/cancel', bookingController_1.bookingController.cancelBooking);
exports.default = router;
//# sourceMappingURL=bookingRoutes.js.map