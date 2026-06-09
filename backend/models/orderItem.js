// models/orderItem.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const OrderItem = db.define("order_items", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true 
  },

  orderId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  productId: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  variantId: { 
    type: DataTypes.INTEGER, 
    allowNull: true 
  },

  productName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },

  price: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
  },

  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  },

  subtotal: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

export default OrderItem;