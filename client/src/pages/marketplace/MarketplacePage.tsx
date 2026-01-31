import { useEffect, useState } from 'react';
import { useItemStore } from '../../store/useItemStore';
import ItemCard from '../../components/ItemCard';
import { useNavigate } from 'react-router-dom';
import { useTradeStore } from '../../store/useTradeStore';

const MarketplacePage = () => {
    const { items, fetchItems, loading } = useItemStore();
    const { startTrade } = useTradeStore();
    const navigate = useNavigate();
    const [isStartingTrade, setIsStartingTrade] = useState(false);

    useEffect(() => {
        fetchItems({ marketplace: 'NORMAL' });
    }, [fetchItems]);

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

    return (
        <div className="min-h-screen bg-black text-white p-6 relative">
            {isStartingTrade && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-cyan-400 font-bold uppercase tracking-widest animate-pulse">Initiating Trade Hub...</p>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="text-center text-gray-500 mt-20">Loading fresh loot...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pointer-events-auto">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} onClick={() => handleItemClick(item.id)} />
                    ))}
                </div>
            )}

            {items.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-20">
                    No items found. Be the first to list something!
                </div>
            )}
        </div>
    );
};

export default MarketplacePage;
