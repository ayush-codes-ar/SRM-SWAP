import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

interface ItemProps {
    item: any;
    onClick: () => void;
}

const ItemCard: React.FC<ItemProps> = ({ item, onClick }) => {
    return (
        <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-cyan-500/20 transition-all"
            onClick={onClick}
        >
            <div className="h-48 bg-black/50 relative overflow-hidden">
                {item.images.length > 0 ? (
                    <img src={`http://localhost:5000${item.images[0]}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">No Image</div>
                )}
                <div className="absolute top-2 right-2 flex gap-1">
                    {item.allowHybrid && (
                        <div className="bg-amber-500/80 backdrop-blur px-2 py-1 rounded text-[10px] font-black text-black uppercase border border-amber-400/50 shadow-lg shadow-amber-500/20">
                            Hybrid
                        </div>
                    )}
                    <div className="bg-black/60 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase border border-white/10">
                        {item.type}
                    </div>
                </div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-bold text-white truncate">{item.title}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-1 mb-2">
                    <span className="truncate">{item.category}</span>
                    {item.seller.trustScore > 90 && <BadgeCheck className="w-4 h-4 text-cyan-400 ml-1" />}
                </div>
                <div className="flex justify-between items-center mt-3">
                    <span className="text-emerald-400 font-bold">
                        {item.price ? `₹${item.price}` : 'Barter'}
                    </span>
                    <div className="flex items-center text-xs text-gray-500">
                        By {item.seller.profile?.fullName?.split(' ')[0]}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard;
