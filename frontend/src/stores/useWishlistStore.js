import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useWishlistStore = create((set, get) => ({
	wishlist: [],
	loading: false,

	fetchWishlist: async () => {
		set({ loading: true });
		try {
			const res = await axios.get("/wishlist");
			set({ wishlist: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch wishlist");
		}
	},

	toggleWishlist: async (productId) => {
		try {
			const res = await axios.post("/wishlist/toggle", { productId });
			// The backend returns the updated list of IDs, but we want the full product objects in the store
			// So we might need to refetch or update locally. 
			// For simplicity, let's just toggle the ID list for now or refetch if we are on the wishlist page.
			
			// If we are just toggling from a card, we can update the local state if it's just IDs.
			// But the WishlistPage needs full objects.
			
			// Let's refetch to keep it simple and consistent.
			await get().fetchWishlist();
			
			const isAdded = res.data.includes(productId);
			if (isAdded) {
				toast.success("Added to wishlist");
			} else {
				toast.success("Removed from wishlist");
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to update wishlist");
		}
	},

	isInWishlist: (productId) => {
		return get().wishlist.some((item) => (item._id || item) === productId);
	},
}));
