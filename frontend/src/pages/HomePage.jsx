import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronRight, FiChevronLeft, FiArrowRight } from 'react-icons/fi';
import { allProducts } from '../data/mockProducts';
import ProductCard from '../components/ProductCard';

const HeroCarousel = () => {
    const slides = [
        {
            id: 1,
            title: "The GOAT Sale is Here",
            subtitle: "Unbeatable deals on top electronics.",
            price: "From ₹14,999*",
            image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&q=80",
            bgClass: "from-blue-900 via-primary to-blue-600"
        },
        {
            id: 2,
            title: "Elevate Your Style",
            subtitle: "Premium footwear collection.",
            price: "Under ₹1,999",
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1200&q=80",
            bgClass: "from-purple-900 via-purple-700 to-purple-500"
        },
        {
            id: 3,
            title: "Smart Home Revolution",
            subtitle: "Upgrade your living space today.",
            price: "Up to 40% Off",
            image: "https://images.unsplash.com/photo-1558002038-1055907df827?w=1200&q=80",
            bgClass: "from-gray-900 via-gray-800 to-gray-700"
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

    return (
        <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-12 shadow-2xl group">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0"
                >
                    <img src={slides[currentSlide].image} alt="Hero" className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgClass} opacity-80 mix-blend-multiply`}></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 max-w-3xl">
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <span className="inline-block px-3 py-1 bg-secondary text-primary font-bold text-xs uppercase tracking-wider rounded-full mb-4 shadow-lg">Limited Time Offer</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">{slides[currentSlide].title}</h1>
                            <p className="text-lg md:text-xl text-gray-200 mb-2 font-light">{slides[currentSlide].subtitle}</p>
                            <p className="text-2xl text-secondary font-bold mb-8">{slides[currentSlide].price}</p>
                            
                            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2 hover:gap-4 shadow-xl">
                                Shop Now <FiArrowRight />
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <FiChevronLeft size={24} />
            </button>
            <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
            >
                <FiChevronRight size={24} />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                {slides.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-2 rounded-full transition-all duration-300 ${currentSlide === idx ? 'w-8 bg-secondary' : 'w-2 bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};

const HomePage = () => {
    const featuredProducts = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 10);
    const recentlyViewed = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 5);

    return (
        <div className="pb-10">
            <HeroCarousel />

            {/* Curated Collection Section */}
            <section className="mb-16">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Curated for You</h2>
                        <p className="text-gray-500">Based on your recent activity</p>
                    </div>
                    <Link to="/category/fashion" className="text-primary font-medium hover:underline flex items-center gap-1">
                        View All <FiArrowRight />
                    </Link>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {recentlyViewed.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </div>
            </section>

            {/* Promotional Banner */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between shadow-xl relative overflow-hidden"
            >
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, #2874f0 0%, transparent 50%)' }}></div>
                
                <div className="relative z-10 text-center md:text-left mb-8 md:mb-0">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Join our Premium Club</h3>
                    <p className="text-gray-400 text-lg max-w-xl">Get free shipping on all orders, exclusive early access to sales, and dedicated priority support.</p>
                </div>
                <button className="relative z-10 bg-secondary text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-white transition-colors shadow-[0_0_20px_rgba(255,229,0,0.3)]">
                    Join Now - ₹499/year
                </button>
            </motion.div>

            {/* Trending Products */}
            <section className="mb-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Right Now</h2>
                        <p className="text-gray-500">The most loved products by our community</p>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {featuredProducts.map((product, index) => (
                        <ProductCard key={product._id} product={product} index={index} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
