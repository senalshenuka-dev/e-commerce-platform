import toast from "react-hot-toast";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
	const { user } = useUserStore();
	const { addToCart } = useCartStore();
	const { toggleWishlist, isInWishlist } = useWishlistStore();
	const isWishlisted = isInWishlist(product._id);

	const handleAddToCart = () => {
		if (!user) {
			toast.error("Please login to add products to cart", { id: "login" });
			return;
		} else {
			addToCart(product);
		}
	};

	const handleToggleWishlist = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) {
			toast.error("Please login to use wishlist", { id: "login" });
			return;
		}
		toggleWishlist(product._id);
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg group'>
			<Link to={`/product/${product._id}`} className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img className='object-cover w-full group-hover:scale-110 transition-transform duration-500' src={product.image} alt='product image' />
				<div className='absolute inset-0 bg-black bg-opacity-20' />
				
				<button
					onClick={handleToggleWishlist}
					className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${
						isWishlisted ? "bg-red-500 text-white" : "bg-white/10 backdrop-blur-md text-white hover:bg-white/20"
					}`}
				>
					<Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
				</button>
			</Link>

			<div className='mt-4 px-5 pb-5'>
				<Link to={`/product/${product._id}`}>
					<h5 className='text-xl font-semibold tracking-tight text-white hover:text-primary-400 transition-colors'>
						{product.name}
					</h5>
				</Link>
				
				<div className='flex items-center gap-2 mt-2 mb-2 italic text-gray-500 text-sm'>
					<span>{product.brand}</span>
				</div>

				<div className='flex items-center gap-1 mb-4'>
					{[...Array(5)].map((_, i) => (
						<Star
							key={i}
							size={14}
							className={i < (product.averageRating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-600"}
						/>
					))}
					<span className='text-xs text-gray-400 ml-1'>({product.numReviews || 0})</span>
				</div>

				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-2xl font-bold text-primary-400 italic'>LKR {product.price}</span>
					</p>
				</div>
				<button
					className='flex items-center justify-center w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to Cart
				</button>
			</div>
		</div>
	);
};
export default ProductCard;
