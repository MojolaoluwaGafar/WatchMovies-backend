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

// const { Pool } = require("pg");

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "watchmovies",
//   password: "Codex808",
//   port: 5000, // ✅ Ensure this is correct
//   ssl: false, // 🔹 Disable SSL
// });

const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "watchmovies",
  password: "Codex808",  // Replace with your actual password
  port: 5000,  // Ensure it's 5000, not 5432
});

pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;


