import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

const CartPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const addToCartHandler = (product, qty) => {
        dispatch(addToCart({ ...product, qty }));
        
        // Show different messages based on if it's an increment or decrement
        if (qty > product.qty) {
            toast.success('Cart updated');
        } else if (qty < product.qty) {
            toast.info('Cart updated');
        }
    };

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
        toast.error('Item removed from cart');
    };

    const checkoutHandler = () => {
        navigate('/login?redirect=/shipping');
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 my-6">
            <div className="md:w-2/3">
                <div className="bg-white p-6 shadow-sm rounded-sm">
                    <h2 className="text-2xl font-semibold mb-6">Shopping Cart ({cartItems.length} items)</h2>
                    
                    {cartItems.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4 text-gray-500">Your cart is empty</div>
                            <Link to="/" className="bg-primary text-white px-6 py-2 rounded-sm font-semibold">
                                Shop Now
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {cartItems.map((item) => (
                                <div key={item._id} className="flex flex-col sm:flex-row border-b pb-6 gap-6">
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-white border rounded-sm p-2 mx-auto sm:mx-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <Link to={`/product/${item._id}`} className="font-semibold text-lg hover:text-primary line-clamp-2">
                                            {item.name}
                                        </Link>
                                        <div className="text-gray-500 text-sm mt-1">Seller: Appario Retail</div>
                                        <div className="font-bold text-xl mt-4">₹{item.price}</div>
                                        
                                        <div className="flex flex-wrap items-center gap-4 mt-6">
                                            <div className="flex items-center border rounded-sm">
                                                <button 
                                                    onClick={() => addToCartHandler(item, item.qty - 1)}
                                                    disabled={item.qty <= 1}
                                                    className="px-3 py-1 bg-gray-100 disabled:opacity-50"
                                                >-</button>
                                                <input 
                                                    type="text" 
                                                    className="w-12 text-center outline-none border-x py-1"
                                                    value={item.qty}
                                                    readOnly
                                                />
                                                <button 
                                                    onClick={() => addToCartHandler(item, item.qty + 1)}
                                                    disabled={item.qty >= item.stock}
                                                    className="px-3 py-1 bg-gray-100 disabled:opacity-50"
                                                >+</button>
                                            </div>
                                            
                                            <button 
                                                className="font-semibold hover:text-primary uppercase"
                                                onClick={() => removeFromCartHandler(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="md:w-1/3">
                <div className="bg-white p-6 shadow-sm rounded-sm sticky top-24">
                    <h3 className="text-gray-500 uppercase font-semibold border-b pb-4 mb-4">Price Details</h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span>Price ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                            <span>₹{cart.itemsPrice}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery Charges</span>
                            <span className={cart.shippingPrice == 0 ? "text-green-600" : ""}>
                                {cart.shippingPrice == 0 ? 'Free' : `₹${cart.shippingPrice}`}
                            </span>
                        </div>
                        <div className="flex justify-between border-b pb-4">
                            <span>Estimated Tax (18% GST)</span>
                            <span>₹{cart.taxPrice}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{cart.totalPrice}</span>
                        </div>
                    </div>
                    
                    <button 
                        disabled={cartItems.length === 0}
                        onClick={checkoutHandler}
                        className="w-full bg-[#fb641b] text-white py-4 rounded-sm font-bold uppercase shadow-sm hover:bg-[#f25b12] disabled:opacity-50"
                    >
                        Place Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
