"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const serviceController_1 = require("../controllers/serviceController");
const router = (0, express_1.Router)();
// Service routes
router.get('/', serviceController_1.serviceController.getAllServices);
router.get('/:id', serviceController_1.serviceController.getServiceById);
router.post('/', serviceController_1.serviceController.createService);
router.put('/:id', serviceController_1.serviceController.updateService);
router.delete('/:id', serviceController_1.serviceController.deleteService);
router.post('/calculate-price', serviceController_1.serviceController.calculatePrice);
exports.default = router;
//# sourceMappingURL=serviceRoutes.js.map