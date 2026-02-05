import { Router } from 'express';
import { customerController } from '../controllers/customerController';

const router = Router();

// Customer routes
router.get('/', customerController.getAllCustomers);
router.get('/search', customerController.searchCustomers);
router.get('/:id', customerController.getCustomerById);
router.get('/email/:email', customerController.getCustomerByEmail);
router.get('/:id/stats', customerController.getCustomerStats);
router.put('/:id', customerController.updateCustomer);
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Customer list retrieved (Protected route placeholder)"
  });
});

export default router;