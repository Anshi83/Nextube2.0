import video from "../Modals/video.js";
import User from "../Modals/Auth.js";

export const uploadvideo = async (req, res) => {
  console.log("File received:", req.file);
  console.log("Body received:", req.body);

  if (req.file === undefined) {
    return res.status(404).json({ message: "plz upload a mp4 video file only" });
  }
  try {
    const file = new video({
      videotitle: req.body.videotitle,
      filename: req.file.originalname,
      filepath: req.file.path, // ✅ Cloudinary full URL
      filetype: req.file.mimetype,
      filesize: req.file.size,
      videochanel: req.body.videochanel,
      uploader: req.body.uploader,
    });
    await file.save();
    return res.status(201).json("file uploaded successfully");
  } catch (error) {
    console.error("Upload error message:", error.message);
    console.error("Upload error details:", JSON.stringify(error, null, 2));
    return res.status(500).json({ message: error.message || "Something went wrong" });
  }
};

export const getallvideo = async (req, res) => {
  try {
    const files = await video.find();
    return res.status(200).send(files);
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const handleDownload = async (req, res) => {
  const { userId, videoId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.isPremium) {
      const today = new Date().setHours(0, 0, 0, 0);
      const downloadsToday = user.downloads.filter(
        (d) => new Date(d.downloadedAt).setHours(0, 0, 0, 0) === today
      );
      if (downloadsToday.length >= 1) {
        return res.status(403).json({
          message: "Daily limit reached. Upgrade to Premium for unlimited downloads.",
        });
      }
    }

    user.downloads.push({ videoId });
    await user.save();
    return res.status(200).json({ message: "Download authorized" });
  } catch (error) {
    console.error("Download error:", error.message);
    return res.status(500).json({ message: "Download error" });
  }
};