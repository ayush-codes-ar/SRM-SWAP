import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, PlusCircle, Home as HomeIcon, Sparkles, Globe, LogOut, Info, Zap, HelpCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import MagneticButton from './ui/MagneticButton';

const Navbar = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const showLandingNav = !user || isAuthPage;

    const isActive = (path: string) => location.pathname === path;

    // Navigation for Authenticated Users
    const authenticatedItems = [
        { path: '/marketplace', label: 'Market', icon: <ShoppingBag size={22} />, activeColor: 'text-cyan-400' },
        { path: '/create-listing', label: 'Sell', icon: <PlusCircle size={22} />, activeColor: 'text-cyan-400' },
        { path: '/student', label: 'Dash', icon: <LayoutDashboard size={22} />, activeColor: 'text-cyan-400' },
        { path: '/freshers', label: 'Freshers', icon: <Sparkles size={22} />, activeColor: 'text-cyan-400' },
        { path: '/about', label: 'Know Your College', icon: <Globe size={22} />, activeColor: 'text-blue-400' },
    ];

    // Navigation for Landing / Auth Pages
    const landingItems = [
        { path: '/', label: 'Home', icon: <HomeIcon size={22} /> },
        { path: '/about', label: 'About', icon: <Info size={22} /> },
        { path: '/how-it-works', label: 'How it works', icon: <Zap size={22} /> },
        { path: '/features', label: 'Features', icon: <Sparkles size={22} /> },
        { path: '/faq', label: 'FAQ', icon: <HelpCircle size={22} /> },
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
                            <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{item.label}</span>
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
                        <HomeIcon size={22} />
                        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Super</span>
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
                            <MagneticButton className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all text-gray-400 hover:text-white border border-white/10 hover:border-white/20">
                                Login
                            </MagneticButton>
                        </Link>
                        <Link to="/register">
                            <MagneticButton className="px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-xl bg-white text-black shadow-white/10 hover:bg-blue-600 hover:text-white">
                                Register
                            </MagneticButton>
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
};

export default Navbar;
