import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CustomerAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  loyaltyPoints: number;
  totalSpent: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CustomerCreationAttributes extends Optional<CustomerAttributes, 'id' | 'loyaltyPoints' | 'totalSpent' | 'createdAt' | 'updatedAt'> {}

class Customer extends Model<CustomerAttributes, CustomerCreationAttributes> implements CustomerAttributes {
  public id!: string;
  public name!: string;
  public email!: string;
  public phone?: string;
  public address?: string;
  public loyaltyPoints!: number;
  public totalSpent!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value: string) {
        this.setDataValue('email', value.toLowerCase().trim());
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    loyaltyPoints: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalSpent: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
  },
  {
    sequelize,
    tableName: 'customers',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

// IMPORTANT: Do NOT define associations here to avoid circular imports
// Move all associations to a separate file (see instructions below)

export default Customer;