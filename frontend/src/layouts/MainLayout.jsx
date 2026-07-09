import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiSearch, FiUser, FiShoppingCart, FiLogOut, FiPackage } from 'react-icons/fi';
import { logout } from '../redux/slices/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';

const MainLayout = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [keyword, setKeyword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            dispatch(logout());
            setIsProfileOpen(false);
            toast.success('Logged out successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to log out');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    const categories = [
        { name: 'Fashion', path: '/category/fashion' },
        { name: 'Mobiles', path: '/category/mobiles' },
        { name: 'Beauty', path: '/category/beauty' },
        { name: 'Electronics', path: '/category/electronics' },
        { name: 'Home', path: '/category/home' },
        { name: 'Appliances', path: '/category/appliances' },
        { name: 'Toys & Baby', path: '/category/toys' },
        { name: 'Sports', path: '/category/sports' },
        { name: 'Furniture', path: '/category/furniture' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header with Glassmorphism */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
                {/* Top Row */}
                <div className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-3">
                    <Link to="/" className="flex items-center gap-2 group order-1">
                        <div className="bg-primary text-secondary p-1.5 rounded-lg shadow-sm group-hover:rotate-12 transition-transform duration-300">
                            <span className="text-xl font-black leading-none italic">&#10022;</span>
                        </div>
                        <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-primary transition-colors">AKStore</span>
                    </Link>

                    {/* Actions */}
                    <div className="flex items-center space-x-4 md:space-x-6 text-gray-700 text-sm font-semibold order-2 md:order-3">
                        {/* Profile Dropdown */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsProfileOpen(true)}
                            onMouseLeave={() => setIsProfileOpen(false)}
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <div className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors py-2">
                                <FiUser size={20} />
                                <span className="hidden sm:inline">{userInfo ? userInfo.name.split(' ')[0] : 'Login'}</span> 
                            </div>
                            
                            {/* Animated Dropdown Menu */}
                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full w-64 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 origin-top-right"
                                    >
                                        {!userInfo ? (
                                            <div className="p-1">
                                                <div className="p-4 bg-gray-50/50 flex justify-between items-center rounded-t-xl">
                                                    <span className="text-sm font-medium text-gray-600">New Customer?</span>
                                                    <Link to="/register" className="text-primary font-bold text-sm hover:underline">Sign Up</Link>
                                                </div>
                                                <div className="p-2">
                                                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 hover:bg-primary/5 text-gray-700 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                                                        <FiUser size={18} /> Login
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-2">
                                                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                                                    <p className="text-xs text-gray-400 font-medium">Signed in as</p>
                                                    <p className="text-sm font-bold text-gray-900 truncate">{userInfo.email}</p>
                                                </div>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 text-gray-700 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                                                    <FiUser size={18} /> My Profile
                                                </Link>
                                                <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-primary/5 text-gray-700 hover:text-primary rounded-xl transition-colors text-sm font-medium">
                                                    <FiPackage size={18} /> Orders
                                                </Link>
                                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 rounded-xl transition-colors text-sm font-medium mt-1">
                                                    <FiLogOut size={18} /> Logout
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Cart */}
                        <Link to="/cart" className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors relative group">
                            <div className="relative">
                                <FiShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
                                <AnimatePresence>
                                    {cartItems.length > 0 && (
                                        <motion.span 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                                        >
                                            {cartItems.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="hidden sm:inline">Cart</span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:flex-1 md:max-w-2xl order-3 md:order-2 md:mx-4">
                        <form onSubmit={handleSearch} className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <FiSearch size={18} />
                            </span>
                            <input 
                                type="text" 
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                placeholder="Search for Products, Brands and More..." 
                                className="w-full py-2.5 pl-11 pr-4 rounded-full text-sm text-gray-800 bg-gray-100 focus:bg-white border border-transparent focus:border-primary/30 focus:shadow-[0_0_0_4px_rgba(40,116,240,0.1)] focus:outline-none transition-all duration-300"
                            />
                        </form>
                    </div>
                </div>

                {/* Categories Row */}
                <div className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto pb-2 md:pb-0 hide-scrollbar pt-2 md:pt-0 border-t md:border-none border-gray-100">
                    {categories.map((cat) => {
                        const isActive = location.pathname === cat.path;
                        return (
                            <Link 
                                key={cat.name}
                                to={cat.path} 
                                className={`relative py-2 md:py-3 text-sm font-medium transition-colors whitespace-nowrap ${isActive ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                            >
                                {cat.name}
                                {isActive && (
                                    <motion.div 
                                        layoutId="activeCategory"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full"
                                    />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </header>
            
            <main className="flex-grow container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
            
            <footer className="bg-dark text-white pt-16 pb-8 mt-auto">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 border-b border-gray-800 pb-12 mb-8">
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-primary text-secondary p-1.5 rounded-lg">
                                <span className="text-xl font-black leading-none italic">&#10022;</span>
                            </div>
                            <span className="text-2xl font-black tracking-tight text-white">AKStore</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">Your premium destination for high-quality products. We offer the best deals and seamless shopping experience.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Help & Support</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Payments & Pricing</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Shipping & Delivery</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Cancellation & Returns</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm tracking-wider uppercase">Legal Information</h4>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-primary transition-colors">Return Policy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms Of Use</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-4 text-center text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} AKStore. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;
