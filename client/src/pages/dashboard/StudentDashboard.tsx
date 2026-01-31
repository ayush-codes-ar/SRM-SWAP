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
        <div className="min-h-screen bg-gray-50 text-black p-8 space-y-12">
            {/* Profile Header */}
            <header className="flex flex-col md:flex-row items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl shadow-blue-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-bl-[5rem] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
                <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center text-4xl font-black text-white border-8 border-gray-50 shadow-2xl relative z-10">
                    {profile?.photoUrl ? <img src={profile.photoUrl} className="w-full h-full rounded-full object-cover" /> : profile?.fullName[0]}
                </div>
                <div className="text-center md:text-left relative z-10">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">{profile?.fullName}</h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                        <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full border border-blue-100 font-black text-xs tracking-widest">
                            <ShieldCheck size={16} />
                            TRUST SCORE: {user?.trustScore}
                        </div>
                        {user?.isVerified && (
                            <span className="bg-black text-white text-[10px] px-4 py-2 rounded-full font-black tracking-[0.2em]">VERIFIED GRAD</span>
                        )}
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Active Trades */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-black rounded-lg text-white">
                            <MessageSquare size={20} />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Live Engagements</h2>
                    </div>
                    <div className="space-y-4">
                        {trades.map(trade => (
                            <Link to={`/trade/${trade.id}`} key={trade.id}>
                                <motion.div
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    className="bg-white border border-gray-100 p-6 rounded-[2rem] flex justify-between items-center hover:border-blue-600/30 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-black font-black group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {trade.listing.title[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-lg leading-tight">{trade.listing.title}</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                                {trade.buyerId === user?.id ? `BUYING FROM ${trade.listing.seller.profile.fullName.split(' ')[0]}` : `SELLING TO ${trade.buyer.profile.fullName.split(' ')[0]}`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] px-4 py-2 rounded-full font-black tracking-widest uppercase border ${trade.status === 'NEGOTIATING' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-black text-white border-black'}`}>
                                            {trade.status}
                                        </span>
                                    </div>
                                </motion.div>
                            </Link>
                        ))}
                        {trades.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center">
                                <p className="text-gray-300 font-black uppercase tracking-widest text-xs">No active maneuvers found.</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* My Listings */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 px-2">
                        <div className="p-2 bg-blue-600 rounded-lg text-white">
                            <List size={20} />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tighter">Your Inventory</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {listings.map(item => (
                            <div key={item.id} className="bg-gray-50/50 border border-gray-100 p-6 rounded-[2rem] flex justify-between items-center group hover:bg-white hover:shadow-lg transition-all">
                                <div className="flex gap-5 items-center">
                                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:text-blue-600 transition-colors">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg">{item.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[8px] font-black uppercase tracking-widest bg-gray-200 text-gray-500 px-2 py-1 rounded-md">{item.type}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{item.status}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-black text-black">{item.price ? `₹${item.price}` : 'BARTER'}</p>
                                </div>
                            </div>
                        ))}
                        {listings.length === 0 && (
                            <div className="p-12 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center">
                                <p className="text-gray-300 font-black uppercase tracking-widest text-xs">Inventory empty. Start trading.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;
