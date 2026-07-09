import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { saveShippingAddress } from '../redux/slices/cartSlice';

const ShippingPage = () => {
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { shippingAddress } = cart;

    const [street, setStreet] = useState(shippingAddress?.street || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [state, setStateName] = useState(shippingAddress?.state || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');
    const [phone, setPhone] = useState(shippingAddress?.phone || '');
    const [email, setEmail] = useState(shippingAddress?.email || userInfo?.email || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ street, city, postalCode, state, country, phone, email }));
        navigate('/payment');
    };

    return (
        <div className="flex justify-center my-10">
            <div className="bg-white p-8 shadow-sm rounded-sm w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-6">Shipping Address</h2>
                <form onSubmit={submitHandler} className="space-y-4">
                    <input 
                        type="text" 
                        placeholder="Street Address" 
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required
                        className="w-full border py-2 px-3 rounded-sm"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="City" 
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                        <input 
                            type="text" 
                            placeholder="Postal Code" 
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="State" 
                            value={state}
                            onChange={(e) => setStateName(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                        <input 
                            type="text" 
                            placeholder="Country" 
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            placeholder="Phone Number" 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                        <input 
                            type="email" 
                            placeholder="Email for Order Updates" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full border py-2 px-3 rounded-sm"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-[#fb641b] text-white py-3 rounded-sm font-bold uppercase mt-6"
                    >
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ShippingPage;
