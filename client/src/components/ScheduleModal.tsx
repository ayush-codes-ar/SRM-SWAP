import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, MessageSquare } from 'lucide-react';

interface ScheduleModalProps {
    trade: any;
    onClose: () => void;
    onSchedule: (data: { location: string, scheduledAt: string, supervisorNote: string }) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ trade, onClose, onSchedule }) => {
    const [location, setLocation] = useState('Student Activity Center (SAC)');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSchedule({
            location,
            scheduledAt: `${date}T${time}`,
            supervisorNote: note
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-gray-900 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
                <div className="p-8 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-2">
                            <Calendar className="text-cyan-400" /> Schedule Trade
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Deal Summary for Inspector */}
                    <div className="bg-black/50 border border-white/10 rounded-3xl p-6 space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-cyan-500">Deal Inspection Summary</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Money</p>
                                <p className="text-lg font-bold">₹{trade.moneyProposal || 0}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold">Item</p>
                                <p className="text-lg font-bold truncate">{trade.listing.title}</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] text-gray-500 uppercase font-bold">Barter & Commitments</p>
                            <p className="text-xs text-gray-300 italic">"{trade.barterProposal || 'No physical items'} | {trade.commitmentProposal || 'No extra terms'}"</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-4 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-cyan-500 outline-none"
                                        placeholder="Meeting point..."
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500">Date & Time</label>
                                <div className="flex gap-2">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none text-xs"
                                        required
                                    />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="flex-1 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:border-cyan-500 outline-none text-xs"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-gray-500">Note for Participants</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 pl-12 text-white focus:border-cyan-500 outline-none h-24 resize-none"
                                    placeholder="e.g. Please bring your student ID and meet near the fountain."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 py-5 rounded-3xl font-black uppercase tracking-widest text-black shadow-xl shadow-cyan-500/20"
                        >
                            Approve & Schedule
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ScheduleModal;
