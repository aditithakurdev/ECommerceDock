import { DataTypes, Model, Optional } from "sequelize";
import db from "../config/database";
import { nanoid } from "nanoid";

// Define attributes
interface ProductAttributes {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define which fields are optional on creation
interface ProductCreationAttributes extends Optional<ProductAttributes, "id" | "description" | "isDeleted" |"createdAt" | "updatedAt"> {}

// Define the class
class Product
  extends Model<ProductAttributes, ProductCreationAttributes>
  implements ProductAttributes
{
    public id!: string;
    public name!: string;
    public description?: string | null;
    public price!: number;
    public stock!: number;
    public isDeleted!: boolean;
    
    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

// Init schema
Product.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
        },
    description: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false, // default is false
    },
  },
  {
    sequelize: db,
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
