import { DataTypes, Model, Optional } from "sequelize";
import { nanoid } from "nanoid";
import db from "../config/database";
import User from "./user";

// Order attributes
interface OrderAttributes {
  id: string;
  totalAmt: number;
  status: string; // pending | succeeded | failed
  userId: string; // foreign key -> User.id
  isDeleted: boolean;
  currency: string; // NEW - "usd", "inr", etc.
  stripePaymentIntentId?: string; // NEW - link to Stripe payment
  stripeCustomerId?: string;      // NEW - link to Stripe customer
  paymentMethod?: string;         // NEW - Stripe pm_xxx or card type
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "status" | "isDeleted" | "currency"> {}

// Define the class
class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public totalAmt!: number;
  public status!: string;
  public userId!: string;
  public isDeleted!: boolean;
  public currency!: string;
  public stripePaymentIntentId?: string;
  public stripeCustomerId?: string;
  public paymentMethod?: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Init schema
Order.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    totalAmt: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "usd", // default currency
    },
    stripePaymentIntentId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db,
    tableName: "orders",
    timestamps: true,
  }
);

// Associations
User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

export default Order;
