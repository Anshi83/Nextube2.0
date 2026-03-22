import { Server } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import paymentRoutes from "./routes/Payment.js";

dotenv.config();

const app = express();

// ✅ CORS first
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://nextube2-0.vercel.app"
  ],
  credentials: true
}));

// ✅ All body parsers BEFORE routes (was after routes before — fixed)
app.use(bodyParser.json());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.get("/", (req, res) => {
  res.send("You tube backend is working");
});

// All route paths unchanged — frontend stays fully compatible
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/payment", paymentRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://nextube2-0.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("offer", (data) => {
    socket.to(data.roomId).emit("offer", data.offer);
  });

  socket.on("answer", (data) => {
    socket.to(data.roomId).emit("answer", data.answer);
  });

  socket.on("ice-candidate", (data) => {
    socket.to(data.roomId).emit("ice-candidate", data.candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const DBURL = process.env.DB_URL;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });