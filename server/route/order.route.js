import express from "express";

import { 
  CashOnDeliveryOrderController,
  paymentController,
  webhookStripe,
  getOrderDetailsController
} from "../controllers/order.controller.js";  // ✅ Correct path

import authToken from "../middleware/auth.js"; 

const router = express.Router();

router.post("/cod", authToken, CashOnDeliveryOrderController);
router.post("/checkout", authToken, paymentController);
router.post("/webhook", webhookStripe);
router.get("/details", authToken, getOrderDetailsController);

export default router;
