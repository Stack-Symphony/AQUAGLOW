"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customerController_1 = require("../controllers/customerController");
const router = (0, express_1.Router)();
// Customer routes
router.get('/', customerController_1.customerController.getAllCustomers);
router.get('/search', customerController_1.customerController.searchCustomers);
router.get('/:id', customerController_1.customerController.getCustomerById);
router.get('/email/:email', customerController_1.customerController.getCustomerByEmail);
router.get('/:id/stats', customerController_1.customerController.getCustomerStats);
router.put('/:id', customerController_1.customerController.updateCustomer);
exports.default = router;
//# sourceMappingURL=customerRoutes.js.map