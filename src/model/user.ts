import { DataTypes } from "sequelize";
import db from "../config/database";
import { nanoid } from "nanoid";
import { Roles } from "../utils/enum/userRole";

const User = db.define("User", {
   id: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: () => nanoid(), 
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM(...Object.values(Roles)),
    allowNull:false,
    defaultValue: Roles.USER,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
}, {
  tableName: "users",
  timestamps: true,
});

export default User;