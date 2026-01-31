import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        regNumber: ''
    });
    const register = useAuthStore((state) => state.register);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await register(formData);
            navigate('/profile-setup');
        } catch (err: any) {
            console.error('Registration Catch:', err);
            const serverMsg = err.response?.data?.error;
            const detailMsg = err.response?.data?.message;
            setError(serverMsg || detailMsg || 'Registration failed - Server unreachable');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900 via-black to-black text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-xl"
            >
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    Join the Hub
                </h2>

                {error && <div className="bg-red-500/20 text-red-300 p-2 rounded mb-4 text-sm text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                        <input
                            name="fullName"
                            type="text"
                            placeholder="Your Name"
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Registration Number</label>
                        <input
                            name="regNumber"
                            type="text"
                            placeholder="AP21..."
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">SRM Email</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="id@srmap.edu.in"
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            onChange={handleChange}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 py-3 rounded-lg font-bold shadow-lg hover:shadow-cyan-500/30 transition-shadow"
                    >
                        Create Account
                    </motion.button>
                </form>

                <p className="mt-6 text-center text-gray-400 text-sm">
                    Already verified? <Link to="/login" className="text-cyan-400 hover:text-cyan-300">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
