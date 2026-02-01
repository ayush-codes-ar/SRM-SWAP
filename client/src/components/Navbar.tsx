import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, PlusCircle, Home as HomeIcon, Sparkles, Globe, LogOut, Info, Zap, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

const Navbar = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const showLandingNav = !user || isAuthPage;

    const isActive = (path: string) => location.pathname === path;

    // Navigation for Authenticated Users
    const authenticatedItems = [
        { path: '/marketplace', label: 'Market', icon: <ShoppingBag size={18} />, activeColor: 'text-cyan-400' },
        { path: '/create-listing', label: 'Sell', icon: <PlusCircle size={18} />, activeColor: 'text-cyan-400' },
        { path: '/student', label: 'Dash', icon: <LayoutDashboard size={18} />, activeColor: 'text-cyan-400' },
        { path: '/freshers', label: 'Freshers', icon: <Sparkles size={18} />, activeColor: 'text-cyan-400' },
        { path: '/about', label: 'Know Your College', icon: <Globe size={18} />, activeColor: 'text-blue-400' },
    ];

    // Navigation for Landing / Auth Pages
    const landingItems = [
        { path: '/', label: 'Home', icon: <HomeIcon size={18} /> },
        { path: '/about', label: 'About', icon: <Info size={18} /> },
        { path: '/how-it-works', label: 'How it works', icon: <Zap size={18} /> },
        { path: '/features', label: 'Features', icon: <Sparkles size={18} /> },
        { path: '/faq', label: 'FAQ', icon: <HelpCircle size={18} /> },
    ];

    const currentNavItems = showLandingNav ? landingItems : authenticatedItems;

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring' as const, damping: 20, stiffness: 100 }}
            className="sticky top-0 w-full glass-morphism px-12 py-5 flex justify-between items-center z-50 border-white/5"
        >
            <Link to={user ? "/marketplace" : "/"} className="no-underline flex items-center gap-4">
                <Logo />
                <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/20 rounded-full">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-yellow-500">Demo Mode</span>
                </div>
            </Link>

            <div className="flex items-center gap-10">
                {currentNavItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`group relative flex items-center gap-2 transition-all duration-500 ${isActive(item.path) ? (showLandingNav ? 'text-blue-600' : (item as any).activeColor.replace('400', '600')) : 'text-gray-400 hover:text-black'}`}
                    >
                        <motion.div
                            whileHover={{ y: -2, scale: 1.1 }}
                            className="flex items-center gap-2"
                        >
                            {item.icon}
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">{item.label}</span>
                        </motion.div>
                        <AnimatePresence>
                            {isActive(item.path) && (
                                <motion.div
                                    layoutId="nav-active"
                                    className={`absolute -bottom-8 left-0 right-0 h-1 rounded-full ${showLandingNav ? 'bg-blue-400' : (item as any).activeColor.replace('text', 'bg')}`}
                                />
                            )}
                        </AnimatePresence>
                    </Link>
                ))}

                {!showLandingNav && user?.role === 'MEMBER' && (
                    <Link to="/member" className={`flex items-center gap-2 transition-colors ${isActive('/member') ? 'text-yellow-600' : 'text-gray-400 hover:text-black'}`}>
                        <HomeIcon size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">Super</span>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-6">
                {user ? (
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-gray-100 hover:border-blue-500/30 transition-colors"
                        >
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white font-black text-[10px]">
                                {user.email[0].toUpperCase()}
                            </div>
                            <span className="text-[10px] font-black text-gray-600 hidden sm:block uppercase tracking-widest">{user.email.split('@')[0]}</span>
                        </motion.div>
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                                useAuthStore.getState().logout();
                                window.location.href = '/login';
                            }}
                            className="p-3 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-2xl transition-all"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </motion.button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${location.pathname === '/login' ? 'bg-white text-black' : 'text-gray-400 hover:text-white border border-white/10 hover:border-white/20'}`}
                            >
                                Login
                            </motion.button>
                        </Link>
                        <Link to="/register">
                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${location.pathname === '/register' ? 'bg-blue-600 text-white shadow-blue-600/20' : 'bg-white text-black shadow-white/10 hover:bg-blue-600 hover:text-white'}`}
                            >
                                Register
                            </motion.button>
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
