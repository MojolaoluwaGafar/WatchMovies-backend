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

app.get("/api/movies", async (req, res) => {
  const { title } = req.query;

  try {
    let query = "SELECT * FROM movies";
    let values = [];

    if (title) {
      query += " WHERE LOWER(title) LIKE LOWER($1)";
      values.push(`%${title}%`);
    }

    const movies = await pool.query(query, values);

    res.json(movies.rows);
  } catch (error) {
    console.error("Error searching movies:", error);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Fetching movie with ID: ${id}`);

    // Fetch the movie from PostgreSQL by ID
    const movie = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);

    // Check if movie exists
    if (movie.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie.rows[0]); // Return the first (and only) movie found
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Server error" });
  }
});




const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
