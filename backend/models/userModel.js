import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const User = db.define("users", {
  id: { 
  type: DataTypes.INTEGER, 
  autoIncrement: true,
   primaryKey: true 
   },
  google_id: { 
  type: DataTypes.STRING, 
  allowNull: true, 
  unique: true 
  },
  name: {
   type: DataTypes.STRING, 
   allowNull: false 
   },
  email: { type: 
  DataTypes.STRING, 
  allowNull: false, 
  unique: true
   },
  password: { 
  type: DataTypes.STRING, 
  allowNull: true 
  },
  photo: {
   type: DataTypes.STRING, 
   allowNull: true 
   },
  phone: { 
  type: DataTypes.STRING, 
  allowNull: true 
  },
  role: {
    type: DataTypes.ENUM("admin", "seller", "buyer"),
    defaultValue: "buyer",
  },
  is_active: { 
  type: DataTypes.BOOLEAN, 
  defaultValue: true },
});

export default User;
