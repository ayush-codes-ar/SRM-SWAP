import { motion, AnimatePresence } from 'framer-motion';
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 120 } }
    };

    return (
        <div className="min-h-screen bg-transparent text-black p-10 relative custom-scrollbar overflow-y-auto overflow-x-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/20 via-white to-gray-50/30 -z-10" />
            <AnimatePresence>
                {isStartingTrade && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-xl px-4"
                    >
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-blue-600 font-black uppercase tracking-[0.2em] animate-pulse drop-shadow-sm">Digitalizing Dorm Nexus...</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-6xl mx-auto space-y-32 py-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-10"
                >
                    <div className="space-y-4">
                        <motion.h1
                            animate={{ scale: [0.98, 1, 0.98] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-8xl md:text-9xl font-black uppercase tracking-tighter text-black leading-none italic"
                        >
                            SURVIVAL <span className="text-blue-600 not-italic">HUB</span>
                        </motion.h1>
                        <p className="text-gray-400 text-xl font-black uppercase tracking-[0.3em] bg-gray-50 inline-block px-10 py-3 rounded-full border border-gray-100">Official Campus Onboarding 1.0</p>
                    </div>

                    {!isPrepMode && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsPrepMode(true)}
                                className="mt-4 bg-black text-white px-16 py-6 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:shadow-blue-500/30 text-lg flex items-center justify-center gap-4 mx-auto group"
                            >
                                🚀 PREPARE FOR HOSTEL
                                <span className="group-hover:translate-x-2 transition-transform">→</span>
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>

                <AnimatePresence mode="wait">
                    {isPrepMode ? (
                        <motion.div
                            key="prep-mode"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="space-y-16"
                        >
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4">
                                <motion.button
                                    whileHover={{ x: -10 }}
                                    onClick={() => { setIsPrepMode(false); setSelectedCategory(null); }}
                                    className="flex items-center gap-3 text-gray-400 hover:text-black transition font-black uppercase tracking-widest text-xs py-3 px-6 rounded-2xl hover:bg-gray-100 border border-transparent hover:border-gray-200"
                                >
                                    <ArrowLeft size={18} /> Exit Wizard
                                </motion.button>
                                <h2 className="text-4xl font-black uppercase tracking-tighter">SELECT EQUIPMENT SECTOR</h2>
                            </div>

                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                                className="flex flex-wrap gap-6 justify-center"
                            >
                                {categories.map((cat) => (
                                    <motion.button
                                        key={cat.id}
                                        variants={itemVariants}
                                        whileHover={{ scale: 1.05, y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`flex items-center gap-6 px-10 py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[10px] transition-all duration-500 border ${selectedCategory === cat.id ? 'bg-black border-black text-white shadow-2xl shadow-black/20' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-600 hover:text-black hover:bg-blue-50/10'}`}
                                    >
                                        <span className={selectedCategory === cat.id ? 'text-blue-400' : 'text-blue-600'}>{cat.icon}</span>
                                        {cat.name}
                                    </motion.button>
                                ))}
                            </motion.div>

                            <AnimatePresence>
                                {selectedCategory && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-20 space-y-16 bg-gray-50/50 p-16 rounded-[4rem] border border-gray-100"
                                    >
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                            <h3 className="text-3xl font-black uppercase tracking-tighter text-black flex flex-wrap items-center gap-6">
                                                AVAILABLE {selectedCategory} UNIT
                                                <span className="text-[10px] bg-blue-600 text-white px-6 py-2 rounded-full font-black tracking-widest uppercase shadow-lg shadow-blue-500/20">Active Stock</span>
                                            </h3>
                                        </div>

                                        {loading ? (
                                            <div className="text-center py-24">
                                                <div className="inline-block animate-pulse text-blue-600 font-black uppercase tracking-[0.4em] text-sm">Synchronizing Dorm Data...</div>
                                            </div>
                                        ) : items.length > 0 ? (
                                            <motion.div
                                                variants={containerVariants}
                                                initial="hidden"
                                                animate="show"
                                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
                                            >
                                                {items.map((item) => (
                                                    <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                initial={{ scale: 0.95, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                className="text-center py-32 bg-white rounded-[4rem] border border-dashed border-gray-200 shadow-inner"
                                            >
                                                <p className="text-gray-300 text-3xl font-black uppercase tracking-tighter">Sector Depleted</p>
                                                <p className="text-gray-400 font-bold mt-4 uppercase tracking-[0.2em] text-[10px]">No {selectedCategory} detected in current quadrant.</p>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => navigate('/create-listing')}
                                                    className="mt-12 bg-black text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all text-sm shadow-xl"
                                                >
                                                    + INITIATE LISTING
                                                </motion.button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="guides"
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-3 gap-12"
                        >
                            {[
                                { title: "How to Barter?", desc: "Upload your item, chat with the seller, and propose a trade. Simple.", icon: <Zap className="text-yellow-400" /> },
                                { title: "Safety First", desc: "Always meet in public campus spots. Our supervisors will be there to verify.", icon: <ShieldAlert className="text-red-400" /> },
                                { title: "Trust Score", desc: "Keep it real. Better ratings mean a higher trust score and better deals.", icon: <BookOpen className="text-cyan-400" /> }
                            ].map((g, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    whileHover={{ y: -15 }}
                                    className="bg-white border border-gray-100 p-12 rounded-[4rem] group hover:border-blue-600 transition-all duration-700 hover:shadow-[0_30px_60px_rgba(37,99,235,0.08)]"
                                >
                                    <div className="mb-10 bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500 shadow-inner">
                                        <div className="group-hover:text-white group-hover:scale-125 transition-all duration-500 text-blue-600">
                                            {g.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 text-black group-hover:text-blue-600 transition-colors">
                                        {g.title}
                                    </h3>
                                    <p className="text-gray-400 font-bold leading-relaxed">{g.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* FAQ Section with Visual Polish */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-black text-white p-20 rounded-[5rem] shadow-3xl overflow-hidden relative group"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                        className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/10 rounded-[4rem] border border-white/5"
                    />
                    <h2 className="text-6xl font-black uppercase tracking-tighter mb-16 flex items-center gap-8 relative z-10">
                        <Coffee className="text-blue-400" size={56} />
                        CAMPUS <span className="text-blue-500 italic">INTEL</span>
                    </h2>
                    <div className="space-y-10 relative z-10">
                        {[
                            { q: "WHAT IF I DON'T HAVE BARTER ASSETS?", a: "No worries! Many students also 'lend' items for a short period or sell them for a small price. Check the 'LEND' category for zero-cost temporary acquisitions." },
                            { q: "WHERE ARE THE EXTRACTION POINTS?", a: "Usually at the Student Activity Center or the Library Plaza. Your assigned supervisor will confirm the exact coordinates in the private trade terminal." }
                        ].map((faq, i) => (
                            <motion.details
                                key={i}
                                whileHover={{ x: 10 }}
                                className="group border-b border-white/10 pb-10 cursor-pointer"
                            >
                                <summary className="text-2xl md:text-3xl font-black uppercase tracking-tight list-none flex justify-between items-center group-open:text-blue-400 transition-all duration-500">
                                    {faq.q}
                                    <span className="bg-white/5 text-gray-400 group-open:rotate-45 group-open:bg-blue-600 group-open:text-white transition-all w-12 h-12 rounded-full flex items-center justify-center font-bold">
                                        +
                                    </span>
                                </summary>
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-gray-400 font-bold mt-8 leading-relaxed max-w-4xl text-lg"
                                >
                                    {faq.a}
                                </motion.p>
                            </motion.details>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default FreshersSection;
