import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageSquare, ShieldCheck, List } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { user, profile, fetchProfile } = useAuthStore();
    const [listings, setListings] = useState<any[]>([]);
    const [trades, setTrades] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [listingsRes, tradesRes] = await Promise.all([
                    api.get('/user/my-listings'),
                    api.get('/user/my-trades')
                ]);
                setListings(listingsRes.data);
                setTrades(tradesRes.data);
                fetchProfile();
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-white p-10">Loading your vibe...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 space-y-8">
            {/* Profile Header */}
            <header className="flex items-center gap-6 bg-white/5 p-8 rounded-3xl border border-white/10">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-bold border-4 border-black">
                    {profile?.photoUrl ? <img src={profile.photoUrl} className="w-full h-full rounded-full object-cover" /> : profile?.fullName[0]}
                </div>
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">{profile?.fullName}</h1>
                    <div className="flex items-center gap-2 text-cyan-400 font-mono mt-1">
                        <ShieldCheck size={18} />
                        <span>Trust Score: {user?.trustScore}</span>
                        {user?.isVerified && <span className="bg-cyan-500/20 text-xs px-2 py-0.5 rounded-full border border-cyan-500/50 ml-2">VERIFIED</span>}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Trades */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-xl font-bold uppercase tracking-widest text-gray-400">
                        <MessageSquare size={20} />
                        <h2>Active Trades</h2>
                    </div>
                    <div className="space-y-4">
                        {trades.map(trade => (
                            <Link to={`/trade/${trade.id}`} key={trade.id}>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition"
                                >
                                    <div>
                                        <h3 className="font-bold">{trade.listing.title}</h3>
                                        <p className="text-sm text-gray-500">
                                            {trade.buyerId === user?.id ? `Buying from ${trade.listing.seller.profile.fullName}` : `Selling to ${trade.buyer.profile.fullName}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${trade.status === 'NEGOTIATING' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                                            {trade.status}
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                        {trades.length === 0 && <p className="text-gray-600 italic">No active trades. Go haggle something!</p>}
                    </div>
                </section>

                {/* My Listings */}
                <section>
                    <div className="flex items-center gap-2 mb-4 text-xl font-bold uppercase tracking-widest text-gray-400">
                        <List size={20} />
                        <h2>My Listings</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {listings.map(item => (
                            <div key={item.id} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-xs text-gray-500">{item.status} | {item.type}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-cyan-400">{item.price ? `₹${item.price}` : 'BARTER'}</p>
                                </div>
                            </div>
                        ))}
                        {listings.length === 0 && <p className="text-gray-600 italic">Listing gallery empty.</p>}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;
