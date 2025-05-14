import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// database configuration
const pool_ = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function connectDb() {
  try {
    // database connection starts here
    const conn = await pool.getConnection();
    console.log("Connected to Database");
    conn.release();
  } catch (e) {
    console.error("Database connection failed:", e.sqlMessage);
  }
}
const pool = pool_.promise();
export { pool, connectDb };
