"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.AppointmentType = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
var AppointmentType;
(function (AppointmentType) {
    AppointmentType["STUDIO"] = "studio";
    AppointmentType["MOBILE"] = "mobile";
})(AppointmentType || (exports.AppointmentType = AppointmentType = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["COMPLETED"] = "completed";
    BookingStatus["CANCELLED"] = "cancelled";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
class Booking extends sequelize_1.Model {
}
Booking.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'customers',
            key: 'id',
        },
    },
    date: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: false,
    },
    time: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    serviceType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    vehicleType: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    vehicleYear: {
        type: sequelize_1.DataTypes.STRING,
    },
    vehicleMake: {
        type: sequelize_1.DataTypes.STRING,
    },
    vehicleModel: {
        type: sequelize_1.DataTypes.STRING,
    },
    condition: {
        type: sequelize_1.DataTypes.STRING,
    },
    extras: {
        type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
        defaultValue: [],
    },
    appointmentType: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(AppointmentType)),
        defaultValue: AppointmentType.STUDIO,
    },
    totalPrice: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(BookingStatus)),
        defaultValue: BookingStatus.PENDING,
    },
    paymentMethod: {
        type: sequelize_1.DataTypes.ENUM('card', 'cash'),
    },
    paymentStatus: {
        type: sequelize_1.DataTypes.ENUM('pending', 'paid', 'failed'),
        defaultValue: 'pending',
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
    },
    referenceNumber: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        defaultValue: function () {
            return 'AG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        },
    },
}, {
    sequelize: database_1.default,
    tableName: 'bookings',
    timestamps: true,
});
exports.default = Booking;
//# sourceMappingURL=Booking.js.map