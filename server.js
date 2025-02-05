// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const authRoutes = require("./routes/auth");

// dotenv.config();
// connectDB();

// require('dotenv').config();
// console.log("Mongo URI:", process.env.MONGO_URI); // Debug log


// const app = express();
// app.use(express.json());
// app.use(cors());

// app.use("/api/auth", (req, res, next) => {
//   console.log("Received request at /api/auth:", req.method, req.url);
//   next();
// }); //debug
// app.use("/api/auth", authRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./config/db"); // ✅ Import PostgreSQL connection
const authRoutes = require("./routes/auth");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Test PostgreSQL connection
pool
  .connect()
  .then(() => console.log("🔥 PostgreSQL connected!"))
  .catch((err) => console.error("❌ Database connection error:", err));

app.use("/api/auth", (req, res, next) => {
  console.log("Received request at /api/auth:", req.method, req.url);
  next();
}); // Debugging

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
