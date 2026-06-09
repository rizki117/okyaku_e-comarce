import { DataTypes } from "sequelize"; // ← lebih simpel
import db from "../config/Database.js";

const Product = db.define("products", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  userId: { type: DataTypes.INTEGER, allowNull: false },

  categoryId: { type: DataTypes.INTEGER, allowNull: false },

  name: { type: DataTypes.STRING, allowNull: false },

  description: { type: DataTypes.TEXT, allowNull: true },

  price: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
    validate: {
      min: 0
    }
  },

  image: { 
    type: DataTypes.TEXT, // ← support multi image
    allowNull: true 
  },

  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },

}, {
  timestamps: true,
  indexes: [
    { fields: ["userId"] },
    { fields: ["categoryId"] }
  ]
});

export default Product; // ← harus sama dengan nama variabel
