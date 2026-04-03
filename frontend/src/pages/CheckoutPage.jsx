import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { useUserStore } from "../stores/useUserStore";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Lock, CreditCard, Truck, User, MapPin, Mail, Phone, Calendar, Hash } from "lucide-react";

const CheckoutPage = () => {
	const navigate = useNavigate();
	const { cart, total, subtotal, coupon, clearCart } = useCartStore();
	const { user } = useUserStore();

	const [isProcessing, setIsProcessing] = useState(false);
	const [shippingDetails, setShippingDetails] = useState({
		fullName: user?.name || "",
		email: user?.email || "",
		address: "",
		city: "",
		postalCode: "",
		phone: "",
	});

	const [cardDetails, setCardDetails] = useState({
		number: "",
		expiry: "",
		cvv: "",
	});

	useEffect(() => {
		if (cart.length === 0) {
			navigate("/");
		}
	}, [cart, navigate]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setShippingDetails((prev) => ({ ...prev, [name]: value }));
	};

	const handleCardChange = (e) => {
		const { name, value } = e.target;
		setCardDetails((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsProcessing(true);

		try {
			// Simulating a brief delay for a "real" feel
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// Directly confirm order with a mock ID
			await axios.post("/payments/confirm-order", {
				paymentIntentId: "mock_" + Math.random().toString(36).substring(2, 11),
				products: cart,
				totalAmount: total,
				shippingAddress: shippingDetails,
				couponCode: coupon?.code || null,
			});

			toast.success("Order placed successfully! (Demo Mode)");
			clearCart();
			navigate("/purchase-success");
		} catch (error) {
			console.error("Checkout error:", error);
			toast.error(error.response?.data?.message || "An error occurred during checkout");
			setIsProcessing(false);
		}
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-5xl mx-auto'>
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-center mb-12'
				>
					<h1 className='text-4xl font-extrabold text-primary-400 mb-2'>Finalize Your Order</h1>
					<p className='text-gray-400'>Secure checkout (Demo Mode - Any card details accepted)</p>
				</motion.div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
					{/* Left Column: Shipping & Payment */}
					<div className='space-y-8'>
						<motion.form
							onSubmit={handleSubmit}
							initial={{ opacity: 0, x: -30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className='bg-gray-800/50 backdrop-blur-md rounded-2xl p-8 border border-gray-700 shadow-xl'
						>
							<div className='mb-8'>
								<h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-white'>
									<Truck size={22} className='text-primary-400' />
									Shipping Information
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Full Name</label>
										<div className='relative'>
											<User className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
											<input
												type='text'
												name='fullName'
												value={shippingDetails.fullName}
												onChange={handleInputChange}
												required
												className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
											/>
										</div>
									</div>
									<div className='space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Email</label>
										<div className='relative'>
											<Mail className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
											<input
												type='email'
												name='email'
												value={shippingDetails.email}
												onChange={handleInputChange}
												required
												className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
											/>
										</div>
									</div>
									<div className='md:col-span-2 space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Shipping Address</label>
										<div className='relative'>
											<MapPin className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
											<input
												type='text'
												name='address'
												value={shippingDetails.address}
												onChange={handleInputChange}
												required
												placeholder='Street address, apartment, etc.'
												className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
											/>
										</div>
									</div>
									<div className='space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>City</label>
										<input
											type='text'
											name='city'
											value={shippingDetails.city}
											onChange={handleInputChange}
											required
											className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
										/>
									</div>
									<div className='space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Postal Code</label>
										<input
											type='text'
											name='postalCode'
											value={shippingDetails.postalCode}
											onChange={handleInputChange}
											required
											className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
										/>
									</div>
									<div className='md:col-span-2 space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Phone Number</label>
										<div className='relative'>
											<Phone className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
											<input
												type='tel'
												name='phone'
												value={shippingDetails.phone}
												onChange={handleInputChange}
												required
												className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
											/>
										</div>
									</div>
								</div>
							</div>

							<div className='mb-8'>
								<h2 className='text-xl font-bold mb-6 flex items-center gap-2 text-white'>
									<CreditCard size={22} className='text-primary-400' />
									Mock Payment Details
								</h2>
								<div className='space-y-4'>
									<div className='space-y-2'>
										<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Card Number</label>
										<div className='relative'>
											<Hash className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
											<input
												type='text'
												name='number'
												placeholder='0000 0000 0000 0000'
												value={cardDetails.number}
												onChange={handleCardChange}
												required
												className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
											/>
										</div>
									</div>
									<div className='grid grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Expiry (MM/YY)</label>
											<div className='relative'>
												<Calendar className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
												<input
													type='text'
													name='expiry'
													placeholder='MM/YY'
													value={cardDetails.expiry}
													onChange={handleCardChange}
													required
													className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
												/>
											</div>
										</div>
										<div className='space-y-2'>
											<label className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>CVV</label>
											<div className='relative'>
												<Lock className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500' size={18} />
												<input
													type='text'
													name='cvv'
													placeholder='000'
													value={cardDetails.cvv}
													onChange={handleCardChange}
													required
													className='w-full bg-gray-900/50 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-primary-500 outline-none transition-all'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<button
								type='submit'
								disabled={isProcessing}
								className='w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95'
							>
								{isProcessing ? "Processing (Demo Mode)..." : (
									<>
										<Lock size={18} />
										Mock LKR {total.toFixed(2)} Payment
									</>
								)}
							</button>
						</motion.form>
					</div>

					{/* Right Column: Order Summary */}
					<div className='space-y-6'>
						<motion.div
							initial={{ opacity: 0, x: 30 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.3 }}
							className='bg-gray-800/80 rounded-2xl p-8 border border-gray-700 shadow-xl'
						>
							<h2 className='text-xl font-bold mb-8 text-white border-b border-gray-700 pb-4'>Order Summary</h2>
							<div className='space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar'>
								{cart.map((item) => (
									<div key={item._id} className='flex items-center gap-4 group'>
										<div className='h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700 shadow-md'>
											<img src={item.image} alt={item.name} className='w-full h-full object-cover group-hover:scale-110 transition-all' />
										</div>
										<div className='flex-1'>
											<h4 className='text-sm font-medium text-gray-200'>{item.name}</h4>
											<p className='text-xs text-gray-500'>{item.quantity} × LKR {item.price}</p>
										</div>
										<div className='text-sm font-bold text-primary-400'>
											LKR {(item.price * item.quantity).toFixed(2)}
										</div>
									</div>
								))}
							</div>

							<div className='mt-8 pt-6 border-t border-gray-700 space-y-3 font-semibold'>
								<div className='flex justify-between text-gray-400'>
									<span>Subtotal</span>
									<span>LKR {subtotal.toFixed(2)}</span>
								</div>
								{coupon && (
									<div className='flex justify-between text-primary-400'>
										<span>Discount ({coupon.discountPercentage}%)</span>
										<span>- LKR {((subtotal * coupon.discountPercentage) / 100).toFixed(2)}</span>
									</div>
								)}
								<div className='flex justify-between items-center text-xl text-white pt-2'>
									<span>Total</span>
									<span className='text-primary-400'>LKR {total.toFixed(2)}</span>
								</div>
							</div>
						</motion.div>

						<div className='p-4 bg-gray-800/30 rounded-xl text-xs text-gray-500 text-center leading-relaxed backdrop-blur-sm'>
							DEMO MODE: No real payment will be processed. Any details entered will result in a successful order.
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CheckoutPage;
