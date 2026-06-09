// models/orderModel.js
import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Order = db.define("orders", {
  id: {
  type: DataTypes.INTEGER, 
  autoIncrement: true, 
  primaryKey: true 
  },

  userId: { type: DataTypes.INTEGER, allowNull: false },

  addressId: { type: DataTypes.INTEGER, allowNull: true },

  totalPrice: { type: DataTypes.INTEGER, allowNull: false },

  status: {
    type: DataTypes.ENUM(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "completed",
      "cancelled"
    ),
    defaultValue: "pending",
  },

  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: "whatsapp",
  },

  note: { type: DataTypes.TEXT, allowNull: true },

  shippingAddress: { // snapshot alamat
    type: DataTypes.TEXT,
    allowNull: true
  },
  
wa_sent: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
}

}, {
  timestamps: true,
  indexes: [
    { fields: ["userId"] },
    { fields: ["status"] }
  ]
});

export default Order;
