import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { Shield, Share2, Zap, Info, ChevronRight, User, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'STUDENT' | 'MEMBER' | 'ADMIN'>('STUDENT');
    const login = useAuthStore((state) => state.login);
    const fetchProfile = useAuthStore((state) => state.fetchProfile);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login({ identifier, password, role });

            // For students, check if profile is complete
            if (role === 'STUDENT') {
                await fetchProfile();
                const profile = useAuthStore.getState().profile;
                if (profile && profile.phone) {
                    navigate('/marketplace');
                } else {
                    navigate('/profile-setup');
                }
            } else if (role === 'ADMIN') {
                navigate('/admin');
            } else if (role === 'MEMBER') {
                navigate('/member');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring' as const, damping: 25, stiffness: 120 }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
            {/* Cinematic Background Layer */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/campus.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[4px]" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-transparent to-black/60" />
            </div>

            {/* Main Cinematic Grid */}
            <div className="container mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Side: Welcome & Info (60%) */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="lg:col-span-7 space-y-8"
                >
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 rotate-12">
                                <Share2 className="text-white" size={24} />
                            </div>
                            <span className="text-blue-400 font-black uppercase tracking-[0.3em] text-[10px]">Official Barter Hub</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
                            Welcome to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">SRM SWAP</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                            The heartbeat of student exchange at SRM University AP. A premium, trust-based marketplace designed for the modern campus life.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:bg-white/15 transition-all group">
                            <Zap className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">Instant Barter</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">Trade items seamlessly with fellow students in real-time.</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2rem] border border-white/10 hover:bg-white/15 transition-all group">
                            <Shield className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" size={28} />
                            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">Trust Verified</h3>
                            <p className="text-gray-400 text-xs leading-relaxed font-bold uppercase tracking-tight">Every inhabitant is verified via official SRM credentials.</p>
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="bg-blue-600/10 backdrop-blur-md border border-blue-500/20 p-8 rounded-[2.5rem] flex items-start gap-6">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center flex-shrink-0 text-blue-400">
                            <Info size={20} />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-black uppercase tracking-widest text-[10px]">Community Guidelines</h4>
                            <ul className="space-y-2">
                                {['Respect fellow students', 'Verify items visually before trade', 'Meet in supervised campus zones'].map((rule, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-300 text-[10px] font-black uppercase tracking-widest">
                                        <ChevronRight size={12} className="text-blue-500" /> {rule}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Right Side: Login Form (40%) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring' as const, damping: 25, stiffness: 100, delay: 0.4 }}
                    className="lg:col-span-5 w-full max-w-md mx-auto"
                >
                    <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-10 rounded-[3.5rem] shadow-[0_32px_128px_-20px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-black">
                                {role === 'STUDENT' ? 'Vibe In' : 'Authenticate'}
                            </h2>
                        </div>

                        {/* Role Switcher */}
                        <div className="flex bg-black/5 p-1.5 rounded-[2rem] mb-10 border border-black/5">
                            {(['STUDENT', 'MEMBER', 'ADMIN'] as const).map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setRole(r)}
                                    className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-[1.5rem] transition-all duration-500 ${role === r
                                        ? `bg-black text-white shadow-xl shadow-black/20`
                                        : 'text-gray-500 hover:text-black hover:bg-black/5'
                                        }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50/50 backdrop-blur-md text-red-500 p-4 rounded-2xl mb-8 text-[9px] font-black text-center border border-red-500/20 uppercase tracking-widest"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                    <User size={12} /> {role === 'STUDENT' ? 'Email Address' : 'Username'}
                                </label>
                                <input
                                    type={role === 'STUDENT' ? 'email' : 'text'}
                                    placeholder={role === 'STUDENT' ? 'id@srmap.edu.in' : 'Enter username'}
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full bg-black/5 border border-transparent rounded-[2rem] p-5 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 shadow-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">
                                    <Lock size={12} /> Security Key
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/5 border border-transparent rounded-[2rem] p-5 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 shadow-sm"
                                    required
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black py-6 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-black/20 hover:bg-blue-600 transition-all text-[10px] flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? 'Verifying...' : (
                                    <>
                                        {role === 'STUDENT' ? 'Enter the Hub' : 'Secure Entry'}
                                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </motion.button>
                        </form>

                        {role === 'STUDENT' && (
                            <div className="mt-10 pt-10 border-t border-black/5 text-center">
                                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                    New inhabitant? <Link to="/register" className="text-blue-600 hover:text-black ml-2 transition-colors inline-flex items-center gap-1">Create Account</Link>
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginPage;
