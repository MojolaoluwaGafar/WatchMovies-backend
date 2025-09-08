// const { Pool } = require("pg");
// require("dotenv").config();

// // console.log("👉 Using DB URL:", process.env.DATABASE_URL);
// // console.trace("🕵️ Pool created from here:");

// const pool = new Pool({
//   user: process.env.DB_USER,
//   host: process.env.DB_HOST,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   port: process.env.DB_PORT,
// });

// pool
//   .connect()
//   .then(() => console.log("🔥 PostgreSQL connected successfully!"))
//   .catch((err) => console.error("❌ Database connection error:", err));

// module.exports = pool;

const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  isProduction
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, 
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
      }
);

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connected successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
