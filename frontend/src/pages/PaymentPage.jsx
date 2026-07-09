import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../redux/slices/cartSlice';

const PaymentPage = () => {
    const cart = useSelector((state) => state.cart);
    const { shippingAddress } = cart;

    const navigate = useNavigate();

    if (!shippingAddress?.street) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');
    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="flex justify-center my-10">
            <div className="bg-white p-8 shadow-sm rounded-sm w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6">Payment Method</h2>
                <form onSubmit={submitHandler}>
                    <div className="mb-6 space-y-4">
                        <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-sm">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-primary"
                                name="paymentMethod"
                                value="Razorpay"
                                checked={paymentMethod === 'Razorpay'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="font-semibold text-lg">Razorpay (UPI, Cards, NetBanking)</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer p-4 border rounded-sm">
                            <input
                                type="radio"
                                className="form-radio h-5 w-5 text-primary"
                                name="paymentMethod"
                                value="CashOnDelivery"
                                checked={paymentMethod === 'CashOnDelivery'}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            />
                            <span className="font-semibold text-lg">Cash on Delivery</span>
                        </label>
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold uppercase mt-6"
                    >
                        Continue to Summary
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PaymentPage;
