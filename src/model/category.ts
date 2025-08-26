// models/Category.ts
import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';
import Product from './product';
import db from '../config/database';
import { nanoid } from 'nanoid';

interface CategoryAttributes {
  id: string;
  name: string;
  description?: string | null;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// 2️Define optional fields for creation
interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'description' | 'isDeleted' | 'createdAt' | 'updatedAt'> {}

// 3️ Define the Category class
class Category
  extends Model<CategoryAttributes, CategoryCreationAttributes>
  implements CategoryAttributes
{
  public id!: string;
  public name!: string;
  public description?: string | null;
  public isDeleted!: boolean;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// 4️ Initialize the model
Category.init(
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
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
  }
);

export default Category;
