import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import User from "./user";
import { nanoid } from "nanoid";

// Define attributes
interface OrderAttributes {
  id: string;
  totalAmt: number;
  status: string;
  userId: string; // foreign key -> User.id
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which fields are optional on creation
interface OrderCreationAttributes
  extends Optional<OrderAttributes, "id" | "status"> {}

// Define the class
class Order
  extends Model<OrderAttributes, OrderCreationAttributes>
  implements OrderAttributes
{
  public id!: string;
  public totalAmt!: number;
  public status!: string;
  public userId!: string;

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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
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
