const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // PostgreSQL connection
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { generateSecureVideoURL  } = require("../config/cloudinary");


// Register Route
router.post("/signup", async (req, res) => {
  console.log("Signup route hit!");
  console.log("Received POST request at /api/auth/signup");


  const { username, email, password } = req.body;
  console.log("Request Body:", req.body);


  try {
    // Check if user exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    // Generate JWT
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ user: newUser.rows[0], token });
  } catch (err) {
  console.error("❌ Signup error:", err.message, err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
}
});

// Login Route
router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = userQuery.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ user: { id: user.id, username: user.username, email: user.email }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "video", // Ensures the upload is treated as a video
    folder: "movies",
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({ url: req.file.path });
});
router.get("/stream/:movieId", (req, res) => {
  const { movieId } = req.params;
  const secureURL = generateSecureVideoURL(`movies/${movieId}`);

  res.json({ videoUrl: secureURL });
});
 router.use((req, res, next) => {
  console.log("Received auth request:", req.method, req.originalUrl);
  next();
});


module.exports = router;
