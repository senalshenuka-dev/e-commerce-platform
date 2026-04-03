import { BarChart, PlusCircle, ShoppingBasket, FolderTree, ShoppingBag, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import AnalyticsTab from "../components/AnalyticsTab";
import CreateProductForm from "../components/CreateProductForm";
import ProductsList from "../components/ProductsList";
import AdminCategories from "../components/AdminCategories";
import OrdersList from "../components/OrdersList";
import ReviewManagement from "../components/ReviewManagement";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
	{ id: "create", label: "Create Product", icon: PlusCircle },
	{ id: "categories", label: "Categories", icon: FolderTree },
	{ id: "products", label: "Products", icon: ShoppingBasket },
	{ id: "orders", label: "Orders", icon: ShoppingBag },
	{ id: "reviews", label: "Customer Reviews", icon: Star },
	{ id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
	const [activeTab, setActiveTab] = useState("create");
	const { fetchAllProducts } = useProductStore();

	useEffect(() => {
		fetchAllProducts();
	}, [fetchAllProducts]);

	return (
		<div className='min-h-screen relative overflow-hidden'>
			<div className='relative z-10 container mx-auto px-4 py-16'>
				<motion.h1
					className='text-4xl font-bold mb-8 text-primary-400 text-center'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Admin Dashboard
				</motion.h1>

				<div className='flex justify-center mb-8'>
					<div className='flex flex-wrap items-center justify-center bg-gray-800 rounded-2xl p-1 shadow-2xl border border-gray-700 w-fit'>
						{tabs.map((tab) => (
							<button
								key={tab.id}
								onClick={() => setActiveTab(tab.id)}
								className={`flex items-center px-4 py-2 mx-1 rounded-xl transition-all duration-300 ${
									activeTab === tab.id
										? "bg-primary-600 text-white shadow-lg"
										: "text-gray-400 hover:bg-gray-700 hover:text-white"
								}`}
							>
								<tab.icon className='mr-2 h-5 w-5' />
								<span className='font-medium'>{tab.label}</span>
							</button>
						))}
					</div>
				</div>

				<motion.div
					key={activeTab}
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -20 }}
					transition={{ duration: 0.4 }}
				>
					{activeTab === "create" && <CreateProductForm />}
					{activeTab === "categories" && <AdminCategories />}
					{activeTab === "products" && <ProductsList />}
					{activeTab === "orders" && <OrdersList />}
					{activeTab === "reviews" && <ReviewManagement />}
					{activeTab === "analytics" && <AnalyticsTab />}
				</motion.div>
			</div>
		</div>
	);
};
export default AdminPage;
