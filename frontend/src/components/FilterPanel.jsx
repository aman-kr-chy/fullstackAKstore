import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiStar, FiTag, FiTrendingDown, FiClock } from 'react-icons/fi';

const FilterPanel = ({ isOpen, onClose, filters, setFilters }) => {
    // Available filter options
    const priceRanges = [
        { id: 'under_10k', label: 'Under ₹10k', min: 0, max: 10000 },
        { id: '10k_30k', label: '₹10k - ₹30k', min: 10000, max: 30000 },
        { id: 'above_30k', label: 'Above ₹30k', min: 30000, max: Infinity },
    ];

    const ratings = [
        { id: '4_star', label: '4★ & Above', minRating: 4.0 },
        { id: '3_star', label: '3★ & Above', minRating: 3.0 },
    ];

    const special = [
        { id: 'high_discount', label: 'High Discount (20%+)', icon: <FiTag /> },
        { id: 'low_stock', label: 'Almost Sold Out', icon: <FiClock /> },
    ];

    const toggleFilter = (category, id) => {
        setFilters(prev => {
            const isActive = prev[category] === id;
            return {
                ...prev,
                [category]: isActive ? null : id // Toggle off if already active
            };
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden bg-white/80 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-primary/5"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900"
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Price Range */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <FiTrendingDown /> Price Range
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {priceRanges.map(range => (
                                        <button
                                            key={range.id}
                                            onClick={() => toggleFilter('price', range.id)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.price === range.id
                                                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                                                }`}
                                        >
                                            {range.label}
                                            {filters.price === range.id && <FiCheck />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Ratings */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <FiStar /> Minimum Rating
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {ratings.map(rating => (
                                        <button
                                            key={rating.id}
                                            onClick={() => toggleFilter('rating', rating.id)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.rating === rating.id
                                                    ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/20 scale-[1.02]'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                                                }`}
                                        >
                                            {rating.label}
                                            {filters.rating === rating.id && <FiCheck />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Special Filters */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                    <FiTag /> Special Offers
                                </h4>
                                <div className="flex flex-col gap-2">
                                    {special.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => toggleFilter('special', item.id)}
                                            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${filters.special === item.id
                                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 scale-[1.02]'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:scale-[1.02]'
                                                }`}
                                        >
                                            <span className="flex items-center gap-2">
                                                {item.icon} {item.label}
                                            </span>
                                            {filters.special === item.id && <FiCheck />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
                            <button
                                onClick={() => setFilters({ price: null, rating: null, special: null })}
                                className="px-6 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FilterPanel;
