import Pricing from "@/components/Pricing";

export default function SubscriptionsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Your Subscription</h1>
      {/* This will now display Bronze, Silver, and Gold tiers inside the sub section */}
      <Pricing /> 
    </div>
  );
}