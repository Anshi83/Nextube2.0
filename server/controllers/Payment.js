import Razorpay from "razorpay";
import User from "../Modals/Auth.js"; 
import { sendInvoiceEmail } from "../utils/sendEmail.js";

// Using hardcoded strings for testing to bypass environment variable issues
const razorpay = new Razorpay({
  key_id: "rzp_test_mock123456", 
  key_secret: "mock_secret_abcdef"
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
     // Log the error but don't let it crash the server
     console.log("Razorpay Order Error (Expected in Mock Mode)");
     res.status(200).json({ id: "mock_order_id", amount: 50000 });
  }
};

export const verifyPayment = async (req, res) => {
  const { userId, planSelected, amount, mockSuccess } = req.body; // planSelected: "Bronze", "Silver", etc.
  
  try {
    if (mockSuccess) {
      // Highlight: Update both isPremium and the specific planType
      const updatedUser = await User.findByIdAndUpdate(
        userId, 
        { 
          isPremium: true, 
          planType: planSelected 
        }, 
        { new: true }
      );

      // Trigger the invoice email
      try {
        await sendInvoiceEmail(updatedUser.email, planSelected, amount);
      } catch (emailErr) {
        console.error("Email failed but payment succeeded:", emailErr);
      }

      return res.status(200).json({ 
        message: `Plan ${planSelected} Activated!`, 
        result: updatedUser 
      });
    }
    res.status(400).json({ message: "Payment failed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Error" });
  }
};
