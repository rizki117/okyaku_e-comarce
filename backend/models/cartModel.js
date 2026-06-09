import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Cart = db.define("carts", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true,
  },

  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

  status: { 
    type: DataTypes.ENUM("active", "checkedout"), 
    defaultValue: "active",
  },

}, {
  timestamps: true,

  indexes: [
    {
      fields: ["userId", "status"]
    }
  ]
});

export default Cart;