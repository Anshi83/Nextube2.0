import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import "@/styles/globals.css";
import { UserProvider } from "../lib/AuthContext";

import type { AppProps } from "next/app";
import { Toaster } from "sonner";

export default function App({ Component, pageProps }: AppProps) {
  return (
  <UserProvider>
    <div className="min-h-screen bg-white text-black">
      <Header />
      <Toaster/>
      <div className="flex">
        <Sidebar/>
        <Component {...pageProps} />
      </div>
    </div>
    </UserProvider>
  );
}
