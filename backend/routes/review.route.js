import express from "express";
import { protectRoute, adminRoute, supportRoute } from "../middleware/auth.middleware.js";
import { addReview, getProductReviews, getAllReviews, deleteReview } from "../controllers/review.controller.js";

const router = express.Router();

router.get("/", protectRoute, supportRoute, getAllReviews);
router.get("/:productId", getProductReviews);
router.post("/:productId", protectRoute, addReview);
router.delete("/:id", protectRoute, supportRoute, deleteReview);

export default router;
