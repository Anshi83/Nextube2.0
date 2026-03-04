import nodemailer from "nodemailer";

export const sendOTPEmail = async (userEmail, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use the 16-character App Password
    },
  });

  const mailOptions = {
    from: '"NexTube Security" <security@nextube.com>',
    to: userEmail,
    subject: "Your Security OTP",
    text: `Your OTP for login is: ${otp}. This is required for South India region access.`,
  };

  return transporter.sendMail(mailOptions);
};

// Mock function for Mobile OTP (Task requirement)
export const sendOTPMobile = async (mobileNumber, otp) => {
  console.log(`Triggering SMS OTP to ${mobileNumber}: ${otp}`);
  // In a real app, you would use Twilio or Vonage here
  return true;
};