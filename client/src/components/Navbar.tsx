import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, LayoutDashboard, PlusCircle, Home, Sparkles, Globe, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const Navbar = () => {
    const { user } = useAuthStore();
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="sticky top-0 w-full bg-black/80 backdrop-blur-xl border-b border-white/10 px-8 py-4 flex justify-between items-center z-50">
            <Link to="/marketplace" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center font-black text-black scale-90 group-hover:scale-100 transition">S</div>
                <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-tighter">SRM Swap</span>
            </Link>

            <div className="flex items-center gap-8">
                <Link to="/marketplace" className={`flex items-center gap-2 transition-colors ${isActive('/marketplace') ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                    <ShoppingBag size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Market</span>
                </Link>

                <Link to="/create-listing" className={`flex items-center gap-2 transition-colors ${isActive('/create-listing') ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                    <PlusCircle size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Sell</span>
                </Link>

                <Link to="/dashboard" className={`flex items-center gap-2 transition-colors ${isActive('/dashboard') || isActive('/student') ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                    <LayoutDashboard size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Dash</span>
                </Link>

                <Link to="/freshers" className={`flex items-center gap-2 transition-colors ${isActive('/freshers') ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}>
                    <Sparkles size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">Freshers</span>
                </Link>

                <Link to="/about" className={`flex items-center gap-2 transition-colors ${isActive('/about') ? 'text-purple-400' : 'text-gray-400 hover:text-white'}`}>
                    <Globe size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest hidden lg:block">Know Your College</span>
                </Link>

                {user?.role === 'MEMBER' && (
                    <Link to="/member" className={`flex items-center gap-2 transition-colors ${isActive('/member') ? 'text-yellow-400' : 'text-gray-400 hover:text-white'}`}>
                        <Home size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Super</span>
                    </Link>
                )}

                {user?.role === 'ADMIN' && (
                    <Link to="/admin" className={`flex items-center gap-2 transition-colors ${isActive('/admin') ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
                        <Home size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Admin</span>
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user && (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-black font-bold text-[10px]">
                                {user.email[0].toUpperCase()}
                            </div>
                            <span className="text-xs font-medium text-gray-300 hidden sm:block">{user.email.split('@')[0]}</span>
                        </div>
                        <button
                            onClick={() => {
                                useAuthStore.getState().logout();
                                window.location.href = '/login';
                            }}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
