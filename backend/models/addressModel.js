//models/addressModel.js

import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Address = db.define("addresses", {
  id: { 
    type: DataTypes.INTEGER, 
    autoIncrement: true, 
    primaryKey: true,
  },

  userId: { 
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

  label: { 
    type: DataTypes.STRING, 
    allowNull: false, // "Rumah", "Kantor"
  },

  recipient: { 
    type: DataTypes.STRING, 
    allowNull: false, // nama penerima
  },

  phone: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },

  address: { 
    type: DataTypes.TEXT, 
    allowNull: false,
  },

  city: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },

  province: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },

  postal_code: { 
    type: DataTypes.STRING, 
    allowNull: false,
  },
  
  is_deleted: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
},

  is_default: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false,
  },
}, {
  timestamps: true // ← WAJIB tambah ini
});

export default Address;
