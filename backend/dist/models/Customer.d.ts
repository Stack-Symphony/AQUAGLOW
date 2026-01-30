import { Model, Optional } from 'sequelize';
interface CustomerAttributes {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    loyaltyPoints: number;
    totalSpent: number;
}
interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'loyaltyPoints' | 'totalSpent'> {
}
declare class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    loyaltyPoints: number;
    totalSpent: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default Customer;
//# sourceMappingURL=Customer.d.ts.map