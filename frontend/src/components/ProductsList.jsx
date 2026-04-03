import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Star, Edit2, Check, X, Package, Tag } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, updateProduct, products, loading } = useProductStore();
	const [editingId, setEditingId] = useState(null);
	const [editData, setEditData] = useState({ price: 0, stock: 0 });

	const handleEditClick = (product) => {
		setEditingId(product._id);
		setEditData({ price: product.price, stock: product.stock });
	};

	const handleSave = async (id) => {
		await updateProduct(id, editData);
		setEditingId(null);
	};

	const handleCancel = () => {
		setEditingId(null);
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-xl rounded-2xl overflow-hidden max-w-5xl mx-auto border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700/50'>
						<tr>
							<th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Product</th>
							<th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Price</th>
							<th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Stock</th>
							<th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Status</th>
							<th className='px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest'>Featured</th>
							<th className='px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest'>Actions</th>
						</tr>
					</thead>

					<tbody className='bg-gray-800 divide-y divide-gray-700'>
						<AnimatePresence>
							{products?.map((product) => (
								<motion.tr 
									key={product._id} 
									className='hover:bg-gray-700/30 transition-colors'
									layout
								>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<div className='flex-shrink-0 h-12 w-12'>
												<img
													className='h-12 w-12 rounded-xl object-cover shadow-sm'
													src={product.image}
													alt={product.name}
												/>
											</div>
											<div className='ml-4'>
												<div className='text-sm font-bold text-white'>{product.name}</div>
												<div className='text-xs text-gray-500'>{product.category}</div>
											</div>
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										{editingId === product._id ? (
											<div className='flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 w-32'>
												<Tag size={14} className='text-gray-500' />
												<input
													type='number'
													value={editData.price}
													onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
													className='bg-transparent border-none text-sm text-white focus:ring-0 w-full p-0'
												/>
											</div>
										) : (
											<div className='text-sm font-semibold text-primary-400'>
												LKR {product?.price?.toFixed(2)}
											</div>
										)}
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										{editingId === product._id ? (
											<div className='flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 w-24'>
												<Package size={14} className='text-gray-500' />
												<input
													type='number'
													value={editData.stock}
													onChange={(e) => setEditData({ ...editData, stock: parseInt(e.target.value) })}
													className='bg-transparent border-none text-sm text-white focus:ring-0 w-full p-0'
												/>
											</div>
										) : (
											<div className='text-sm text-gray-300 font-medium'>
												{product.stock} units
											</div>
										)}
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
											product.stock > 0 
											? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
											: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
										}`}>
											{product.stock > 0 ? "In Stock" : "Out of Stock"}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<button
											onClick={() => toggleFeaturedProduct(product._id)}
											className={`p-2 rounded-xl transition-all duration-300 ${
												product.isFeatured 
												? "bg-amber-400 text-gray-900 shadow-lg shadow-amber-400/20" 
												: "bg-gray-700 text-gray-400 hover:bg-gray-600"
											}`}
										>
											<Star className='h-4 w-4' fill={product.isFeatured ? "currentColor" : "none"} />
										</button>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<div className='flex items-center justify-end gap-2'>
											{editingId === product._id ? (
												<>
													<button
														onClick={() => handleSave(product._id)}
														disabled={loading}
														className='p-2 bg-emerald-500 hover:bg-emerald-400 text-white rounded-lg transition-colors'
														title='Save'
													>
														<Check size={16} />
													</button>
													<button
														onClick={handleCancel}
														className='p-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition-colors'
														title='Cancel'
													>
														<X size={16} />
													</button>
												</>
											) : (
												<>
													<button
														onClick={() => handleEditClick(product)}
														className='p-2 text-primary-400 hover:bg-primary-400/10 rounded-lg transition-all'
														title='Edit Price & Stock'
													>
														<Edit2 size={18} />
													</button>
													<button
														onClick={() => deleteProduct(product._id)}
														className='p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all'
														title='Delete Product'
													>
														<Trash size={18} />
													</button>
												</>
											)}
										</div>
									</td>
								</motion.tr>
							))}
						</AnimatePresence>
					</tbody>
				</table>
			</div>

			{products?.length === 0 && (
				<div className='py-20 text-center text-gray-500 border-t border-gray-700'>
					<Package size={48} className='mx-auto mb-4 opacity-20' />
					<p className='text-lg font-medium'>No products found in the catalog.</p>
				</div>
			)}
		</motion.div>
	);
};

export default ProductsList;
