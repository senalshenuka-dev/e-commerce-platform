import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, ShieldCheck, Truck, RefreshCw, Send, MessageSquare } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useReviewStore } from "../stores/useReviewStore";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import { useWishlistStore } from "../stores/useWishlistStore";
import LoadingSpinner from "../components/LoadingSpinner";

const ProductPage = () => {
	const { id } = useParams();
	const { products, fetchAllProducts } = useProductStore();
	const { reviews, fetchProductReviews, addReview, loading: reviewsLoading, getAverageRating } = useReviewStore();
	const { addToCart } = useCartStore();
	const { user } = useUserStore();
	const { toggleWishlist, isInWishlist } = useWishlistStore();

	const [product, setProduct] = useState(null);
	const [activeTab, setActiveTab] = useState("description");
	const [rating, setRating] = useState(5);
	const [comment, setComment] = useState("");

	const isWishlisted = isInWishlist(id);

	useEffect(() => {
		const foundProduct = products.find((p) => p._id === id);
		if (foundProduct) {
			setProduct(foundProduct);
		} else {
			fetchAllProducts(); // Fallback if direct link
		}
	}, [id, products, fetchAllProducts]);

	useEffect(() => {
		fetchProductReviews(id);
	}, [id, fetchProductReviews]);

	if (!product) return <LoadingSpinner />;

	const handleAddReview = async (e) => {
		e.preventDefault();
		if (!user) return;
		const success = await addReview(id, { rating, comment });
		if (success) {
			setComment("");
			setRating(5);
		}
	};

	const averageRating = getAverageRating();

	return (
		<div className='min-h-screen bg-gray-900 pt-24 px-4 pb-20'>
			<div className='max-w-7xl mx-auto'>
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20'>
					{/* Left: Image Gallery */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						className='relative'
					>
						<div className='aspect-square rounded-3xl overflow-hidden border border-gray-800 bg-gray-800/20 backdrop-blur-sm group'>
							<img
								src={product.image}
								alt={product.name}
								className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-700'
							/>
						</div>
						<button
							onClick={() => toggleWishlist(product._id)}
							className={`absolute top-6 right-6 p-4 rounded-2xl shadow-xl transition-all duration-300 ${
								isWishlisted ? "bg-red-500 text-white" : "bg-gray-900/80 backdrop-blur-md text-white hover:bg-gray-800"
							}`}
						>
							<Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
						</button>
					</motion.div>

					{/* Right: Product Info */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className='flex flex-col'
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='bg-primary-500/10 text-primary-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary-500/20'>
								{product.category}
							</span>
							<span className='text-gray-500 font-medium italic'>{product.brand}</span>
						</div>

						<h1 className='text-5xl font-black text-white mb-4 tracking-tighter leading-tight'>
							{product.name}
						</h1>

						<div className='flex items-center gap-4 mb-8'>
							<div className='flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20'>
								<Star className='text-amber-500 fill-amber-500' size={18} />
								<span className='text-amber-500 font-bold'>{averageRating}</span>
							</div>
							<span className='text-gray-500 text-sm font-medium'>
								Based on {reviews.length} customer reviews
							</span>
						</div>

						<div className='flex items-baseline gap-4 mb-10'>
							<span className='text-5xl font-black text-primary-400'>LKR {product.price.toFixed(2)}</span>
						</div>

						<div className='grid grid-cols-2 gap-4 mb-10'>
							<div className='flex items-center gap-3 p-4 bg-gray-800/30 rounded-2xl border border-gray-800 transition-colors hover:bg-gray-800/50'>
								<Truck className='text-primary-400' size={24} />
								<div>
									<p className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Free Shipping</p>
									<p className='text-sm text-gray-300 font-medium'>On all orders over LKR 5000</p>
								</div>
							</div>
							<div className='flex items-center gap-3 p-4 bg-gray-800/30 rounded-2xl border border-gray-800 transition-colors hover:bg-gray-800/50'>
								<ShieldCheck className='text-primary-400' size={24} />
								<div>
									<p className='text-xs font-bold text-gray-500 uppercase tracking-widest'>Warranty</p>
									<p className='text-sm text-gray-300 font-medium'>100% Genuine products</p>
								</div>
							</div>
						</div>

						<button
							onClick={() => addToCart(product)}
							disabled={product.stock === 0}
							className='w-full py-5 bg-primary-600 hover:bg-primary-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary-900/20 disabled:opacity-50 disabled:grayscale'
						>
							<ShoppingCart size={24} />
							{product.stock > 0 ? "Add to Shopping Cart" : "Out of Stock"}
						</button>
					</motion.div>
				</div>

				{/* Description & Reviews Tabs */}
				<div className='mt-20'>
					<div className='flex gap-12 border-b border-gray-800 mb-12'>
						{["description", "reviews"].map((tab) => (
							<button
								key={tab}
								onClick={() => setActiveTab(tab)}
								className={`pb-4 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
									activeTab === tab ? "text-primary-400" : "text-gray-500 hover:text-gray-300"
								}`}
							>
								{tab}
								{activeTab === tab && (
									<motion.div
										layoutId='activeTab'
										className='absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full'
									/>
								)}
							</button>
						))}
					</div>

					<AnimatePresence mode='wait'>
						{activeTab === "description" ? (
							<motion.div
								key='desc'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='text-gray-400 leading-relaxed max-w-4xl space-y-4'
							>
								<p className='text-lg'>{product.description}</p>
								<div className='grid grid-cols-2 gap-8 pt-8'>
									<div>
										<h4 className='text-white font-bold mb-4 uppercase tracking-widest text-xs'>Product details</h4>
										<ul className='space-y-2 text-sm'>
											<li><span className='text-gray-600'>Brand:</span> {product.brand}</li>
											<li><span className='text-gray-600'>Availability:</span> {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</li>
											<li><span className='text-gray-600'>Category:</span> {product.category}</li>
										</ul>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								key='reviews'
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								className='grid grid-cols-1 lg:grid-cols-3 gap-16'
							>
								{/* Left: Review List */}
								<div className='lg:col-span-2 space-y-10'>
									{reviews.length === 0 ? (
										<div className='bg-gray-800/20 rounded-3xl p-12 text-center border border-gray-800 border-dashed'>
											<MessageSquare className='mx-auto text-gray-700 mb-4' size={48} />
											<p className='text-gray-500 font-medium'>No reviews yet. Be the first to share your experience!</p>
										</div>
									) : (
										reviews.map((review) => (
											<div key={review._id} className='bg-gray-800/10 p-8 rounded-3xl border border-gray-800/50 hover:border-gray-700 transition-colors'>
												<div className='flex justify-between items-start mb-6'>
													<div className='flex items-center gap-4'>
														<div className='w-12 h-12 bg-primary-500/20 rounded-2xl flex items-center justify-center font-black text-primary-400 border border-primary-500/20'>
															{review.user?.name?.[0].toUpperCase()}
														</div>
														<div>
															<h4 className='text-white font-bold'>{review.user?.name}</h4>
															<p className='text-xs text-gray-500 uppercase tracking-widest mt-0.5'>
															{new Date(review.createdAt).toLocaleDateString("en-US", {
																year: "numeric",
																month: "short",
																day: "numeric",
															})}
															</p>
														</div>
													</div>
													<div className='flex gap-1'>
														{[...Array(5)].map((_, i) => (
															<Star
																key={i}
																size={14}
																className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"}
															/>
														))}
													</div>
												</div>
												<p className='text-gray-400 leading-relaxed italic'>"{review.comment}"</p>
											</div>
										))
									)}
								</div>

								{/* Right: Review Form */}
								<div className='lg:col-span-1'>
									<div className='bg-gray-800 rounded-3xl p-8 border border-gray-700 sticky top-24'>
										<h3 className='text-2xl font-black text-white mb-6 tracking-tight'>Write a Review</h3>
										
										{!user ? (
											<div className='text-center p-6 bg-gray-900/50 rounded-2xl border border-gray-700'>
												<p className='text-gray-400 text-sm mb-4'>Please log in to share your feedback with the community.</p>
												<button className='text-primary-400 font-bold hover:underline'>Log in now</button>
											</div>
										) : (
											<form onSubmit={handleAddReview} className='space-y-6'>
												<div>
													<label className='block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4'>Your Rating</label>
													<div className='flex gap-2'>
														{[1, 2, 3, 4, 5].map((star) => (
															<button
																key={star}
																type='button'
																onClick={() => setRating(star)}
																className='transition-transform hover:scale-110 active:scale-95'
															>
																<Star
																	size={28}
																	className={star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-700"}
																/>
															</button>
														))}
													</div>
												</div>
												<div>
													<label className='block text-xs font-bold text-gray-500 uppercase tracking-widest mb-4'>Your Experience</label>
													<textarea
														value={comment}
														onChange={(e) => setComment(e.target.value)}
														placeholder='Tell others what you think about this product...'
														className='w-full bg-gray-900 border border-gray-700 rounded-2xl p-4 text-sm focus:outline-none focus:border-primary-500 min-h-[120px] transition-all'
														required
													/>
												</div>
												<button
													type='submit'
													disabled={reviewsLoading}
													className='w-full flex items-center justify-center gap-2 bg-white text-gray-900 font-black py-4 rounded-2xl hover:bg-gray-100 transition-all uppercase tracking-widest text-sm shadow-xl'
												>
													{reviewsLoading ? (
														<RefreshCw className='animate-spin' size={20} />
													) : (
														<>
															<Send size={18} />
															Post Review
														</>
													)}
												</button>
											</form>
										)}
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
};

export default ProductPage;
