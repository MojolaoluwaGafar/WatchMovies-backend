// const mongoose = require("mongoose");

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB connected!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err.message);
//     process.exit(1); // Exit process with failure
//   }
// };

// module.exports = connectDB;

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "watchmovies",
  password: "Codex808",
  port: 5000, // ✅ Ensure this is correct
  ssl: false, // 🔹 Disable SSL
});

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;

