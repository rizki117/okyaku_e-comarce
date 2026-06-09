//models/productVariants.js

import { DataTypes } from "sequelize";
import db from "../config/Database.js";

const ProductVariant = db.define("product_variants", {
id: {
type: DataTypes.INTEGER,
autoIncrement: true,
primaryKey: true,
},

productId: {
type: DataTypes.INTEGER,
allowNull: false,
},

size: {
type: DataTypes.STRING,
allowNull: true,
},

color: {
type: DataTypes.STRING,
allowNull: true,
},

stock: {
type: DataTypes.INTEGER,
allowNull: false,
defaultValue: 0,
validate: {
min: 0
}
},

price: {
type: DataTypes.INTEGER,
allowNull: true,
},

is_active: {
type: DataTypes.BOOLEAN,
defaultValue: true
}

}, {
timestamps: true,
indexes: [
{
unique: true,
fields: ["productId", "size", "color"]
}
]
});

export default ProductVariant;
