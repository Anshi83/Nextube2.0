import Razorpay from "razorpay";
import User from "../Modals/Auth.js";
import { sendInvoiceEmail } from "../utils/sendEmail.js";

// ✅ Use environment variables — never hardcode keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_mock123456",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "mock_secret_abcdef",
});

export const createOrder = async (req, res) => {
  try {
    const options = {
      amount: 50000,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.log("Razorpay Order Error (Mock Mode):", error.message);
    // Fallback mock response so frontend doesn't break in test mode
    res.status(200).json({ id: "mock_order_id", amount: 50000 });
  }
};

export const verifyPayment = async (req, res) => {
  const { userId, planSelected, amount, mockSuccess } = req.body;

  try {
    if (mockSuccess) {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isPremium: true,
          planType: planSelected,
        },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Send invoice email — don't let email failure break the payment response
      try {
        await sendInvoiceEmail(updatedUser.email, planSelected, amount);
      } catch (emailErr) {
        console.error("Email failed but payment succeeded:", emailErr.message);
      }

      return res.status(200).json({
        message: `Plan ${planSelected} Activated!`,
        result: updatedUser,
      });
    }
    return res.status(400).json({ message: "Payment failed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Error" });
  }
};