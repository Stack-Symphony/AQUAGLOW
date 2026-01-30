import { Model, Optional } from 'sequelize';
export interface ServiceAttributes {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    duration: number;
    vehicleTypes: string[];
    category: 'basic' | 'deluxe' | 'premium';
    features: string[];
    imageUrl?: string;
    active: boolean;
}
interface ServiceCreationAttributes extends Optional<ServiceAttributes, 'id' | 'active'> {
}
declare class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    duration: number;
    vehicleTypes: string[];
    category: 'basic' | 'deluxe' | 'premium';
    features: string[];
    imageUrl?: string;
    active: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Service;
//# sourceMappingURL=Service.d.ts.map