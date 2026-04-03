import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useOrderStore = create((set) => ({
	orders: [],
	loading: false,

	fetchAllOrders: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/orders");
			set({ orders: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch orders");
		}
	},

	fetchMyOrders: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/orders/my-orders");
			set({ orders: response.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to fetch your orders");
		}
	},

	updateOrderStatus: async (orderId, status) => {
		set({ loading: true });
		try {
			const response = await axios.put(`/orders/${orderId}`, { status });
			set((state) => ({
				orders: state.orders.map((order) =>
					order._id === orderId ? { ...order, status: response.data.status } : order
				),
				loading: false,
			}));
			toast.success("Order status updated successfully");
		} catch (error) {
			set({ loading: false });
			toast.error(error.response?.data?.message || "Failed to update order status");
		}
	},
}));
