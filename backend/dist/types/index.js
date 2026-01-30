"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingStatus = exports.AppointmentType = exports.ExtraService = exports.CarCondition = exports.CarType = void 0;
// Enums matching frontend types
var CarType;
(function (CarType) {
    CarType["SEDAN"] = "SEDAN";
    CarType["COUPE"] = "COUPE";
    CarType["HATCHBACK"] = "HATCHBACK";
    CarType["SUV"] = "SUV";
    CarType["TRUCK"] = "TRUCK";
    CarType["LUXURY"] = "LUXURY";
})(CarType || (exports.CarType = CarType = {}));
var CarCondition;
(function (CarCondition) {
    CarCondition["LIGHT"] = "LIGHT";
    CarCondition["MODERATE"] = "MODERATE";
    CarCondition["HEAVY"] = "HEAVY";
})(CarCondition || (exports.CarCondition = CarCondition = {}));
var ExtraService;
(function (ExtraService) {
    ExtraService["INTERIOR"] = "INTERIOR";
    ExtraService["WAX"] = "WAX";
    ExtraService["ENGINE"] = "ENGINE";
})(ExtraService || (exports.ExtraService = ExtraService = {}));
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
//# sourceMappingURL=index.js.map