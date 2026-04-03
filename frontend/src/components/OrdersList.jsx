import { useEffect } from "react";
import { motion } from "framer-motion";
import { useOrderStore } from "../stores/useOrderStore";
import { ShoppingBag, User, Calendar, CheckCircle, Clock, Truck, Package, XCircle } from "lucide-react";
import { ORDER_STATUS, APP_CURRENCY } from "../lib/constants";

const statusIcons = {
	[ORDER_STATUS.PENDING]: Clock,
	[ORDER_STATUS.PROCESSING]: Package,
	[ORDER_STATUS.SHIPPED]: Truck,
	[ORDER_STATUS.DELIVERED]: CheckCircle,
	[ORDER_STATUS.CANCELLED]: XCircle,
};

const statusColors = {
	[ORDER_STATUS.PENDING]: "text-yellow-400 bg-yellow-400/10",
	[ORDER_STATUS.PROCESSING]: "text-blue-400 bg-blue-400/10",
	[ORDER_STATUS.SHIPPED]: "text-purple-400 bg-purple-400/10",
	[ORDER_STATUS.DELIVERED]: "text-green-400 bg-green-400/10",
	[ORDER_STATUS.CANCELLED]: "text-red-400 bg-red-400/10",
};

const OrdersList = () => {
	const { orders, fetchAllOrders, updateOrderStatus, loading } = useOrderStore();

	useEffect(() => {
		fetchAllOrders();
	}, [fetchAllOrders]);

	if (loading && orders.length === 0) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500'></div>
			</div>
		);
	}

	return (
		<motion.div
			className='bg-gray-800/50 backdrop-blur-md shadow-xl rounded-xl overflow-hidden border border-gray-700 max-w-6xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead className='bg-gray-700/50'>
						<tr>
							<th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
								Order Details
							</th>
							<th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
								Customer
							</th>
							<th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
								Products
							</th>
							<th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
								Total
							</th>
							<th className='px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider'>
								Status
							</th>
						</tr>
					</thead>
					<tbody className='divide-y divide-gray-700'>
						{orders.map((order) => (
							<motion.tr
								key={order._id}
								className='hover:bg-gray-700/30 transition-colors'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
							>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex flex-col'>
										<span className='text-sm font-medium text-white'>#{order._id.slice(-8).toUpperCase()}</span>
										<div className='flex items-center text-xs text-gray-400 mt-1'>
											<Calendar className='h-3 w-3 mr-1' />
											{new Date(order.createdAt).toLocaleDateString()}
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center'>
										<div className='h-8 w-8 rounded-full bg-primary-900/50 flex items-center justify-center mr-3'>
											<User className='h-4 w-4 text-primary-400' />
										</div>
										<div className='flex flex-col'>
											<span className='text-sm font-medium text-white'>{order.user?.name || "Deleted User"}</span>
											<span className='text-xs text-gray-400'>{order.user?.email || "N/A"}</span>
										</div>
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex flex-col max-w-xs'>
										{order.products.slice(0, 2).map((item, idx) => (
											<span key={idx} className='text-xs text-gray-300 truncate'>
												{item.quantity}x {item.product?.name || "Unknown Product"}
											</span>
										))}
										{order.products.length > 2 && (
											<span className='text-xs text-primary-400 mt-1'>
												+{order.products.length - 2} more items
											</span>
										)}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='flex items-center text-sm font-bold text-primary-400'>
										{APP_CURRENCY} {order.totalAmount.toFixed(2)}
									</div>
								</td>
								<td className='px-6 py-4 whitespace-nowrap'>
									<div className='relative'>
										<select
											value={order.status}
											onChange={(e) => updateOrderStatus(order._id, e.target.value)}
											className={`appearance-none text-xs font-semibold px-3 py-1.5 rounded-full border-none focus:ring-2 focus:ring-primary-500 cursor-pointer transition-all ${
												statusColors[order.status] || "bg-gray-700 text-gray-300"
											}`}
											disabled={loading}
										>
											<option value={ORDER_STATUS.PENDING}>Pending</option>
											<option value={ORDER_STATUS.PROCESSING}>Processing</option>
											<option value={ORDER_STATUS.SHIPPED}>Shipped</option>
											<option value={ORDER_STATUS.DELIVERED}>Delivered</option>
											<option value={ORDER_STATUS.CANCELLED}>Cancelled</option>
										</select>
										<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400'>
											{/* status icon could go here or inside the select but select icons are tricky */}
										</div>
									</div>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			{orders.length === 0 && (
				<div className='p-12 text-center'>
					<ShoppingBag className='h-12 w-12 mx-auto text-gray-600 mb-4' />
					<h3 className='text-lg font-medium text-gray-300'>No orders found</h3>
					<p className='text-gray-500 mt-1'>Orders will appear here once customers start purchasing.</p>
				</div>
			)}
		</motion.div>
	);
};

export default OrdersList;
