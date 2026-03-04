import { useState, useEffect } from "react";
import Script from "next/script";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
export default function App({ Component, pageProps }: AppProps) {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const checkTheme = async () => {
      const hour = new Date().getHours();

      // 1. Time Check: 10 AM to 12 PM
      const isCorrectTime = hour >= 10 && hour < 12;

      try {
        // 2. Location Check using a free API
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        const southIndiaStates = [
          "Tamil Nadu",
          "Kerala",
          "Karnataka",
          "Andhra Pradesh",
          "Telangana",
        ];
        const isSouthIndia = southIndiaStates.includes(data.region);
        const shouldLight = isCorrectTime && isSouthIndia;
        setIsLightMode(isCorrectTime && isSouthIndia);

        if (shouldLight) {
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
        }
      } catch (error) {
        console.error("Location detection failed");
      }
    };

    checkTheme();
  }, []);
 
  return (
    <UserProvider>
      <div className="min-h-screen transition-colors duration-500">
        <title>Nex-Tube Clone</title>
        {/* Pass isLightMode as a prop so the Header can change its colors */}
        <Header isLightMode={isLightMode} />
        <Toaster />
        <div className="flex">
          {/* Pass isLightMode as a prop so the Sidebar can change its colors */}
          <Sidebar isLightMode={isLightMode} />
          <div className="flex-1">
            <Component {...pageProps} isLightMode={isLightMode} />
          </div>
        </div>
      </div>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
    </UserProvider>
  );
}
