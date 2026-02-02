import { useEffect, useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import ItemCard from '../../components/ItemCard';
import { useNavigate } from 'react-router-dom';
import { useTradeStore } from '../../store/useTradeStore';
import { AnimatePresence, motion } from 'framer-motion';
import Skeleton from '../../components/ui/Skeleton';

const MarketplacePage = () => {
    const { items, fetchItems, loading } = useItemStore();
    const { startTrade } = useTradeStore();
    const navigate = useNavigate();
    const [isStartingTrade, setIsStartingTrade] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                await fetchItems({ marketplace: 'NORMAL' });
            } catch (e) {
                console.error("Failed to fetch items", e);
                setError("Could not load marketplace. Please try again.");
            }
        };
        load();
    }, []); // Fixed: Empty dependency array to prevent infinite loop

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

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-black p-12 relative overflow-hidden">


            <AnimatePresence>
                {isStartingTrade && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/40 backdrop-blur-2xl"
                    >
                        <div className="flex flex-col items-center gap-8">
                            <div className="relative">
                                <div className="w-24 h-24 border-2 border-blue-600/20 rounded-full"></div>
                                <div className="absolute inset-0 w-24 h-24 border-t-2 border-blue-600 rounded-full animate-spin"></div>
                            </div>
                            <p className="text-blue-600 font-black uppercase tracking-[0.4em] text-xs animate-pulse">Initializing Nexus Terminal</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="mb-24 space-y-6 relative z-10">
                <div className="flex items-center gap-6">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        className="h-1 w-20 bg-blue-600 origin-left rounded-full"
                    />
                    <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600"
                    >
                        Sector 01: Assets
                    </motion.span>
                </div>
                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="text-8xl md:text-9xl font-black uppercase tracking-[ -0.05em] italic leading-[0.8]"
                >
                    THE <br /> <span className="text-blue-600 not-italic">MARKET</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] ml-2"
                >
                    Acquisition potential for the SRM University community.
                </motion.p>
            </header>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-24 border-2 border-red-200 rounded-[5rem] bg-red-50/30"
                >
                    <p className="text-red-600 font-black uppercase tracking-[0.3em] text-xs mb-4">System Malfunction</p>
                    <p className="text-red-400 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-full font-bold uppercase text-xs hover:bg-red-700 transition-colors"
                    >
                        Reboot Terminal
                    </button>
                </motion.div>
            )}

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 relative z-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden h-[400px] flex flex-col">
                            <Skeleton className="h-64 w-full rounded-none" />
                            <div className="p-6 space-y-4 flex-1">
                                <Skeleton className="h-6 w-3/4" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 relative z-10"
                >
                    {items && items.map((item) => (
                        <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
                    ))}
                </motion.div>
            )}

            {!loading && !error && items && items.length === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-48 border-2 border-dashed border-gray-100 rounded-[5rem] bg-gray-50/30"
                >
                    <p className="text-gray-300 font-black uppercase tracking-[0.3em] text-xs">No assets detected in this quadrant.</p>
                </motion.div>
            )}
        </div>
    );
};

export default MarketplacePage;
