import { Model, DataTypes, Optional } from 'sequelize';
import Product from './product';
import { nanoid } from 'nanoid';
import db from '../config/database';

interface InventoryAttributes {
    id: string;
    productId: string;
    quantity: number;
    stock: number;
    warehouseLocation?: string;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Define which fields are optional on creation
interface InventoryCreationAttributes extends Optional<InventoryAttributes, "id" | "productId" | "quantity" | "stock" | "warehouseLocation" | "isDeleted" |"createdAt" | "updatedAt"> {}

class Inventory
    extends Model<InventoryAttributes, InventoryCreationAttributes>
    implements InventoryAttributes
{
  public id!: string;
  public productId!: string;
  public quantity!: number;
  public stock!: number;
  public warehouseLocation?: string;
  public isDeleted!: boolean;
  
    // timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Inventory.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true, defaultValue: () => nanoid() },
    productId: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    warehouseLocation: { type: DataTypes.STRING, allowNull: true },
    isDeleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize: db,
    tableName: "Inventories",
    timestamps: true,
  }
);

// Association
Inventory.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Inventory, { foreignKey: 'productId' });

export default Inventory;
