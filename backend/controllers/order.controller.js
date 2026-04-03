import Order from "../models/order.model.js";

export const getAllOrders = async (req, res) => {
	try {
		const orders = await Order.find({})
			.populate("user", "name email")
			.populate("products.product", "name image price")
			.sort({ createdAt: -1 });

		res.status(200).json(orders);
	} catch (error) {
		console.log("Error in getAllOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const updateOrderStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;

		if (!["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
			return res.status(400).json({ message: "Invalid status" });
		}

		const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

		if (!order) {
			return res.status(404).json({ message: "Order not found" });
		}

		res.status(200).json(order);
	} catch (error) {
		console.log("Error in updateOrderStatus controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user: req.user._id })
			.populate("products.product", "name image price")
			.sort({ createdAt: -1 });

		res.status(200).json(orders);
	} catch (error) {
		console.log("Error in getMyOrders controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
