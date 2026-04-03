import User from "../models/user.model.js";

export const toggleWishlist = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = await User.findById(req.user._id);

		const isWishlisted = user.wishlist.includes(productId);

		if (isWishlisted) {
			user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
		} else {
			user.wishlist.push(productId);
		}

		await user.save();
		res.status(200).json(user.wishlist);
	} catch (error) {
		console.log("Error in toggleWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getWishlist = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).populate({
			path: "wishlist",
			select: "name image price brand stock category",
		});

		res.status(200).json(user.wishlist);
	} catch (error) {
		console.log("Error in getWishlist controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
