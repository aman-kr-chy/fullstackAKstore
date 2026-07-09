import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiMapPin, FiCreditCard } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';

const OrderPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Error fetching order');
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    }

    if (!order) {
        return <div className="text-center py-20 text-xl text-gray-500">Order not found</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-green-50 border-b border-green-100 p-8 text-center">
                    <FiCheckCircle className="mx-auto text-green-500 text-6xl mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Successfully Placed!</h1>
                    <p className="text-gray-600">Thank you for your purchase. Your order ID is <strong>{order._id}</strong>.</p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-6 md:col-span-2">
                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
                                <FiMapPin className="text-primary" /> Shipping Details
                            </h2>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="font-semibold text-gray-800">{order.user.name}</p>
                                <p className="text-gray-600">{order.user.email}</p>
                                <p className="text-gray-600 mt-2">
                                    {order.shippingAddress.street}<br/>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}<br/>
                                    {order.shippingAddress.country}
                                </p>
                                <p className="text-gray-600 mt-2">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-2">
                                <FiPackage className="text-primary" /> Order Items
                            </h2>
                            <div className="space-y-4">
                                {order.orderItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 bg-gray-50 p-4 rounded-lg">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 object-contain bg-white rounded-md border p-1" />
                                        <div className="flex-1">
                                            <Link to={`/product/${item.product}`} className="font-semibold text-gray-800 hover:text-primary">
                                                {item.name}
                                            </Link>
                                        </div>
                                        <div className="font-bold text-gray-900">
                                            {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <FiCreditCard className="text-primary" /> Order Summary
                            </h2>
                            
                            <div className="space-y-4 text-gray-600">
                                <div className="flex justify-between">
                                    <span>Items Total</span>
                                    <span className="font-medium text-gray-900">₹{order.itemsPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="font-medium text-gray-900">₹{order.shippingPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax</span>
                                    <span className="font-medium text-gray-900">₹{order.taxPrice}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between">
                                    <span className="text-lg font-bold text-gray-900">Grand Total</span>
                                    <span className="text-lg font-bold text-primary">₹{order.totalPrice}</span>
                                </div>
                            </div>
                            
                            <div className="mt-8">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Payment Method</p>
                                <p className="text-gray-600">{order.paymentMethod}</p>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Order Status</p>
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 font-semibold text-sm rounded-full">
                                    {order.orderStatus}
                                </span>
                            </div>
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-gray-800 mb-1">Payment Status</p>
                                <span className={`inline-block px-3 py-1 font-semibold text-sm rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {order.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleDateString()}` : 'Not Paid'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
