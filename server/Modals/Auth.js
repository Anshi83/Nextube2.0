import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String },
  channelname: { type: String },
  description: { type: String },
  image: { type: String },
  joinedon: { type: Date, default: Date.now },
  // UPDATED FOR MULTI-PLAN TASK
  planType: { 
    type: String, 
    enum: ["Free", "Bronze", "Silver", "Gold"], 
    default: "Free" 
  },
  // ADDED FOR DOWNLOAD TASK
  isPremium: { type: Boolean, default: false },
  downloads: [
    {
      videoId: { type: mongoose.Schema.Types.ObjectId, ref: "video" },
      downloadedAt: { type: Date, default: Date.now }
    }
  ]
});
export default mongoose.model("user", userSchema);
