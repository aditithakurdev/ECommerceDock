import { DataTypes, Model, Optional } from "sequelize";
import { nanoid } from "nanoid";
import db from "../config/database";
import User from "./user";

// Notification attributes
interface NotificationAttributes {
  id: string;
  userId: string;
  title: string;
  body: string;
  topic: string;
  isRead: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface NotificationCreationAttributes
  extends Optional<NotificationAttributes, "id" | "isRead"> {}

// Define class
class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes
{
  public id!: string;
  public userId!: string;
  public title!: string;
  public body!: string;
  public topic!: string;
  public isRead!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Init schema
Notification.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    topic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize: db,
    tableName: "notifications",
    timestamps: true,
  }
);

// Associations
User.hasMany(Notification, { foreignKey: "userId" });
Notification.belongsTo(User, { foreignKey: "userId" });

export default Notification;
