import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCartItems } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

const PlaceOrderPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        if (!cart.shippingAddress.street) {
            navigate('/shipping');
        } else if (!cart.paymentMethod) {
            navigate('/payment');
        }
    }, [cart.paymentMethod, cart.shippingAddress.street, navigate]);

    const placeOrderHandler = async () => {
        try {
            const { data } = await api.post('/orders', {
                orderItems: cart.cartItems.map(item => ({
                    name: item.name,
                    qty: item.qty,
                    image: item.image,
                    price: item.price,
                    product: item._id, // Assign the mock ID to 'product' field as expected by the backend
                })),
                shippingAddress: cart.shippingAddress,
                paymentMethod: cart.paymentMethod,
                itemsPrice: cart.itemsPrice,
                shippingPrice: cart.shippingPrice,
                taxPrice: cart.taxPrice,
                totalPrice: cart.totalPrice,
            });

            if (cart.paymentMethod === 'Razorpay') {
                const options = {
                    key: 'YOUR_RAZORPAY_KEY_ID', // Replace with real key in production (ideally fetched from backend)
                    amount: data.razorpayOrder.amount,
                    currency: data.razorpayOrder.currency,
                    name: 'FlipStore',
                    description: 'Test Transaction',
                    order_id: data.razorpayOrder.id,
                    handler: async function (response) {
                        try {
                            await api.post(`/orders/${data.order._id}/verify-payment`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });
                            dispatch(clearCartItems());
                            toast.success('Payment Successful!');
                            navigate(`/order/${data.order._id}`);
                        } catch (error) {
                            toast.error('Payment verification failed');
                        }
                    },
                    prefill: {
                        name: 'Test User',
                        email: 'test@example.com',
                        contact: '9999999999'
                    },
                    theme: {
                        color: '#2874f0'
                    }
                };
                const rzp1 = new window.Razorpay(options);
                rzp1.open();
            } else {
                dispatch(clearCartItems());
                navigate(`/order/${data.order._id}`);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Error placing order');
        }
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className="md:w-2/3 space-y-6">
                <div className="bg-white p-6 shadow-sm rounded-sm">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Shipping</h2>
                    <p className="text-gray-700">
                        <strong>Address: </strong>
                        {cart.shippingAddress.street}, {cart.shippingAddress.city},
                        {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                    </p>
                </div>

                <div className="bg-white p-6 shadow-sm rounded-sm">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Payment Method</h2>
                    <p className="text-gray-700">
                        <strong>Method: </strong>
                        {cart.paymentMethod}
                    </p>
                </div>

                <div className="bg-white p-6 shadow-sm rounded-sm">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Order Items</h2>
                    {cart.cartItems.length === 0 ? (
                        <div>Your cart is empty</div>
                    ) : (
                        <div className="space-y-4">
                            {cart.cartItems.map((item, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-500">Image</div>
                                    <div className="flex-1">
                                        <Link to={`/product/${item._id}`} className="hover:text-primary">{item.name}</Link>
                                    </div>
                                    <div className="font-semibold text-gray-700">
                                        {item.qty} x ₹{item.price} = ₹{item.qty * item.price}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="md:w-1/3">
                <div className="bg-white p-6 shadow-sm rounded-sm sticky top-24">
                    <h2 className="text-xl font-semibold border-b pb-4 mb-4">Order Summary</h2>

                    <div className="space-y-4 mb-6 text-gray-700">
                        <div className="flex justify-between">
                            <span>Items</span>
                            <span>₹{cart.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>₹{cart.shippingPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (18%)</span>
                            <span>₹{cart.taxPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl border-t pt-4 text-gray-900">
                            <span>Total</span>
                            <span>₹{cart.totalPrice}</span>
                        </div>
                    </div>

                    <button
                        disabled={cart.cartItems.length === 0}
                        onClick={placeOrderHandler}
                        className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold uppercase shadow-sm hover:bg-[#f25b12]"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrderPage;
