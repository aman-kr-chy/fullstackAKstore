import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { allProducts } from '../data/mockProducts';

const ProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const product = allProducts.find((p) => p._id === id) || allProducts[0];

    const [qty, setQty] = useState(1);

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty }));
        toast.success('Item added to cart!');
        navigate('/cart');
    };

    return (
        <div className="bg-white p-4 shadow-sm min-h-[80vh]">
            <Link to="/" className="text-sm text-primary hover:underline font-semibold mb-4 inline-block">
                &#8592; Back to Home
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Product Image */}
                <div className="md:col-span-5 h-[300px] md:h-[500px] border flex items-center justify-center bg-white p-4 sticky top-24 rounded-sm">
                    <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                </div>

                {/* Product Info */}
                <div className="md:col-span-7">
                    <h1 className="text-2xl font-normal text-gray-900 mb-2">{product.name}</h1>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-green-600 text-white px-2 py-0.5 rounded-sm text-sm font-bold flex items-center gap-1">
                            {product.rating} &#9733;
                        </div>
                        <span className="text-gray-500 font-semibold text-sm">
                            {product.numReviews} Ratings & Reviews
                        </span>
                    </div>

                    <div className="text-green-600 font-semibold mb-1 text-sm">Special price</div>
                    <div className="flex items-baseline space-x-3 mb-6">
                        <span className="text-3xl font-bold">₹{product.price}</span>
                        <span className="text-gray-500 line-through">₹{product.discountPrice}</span>
                        <span className="text-green-600 font-semibold">
                            {Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% off
                        </span>
                    </div>

                    {/* Offers */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-2">Available offers</h3>
                        <ul className="text-sm space-y-2 text-gray-700">
                            <li><span className="text-green-600 font-bold mr-2">&#10003;</span>Bank Offer 5% Cashback on XYZ Bank Card</li>
                            <li><span className="text-green-600 font-bold mr-2">&#10003;</span>Partner Offer Sign up for FlipStore Pay Later and get ₹500 Gift Card</li>
                        </ul>
                    </div>

                    <div className="border-t pt-6 mb-6">
                        <h3 className="text-gray-500 uppercase font-semibold mb-2">Description</h3>
                        <p className="text-gray-800 leading-relaxed text-sm">
                            {product.description}
                        </p>
                    </div>

                    {/* Add to Cart Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 pt-6 border-t border-dashed w-full">
                        <div className="flex items-center border rounded-sm sm:mr-4 w-full sm:w-auto justify-center">
                            <button
                                onClick={() => {
                                    if (qty > 1) {
                                        setQty(qty - 1);
                                        toast.info(`Quantity decreased to ${qty - 1}`, { autoClose: 1000 });
                                    } else {
                                        toast.error("Minimum quantity is 1", { autoClose: 1000 });
                                    }
                                }}
                                disabled={qty <= 1}
                                className="px-4 py-2 bg-gray-100 disabled:opacity-50 font-bold text-lg transition-colors hover:bg-gray-200"
                            >-</button>
                            <span className="w-16 text-center font-semibold">{qty}</span>
                            <button
                                onClick={() => {
                                    if (qty < product.stock) {
                                        setQty(qty + 1);
                                        toast.success(`Quantity increased to ${qty + 1}`, { autoClose: 1000 });
                                    } else {
                                        toast.error("Maximum stock limit reached", { autoClose: 1000 });
                                    }
                                }}
                                disabled={qty >= product.stock}
                                className="px-4 py-2 bg-gray-100 disabled:opacity-50 font-bold text-lg transition-colors hover:bg-gray-200"
                            >+</button>
                        </div>
                        <button
                            onClick={addToCartHandler}
                            disabled={product.stock === 0}
                            className="w-full sm:w-auto bg-[#ff9f00] text-white px-8 py-4 rounded-sm font-bold uppercase shadow-sm hover:bg-[#f39800] disabled:opacity-50 flex-1"
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={() => {
                                dispatch(addToCart({ ...product, qty }));
                                toast.success('Item added to cart!');
                                navigate('/login?redirect=/shipping');
                            }}
                            disabled={product.stock === 0}
                            className="w-full sm:w-auto bg-[#fb641b] text-white px-8 py-4 rounded-sm font-bold uppercase shadow-sm hover:bg-[#f25b12] disabled:opacity-50 flex-1"
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
