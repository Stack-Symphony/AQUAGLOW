// src/models/index.ts
// Central barrel file to re-export all models + associations

// Import individual models (relative to this file)
import { default as Booking } from './Booking';
import { default as Customer } from './Customer';
import { default as Service } from './Service';

// IMPORTANT: Import associations LAST — after all models are loaded
import './associations';

// Export named exports (preferred way for TypeScript)
export { Booking, Customer, Service };


// Optional: Export as default object (if some old code expects it)
export default {
  Booking,
  Customer,
  Service,
};