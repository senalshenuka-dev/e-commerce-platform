import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, RefreshCcw, PlusCircle, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp, Package, ShoppingBag, Truck } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";
import { useOrderStore } from "../stores/useOrderStore";
import ReturnRequestModal from "../components/ReturnRequestModal";
import { TICKET_STATUS, TICKET_PRIORITY, ORDER_STATUS, RETURN_STATUS, DASHBOARD_TABS, APP_CURRENCY } from "../lib/constants";

const CustomerDashboard = () => {
	const { myReturns, fetchMyReturns, loading: supportLoading } = useSupportStore();
	const { orders, fetchMyOrders, loading: orderLoading } = useOrderStore();
	const [activeTab, setActiveTab] = useState(DASHBOARD_TABS.ORDERS);
	const [expandedOrderId, setExpandedOrderId] = useState(null);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

	useEffect(() => {
		fetchMyReturns();
		fetchMyOrders();
	}, [fetchMyReturns, fetchMyOrders]);


	return (
		<div className='min-h-screen bg-gray-900 text-white pb-12'>
			<div className='max-w-4xl mx-auto px-4 pt-8'>
				<div className='flex justify-between items-center mb-10'>
					<motion.h1 
						className='text-3xl font-bold text-primary-400'
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
					>
						Customer Dashboard
					</motion.h1>
				</div>

				{/* Tabs */}
				<div className='flex gap-4 mb-8 bg-gray-800/50 p-1.5 rounded-2xl w-fit border border-gray-700'>
					<button
						onClick={() => setActiveTab(DASHBOARD_TABS.ORDERS)}
						className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
							activeTab === DASHBOARD_TABS.ORDERS ? "bg-primary-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
						}`}
					>
						<Package size={18} />
						My Orders
					</button>
					<button
						onClick={() => setActiveTab(DASHBOARD_TABS.RETURNS)}
						className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all ${
							activeTab === DASHBOARD_TABS.RETURNS ? "bg-primary-600 text-white shadow-lg" : "text-gray-400 hover:text-white"
						}`}
					>
						<RefreshCcw size={18} />
						Returns & Refunds
					</button>
				</div>

				{/* Content */}
				<AnimatePresence mode='wait'>
					{activeTab === DASHBOARD_TABS.ORDERS ? (
						<motion.div
							key='orders'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className='space-y-6'
						>
							{orders?.length > 0 ? (
								orders.map((order) => (
									<div key={order._id} className='bg-gray-800 rounded-3xl border border-gray-700 overflow-hidden shadow-xl'>
										<div className='p-6 flex flex-wrap items-center justify-between gap-4 border-b border-gray-700/50'>
											<div className='flex items-center gap-4'>
												<div className='bg-primary-500/10 p-3 rounded-2xl'>
													<ShoppingBag className='text-primary-400' size={24} />
												</div>
												<div>
													<h3 className='font-bold text-lg'>Order #{order._id.slice(-8).toUpperCase()}</h3>
													<p className='text-sm text-gray-400'>{new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
												</div>
											</div>
											<div className='flex items-center gap-6'>
												<div className='text-right'>
													<p className='text-xs text-gray-500 uppercase font-bold tracking-widest mb-1'>Total Amount</p>
													<p className='text-xl font-black text-primary-400'>{APP_CURRENCY} {order.totalAmount.toFixed(2)}</p>
												</div>
												<div className='flex items-center gap-2'>
													{order.status === ORDER_STATUS.DELIVERED && (
														<button
															onClick={(e) => {
																e.stopPropagation();
																setSelectedOrder(order);
																setIsReturnModalOpen(true);
															}}
															className='text-[10px] font-bold uppercase tracking-widest bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-2 rounded-xl transition-all'
														>
															Request Return
														</button>
													)}
													<button 
														onClick={() => setExpandedOrderId(expandedOrderId === order._id ? null : order._id)}
														className='p-2 hover:bg-gray-700 rounded-full transition-colors'
													>
														{expandedOrderId === order._id ? <ChevronUp /> : <ChevronDown />}
													</button>
												</div>
											</div>
										</div>

										{/* Tracking Stepper */}
										<div className='px-6 py-8 bg-gray-900/20'>
											<div className='flex items-center justify-between max-w-2xl mx-auto relative'>
												{/* Line */}
												<div className='absolute top-1/2 left-0 w-full h-0.5 bg-gray-700 -translate-y-1/2' />
												<div 
													className='absolute top-1/2 left-0 h-0.5 bg-primary-500 -translate-y-1/2 transition-all duration-1000 ease-out' 
													style={{ 
														width: order.status === ORDER_STATUS.PENDING ? "0%" : 
															   order.status === ORDER_STATUS.PROCESSING ? "33%" : 
															   order.status === ORDER_STATUS.SHIPPED ? "66%" : "100%" 
													}}
												/>

												{[
													{ id: ORDER_STATUS.PENDING, label: "Ordered", icon: Clock },
													{ id: ORDER_STATUS.PROCESSING, label: "Processing", icon: Package },
													{ id: ORDER_STATUS.SHIPPED, label: "Shipped", icon: Truck },
													{ id: ORDER_STATUS.DELIVERED, label: "Delivered", icon: CheckCircle }
												].map((step, index) => {
													const statuses = [ORDER_STATUS.PENDING, ORDER_STATUS.PROCESSING, ORDER_STATUS.SHIPPED, ORDER_STATUS.DELIVERED];
													const currentIndex = statuses.indexOf(order.status);
													const isCompleted = index < currentIndex || (order.status === ORDER_STATUS.DELIVERED && index === 3);
													const isActive = order.status === step.id;

													return (
														<div key={step.id} className='relative z-10 flex flex-col items-center gap-3'>
															<div className={`p-2.5 rounded-full transition-all duration-500 ${
																isCompleted || isActive ? "bg-primary-600 text-white scale-110 shadow-lg shadow-primary-500/20" : "bg-gray-800 text-gray-500"
															}`}>
																<step.icon size={18} />
															</div>
															<span className={`text-[10px] font-bold uppercase tracking-widest ${
																isActive ? "text-primary-400" : "text-gray-500"
															}`}>
																{step.label}
															</span>
														</div>
													);
												})}
											</div>
										</div>

										<AnimatePresence>
											{expandedOrderId === order._id && (
												<motion.div
													initial={{ height: 0 }}
													animate={{ height: "auto" }}
													exit={{ height: 0 }}
													className='overflow-hidden border-t border-gray-700/50'
												>
													<div className='p-6 space-y-4'>
														{order.products.map((item) => (
															<div key={item._id} className='flex items-center justify-between bg-gray-900/40 p-4 rounded-2xl border border-gray-700/30'>
																<div className='flex items-center gap-4'>
																	<img 
																		src={item.product?.image} 
																		alt={item.product?.name} 
																		className='w-16 h-16 object-cover rounded-xl shadow-md'
																	/>
																	<div>
																		<h4 className='font-bold text-gray-200'>{item.product?.name}</h4>
																		<p className='text-sm text-gray-500'>Quantity: {item.quantity}</p>
																	</div>
																</div>
																<div className='text-right'>
																	<p className='font-bold text-white'>{APP_CURRENCY} {item.price.toFixed(2)}</p>
																	<p className='text-xs text-gray-500'>Subtotal: {APP_CURRENCY} {(item.price * item.quantity).toFixed(2)}</p>
																</div>
															</div>
														))}
													</div>
												</motion.div>
											)}
										</AnimatePresence>
									</div>
								))
							) : (
								<div className='text-center py-24 bg-gray-800/10 rounded-[3rem] border-4 border-dashed border-gray-800'>
									<Package size={64} className='mx-auto text-gray-700 mb-6 opacity-30' />
									<h3 className='text-2xl font-bold text-gray-500'>No orders found</h3>
									<p className='text-gray-600 mt-3'>Your shopping journey starts here.</p>
								</div>
							)}
						</motion.div>
					) : (
						<motion.div
							key='returns'
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							className='bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden'
						>
							<div className='overflow-x-auto'>
								<table className='w-full text-left'>
									<thead className='bg-gray-700/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest'>
										<tr>
											<th className='px-6 py-4'>Order Reference</th>
											<th className='px-6 py-4'>Amount</th>
											<th className='px-6 py-4'>Processing</th>
										</tr>
									</thead>
									<tbody className='divide-y divide-gray-700'>
										{myReturns?.map((req) => (
											<tr key={req._id} className='hover:bg-gray-700/20 transition-colors'>
												<td className='px-6 py-4'>
													<div className='font-medium text-white'>Order #{req.order?._id?.slice(-6).toUpperCase()}</div>
													<div className='text-xs text-gray-500 mt-1 italic'>{req.reason}</div>
												</td>
												<td className='px-6 py-4 font-semibold text-primary-400'>{APP_CURRENCY} {req.amount.toFixed(2)}</td>
												<td className='px-6 py-4'>
													<span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
														req.status === RETURN_STATUS.APPROVED ? "bg-green-500/20 text-green-400" :
														req.status === RETURN_STATUS.REJECTED ? "bg-red-500/20 text-red-400" :
														"bg-yellow-500/20 text-yellow-400"
													}`}>
														{req.status}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								{!myReturns?.length && (
									<div className='p-12 text-center text-gray-500 italic'>
										No return requests yet.
									</div>
								)}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<ReturnRequestModal 
				isOpen={isReturnModalOpen} 
				onClose={() => setIsReturnModalOpen(false)} 
				order={selectedOrder}
			/>
		</div>
	);
};

export default CustomerDashboard;
