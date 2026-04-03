import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useProductStore } from "../stores/useProductStore";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader, ShoppingBag } from "lucide-react";

const BrowsePage = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { products, browseProducts, loading, categories, fetchCategories } = useProductStore();

	const [filters, setFilters] = useState({
		search: searchParams.get("search") || "",
		minPrice: searchParams.get("minPrice") || "",
		maxPrice: searchParams.get("maxPrice") || "",
		category: searchParams.get("category") || "",
		brand: searchParams.get("brand") || "",
		inStock: searchParams.get("inStock") === "true",
	});

	useEffect(() => {
		fetchCategories();
	}, [fetchCategories]);

	const debouncedBrowse = useCallback(
		(currentFilters) => {
			browseProducts(currentFilters);
		},
		[browseProducts]
	);

	useEffect(() => {
		const handler = setTimeout(() => {
			debouncedBrowse(filters);
		}, 300);

		return () => clearTimeout(handler);
	}, [filters, debouncedBrowse]);

	const handleFilterChange = useCallback((newFilters) => {
		setFilters((prev) => ({
			...prev,
			...newFilters,
		}));
	}, []);

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setFilters((prev) => ({ ...prev, search: value }));
		setSearchParams((prev) => {
			if (value) prev.set("search", value);
			else prev.delete("search");
			return prev;
		});
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white'>
			<div className='max-w-7xl mx-auto px-4 py-12'>
				<div className='flex flex-col lg:flex-row gap-8'>
					{/* Sidebar */}
					<aside className='w-full lg:w-1/4'>
						<FilterSidebar categories={categories} onFilterChange={handleFilterChange} />
					</aside>

					{/* Main Content */}
					<main className='w-full lg:w-3/4'>
						<div className='mb-8 relative'>
							<Search className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-500' size={20} />
							<input
								type='text'
								value={filters.search}
								onChange={handleSearchChange}
								placeholder='Search products by name or description...'
								className='w-full bg-gray-800 border-2 border-gray-700/50 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-primary-500 transition-all shadow-xl text-lg'
							/>
						</div>

						{loading ? (
							<div className='flex flex-col items-center justify-center py-24 gap-4'>
								<Loader className='animate-spin text-primary-500' size={48} />
								<p className='text-gray-400 font-medium'>Fetching products...</p>
							</div>
						) : (
							<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
								<AnimatePresence>
									{products.length > 0 ? (
										products.map((product) => (
											<motion.div
												key={product._id}
												layout
												initial={{ opacity: 0, scale: 0.9 }}
												animate={{ opacity: 1, scale: 1 }}
												exit={{ opacity: 0, scale: 0.9 }}
												transition={{ duration: 0.3 }}
											>
												<ProductCard product={product} />
											</motion.div>
										))
									) : (
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											className='col-span-full py-24 text-center'
										>
											<ShoppingBag className='mx-auto text-gray-700 mb-4 opacity-20' size={80} />
											<h3 className='text-2xl font-bold text-gray-500 mb-2'>No products found</h3>
											<p className='text-gray-600'>Try adjusting your filters or search query.</p>
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						)}
					</main>
				</div>
			</div>
		</div>
	);
};

export default BrowsePage;
