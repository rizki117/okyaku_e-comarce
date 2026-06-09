//models/userSession.js

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const RefreshToken = db.define("refresh_tokens", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true,
  },
  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },
  token: { 
    type: DataTypes.TEXT, 
    allowNull: false,
    unique: true
  },
  expiredAt: { 
    type: DataTypes.DATE, 
    allowNull: false,
  },
}, {
  timestamps: true
});

export default RefreshToken;
