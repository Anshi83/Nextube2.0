"use strict";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

// ✅ Accept all common video formats (was mp4 only before)
const filefilter = (req, file, cb) => {
  const allowedTypes = [
    "video/mp4",
    "video/webm",
    "video/quicktime",
    "video/x-msvideo",
    "video/avi",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({ storage: storage, fileFilter: filefilter });
export default upload;