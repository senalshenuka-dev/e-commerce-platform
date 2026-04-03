import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const addReview = async (req, res) => {
	try {
		const { rating, comment } = req.body;
		const { productId } = req.params;

		const existingReview = await Review.findOne({ product: productId, user: req.user._id });
		if (existingReview) {
			return res.status(400).json({ message: "You have already reviewed this product" });
		}

		const review = await Review.create({
			product: productId,
			user: req.user._id,
			rating,
			comment,
		});

		// Optional: We could update the product's average rating here if we added it to the Product model.
		// For now, we calculate it on the fly or keep it simple.

		const populatedReview = await review.populate("user", "name email");

		res.status(201).json(populatedReview);
	} catch (error) {
		console.log("Error in addReview controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProductReviews = async (req, res) => {
	try {
		const { productId } = req.params;
		const reviews = await Review.find({ product: productId })
			.populate("user", "name")
			.sort({ createdAt: -1 });

		res.status(200).json(reviews);
	} catch (error) {
		console.log("Error in getProductReviews controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getAllReviews = async (req, res) => {
	try {
		const reviews = await Review.find({})
			.populate("user", "name email")
			.populate("product", "name image")
			.sort({ createdAt: -1 });

		res.status(200).json(reviews);
	} catch (error) {
		console.log("Error in getAllReviews controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const deleteReview = async (req, res) => {
	try {
		const review = await Review.findByIdAndDelete(req.params.id);

		if (!review) {
			return res.status(404).json({ message: "Review not found" });
		}

		res.status(200).json({ message: "Review deleted successfully" });
	} catch (error) {
		console.log("Error in deleteReview controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
