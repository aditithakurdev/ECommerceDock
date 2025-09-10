import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import { nanoid } from "nanoid";
import { UserSubscriptionEnum } from "../utils/enum/userSubscriptionEnum";
import User from "./user";

// Define the attributes
interface UserSubscriptionAttributes {
  id: string;
  userId: string; 
  stripeSubscriptionId: string; 
  planName: string; 
  priceId: string; 
  stripeCustomerId?: string;
  status: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "expired";
  startDate: Date;
  endDate: Date;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which fields are optional when creating
interface UserSubscriptionCreationAttributes
  extends Optional<UserSubscriptionAttributes, "id" | "endDate" | "isDeleted"> {}

// Define the class
class UserSubscription
  extends Model<UserSubscriptionAttributes, UserSubscriptionCreationAttributes>
  implements UserSubscriptionAttributes
{
  public id!: string;
  public userId!: string;
  public stripeSubscriptionId!: string;
  public planName!: string;
  public priceId!: string;
  public stripeCustomerId?: string; 
  public status!: "active" | "canceled" | "incomplete" | "incomplete_expired" | "past_due" | "unpaid" | "expired";
  public startDate!: Date;
  public endDate!: Date;
  public isDeleted!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Init schema
UserSubscription.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stripeSubscriptionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    planName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(UserSubscriptionEnum)),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    stripeCustomerId: {
      type: DataTypes.STRING, 
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "userSubscriptions",
    timestamps: true,
  }
);
// ✅ Define association here
User.hasMany(UserSubscription, { foreignKey: "userId", as: "subscriptions" });
UserSubscription.belongsTo(User, { foreignKey: "userId", as: "user" });

export default UserSubscription;
