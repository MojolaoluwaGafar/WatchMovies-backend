const { Pool } = require("pg");
require("dotenv").config();

// console.log("👉 Using DB URL:", process.env.DATABASE_URL);
// console.trace("🕵️ Pool created from here:");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "watchmovies",
  password: "Codexcodex808", 
  port: 5432,
});

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connected successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;
