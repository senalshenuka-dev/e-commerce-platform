import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	checkoutSuccess,
	createCheckoutSession,
	createPaymentIntent,
	confirmOrder,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);
router.post("/checkout-success", protectRoute, checkoutSuccess);
router.post("/create-payment-intent", protectRoute, createPaymentIntent);
router.post("/confirm-order", protectRoute, confirmOrder);

export default router;
