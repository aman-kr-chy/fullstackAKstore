import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        try {
            setIsLoading(true);
            await api.post('/auth/forgotpassword', { email });
            setEmailSent(true);
            toast.success('Password reset email sent');
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
                    <h2 className="text-2xl font-semibold text-gray-800">Forgot Password</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your email to receive a password reset link</p>
                </div>
                
                {!emailSent ? (
                    <form onSubmit={submitHandler} className="space-y-6">
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
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-primary text-white font-semibold py-3 rounded-sm shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? 'Sending Email...' : 'Send Reset Link'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-6">
                            An email has been sent to <strong>{email}</strong> with further instructions. Please check your inbox (and spam folder).
                        </div>
                    </div>
                )}
                
                <div className="mt-8 text-center text-sm">
                    <span className="text-gray-600">Remember your password? </span>
                    <Link to="/login" className="text-primary font-semibold hover:underline">
                        Log in here
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
