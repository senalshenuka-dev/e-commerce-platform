import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trash, Star, User, ShoppingBag } from "lucide-react";
import { useReviewStore } from "../stores/useReviewStore";

const ReviewManagement = () => {
	const { reviews, fetchAllReviews, deleteReview, loading } = useReviewStore();

	useEffect(() => {
		fetchAllReviews();
	}, [fetchAllReviews]);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500'></div>
			</div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-6xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Product</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Customer</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Rating</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Comment</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Actions</th>
					</tr>
				</thead>
				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{reviews.map((review) => (
						<tr key={review._id} className='hover:bg-gray-700/50 transition-colors'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img className='h-10 w-10 rounded-full object-cover' src={review.product?.image} alt='' />
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{review.product?.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>{review.user?.name}</div>
								<div className='text-xs text-gray-500'>{review.user?.email}</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											size={16}
											className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-600"}
										/>
									))}
								</div>
							</td>
							<td className='px-6 py-4'>
								<div className='text-sm text-gray-300 max-w-xs truncate' title={review.comment}>
									{review.comment}
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
								<button
									onClick={() => deleteReview(review._id)}
									className='text-red-400 hover:text-red-300 transition-colors'
								>
									<Trash size={18} />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{reviews.length === 0 && (
				<div className='py-20 text-center text-gray-500'>
					<Star size={48} className='mx-auto mb-4 opacity-20' />
					<p>No customer reviews found.</p>
				</div>
			)}
		</motion.div>
	);
};

export default ReviewManagement;
