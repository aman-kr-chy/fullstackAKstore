import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';

const ProductCard = ({ product, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index ? (index % 5) * 0.1 : 0 }}
            className="group relative bg-white rounded-2xl p-4 border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full"
        >
            {/* Wishlist Button */}
            <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 shadow-sm border border-gray-100">
                <FiHeart size={18} />
            </button>

            {/* Product Image */}
            <Link to={`/product/${product._id}`} className="block relative aspect-square mb-4 overflow-hidden rounded-xl bg-gray-50 flex items-center justify-center p-4">
                <motion.img
                    loading="lazy"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                />

                {/* Quick Add overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-primary/90 backdrop-blur-sm text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors shadow-lg">
                        <FiShoppingCart size={16} /> Quick Add
                    </button>
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex flex-col flex-grow">
                <div className="text-xs font-semibold text-primary/80 mb-1.5 uppercase tracking-wide">
                    {product.category}
                </div>
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-gray-900 font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-relaxed">
                        {product.name}
                    </h3>
                </Link>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-100/50">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">₹{(product.price * 1.2).toLocaleString('en-IN')}</span>
                        <span className="font-bold text-lg text-gray-900">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    {product.rating && (
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs font-bold">
                            <span>{product.rating}</span>
                            <span className="text-[10px]">&#9733;</span>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
