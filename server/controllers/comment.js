import comment from "../Modals/comment.js";
import mongoose from "mongoose";
import axios from "axios"; // Added axios for geo-lookup
import { translate } from '@vitalets/google-translate-api';

export const postcomment = async (req, res) => {
  //const commentdata = req.body;
  const { videoid, userid, commentbody, usercommented } = req.body;//const postcomment = new comment(commentdata);
  {/*try {
    await postcomment.save();
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};}*/}
try {
  let city = "Unknown";
  // Detection of city via IP
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  
  try {
    // Use a timeout to prevent the request from hanging
    const geo = await axios.get(`http://ip-api.com/json/${ip}`, { timeout: 2000 });
    if (geo.data && geo.data.city) {
      city = geo.data.city;
    }
  } catch (err) {
    console.error("Geo-lookup failed:", err.message);
  }

  const newComment = new comment({
    videoid,
    userid,
    commentbody,
    usercommented,
    city 
  });

  await newComment.save();
  // Return the full comment object so the frontend has the _id and city
  return res.status(200).json({ comment: true, data: newComment });
} catch (error) {
  return res.status(500).json({ message: "Something went wrong" });
}
};
export const getallcomment = async (req, res) => {
  const { videoid } = req.params;
  try {
    const commentvideo = await comment.find({ videoid: videoid });
    return res.status(200).json(commentvideo);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const deletecomment = async (req, res) => {
  const { id: _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    await comment.findByIdAndDelete(_id);
    return res.status(200).json({ comment: true });
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const editcomment = async (req, res) => {
  const { id: _id } = req.params;
  const { commentbody } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("comment unavailable");
  }
  try {
    const updatecomment = await comment.findByIdAndUpdate(_id, {
      $set: { commentbody: commentbody }},
    { new: true } // Returns updated text to frontend
  );
    res.status(200).json(updatecomment);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const translatecomment = async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ message: "Text and target language required" });
    }

    // Try translating with a specific mobile user-agent to avoid 503 errors
    const result = await translate(text, { 
      to: targetLang,
      fetchOptions: {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        }
      }
    });

    return res.status(200).json({
      translatedText: result.text
    });

  } catch (error) {
    console.error("Translation logic error:", error.message);
    // If it's still failing, send a 200 with the original text so the UI doesn't break
    return res.status(200).json({ 
      translatedText: `(Translation Error: ${text})`, 
      error: true 
    });
  }
};




