"use client";

import { useRef, useEffect, useState } from "react";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
  isLightMode?: boolean;
  onNextVideo?: () => void;        // for triple center
  onShowComments?: () => void;     // for triple left
}

export default function VideoPlayer({
  video,
  isLightMode,
  onNextVideo,
  onShowComments,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const router = useRouter();

  const [tapCount, setTapCount] = useState(0);
  const [tapSide, setTapSide] = useState<"left" | "center" | "right" | null>(null);
  const [tapTimer, setTapTimer] = useState<NodeJS.Timeout | null>(null);

  // ================= PLAN LIMIT LOGIC =================
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (!videoRef.current) return;

      const currentTime = videoRef.current.currentTime;
      let limit = 300;
      const plan = user?.planType || "Free";

      if (plan === "Bronze") limit = 420;
      else if (plan === "Silver") limit = 600;
      else if (plan === "Gold") limit = Infinity;

      if (currentTime >= limit) {
        videoRef.current.pause();
        alert(
          `You've reached the ${
            limit / 60
          } min limit for the ${plan} plan. Upgrade for more!`
        );
      }
    };

    const videoElement = videoRef.current;
    videoElement?.addEventListener("timeupdate", handleTimeUpdate);

    return () =>
      videoElement?.removeEventListener("timeupdate", handleTimeUpdate);
  }, [user]);

  // ================= GESTURE LOGIC =================
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    let side: "left" | "center" | "right";

    if (clickX < width / 3) side = "left";
    else if (clickX > (width * 2) / 3) side = "right";
    else side = "center";

    setTapSide(side);
    setTapCount((prev) => prev + 1);

    if (tapTimer) clearTimeout(tapTimer);

    const timer = setTimeout(() => {
      processTap(side, tapCount + 1);
      setTapCount(0);
    }, 400);

    setTapTimer(timer);
  };

  const processTap = (side: string, count: number) => {
    if (!videoRef.current) return;

    // DOUBLE TAP
    if (count === 2) {
      if (side === "right") {
        videoRef.current.currentTime += 10;
      } else if (side === "left") {
        videoRef.current.currentTime -= 10;
      }
    }

    // SINGLE TAP
    if (count === 1 && side === "center") {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    }

    // TRIPLE TAP
    if (count === 3) {
      if (side === "center") {
        onNextVideo?.();
      }

      if (side === "right") {
        router.push("/"); // close equivalent
      }

      if (side === "left") {
        onShowComments?.();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleTap}
      className="aspect-video bg-black rounded-lg overflow-hidden cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        className="w-full h-full pointer-events-none"
        poster={`/placeholder.svg?height=480&width=854`}
        autoPlay
      >
        <source
          src={video?.filepath}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}