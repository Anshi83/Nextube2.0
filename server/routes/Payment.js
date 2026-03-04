// backend/routes/payment.js
import express from "express";
import { createOrder, verifyPayment } from "../controllers/Payment.js";

const router = express.Router();

// These match the URLs your frontend is calling
router.post("/create-order", createOrder); 
router.post("/verify", verifyPayment);

export default router;