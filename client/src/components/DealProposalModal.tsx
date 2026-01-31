import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, DollarSign, Package, Handshake, ShieldCheck } from 'lucide-react';

interface DealProposalModalProps {
    onClose: () => void;
    onPropose: (terms: { money: number, barter: string, commitment: string }) => void;
}

const DealProposalModal: React.FC<DealProposalModalProps> = ({ onClose, onPropose }) => {
    const [money, setMoney] = useState<string>('0');
    const [barter, setBarter] = useState<string>('');
    const [commitment, setCommitment] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onPropose({
            money: parseFloat(money) || 0,
            barter,
            commitment
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="w-full max-w-lg bg-gray-900 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-8 space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyan-500 rounded-2xl flex items-center justify-center text-black">
                                <Handshake size={24} />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Seal the Deal</h2>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Money Section */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                                <DollarSign size={14} /> Final Price (INR)
                            </label>
                            <input
                                type="number"
                                placeholder="0"
                                value={money}
                                onChange={(e) => setMoney(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors text-lg font-bold"
                            />
                        </div>

                        {/* Barter Section */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                                <Package size={14} /> Barter Items
                            </label>
                            <textarea
                                placeholder="Any physical items included?"
                                value={barter}
                                onChange={(e) => setBarter(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                            />
                        </div>

                        {/* Commitment Section */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-500">
                                <ShieldCheck size={14} /> Extra Commitments
                            </label>
                            <textarea
                                placeholder="e.g. 'I will drop it off at your hostel tomorrow'"
                                value={commitment}
                                onChange={(e) => setCommitment(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-cyan-500 transition-colors h-24 resize-none"
                            />
                        </div>

                        <div className="pt-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-3xl font-black uppercase tracking-widest text-black shadow-xl shadow-cyan-500/20"
                            >
                                Send Final Proposal
                            </motion.button>
                            <p className="text-[10px] text-center text-gray-600 mt-4 uppercase tracking-widest font-bold">
                                Once sent, the buyer must accept for the deal to close.
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default DealProposalModal;
