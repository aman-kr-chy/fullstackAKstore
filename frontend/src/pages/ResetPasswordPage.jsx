import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const ResetPasswordPage = () => {
    const { token } = useParams();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }
        
        try {
            setIsLoading(true);
            await api.put(`/auth/resetpassword/${token}`, { password });
            setSuccess(true);
            toast.success('Password updated successfully');
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
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
                    <h2 className="text-2xl font-semibold text-gray-800">Reset Password</h2>
                    <p className="text-gray-500 text-sm mt-2">Enter your new password below</p>
                </div>
                
                {!success ? (
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div>
                            <input 
                                type="password" 
                                placeholder="New Password" 
                                className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <div>
                            <input 
                                type="password" 
                                placeholder="Confirm New Password" 
                                className="w-full border-b border-gray-300 focus:border-primary outline-none py-2 px-1 text-sm transition-colors"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-primary text-white font-semibold py-3 rounded-sm shadow-sm hover:bg-blue-600 transition-colors disabled:opacity-50 flex justify-center items-center"
                        >
                            {isLoading ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm mb-6">
                            Your password has been successfully reset. You will be redirected to the login page momentarily.
                        </div>
                        <Link to="/login" className="inline-block mt-4 bg-primary text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-600 transition-colors">
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPasswordPage;
