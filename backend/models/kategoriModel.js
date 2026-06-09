//models/kategoiModel.js

import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Category = db.define("categories", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },

}, {
  timestamps: true
});

export default Category;