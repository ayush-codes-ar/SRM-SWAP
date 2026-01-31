import { motion } from 'framer-motion';
import { BookOpen, ShieldAlert, Zap, Coffee, Bed, Pill, PenTool, Bath, Package, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useItemStore } from '../../store/useItemStore';
import ItemCard from '../../components/ItemCard';
import { useTradeStore } from '../../store/useTradeStore';
import { useNavigate } from 'react-router-dom';

const FreshersSection = () => {
    const { items, fetchItems, loading } = useItemStore();
    const { startTrade } = useTradeStore();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isPrepMode, setIsPrepMode] = useState(false);
    const [isStartingTrade, setIsStartingTrade] = useState(false);

    const categories = [
        { id: 'Pillows', name: 'Pillows', icon: <Package size={20} /> },
        { id: 'Mattresses', name: 'Mattresses', icon: <Bed size={20} /> },
        { id: 'Stationery', name: 'Stationery', icon: <PenTool size={20} /> },
        { id: 'Bathroom equipments', name: 'Bathroom', icon: <Bath size={20} /> },
        { id: 'Medicines', name: 'Medicines', icon: <Pill size={20} /> },
    ];

    useEffect(() => {
        if (selectedCategory) {
            fetchItems({ marketplace: 'FRESHERS', category: selectedCategory });
        }
    }, [selectedCategory, fetchItems]);

    const handleItemClick = async (itemId: string) => {
        if (isStartingTrade) return;
        setIsStartingTrade(true);
        try {
            const tradeId = await startTrade(itemId);
            navigate(`/trade/${tradeId}`);
        } catch (e: any) {
            console.error('Failed to start trade', e);
            alert(`Could not start trade: ${e.response?.data?.error || e.message}`);
        } finally {
            setIsStartingTrade(false);
        }
    };

    const guides = [
        {
            title: "How to Barter?",
            desc: "Upload your item, chat with the seller, and propose a trade. Simple.",
            icon: <Zap className="text-yellow-400" />
        },
        {
            title: "Safety First",
            desc: "Always meet in public campus spots. Our supervisors will be there to verify.",
            icon: <ShieldAlert className="text-red-400" />
        },
        {
            title: "Trust Score",
            desc: "Keep it real. Better ratings mean a higher trust score and better deals.",
            icon: <BookOpen className="text-cyan-400" />
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white p-8 relative">
            {isStartingTrade && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Establishing Dorm Connection...</p>
                    </div>
                </div>
            )}
            <div className="max-w-5xl mx-auto space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-7xl font-black uppercase tracking-tighter text-white">
                        WELCOME <span className="text-cyan-500">FRESHERS</span>
                    </h1>
                    <p className="text-gray-400 text-xl font-mono">Your ultimate survival guide to campus commerce.</p>

                    {!isPrepMode && (
                        <button
                            onClick={() => setIsPrepMode(true)}
                            className="mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl shadow-cyan-500/20"
                        >
                            🚀 Let's prepare for hostel
                        </button>
                    )}
                </div>

                {isPrepMode ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => { setIsPrepMode(false); setSelectedCategory(null); }}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition font-bold"
                            >
                                <ArrowLeft size={20} /> Back to Guides
                            </button>
                            <h2 className="text-2xl font-bold">What are you looking for?</h2>
                        </div>

                        <div className="flex flex-wrap gap-4 justify-center">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-bold border transition ${selectedCategory === cat.id ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                                >
                                    {cat.icon}
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {selectedCategory && (
                            <div className="mt-12 space-y-8">
                                <h3 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                                    Available {selectedCategory}
                                    <span className="text-xs bg-cyan-500/20 px-2 py-1 rounded-full text-cyan-500 uppercase">Freshers Market</span>
                                </h3>

                                {loading ? (
                                    <div className="text-center py-20 text-gray-500">Scouring the dorms...</div>
                                ) : items.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {items.map((item) => (
                                            <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                        <p className="text-gray-400 text-xl font-bold uppercase tracking-widest">
                                            No {selectedCategory} available
                                        </p>
                                        <p className="text-gray-600 mt-2">Check back later or list one yourself!</p>
                                        <button
                                            onClick={() => navigate('/create-listing')}
                                            className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full font-bold transition"
                                        >
                                            + List {selectedCategory}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {guides.map((g, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/10 p-8 rounded-3xl group hover:border-cyan-500 transition"
                                >
                                    <div className="mb-6 bg-white/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition">
                                        {g.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{g.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">{g.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}

                {/* FAQ Section */}
                <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-[3rem] border border-white/5">
                    <h2 className="text-4xl font-bold mb-8 flex items-center gap-4">
                        <Coffee className="text-orange-400" />
                        Campus FAQs
                    </h2>
                    <div className="space-y-6">
                        <details className="group border-b border-white/10 pb-4">
                            <summary className="text-xl font-bold cursor-pointer list-none flex justify-between items-center group-open:text-cyan-400">
                                What if I don't have something to barter?
                                <span className="text-gray-500 group-open:rotate-180 transition">+</span>
                            </summary>
                            <p className="text-gray-500 mt-4 leading-relaxed">
                                No worries! Many students also "lend" items for a short period or sell them for a small price. Check the "LEND" category!
                            </p>
                        </details>
                        <details className="group border-b border-white/10 pb-4">
                            <summary className="text-xl font-bold cursor-pointer list-none flex justify-between items-center group-open:text-cyan-400">
                                Where are the supervised meetups?
                                <span className="text-gray-500 group-open:rotate-180 transition">+</span>
                            </summary>
                            <p className="text-gray-500 mt-4 leading-relaxed">
                                Usually at the Student Activity Center or the Library Plaza. Your supervisor will confirm the exact spot in the chat.
                            </p>
                        </details>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FreshersSection;
