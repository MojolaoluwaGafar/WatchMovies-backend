const cloudinary = require("cloudinary").v2;
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
  process.env;
const dotenv = require("dotenv");

  dotenv.config();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

// Function to generate a signed video URL (valid for 1 hour)
const generateSecureVideoURL = (publicId) => {
  return cloudinary.url(publicId, {
    resource_type: "video",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  });
};

module.exports = { cloudinary, generateSecureVideoURL };
