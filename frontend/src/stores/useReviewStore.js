import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useReviewStore = create((set, get) => ({
	reviews: [],
	loading: false,

	fetchProductReviews: async (productId) => {
		set({ loading: true });
		try {
			const res = await axios.get(`/reviews/${productId}`);
			set({ reviews: res.data, loading: true });
			set({ loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch reviews");
		}
	},

	addReview: async (productId, reviewData) => {
		set({ loading: true });
		try {
			const res = await axios.post(`/reviews/${productId}`, reviewData);
			set((state) => ({
				reviews: [res.data, ...state.reviews],
				loading: false,
			}));
			toast.success("Review submitted successfully");
			return true;
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to submit review");
			return false;
		}
	},

	getAverageRating: () => {
		const { reviews } = get();
		if (reviews.length === 0) return 0;
		const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
		return (sum / reviews.length).toFixed(1);
	},

	fetchAllReviews: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/reviews");
			set({ reviews: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch all reviews");
		}
	},

	deleteReview: async (reviewId) => {
		try {
			await axios.delete(`/reviews/${reviewId}`);
			set((state) => ({
				reviews: state.reviews.filter((review) => review._id !== reviewId),
			}));
			toast.success("Review deleted successfully");
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to delete review");
		}
	},
}));
