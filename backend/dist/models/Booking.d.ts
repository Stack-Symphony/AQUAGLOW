import { Model, Optional } from 'sequelize';
import Customer from './Customer';
export declare enum AppointmentType {
    STUDIO = "studio",
    MOBILE = "mobile"
}
export declare enum BookingStatus {
    PENDING = "pending",
    CONFIRMED = "confirmed",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
interface BookingAttributes {
    id: string;
    customerId: string;
    date: Date;
    time: string;
    serviceType: string;
    vehicleType: string;
    vehicleYear?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    condition?: string;
    extras: string[];
    appointmentType: AppointmentType;
    totalPrice: number;
    status: BookingStatus;
    paymentMethod?: 'card' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    notes?: string;
    referenceNumber: string;
}
interface BookingCreationAttributes extends Optional<BookingAttributes, 'id' | 'referenceNumber'> {
}
declare class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
    id: string;
    customerId: string;
    date: Date;
    time: string;
    serviceType: string;
    vehicleType: string;
    vehicleYear?: string;
    vehicleMake?: string;
    vehicleModel?: string;
    condition?: string;
    extras: string[];
    appointmentType: AppointmentType;
    totalPrice: number;
    status: BookingStatus;
    paymentMethod?: 'card' | 'cash';
    paymentStatus: 'pending' | 'paid' | 'failed';
    notes?: string;
    referenceNumber: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly customer?: Customer;
}
export default Booking;
//# sourceMappingURL=Booking.d.ts.map