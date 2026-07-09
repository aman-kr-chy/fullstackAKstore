import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiUser, FiMapPin, FiPackage, FiHeart, 
    FiStar, FiLogOut, FiSettings, FiBox, FiPlus 
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import { logout } from '../redux/slices/authSlice';
import api from '../services/api';

const ProfilePage = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // State for tabs
    const [activeTab, setActiveTab] = useState('profile');

    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/myorders');
                setOrders(data);
                setLoadingOrders(false);
            } catch (error) {
                console.error("Error fetching orders", error);
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    // Profile form state
    const [name, setName] = useState(userInfo?.name || 'Aman kumar');
    const [email, setEmail] = useState(userInfo?.email || 'amankr@gmail.com');
    const [password, setPassword] = useState('');

    const submitHandler = (e) => {
        e.preventDefault();
        toast.success('Profile updated successfully!');
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            dispatch(logout());
            navigate('/login');
            toast.success('Logged out successfully');
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error logging out');
        }
    };

    // Tab Configuration
    const menuGroups = [
        {
            title: 'Account Settings',
            icon: <FiSettings className="text-primary" />,
            items: [
                { id: 'profile', label: 'Profile Information', icon: <FiUser /> },
                { id: 'addresses', label: 'Manage Addresses', icon: <FiMapPin /> },
            ]
        },
        {
            title: 'My Stuff',
            icon: <FiBox className="text-primary" />,
            items: [
                { id: 'orders', label: 'My Orders', icon: <FiPackage /> },
                { id: 'wishlist', label: 'My Wishlist', icon: <FiHeart /> },
                { id: 'reviews', label: 'My Reviews & Ratings', icon: <FiStar /> },
            ]
        }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 my-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Sidebar Navigation */}
            <div className="md:w-1/4 flex flex-col gap-4">
                {/* User Info Card */}
                <div className="bg-white p-5 shadow-sm rounded-xl flex items-center space-x-4 border border-gray-100">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 text-primary flex items-center justify-center font-bold text-2xl shadow-inner">
                        {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 font-medium tracking-wide uppercase">Hello,</div>
                        <div className="font-bold text-gray-800 text-lg">{name}</div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
                    {menuGroups.map((group, idx) => (
                        <div key={idx} className={idx !== 0 ? 'border-t border-gray-100' : ''}>
                            <div className="p-4 bg-gray-50/50 text-gray-500 font-bold uppercase text-xs flex items-center gap-2 tracking-wider">
                                {group.icon} {group.title}
                            </div>
                            <ul className="flex flex-col">
                                {group.items.map((item) => (
                                    <li 
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`p-4 cursor-pointer flex items-center gap-3 transition-all duration-200 border-l-4 ${
                                            activeTab === item.id 
                                            ? 'border-primary bg-blue-50/50 text-primary font-semibold' 
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className={activeTab === item.id ? 'text-primary' : 'text-gray-400'}>
                                            {item.icon}
                                        </span>
                                        {item.label}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    
                    <div 
                        onClick={handleLogout}
                        className="p-4 text-red-500 font-bold uppercase text-xs flex items-center gap-3 hover:bg-red-50 cursor-pointer border-t border-gray-100 transition-colors"
                    >
                        <FiLogOut size={16} /> Logout
                    </div>
                </div>
            </div>

            {/* Dynamic Content Area */}
            <div className="md:w-3/4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden min-h-[500px]"
                    >
                        {/* 1. PROFILE TAB */}
                        {activeTab === 'profile' && (
                            <div className="p-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FiUser className="text-primary" /> Personal Information
                                </h2>
                                <form onSubmit={submitHandler} className="max-w-xl space-y-5">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border border-gray-200 py-3 px-4 rounded-lg bg-gray-50 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full border border-gray-200 py-3 px-4 rounded-lg bg-gray-50 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">New Password (optional)</label>
                                        <input 
                                            type="password" 
                                            placeholder="Leave blank to keep current"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full border border-gray-200 py-3 px-4 rounded-lg bg-gray-50 outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <button type="submit" className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-primary/30 mt-4">
                                        Save Changes
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* 2. ADDRESSES TAB */}
                        {activeTab === 'addresses' && (
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                        <FiMapPin className="text-primary" /> Manage Addresses
                                    </h2>
                                    <button className="flex items-center gap-2 text-primary font-semibold hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-primary/20">
                                        <FiPlus /> Add New
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="border border-gray-200 p-5 rounded-xl hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 bg-blue-100 text-primary text-xs font-bold px-3 py-1 rounded-bl-lg">HOME</div>
                                        <div className="font-bold text-gray-800 mb-1">{name}</div>
                                        <div className="text-sm text-gray-600 leading-relaxed">
                                            123 Tech Park, Block C<br/>
                                            Silicon Valley Sector<br/>
                                            Bengaluru, Karnataka - 560001
                                        </div>
                                        <div className="text-sm text-gray-600 mt-2 font-medium">Ph: +91 9876543210</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 3. ORDERS TAB */}
                        {activeTab === 'orders' && (
                            <div className="p-8 bg-gray-50/30 min-h-full">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FiPackage className="text-primary" /> Recent Orders
                                </h2>
                                {orders.length === 0 ? (
                                    <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                                        <FiBox className="mx-auto text-6xl text-gray-200 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-800">No orders yet</h3>
                                        <p className="text-gray-500 mt-2">Looks like you haven't made your first purchase.</p>
                                        <button className="mt-6 bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors">Start Shopping</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order) => (
                                            <Link 
                                                key={order._id} 
                                                to={`/order/${order._id}`}
                                                className="bg-white border border-gray-100 rounded-xl p-5 flex flex-col sm:flex-row gap-5 hover:shadow-lg hover:border-primary/30 transition-all block group"
                                            >
                                                <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-400 group-hover:bg-blue-50 transition-colors">
                                                    <FiBox size={32} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800 line-clamp-1">{order.orderItems[0]?.name}</div>
                                                    <div className="text-sm text-gray-500 mt-1">Order ID: {order._id}</div>
                                                    <div className="mt-3">
                                                        <span className="text-sm text-gray-500">Total Amount: </span>
                                                        <span className="font-bold text-gray-900 text-lg">₹{order.totalPrice.toLocaleString()}</span>
                                                    </div>
                                                </div>
                                                <div className="sm:w-48 flex flex-col justify-center border-t sm:border-t-0 sm:border-l border-gray-100 pt-4 sm:pt-0 sm:pl-5">
                                                    <div className="font-bold flex items-center gap-2">
                                                        <span className={`w-2.5 h-2.5 rounded-full ${order.isDelivered ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-amber-500 shadow-sm shadow-amber-500/50'}`}></span>
                                                        <span className={order.isDelivered ? 'text-emerald-600' : 'text-amber-600'}>{order.orderStatus}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-2 font-medium">
                                                        {order.isDelivered ? 'Delivered successfully' : 'Expected delivery soon'}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 4. WISHLIST TAB */}
                        {activeTab === 'wishlist' && (
                            <div className="p-8 h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                                    <FiHeart className="text-4xl text-rose-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Wishlist is Empty</h2>
                                <p className="text-gray-500 mt-3 max-w-sm">Save items that you like in your wishlist. Review them anytime and easily move them to the cart.</p>
                                <button className="mt-8 bg-gray-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-sm">
                                    Explore Products
                                </button>
                            </div>
                        )}

                        {/* 5. REVIEWS TAB */}
                        {activeTab === 'reviews' && (
                            <div className="p-8 h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center mb-6">
                                    <FiStar className="text-4xl text-yellow-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800">No Reviews Yet</h2>
                                <p className="text-gray-500 mt-3 max-w-sm">You haven't reviewed any products yet. Share your experience with other shoppers!</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ProfilePage;
