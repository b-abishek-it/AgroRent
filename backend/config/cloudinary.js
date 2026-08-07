const fs = require("fs");
const path = require("path");
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
}

const localUploadDir = path.join(__dirname, "..", "uploads", "machines");
const ensureLocalUploadDir = () => {
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }
};

const saveMachineImageLocally = (fileBuffer) => {
  ensureLocalUploadDir();
  const timestamp = Date.now();
  const fileName = `machine-${timestamp}-${Math.floor(Math.random() * 10000)}.jpg`;
  const filePath = path.join(localUploadDir, fileName);
  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/machines/${fileName}`;
};

const uploadMachineImage = async (fileBuffer) => {
  if (!fileBuffer) {
    throw new Error("No file buffer provided");
  }

  if (!cloudinaryConfigured) {
    console.warn("Cloudinary is not configured. Saving machine image locally.");
    return saveMachineImageLocally(fileBuffer);
  }

  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "agrorent/machines",
          resource_type: "image",
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      );

      uploadStream.end(fileBuffer);
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error.message || error);
    console.warn("Falling back to local save for machine image.");
    return saveMachineImageLocally(fileBuffer);
  }
};

module.exports = { uploadMachineImage };
