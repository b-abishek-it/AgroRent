const { v2: cloudinary } = require("cloudinary");

const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("✅ Cloudinary configured (cloud:", process.env.CLOUDINARY_CLOUD_NAME + ")");
} else {
  console.warn(
    "⚠️  Cloudinary is NOT configured. Machine image uploads will fail.",
    "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET env vars."
  );
}

/**
 * Upload a machine image buffer to Cloudinary.
 * Throws if Cloudinary is not configured or the upload fails.
 */
const uploadMachineImage = async (file) => {
  if (!file || !file.buffer) {
    throw new Error("No image file provided");
  }

  if (!cloudinaryConfigured) {
    throw new Error(
      "Image upload is unavailable — Cloudinary is not configured. " +
      "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables."
    );
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "agrorent/machines",
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error.message || error);
          return reject(new Error("Image upload to Cloudinary failed: " + (error.message || "Unknown error")));
        }
        console.log("✅ Image uploaded to Cloudinary:", result.secure_url);
        resolve(result.secure_url);
      }
    );

    uploadStream.end(file.buffer);
  });
};

module.exports = { uploadMachineImage };
