// components/PremiumButton.tsx
import React from "react";
import { Button } from "./ui/button";
import axiosInstance from "@/lib/axiosinstance";

const PremiumButton = ({ userId }: { userId: string }) => {
  const handlePayment = async () => {
    try {
      // 1. Create order on your backend
      const { data: order } = await axiosInstance.post("/payment/create-order");

      // 2. Set up Razorpay options
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Get from Razorpay Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "Nex-Tube Premium",
        description: "Unlimited Video Downloads",
        order_id: order.id,
        handler: async (response: any) => {
          // 3. Verify payment on backend
          const verifyRes = await axiosInstance.post("/payment/verify", {
            ...response,
            userId,
          });
          if (verifyRes.status === 200) {
            alert("Payment Successful! You are now a Premium user.");
            window.location.reload(); // Refresh to update user status
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <Button onClick={handlePayment} className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold">
      Upgrade to Premium
    </Button>
  );
};

export default PremiumButton;