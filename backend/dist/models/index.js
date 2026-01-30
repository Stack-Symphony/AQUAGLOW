"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.Customer = exports.Booking = void 0;
const Booking_1 = __importDefault(require("./Booking"));
exports.Booking = Booking_1.default;
const Customer_1 = __importDefault(require("./Customer"));
exports.Customer = Customer_1.default;
const Service_1 = __importDefault(require("./Service"));
exports.Service = Service_1.default;
// Define associations
Booking_1.default.belongsTo(Customer_1.default, { foreignKey: 'customerId', as: 'customer' });
Customer_1.default.hasMany(Booking_1.default, { foreignKey: 'customerId', as: 'bookings' });
exports.default = {
    Booking: Booking_1.default,
    Customer: Customer_1.default,
    Service: Service_1.default,
};
//# sourceMappingURL=index.js.map