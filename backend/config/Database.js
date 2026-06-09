import mysql from "mysql2/promise";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

const createDatabaseIfNotExists = async () => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
    });

    const [rows] = await connection.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA 
       WHERE SCHEMA_NAME = ?`,
      [DB_NAME]
    );

    if (rows.length === 0) {
      await connection.query(`CREATE DATABASE \`${DB_NAME}\``);
      console.log(`✅ Database '${DB_NAME}' berhasil dibuat`);
    } else {
      console.log(`ℹ️  Database '${DB_NAME}' sudah ada`);
    }

  } catch (error) {
    console.error("❌ Gagal membuat database:", error.message);
    process.exit(1); // hentikan server jika gagal
  } finally {
    if (connection) await connection.end();
  }
};

await createDatabaseIfNotExists();

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
});

export default db;