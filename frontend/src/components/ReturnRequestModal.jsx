import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Send, Package, RefreshCw } from "lucide-react";
import { useSupportStore } from "../stores/useSupportStore";
import { APP_CURRENCY } from "../lib/constants";

const ReturnRequestModal = ({ isOpen, onClose, order }) => {
	const [reason, setReason] = useState("");
	const { createReturnRequest, loading } = useSupportStore();

	if (!order) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!reason.trim()) return;

		const success = await createReturnRequest({
			orderId: order._id,
			reason,
			amount: order.totalAmount, // Default to full refund for now
		});

		if (success) {
			setReason("");
			onClose();
		}
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm'>
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 20 }}
						className='bg-gray-800 rounded-3xl p-8 w-full max-w-md border border-gray-700 shadow-2xl relative overflow-hidden'
					>
						{/* Background Glow */}
						<div className='absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none' />

						<div className='relative z-10'>
							<div className='flex justify-between items-center mb-8'>
								<div className='flex items-center gap-3'>
									<div className='bg-primary-500/20 p-2.5 rounded-2xl'>
										<RefreshCw className='text-primary-400' size={24} />
									</div>
									<h2 className='text-2xl font-bold text-white'>Request Return</h2>
								</div>
								<button
									onClick={onClose}
									className='p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400'
								>
									<X size={20} />
								</button>
							</div>

							<div className='mb-6 p-4 bg-gray-900/40 rounded-2xl border border-gray-700/50 flex items-center gap-4'>
								<div className='bg-gray-800 p-3 rounded-xl'>
									<Package className='text-gray-400' size={24} />
								</div>
								<div>
									<p className='text-xs text-gray-500 uppercase font-bold tracking-widest'>Order Reference</p>
									<p className='text-sm font-bold text-primary-300'>#{order._id.slice(-8).toUpperCase()}</p>
									<p className='text-xs text-gray-400 mt-0.5'>Total Amount: {APP_CURRENCY} {order.totalAmount.toFixed(2)}</p>
								</div>
							</div>

							<form onSubmit={handleSubmit} className='space-y-6'>
								<div>
									<label htmlFor='reason' className='block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1'>
										Reason for Return
									</label>
									<textarea
										id='reason'
										value={reason}
										onChange={(e) => setReason(e.target.value)}
										placeholder='Please explain why you are returning this order...'
										className='w-full bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 min-h-[120px] transition-all'
										required
									/>
								</div>

								<div className='flex items-start gap-3 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20'>
									<AlertCircle className='text-amber-500 shrink-0' size={18} />
									<p className='text-[11px] leading-relaxed text-amber-200/70 capitalize'>
										Once submitted, our support team will review your request. 
										Refunds are typically processed within 3-5 business days after approval.
									</p>
								</div>

								<button
									type='submit'
									disabled={loading || !reason.trim()}
									className='w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-primary-900/20 disabled:opacity-50 active:scale-95'
								>
									{loading ? (
										<RefreshCw className='animate-spin' size={20} />
									) : (
										<>
											<Send size={18} />
											Submit Request
										</>
									)}
								</button>
							</form>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};

export default ReturnRequestModal;
