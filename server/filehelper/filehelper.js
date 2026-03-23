import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import * as cloudinaryStorage from "multer-storage-cloudinary";

console.log("Cloudinary config check:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "MISSING"
});
const CloudinaryStorage =
  cloudinaryStorage.CloudinaryStorage ||
  cloudinaryStorage.default?.CloudinaryStorage ||
  cloudinaryStorage.default;

if (!CloudinaryStorage) {
  throw new Error("CloudinaryStorage import failed");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "video",
    folder: "nextube-videos",
    allowed_formats: ["mp4", "webm", "mov", "avi"],
  },
});

const upload = multer({ storage });

export default upload;