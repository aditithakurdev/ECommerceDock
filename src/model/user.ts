import { DataTypes, Model } from "sequelize";
import db from "../config/database";
import { Role } from "../utils/enum/userRole";
import { nanoid } from "nanoid";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
        password: { type: DataTypes.STRING, allowNull: false },
    // otp:{type:DataTypes.STRING,allowNull:false},
    role: {
      type: DataTypes.ENUM(...Object.values(Role)),
      defaultValue: Role.USER,
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  },
  {
    sequelize: db,
    tableName: "users",
    timestamps: true,
  }
);

export default User;