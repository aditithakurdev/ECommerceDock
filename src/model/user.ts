import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import { nanoid } from "nanoid";
import { RolesEnum } from "../utils/enum/userRole";


// Define the attributes
interface UserAttributes {
  id: string;
  firstName: string;
  lastName?: string | null;
  email: string;
  password: string;
  role: RolesEnum;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define which fields are optional when creating
interface UserCreationAttributes extends Optional<UserAttributes, "id" | "lastName" | "isActive" | "role"> {}

// 3. Define the class
class User extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string | null;
  public email!: string;
  public password!: string;
  public role!: RolesEnum;
  public isActive!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Init schema
User.init(
  {
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
      type: DataTypes.ENUM(...Object.values(RolesEnum)),
      allowNull: false,
      defaultValue: RolesEnum.USER,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },{
    sequelize: db,
    tableName: "users",
    timestamps: true,
  });

export default User;