import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';

interface ItemProps {
    item: any;
    onClick: () => void;
}

const ItemCard: React.FC<ItemProps> = ({ item, onClick }) => {
    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring' as const,
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover="hover"
            whileTap={{ scale: 0.98 }}
            className="bg-white border border-gray-100 rounded-[3rem] overflow-hidden cursor-pointer group shadow-sm hover:shadow-layered transition-all duration-700"
            onClick={onClick}
        >
            <div className="h-64 bg-gray-50 relative overflow-hidden">
                {item.images.length > 0 ? (
                    <motion.img
                        variants={{
                            hover: { scale: 1.1, filter: 'grayscale(0%)' }
                        }}
                        initial={{ filter: 'grayscale(40%)' }}
                        src={`http://localhost:5001${item.images[0]}`}
                        alt={item.title}
                        className="w-full h-full object-cover transition-all duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-200 font-black uppercase tracking-widest text-xs">No Visuals</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-6 right-6 flex flex-col gap-2">
                    <motion.div
                        variants={{
                            hover: { x: 0, opacity: 1 },
                            initial: { x: 20, opacity: 0 }
                        }}
                        className="bg-blue-600 px-4 py-2 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg"
                    >
                        {item.type}
                    </motion.div>
                    {item.allowHybrid && (
                        <motion.div
                            variants={{
                                hover: { x: 0, opacity: 1 },
                                initial: { x: 20, opacity: 0 }
                            }}
                            className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest shadow-lg border border-blue-100"
                        >
                            Hybrid
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="p-10 space-y-6">
                <div>
                    <h3 className="text-2xl font-black text-black leading-[0.9] truncate tracking-tighter uppercase">{item.title}</h3>
                    <motion.div
                        variants={{
                            hover: { y: 0, opacity: 1 },
                            initial: { y: 10, opacity: 0.6 }
                        }}
                        className="flex items-center text-[10px] font-black text-gray-400 mt-4 uppercase tracking-[0.2em]"
                    >
                        <span className="truncate">{item.category}</span>
                        {item.seller.trustScore > 90 && (
                            <div className="flex items-center ml-3 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md">
                                <BadgeCheck className="w-3 h-3 mr-1" />
                                <span>TOP TIER</span>
                            </div>
                        )}
                    </motion.div>
                </div>

                <div className="flex justify-between items-end pt-6 border-t border-gray-50 group-hover:border-blue-50 transition-colors">
                    <div className="space-y-1">
                        <span className="block text-[8px] font-black text-gray-300 uppercase tracking-widest">Market Value</span>
                        <span className="text-3xl font-black text-black group-hover:text-blue-600 transition-colors">
                            {item.price ? `₹${item.price}` : 'BARTER'}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="block text-[8px] font-black text-gray-300 uppercase tracking-widest mb-1">Inhabitant</span>
                        <div className="flex items-center gap-2 group-hover:scale-110 transition-transform origin-right">
                            <span className="text-[10px] font-black text-black uppercase tracking-widest italic">
                                @{item.seller.profile?.fullName?.split(' ')[0] || 'User'}
                            </span>
                            <div className="w-5 h-5 rounded-full bg-gray-100 border border-white flex items-center justify-center text-[8px] font-black text-gray-400">
                                {(item.seller.email?.[0] || 'U').toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ItemCard;
