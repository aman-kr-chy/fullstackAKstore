import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiFilter, FiChevronDown, FiInbox } from 'react-icons/fi';
import { allProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';
import FilterPanel from '../components/FilterPanel';

const CategoryPage = () => {
    const { categoryName } = useParams();

    const [sortBy, setSortBy] = useState(''); // 'price-asc', 'rating-desc'
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({ price: null, rating: null, special: null });

    // Filter products by category (case-insensitive)
    let filteredProducts = allProducts.filter(
        (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );

    // Apply advanced filters
    if (filters.price === 'under_10k') {
        filteredProducts = filteredProducts.filter(p => p.price < 10000);
    } else if (filters.price === '10k_30k') {
        filteredProducts = filteredProducts.filter(p => p.price >= 10000 && p.price <= 30000);
    } else if (filters.price === 'above_30k') {
        filteredProducts = filteredProducts.filter(p => p.price > 30000);
    }

    if (filters.rating === '4_star') {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.rating) >= 4.0);
    } else if (filters.rating === '3_star') {
        filteredProducts = filteredProducts.filter(p => parseFloat(p.rating) >= 3.0);
    }

    if (filters.special === 'high_discount') {
        filteredProducts = filteredProducts.filter(p => p.discount >= 20);
    } else if (filters.special === 'low_stock') {
        filteredProducts = filteredProducts.filter(p => p.stock < 10);
    }

    // Apply sorting
    if (sortBy === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'rating-desc') {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    return (
        <div className="pb-12">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-3xl mb-10 border border-primary/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-4xl font-black mb-3 text-gray-900 capitalize tracking-tight">{categoryName}</h1>
                    <p className="text-gray-600 text-lg">Explore {filteredProducts.length} premium products in this collection.</p>
                </div>

                {/* Decorative background element */}
                <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
                    <button 
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            showFilters || Object.values(filters).some(v => v !== null)
                                ? 'bg-primary text-white shadow-md shadow-primary/20' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <FiFilter /> Filters
                        {Object.values(filters).some(v => v !== null) && (
                            <span className="bg-white text-primary text-xs font-bold px-1.5 py-0.5 rounded-full ml-1">
                                {Object.values(filters).filter(v => v !== null).length}
                            </span>
                        )}
                    </button>
                    <button 
                        onClick={() => setSortBy(sortBy === 'price-asc' ? '' : 'price-asc')}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            sortBy === 'price-asc' 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-white border-gray-200 hover:border-primary text-gray-700'
                        }`}
                    >
                        Price: Low to High
                    </button>
                    <button 
                        onClick={() => setSortBy(sortBy === 'rating-desc' ? '' : 'rating-desc')}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                            sortBy === 'rating-desc' 
                                ? 'bg-primary/10 border-primary text-primary' 
                                : 'bg-white border-gray-200 hover:border-primary text-gray-700'
                        }`}
                    >
                        Top Rated
                    </button>
                </div>

                <div className="text-sm text-gray-500 font-medium whitespace-nowrap self-start sm:self-center">
                    Showing <span className="text-gray-900 font-bold">{filteredProducts.length}</span> results
                </div>
            </div>

            {/* Expandable Filter Panel */}
            <FilterPanel 
                isOpen={showFilters} 
                onClose={() => setShowFilters(false)} 
                filters={filters} 
                setFilters={setFilters} 
            />

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-gray-200 text-center px-4"
                >
                    <div className="bg-gray-50 p-6 rounded-full text-gray-300 mb-6">
                        <FiInbox size={48} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
                    <p className="text-gray-500 mb-8 max-w-md">We're currently restocking our {categoryName} collection. Check back soon for exciting new products!</p>

                    <Link to="/" className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                        Continue Shopping
                    </Link>
                </motion.div>
            )}
        </div>
    );
};

export default CategoryPage;
