import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ChevronDown, Check } from "lucide-react";

const FilterSidebar = ({ onFilterChange, categories }) => {
	const [filters, setFilters] = useState({
		minPrice: "",
		maxPrice: "",
		category: "",
		brand: "",
		inStock: false,
	});

	useEffect(() => {
		onFilterChange(filters);
	}, [filters, onFilterChange]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	return (
		<div className='bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl sticky top-24 h-fit'>
			<div className='flex items-center gap-2 mb-8 text-primary-400'>
				<SlidersHorizontal size={20} />
				<h2 className='text-lg font-bold uppercase tracking-wider'>Filters</h2>
			</div>

			<div className='space-y-8'>
				{/* Price Range */}
				<div>
					<h3 className='text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4'>Price Range</h3>
					<div className='flex gap-2 items-center'>
						<input
							type='number'
							name='minPrice'
							placeholder='Min'
							value={filters.minPrice}
							onChange={handleChange}
							className='w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors'
						/>
						<span className='text-gray-600'>-</span>
						<input
							type='number'
							name='maxPrice'
							placeholder='Max'
							value={filters.maxPrice}
							onChange={handleChange}
							className='w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors'
						/>
					</div>
				</div>

				{/* Category */}
				<div>
					<h3 className='text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4'>Category</h3>
					<select
						name='category'
						value={filters.category}
						onChange={handleChange}
						className='w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors'
					>
						<option value=''>All Categories</option>
						{categories.map((cat) => (
							<option key={cat._id} value={cat.slug}>
								{cat.name}
							</option>
						))}
					</select>
				</div>

				{/* Brand */}
				<div>
					<h3 className='text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4'>Brand</h3>
					<input
						type='text'
						name='brand'
						placeholder='Search brand...'
						value={filters.brand}
						onChange={handleChange}
						className='w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500 transition-colors'
					/>
				</div>

				{/* Availability */}
				<div className='flex items-center justify-between py-4 border-t border-gray-700/50'>
					<label htmlFor='inStock' className='text-sm font-semibold text-gray-300 cursor-pointer'>
						In Stock Only
					</label>
					<div className='relative inline-flex items-center cursor-pointer'>
						<input
							type='checkbox'
							id='inStock'
							name='inStock'
							checked={filters.inStock}
							onChange={handleChange}
							className='sr-only peer'
						/>
						<div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
					</div>
				</div>

				{/* Reset Button */}
				<button
					onClick={() =>
						setFilters({
							minPrice: "",
							maxPrice: "",
							category: "",
							brand: "",
							inStock: false,
						})
					}
					className='w-full py-2.5 rounded-xl border border-gray-700 text-gray-400 text-sm font-bold hover:bg-gray-700 hover:text-white transition-all'
				>
					Clear All Filters
				</button>
			</div>
		</div>
	);
};

export default FilterSidebar;
