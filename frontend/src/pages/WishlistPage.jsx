import { useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "../stores/useWishlistStore";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const WishlistPage = () => {
	const { wishlist, fetchWishlist, loading } = useWishlistStore();

	useEffect(() => {
		fetchWishlist();
	}, [fetchWishlist]);

	if (loading) return <LoadingSpinner />;

	return (
		<div className='min-h-screen bg-gray-900 pt-20 px-4'>
			<div className='max-w-7xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='flex items-center gap-4 mb-12'
				>
					<div className='bg-red-500/20 p-3 rounded-2xl'>
						<Heart className='text-red-500' size={32} fill='currentColor' />
					</div>
					<div>
						<h1 className='text-4xl font-bold text-white uppercase tracking-tighter'>My Wishlist</h1>
						<p className='text-gray-400 mt-1'>Saved products you're keeping an eye on</p>
					</div>
				</motion.div>

				{wishlist.length === 0 ? (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className='flex flex-col items-center justify-center py-20 bg-gray-800/50 rounded-3xl border border-gray-700 border-dashed'
					>
						<Heart className='text-gray-600 mb-6' size={80} />
						<h2 className='text-2xl font-bold text-white mb-2'>Your wishlist is empty</h2>
						<p className='text-gray-400 mb-8 max-w-md text-center'>
							See something you like? Tap the heart icon to save it here for later.
						</p>
						<Link
							to='/browse'
							className='flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-8 py-3 rounded-xl font-bold transition-all hover:scale-105'
						>
							<ShoppingBag size={20} />
							Start Shopping
						</Link>
					</motion.div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
						{wishlist.map((product) => (
							<motion.div
								key={product._id}
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								layout
							>
								<ProductCard product={product} />
							</motion.div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default WishlistPage;
