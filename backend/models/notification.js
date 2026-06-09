//models/notification.js

import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const Notification = db.define(
  "notifications",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.ENUM("order", "system", "payment", "promo"),
      defaultValue: "system",
    },

    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    data: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    indexes: [
      { fields: ["userId"] },
      { fields: ["isRead"] },
      { fields: ["createdAt"] },
    ],
  }
);

export default Notification;