"use client";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";

const plans = [
  { name: "Free", price: 0, limit: "5 mins", color: "bg-gray-500" },
  { name: "Bronze", price: 10, limit: "7 mins", color: "bg-orange-600" },
  { name: "Silver", price: 50, limit: "10 mins", color: "bg-slate-400" },
  { name: "Gold", price: 100, limit: "Unlimited", color: "bg-yellow-500" },
];

export default function Pricing() {
  const { user, login } = useUser();

  const handleSubscription = async (planName: string, amount: number) => {
    if (!user) return alert("Please login first!");

    try {
      // Logic to hit your existing verifyPayment controller
      const response = await axiosInstance.post("/payment/verify", {
        userId: user._id,
        planSelected: planName,
        amount: amount,
        mockSuccess: true, // For your testing mode
      });

      if (response.data.result) {
        login(response.data.result); // Update local user state
        alert(`Successfully upgraded to ${planName}! Check your email for the invoice.`);
      }
    } catch (error) {
      console.error("Payment failed", error);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      {plans.map((plan) => (
        <div key={plan.name} className="border rounded-xl p-4 flex flex-col items-center shadow-lg bg-zinc-900 text-white">
          <h2 className={`text-xl font-bold px-4 py-1 rounded-full ${plan.color}`}>{plan.name}</h2>
          <p className="text-3xl font-bold mt-4">₹{plan.price}</p>
          <p className="text-zinc-400 mt-2">{plan.limit} Watch Time</p>
          <button 
            onClick={() => handleSubscription(plan.name, plan.price)}
            className="mt-6 w-full py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg font-semibold transition"
          >
            {user?.planType === plan.name ? "Current Plan" : "Upgrade Now"}
          </button>
        </div>
      ))}
    </div>
  );
}