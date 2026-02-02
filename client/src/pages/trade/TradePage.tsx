import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTradeStore } from '../../store/useTradeStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Send, MapPin, Calendar, ArrowLeft, Clock, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import RatingModal from '../../components/RatingModal';
import DealProposalModal from '../../components/DealProposalModal';
import Skeleton from '../../components/ui/Skeleton';

const TradePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activeTrade, fetchTrade, sendMessage, proposeDeal, acceptDeal, connectSocket, disconnectSocket, finishTrade, reportIssue } = useTradeStore();
    const { user } = useAuthStore();
    const [message, setMessage] = useState('');
    const [showRating, setShowRating] = useState(false);
    const [showDealModal, setShowDealModal] = useState(false);
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [issueDescription, setIssueDescription] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        connectSocket();
        if (id) fetchTrade(id);
        return () => disconnectSocket();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeTrade?.messages, activeTrade?.status]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && id && user) {
            sendMessage(id, user.id, message);
            setMessage('');
        }
    };

    const handlePropose = async (terms: { money: number, barter: string, commitment: string }) => {
        if (!id) return;
        try {
            await proposeDeal(id, terms);
            setShowDealModal(false);
        } catch (e) {
            alert('Failed to propose deal');
        }
    };

    const handleAccept = async () => {
        if (!id) return;
        try {
            await acceptDeal(id);
            alert('Deal closed! Item is now off the market.');
        } catch (e) {
            alert('Failed to accept deal');
        }
    };

    const handleDecline = async () => {
        if (!id) return;
        if (confirm('Decline this proposal and return to negotiation?')) {
            try {
                await useTradeStore.getState().declineDeal(id);
            } catch (e) {
                alert('Failed to decline deal');
            }
        }
    };

    const handleFinish = async () => {
        if (!id) return;
        try {
            await finishTrade(id);
            alert('Your confirmation has been recorded!');
        } catch (e) {
            alert('Failed to finish trade');
        }
    };

    const handleReportIssue = async () => {
        if (!id || !issueDescription.trim()) return;
        try {
            await reportIssue(id, issueDescription);
            setShowIssueModal(false);
            setIssueDescription('');
            alert('Issue reported to supervisor.');
        } catch (e) {
            alert('Failed to report issue');
        }
    };

    if (!activeTrade) return (
        <div className="h-[calc(100vh-88px)] bg-gray-50 flex flex-col lg:flex-row overflow-hidden">
            <div className="w-full lg:w-1/3 border-r border-gray-100 bg-gray-50/50 p-6 space-y-8">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="aspect-square rounded-[3rem]" />
                <div className="space-y-4">
                    <Skeleton className="h-24 w-full rounded-3xl" />
                    <Skeleton className="h-16 w-full rounded-3xl" />
                </div>
            </div>
            <div className="flex-1 flex flex-col bg-white">
                <div className="px-8 py-5 border-b border-gray-100 flex justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-8 w-24 rounded-full" />
                </div>
                <div className="flex-1 p-8 space-y-6">
                    <Skeleton className="h-20 w-3/4 rounded-tr-none self-start" />
                    <Skeleton className="h-12 w-1/2 rounded-tl-none self-end ml-auto" />
                    <Skeleton className="h-24 w-2/3 rounded-tr-none self-start" />
                </div>
            </div>
        </div>
    );

    const isSeller = activeTrade.listing.sellerId === user?.id;
    const isBuyer = activeTrade.buyerId === user?.id;
    const isSupervisor = user?.role === 'MEMBER' || user?.role === 'ADMIN';
    const partner = isSeller ? activeTrade.buyer : activeTrade.listing.seller;
    const isUserFinished = isSeller ? activeTrade.sellerFinished : activeTrade.buyerFinished;

    return (
        <div className="h-[calc(100vh-88px)] bg-transparent text-black flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Item + Seller Details */}
            <div className="w-full lg:w-1/3 border-r border-gray-100 bg-gray-50/50 overflow-y-auto custom-scrollbar">
                <div className="p-6 space-y-8">
                    {/* Back Button */}
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition" />
                        <span className="text-xs font-bold uppercase tracking-wider">Back to Market</span>
                    </button>

                    {/* Item Image */}
                    <div className="aspect-square rounded-[3rem] overflow-hidden border border-gray-100 relative shadow-2xl">
                        {activeTrade.listing.images.length > 0 ? (
                            <img
                                src={`${activeTrade.listing.images[0]}`}
                                alt={activeTrade.listing.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-black uppercase tracking-widest text-xs">No Visuals</div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">{activeTrade.listing.title}</h1>
                            <p className="text-blue-400 font-bold text-lg mt-1">{activeTrade.listing.price ? `₹${activeTrade.listing.price}` : 'Trade Proposal'}</p>
                        </div>
                    </div>

                    {/* Participants Card (Supervisor Version) */}
                    {isSupervisor ? (
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4 shadow-sm">
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Participants</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs">B</div>
                                <span className="text-sm font-bold text-black">{activeTrade.buyer.profile.fullName}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-white font-black text-xs">S</div>
                                <span className="text-sm font-bold text-black">{activeTrade.listing.seller.profile.fullName}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-100 rounded-3xl p-6 relative shadow-sm">
                            <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Trading Partner</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl">
                                    {partner?.profile?.fullName?.[0]}
                                </div>
                                <div>
                                    <p className="text-xl font-bold text-black">{partner?.profile?.fullName}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Interaction States */}
                    <div className="space-y-4">
                        {activeTrade.status === 'ACCEPTED' && (
                            <div className="bg-cyan-500/10 border border-cyan-500/20 p-6 rounded-3xl animate-pulse text-cyan-400 font-black uppercase text-xs">
                                <Clock className="inline mr-2" size={16} /> Awaiting Supervisor Scheduling...
                            </div>
                        )}

                        {activeTrade.status === 'SCHEDULED' && (
                            <div className="space-y-4">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-3">
                                    <p className="text-[10px] text-gray-500 font-black uppercase">Meeting Set</p>
                                    <div className="flex items-center gap-2 text-sm font-bold"><MapPin size={14} className="text-cyan-400" /> {activeTrade.location}</div>
                                    <div className="flex items-center gap-2 text-sm font-bold"><Calendar size={14} className="text-purple-400" /> {new Date(activeTrade.scheduledAt || "").toLocaleString()}</div>
                                    {activeTrade.supervisorNote && <p className="text-xs text-gray-400 italic mt-2 border-t border-white/5 pt-2">"{activeTrade.supervisorNote}"</p>}
                                </div>

                                {activeTrade.supervisorConfirmed ? (
                                    <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/30 p-8 rounded-[2rem] space-y-4">
                                        <h3 className="text-lg font-black uppercase tracking-tighter">Verified by Supervisor</h3>
                                        <button onClick={handleFinish} disabled={isUserFinished} className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all ${isUserFinished ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/20' : 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'}`}>
                                            {isUserFinished ? 'Awaiting Partner...' : 'Confirm Finish'}
                                        </button>
                                        {!isUserFinished && (
                                            <button onClick={() => setShowIssueModal(true)} className="w-full text-red-500 font-black uppercase text-[10px] tracking-widest hover:underline">Raise Dispute</button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-emerald-500/10 rounded-3xl text-center border border-emerald-500/20">
                                        <Clock className="mx-auto mb-2 text-emerald-400 animate-spin-slow" />
                                        <p className="text-[10px] font-black uppercase text-gray-500">Waiting for Physical Verification</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTrade.status === 'UNDER_REVIEW' && (
                            <div className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-[2rem] space-y-4">
                                <div className="flex items-center gap-2 text-red-500">
                                    <ShieldAlert size={20} />
                                    <span className="font-black uppercase tracking-tighter">Dispute Active</span>
                                </div>
                                <button onClick={handleFinish} className="w-full bg-emerald-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Mark as Resolved</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Chat Hub */}
            <div className="flex-1 flex flex-col bg-white relative">
                <header className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm">
                    <h2 className="text-lg font-black uppercase tracking-tighter text-black">Swap Chat</h2>
                    <div className="flex gap-2">
                        {isSeller && activeTrade.status === 'NEGOTIATING' && (
                            <button onClick={() => setShowDealModal(true)} className="bg-black text-white hover:bg-blue-600 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors shadow-lg">Close Deal</button>
                        )}
                        {activeTrade.status === 'COMPLETED' && isBuyer && (
                            <button onClick={() => setShowRating(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">Rate Partner</button>
                        )}
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {activeTrade.status === 'PROPOSED' && (
                        <div className="bg-white border-2 border-blue-600 p-8 rounded-[3rem] space-y-6 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-blue-600 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Decision Pending</div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Final Proposal</h3>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-gray-400 uppercase font-black text-[10px] tracking-widest">Cash</p>
                                    <p className="text-2xl font-black text-blue-600">₹{activeTrade.moneyProposal}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-gray-400 uppercase font-black text-[10px] tracking-widest">Barter Item</p>
                                    <p className="text-lg font-bold text-black">{activeTrade.barterProposal || 'NONE'}</p>
                                </div>
                            </div>
                            {activeTrade.commitmentProposal && (
                                <div className="mt-4 p-6 bg-gray-50 rounded-2xl border border-gray-100 italic">
                                    <p className="text-gray-400 uppercase font-black text-[8px] tracking-widest mb-2">Extra Commitment</p>
                                    <p className="font-bold text-gray-700">"{activeTrade.commitmentProposal}"</p>
                                </div>
                            )}
                            {isBuyer && (
                                <div className="flex gap-4 pt-4">
                                    <button onClick={handleDecline} className="flex-1 bg-gray-100 text-gray-400 py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 hover:text-red-500 transition-all border border-transparent">Decline</button>
                                    <button onClick={handleAccept} className="flex-[2] bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-500/20">Accept & Lock Deal</button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTrade.messages.map((msg, idx) => {
                        const isMe = msg.senderId === user?.id;
                        return (
                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">
                                    {isMe ? 'YOU' : (msg.sender?.profile?.fullName || 'PARTNER').split(' ')[0]}
                                </span>
                                <div className={`max-w-[75%] rounded-[2rem] px-6 py-4 shadow-sm ${isMe ? 'bg-black text-white rounded-tr-none' : 'bg-gray-100 text-black rounded-tl-none'}`}>
                                    <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-8 flex gap-4 bg-white border-t border-gray-100">
                    <input className="flex-1 bg-gray-50 border border-transparent rounded-2xl px-6 py-5 text-black outline-none focus:bg-white focus:border-blue-600 transition-all font-bold placeholder:text-gray-300" placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button type="submit" className="bg-blue-600 p-5 rounded-2xl text-white shadow-lg shadow-blue-500/20 transition-transform active:scale-90"><Send size={20} /></button>
                </form>
            </div>

            <AnimatePresence>
                {showIssueModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-white/10 p-10 rounded-[2rem] w-full max-w-xl space-y-8 shadow-2xl">
                            <h3 className="text-3xl font-black uppercase tracking-tighter text-red-500 text-center">Open Dispute</h3>
                            <textarea value={issueDescription} onChange={(e) => setIssueDescription(e.target.value)} placeholder="Explain the issue..." className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white h-48 focus:border-red-500 outline-none" />
                            <div className="flex gap-4">
                                <button onClick={() => setShowIssueModal(false)} className="flex-1 text-gray-400 font-black uppercase text-xs">Cancel</button>
                                <button onClick={handleReportIssue} className="flex-2 bg-red-500 text-white py-4 px-8 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/20">Submit</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {showRating && (
                <RatingModal
                    tradeId={activeTrade.id}
                    revieweeId={activeTrade.listing.sellerId}
                    onClose={() => setShowRating(false)}
                    onSuccess={() => alert('Review Sent!')}
                />
            ) as any}

            <AnimatePresence>
                {showDealModal && (
                    <DealProposalModal
                        onClose={() => setShowDealModal(false)}
                        onPropose={handlePropose}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default TradePage;
