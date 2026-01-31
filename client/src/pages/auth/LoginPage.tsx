import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'MEMBER' | 'ADMIN'>('STUDENT');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login({ identifier, password, role });
            // Direct navigation based on role
            if (role === 'ADMIN') navigate('/admin');
            else if (role === 'MEMBER') navigate('/member');
            else navigate('/marketplace');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid credentials');
        }
    };

    const roleColors = {
        STUDENT: 'from-purple-600 to-pink-600',
        MEMBER: 'from-cyan-600 to-blue-600',
        ADMIN: 'from-red-600 to-orange-600'
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-black transition-colors duration-500`}>
            {/* Ambient Background Gradient */}
            <div className={`fixed inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] ${role === 'ADMIN' ? 'from-red-900' : role === 'MEMBER' ? 'from-cyan-900' : 'from-purple-900'} via-black to-black`} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative z-10"
            >
                <h2 className={`text-4xl font-black mb-8 text-center uppercase tracking-tighter bg-gradient-to-r ${roleColors[role]} bg-clip-text text-transparent`}>
                    {role === 'STUDENT' ? 'Vibe In' : role === 'MEMBER' ? 'Team Access' : 'Master Control'}
                </h2>

                {/* Role Switcher */}
                <div className="flex bg-black/40 p-1 rounded-2xl mb-8 border border-white/5">
                    {(['STUDENT', 'MEMBER', 'ADMIN'] as const).map((r) => (
                        <button
                            key={r}
                            onClick={() => {
                                setRole(r);
                                setIdentifier('');
                                setPassword('');
                            }}
                            className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${role === r
                                ? `bg-gradient-to-r ${roleColors[r]} text-black shadow-lg`
                                : 'text-gray-500 hover:text-gray-300'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>

                {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-xl mb-6 text-xs font-bold text-center border border-red-500/30 uppercase tracking-widest">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                            {role === 'STUDENT' ? 'SRM Email' : 'Username'}
                        </label>
                        <input
                            type={role === 'STUDENT' ? 'email' : 'text'}
                            placeholder={role === 'STUDENT' ? 'id@srmap.edu.in' : 'Enter username'}
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-white/30 transition-all font-medium"
                            required
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`w-full bg-gradient-to-r ${roleColors[role]} py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-xl shadow-black/20 hover:shadow-cyan-500/10 transition-all text-sm`}
                    >
                        {role === 'STUDENT' ? 'Enter The Swap' : 'Authenticate'}
                    </motion.button>
                </form>

                {role === 'STUDENT' && (
                    <p className="mt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                        New here? <Link to="/register" className="text-purple-400 hover:text-purple-300 ml-1">Join the Tribe</Link>
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default LoginPage;
