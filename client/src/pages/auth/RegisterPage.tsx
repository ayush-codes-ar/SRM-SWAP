import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ShieldCheck, ArrowRight, Loader2, BookOpen, Fingerprint, Sparkles, ChevronRight } from 'lucide-react';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        fullName: '',
        regNumber: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const register = useAuthStore((state) => state.register);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(formData);
            navigate('/profile-setup');
        } catch (err: any) {
            console.error('Registration Catch:', err);
            const serverMsg = err.response?.data?.error;
            const detailMsg = err.response?.data?.message;
            setError(serverMsg || detailMsg || 'Registration failed - Server unreachable');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', damping: 25, stiffness: 120 }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 font-sans">
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
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-transparent to-blue-900/30" />
            </div>

            <div className="container mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Side: Onboarding Guidelines (60%) */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="lg:col-span-7 space-y-10"
                >
                    <motion.div variants={itemVariants} className="space-y-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 rotate-12">
                                <Sparkles className="text-cyan-400" size={24} />
                            </div>
                            <span className="text-cyan-400 font-black uppercase tracking-[0.3em] text-[10px]">New Account Wizard</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter uppercase">
                            Join the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Tribe</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
                            Create your official identity and start trading with thousands of fellow students at SRM University AP.
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-6">
                        <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                            <BookOpen size={16} className="text-orange-400" /> Registration Guidelines
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Official Email', desc: 'Must use your @srmap.edu.in identity.', icon: <Mail size={18} /> },
                                { title: 'Valid ID', desc: 'Provide your accurate registration number.', icon: <Fingerprint size={18} /> },
                                { title: 'Security', desc: 'Set a strong, memorable security key.', icon: <Lock size={18} /> },
                                { title: 'Profile', desc: 'Trust is built through complete profiles.', icon: <User size={18} /> }
                            ].map((rule, i) => (
                                <div key={i} className="bg-white/5 backdrop-blur-sm p-6 rounded-[2rem] border border-white/5 flex gap-4 items-start group hover:bg-white/10 transition-all">
                                    <div className="text-orange-400 group-hover:scale-110 transition-transform">{rule.icon}</div>
                                    <div>
                                        <h5 className="text-white font-black uppercase tracking-widest text-[9px] mb-1">{rule.title}</h5>
                                        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight leading-tight">{rule.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} className="flex items-center gap-4 text-gray-500 font-black uppercase tracking-widest text-[10px]">
                        <span className="w-12 h-px bg-white/10"></span>
                        Trusted by 2k+ Inhabitants
                        <span className="w-12 h-px bg-white/10"></span>
                    </motion.div>
                </motion.div>

                {/* Right Side: Signup Form (40%) */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 100, delay: 0.4 }}
                    className="lg:col-span-5 w-full max-w-md mx-auto"
                >
                    <div className="bg-white/80 backdrop-blur-2xl border border-white/20 p-10 rounded-[3.5rem] shadow-[0_32px_128px_-20px_rgba(0,0,0,0.5)]">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-black">
                                Create Account
                            </h2>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="bg-red-50 text-red-500 p-4 rounded-2xl mb-8 border border-red-100 flex items-center gap-3"
                            >
                                <div className="w-6 h-6 bg-red-500 rounded-full flex-shrink-0 flex items-center justify-center text-white font-black text-[10px]">!</div>
                                <span className="text-[9px] font-black uppercase tracking-widest leading-tight">{error}</span>
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Full Name</label>
                                    <input
                                        name="fullName"
                                        type="text"
                                        placeholder="Name"
                                        onChange={handleChange}
                                        className="w-full bg-black/5 border border-transparent rounded-[1.5rem] p-4 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 text-sm shadow-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">ID Number</label>
                                    <input
                                        name="regNumber"
                                        type="text"
                                        placeholder="AP21..."
                                        onChange={handleChange}
                                        className="w-full bg-black/5 border border-transparent rounded-[1.5rem] p-4 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 text-sm shadow-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Official Email</label>
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="id@srmap.edu.in"
                                    onChange={handleChange}
                                    className="w-full bg-black/5 border border-transparent rounded-[2rem] p-4 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 text-sm shadow-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-4">Security Key</label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    onChange={handleChange}
                                    className="w-full bg-black/5 border border-transparent rounded-[2rem] p-4 text-black focus:bg-white focus:border-blue-600 focus:outline-none transition-all font-bold placeholder:text-gray-400 text-sm shadow-sm"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-black py-5 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-black/20 hover:bg-black transition-all text-[10px] flex items-center justify-center gap-4 group relative overflow-hidden mt-2"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : (
                                    <>
                                        Join Hub
                                        <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                                />
                            </motion.button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-black/5 text-center">
                            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                Already belong? <Link to="/login" className="text-blue-600 hover:text-black ml-2 transition-colors inline-flex items-center gap-1">Login <ChevronRight size={12} /></Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default RegisterPage;
