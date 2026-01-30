"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = calculatePrice;
const models_1 = require("../models");
async function calculatePrice(input) {
    const service = await models_1.Service.findOne({
        where: { name: input.serviceType, active: true }
    });
    if (!service) {
        throw new Error(`Service '${input.serviceType}' not found`);
    }
    // Vehicle type multipliers
    const vehicleMultipliers = {
        'SEDAN': 1.0,
        'COUPE': 1.1,
        'HATCHBACK': 1.0,
        'SUV': 1.3,
        'TRUCK': 1.5,
        'LUXURY': 1.8
    };
    // Condition multipliers
    const conditionMultipliers = {
        'LIGHT': 1.0,
        'MODERATE': 1.2,
        'HEAVY': 1.5
    };
    // Extra service prices
    const extraPrices = {
        'INTERIOR': 150,
        'WAX': 200,
        'ENGINE': 300
    };
    let totalPrice = parseFloat(service.basePrice.toString());
    // Apply vehicle type multiplier
    const vehicleMultiplier = vehicleMultipliers[input.vehicleType.toUpperCase()] || 1.0;
    totalPrice *= vehicleMultiplier;
    // Apply condition multiplier
    const conditionMultiplier = conditionMultipliers[input.condition?.toUpperCase()] || 1.0;
    totalPrice *= conditionMultiplier;
    // Add extra services
    const extrasTotal = input.extras.reduce((sum, extra) => {
        return sum + (extraPrices[extra] || 0);
    }, 0);
    totalPrice += extrasTotal;
    return Math.round(totalPrice * 100) / 100; // Round to 2 decimal places
}
//# sourceMappingURL=priceCalculator.js.map