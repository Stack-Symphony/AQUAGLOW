// src/models/associations.ts
// This file only defines relationships — imported once after models are loaded

import Booking from './Booking';       // ← Default import (no curly braces)
import Customer from './Customer';     // ← Default import

// ────────────────────────────────────────────────
// Customer 1 → N Bookings
// ────────────────────────────────────────────────
Customer.hasMany(Booking, {
  foreignKey: 'customerId',
  as: 'bookings',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// ────────────────────────────────────────────────
// Booking N → 1 Customer
// ────────────────────────────────────────────────
Booking.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

// Optional: Add more associations here later
// Example:
// import Service from './Service';
// Service.hasMany(Booking, { foreignKey: 'serviceId', as: 'bookings' });

// Export nothing — this is a side-effect file
export {};