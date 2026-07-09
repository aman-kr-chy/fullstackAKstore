import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import api from '../services/api';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const redirect = location.search ? location.search.split('=')[1] : '/';

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [navigate, userInfo, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await api.post('/auth/register', { name, email, password });
            dispatch(setCredentials(data));
            toast.success('Registration successful');
            navigate(redirect);
        } catch (error) {
            toast.error(error?.response?.data?.message || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-full my-10">
            <div className="bg-white p-8 shadow-sm rounded-sm w-full max-w-md flex flex-col">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-semibold text-gray-800">Looks like you're new here!</h2>
                    <p className="text-gray-500 text-sm mt-2">Sign up with your details to get started</p>
                </div>
                
                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <input 
                            type="text" 
                            placeholder="Full Name" 
                            className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            placeholder="Confirm Password" 
                            className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full bg-primary text-white font-semibold py-3 rounded-sm shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                        {isLoading ? 'Creating Account...' : 'Continue'}
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm flex-col">
                    <Link to="/login" className="w-full block bg-white text-primary border border-gray-300 font-semibold py-3 rounded-sm shadow-sm hover:bg-gray-50 transition-colors">
                        Existing User? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
