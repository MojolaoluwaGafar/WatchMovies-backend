const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const axios = require("axios");

// Load environment variables
dotenv.config();

// Ensure DB connects immediately (it logs internally)
require("./config/db");

const app = express();
exports.app = app;

app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);

app.get("/api/movies", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title query is required" });
  }

  try {
    const tmdbApiKey = process.env.TMDB_API_KEY;
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${encodeURIComponent(title)}`
    );

    res.json(response.data.results);
  } catch (error) {
    console.error("Error fetching movies from TMDB:", error);
    res.status(500).json({ error: "Failed to fetch movies from TMDB" });
  }
});

app.get("/api/movies/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Fetching movie with ID: ${id}`);
    const pool = require("./config/db");

    const movie = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);

    if (movie.rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie.rows[0]);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
