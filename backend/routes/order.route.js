import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAllOrders, updateOrderStatus, getMyOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllOrders);
router.get("/my-orders", protectRoute, getMyOrders);
router.put("/:id", protectRoute, adminRoute, updateOrderStatus);

export default router;
