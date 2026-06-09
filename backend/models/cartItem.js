//models/cartItem.js

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const CartItem = db.define("cart_items", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true,
  },

  cartId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

  variantId: { 
    type: DataTypes.INTEGER, 
    allowNull: true,
  },

  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1,
  },

  price: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

}, {
  timestamps: true,

  indexes: [
    {
      unique: true,
      fields: ["cartId", "productId", "variantId"]
    }
  ]
});

export default CartItem;