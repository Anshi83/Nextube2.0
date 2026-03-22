import mongoose from "mongoose";
import users from "../Modals/Auth.js";
import { sendOTPEmail, sendOTPMobile } from "../utils/sendOtp.js";

export const login = async (req, res) => {
  const { email, name, image, region, mobileNumber } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);

  try {
    const southIndiaStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"];
    const isSouthIndia = southIndiaStates.includes(region);

    if (isSouthIndia) {
      await sendOTPEmail(email, otp);
    } else {
      await sendOTPMobile(mobileNumber, otp);
    }

    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      const newUser = await users.create({
        email,
        name,
        image,
        isPremium: false,
        planType: "Free",
        downloads: []
      });
      // ✅ OTP NOT sent in response — security fix
      // Frontend should verify OTP separately, not read it from response
      return res.status(201).json({ result: newUser, message: "OTP sent successfully" });
    } else {
      return res.status(200).json({ result: existingUser, message: "OTP sent successfully" });
    }

  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateprofile = async (req, res) => {
  const { id: _id } = req.params;
  const { channelname, description } = req.body;

  // ✅ Fixed: 404 for invalid ID (was 500 before)
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).json({ message: "User unavailable..." });
  }

  try {
    const updatedata = await users.findByIdAndUpdate(
      _id,
      {
        $set: {
          channelname: channelname,
          description: description,
        },
      },
      { new: true }
    );
    return res.status(201).json(updatedata);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};