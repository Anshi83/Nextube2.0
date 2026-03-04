"use client";

import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const recordedChunks = useRef<Blob[]>([]);

const VideoCall = () => {
  const localVideo = useRef<HTMLVideoElement>(null);
  const remoteVideo = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<RTCPeerConnection | null>(null);

  const roomId = "youtube-room";

  useEffect(() => {
    socket.emit("join-room", roomId);

    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.ontrack = (event) => {
      if (remoteVideo.current) {
        remoteVideo.current.srcObject = event.streams[0];
      }
    };

    peerRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    socket.on("offer", async (offer) => {
      await peerRef.current?.setRemoteDescription(offer);
      const answer = await peerRef.current?.createAnswer();
      await peerRef.current?.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peerRef.current?.setRemoteDescription(answer);
    });

    socket.on("ice-candidate", async (candidate) => {
      await peerRef.current?.addIceCandidate(candidate);
    });
  }, []);
  const startRecording = () => {
    if (!remoteVideo.current?.srcObject) {
      alert("No remote stream to record");
      return;
    }

    const stream = remoteVideo.current.srcObject as MediaStream;

    const recorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
    });

    mediaRecorderRef.current = recorder;
    recordedChunks.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, {
        type: "video/webm",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "video-call-recording.webm";
      a.click();

      URL.revokeObjectURL(url);
    };

    recorder.start();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideo.current) {
        localVideo.current.srcObject = stream;
      }

      stream.getTracks().forEach((track) => {
        peerRef.current?.addTrack(track, stream);
      });

      const offer = await peerRef.current?.createOffer();
      await peerRef.current?.setLocalDescription(offer);

      socket.emit("offer", { roomId, offer });
    } catch (error) {
      console.error("Media device error:", error);
      alert("Camera or microphone not found. Check permissions.");
    }
  };

  const shareScreen = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const screenTrack = screenStream.getVideoTracks()[0];

    const sender = peerRef.current
      ?.getSenders()
      .find((s) => s.track?.kind === "video");

    sender?.replaceTrack(screenTrack);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <video ref={localVideo} autoPlay muted className="w-64 border" />
        <video ref={remoteVideo} autoPlay className="w-64 border" />
      </div>

      <div className="flex gap-4">
        <button
          onClick={startCall}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Start Call
        </button>

        <button
          onClick={shareScreen}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Share Screen
        </button>
        <button
          onClick={startRecording}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="bg-gray-800 text-white px-4 py-2 rounded"
        >
          Stop Recording
        </button>
      </div>
    </div>
  );
};

export default VideoCall;
