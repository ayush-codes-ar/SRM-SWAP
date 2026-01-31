import { useEffect, useState } from 'react';
import api from '../../services/api';
import { AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, Clock, ShieldAlert, BadgeCheck, User, MessageSquare, AlertCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ScheduleModal from '../../components/ScheduleModal';
import RatingModal from '../../components/RatingModal';

type DashboardView = 'PENDING_DEALS' | 'APPROVED_DEALS' | 'COMPLETED_DEALS' | 'NEW_ISSUES' | 'PENDING_ISSUES' | 'SOLVED_ISSUES' | 'PROFILE';

const MemberDashboard = () => {
    const [view, setView] = useState<DashboardView>('PENDING_DEALS');
    const [trades, setTrades] = useState<any[]>([]);
    const [issues, setIssues] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTrade, setSelectedTrade] = useState<any>(null);
    const [showSchedule, setShowSchedule] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const { user } = useAuthStore();

    const fetchAllData = async () => {
        setLoading(true);
        try {
            if (view.includes('DEAL')) {
                let status = view === 'PENDING_DEALS' ? 'ACCEPTED' : view === 'APPROVED_DEALS' ? 'SCHEDULED' : 'COMPLETED';
                const res = await api.get(`/trades/pending-supervision?status=${status}`);
                setTrades(res.data);
            } else if (view.includes('ISSUE')) {
                let status = view === 'NEW_ISSUES' ? 'OPEN' : view === 'PENDING_ISSUES' ? 'PENDING' : 'RESOLVED';
                const res = await api.get(`/trades/issues/${status}`);
                setIssues(res.data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, [view]);

    const handleMarkDone = async (id: string) => {
        await api.post(`/trades/${id}/mark-done`);
        alert('Marked as Physically Done!');
        fetchAllData();
    };

    const handleClaimIssue = async (id: string) => {
        await api.post(`/trades/issues/${id}/claim`);
        setView('PENDING_ISSUES');
    };

    const handleFinalizeIssue = async (id: string) => {
        await api.post(`/trades/issues/${id}/finalize`);
        alert('Issue Resolved!');
        fetchAllData();
    };

    const NavButton = ({ target, label, icon: Icon }: { target: DashboardView, label: string, icon: any }) => (
        <button
            onClick={() => setView(target)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all ${view === target ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            <Icon size={20} />
            <span className="text-xs font-black uppercase tracking-widest">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <aside className="w-80 border-r border-white/10 p-6 flex flex-col gap-2 sticky top-0 h-screen">
                <div className="mb-10 px-6">
                    <h2 className="text-2xl font-black italic tracking-tighter text-cyan-400">SRM SWAP</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Supervisor Terminal</p>
                </div>

                <div className="space-y-1">
                    <p className="px-6 text-[10px] font-black uppercase text-gray-600 mb-2">Market Management</p>
                    <NavButton target="PENDING_DEALS" label="Pending Deals" icon={Clock} />
                    <NavButton target="APPROVED_DEALS" label="Approved Deals" icon={BadgeCheck} />
                    <NavButton target="COMPLETED_DEALS" label="Closed Archive" icon={CheckCircle} />
                </div>

                <div className="mt-8 space-y-1">
                    <p className="px-6 text-[10px] font-black uppercase text-gray-600 mb-2">Conflict Resolution</p>
                    <NavButton target="NEW_ISSUES" label="New Issues" icon={ShieldAlert} />
                    <NavButton target="PENDING_ISSUES" label="Pending Resolution" icon={MessageSquare} />
                    <NavButton target="SOLVED_ISSUES" label="Solved List" icon={CheckCircle} />
                </div>

                <div className="mt-auto space-y-1">
                    <NavButton target="PROFILE" label="My Profile" icon={User} />
                    <button
                        onClick={() => { useAuthStore.getState().logout(); window.location.href = '/login'; }}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest font-black text-xs"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-12 overflow-y-auto">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter text-white">{view.replace('_', ' ')}</h1>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Active session: {user?.email}</p>
                    </div>
                </header>

                {loading ? (
                    <div className="animate-pulse text-cyan-500 font-bold uppercase tracking-widest">Syncing with Node...</div>
                ) : (
                    <div className="grid gap-6">
                        {view.includes('DEAL') && trades.map(trade => (
                            <div key={trade.id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] flex justify-between items-center group hover:border-cyan-500/20 transition-all">
                                <div className="space-y-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter">{trade.listing.title}</h3>
                                    <div className="flex gap-4 text-xs font-bold text-gray-400 uppercase">
                                        <span>B: {trade.buyer.profile.fullName}</span>
                                        <span className="text-gray-600">|</span>
                                        <span>S: {trade.listing.seller.profile.fullName}</span>
                                    </div>
                                    <div className="flex gap-6 mt-4 p-4 bg-black/40 rounded-2xl border border-white/5 text-xs">
                                        <div className="flex items-center gap-2"><MapPin size={14} className="text-cyan-400" /> {trade.location || 'TBD'}</div>
                                        <div className="flex items-center gap-2 border-l border-white/10 pl-6"><Calendar size={14} className="text-purple-400" /> {trade.scheduledAt ? new Date(trade.scheduledAt).toLocaleString() : 'TBD'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {view === 'PENDING_DEALS' && (
                                        <button onClick={() => { setSelectedTrade(trade); setShowSchedule(true); }} className="bg-cyan-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Verify & Schedule</button>
                                    )}
                                    {view === 'APPROVED_DEALS' && (
                                        <>
                                            {trade.supervisorConfirmed ? (
                                                <button disabled className="bg-white/10 text-gray-500 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed border border-white/5 flex items-center gap-2">
                                                    <Clock size={14} className="animate-pulse" />
                                                    Waiting for User Approval
                                                </button>
                                            ) : (
                                                <button onClick={() => handleMarkDone(trade.id)} className="bg-emerald-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                                                    🤝 Deal Done
                                                </button>
                                            )}
                                        </>
                                    )}
                                    {view === 'COMPLETED_DEALS' && (
                                        <button onClick={() => { setSelectedTrade(trade); setShowRating(true); }} className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
                                            ⭐ Rate Seller
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {view.includes('ISSUE') && issues.map(issue => (
                            <div key={issue.id} className="bg-white/5 border border-white/10 p-8 rounded-[2rem] space-y-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                                            <AlertCircle className="text-red-500" /> {issue.trade.listing.title} Dispute
                                        </h3>
                                        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Reported by: {issue.reporter.profile.fullName}</p>
                                    </div>
                                    <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-black uppercase border border-red-500/20">{issue.status}</span>
                                </div>
                                <p className="text-gray-400 italic font-medium">"{issue.description}"</p>
                                <div className="flex gap-4">
                                    {view === 'NEW_ISSUES' && (
                                        <button onClick={() => handleClaimIssue(issue.id)} className="bg-red-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">Take Issue</button>
                                    )}
                                    {view === 'PENDING_ISSUES' && (
                                        <div className="w-full space-y-4">
                                            <div className="flex gap-2">
                                                <div className={`p-2 rounded flex-1 text-center text-[10px] font-black ${issue.trade.buyerFinished ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-600'}`}>Buyer Resolved</div>
                                                <div className={`p-2 rounded flex-1 text-center text-[10px] font-black ${issue.trade.sellerFinished ? 'bg-emerald-500 text-black' : 'bg-white/5 text-gray-600'}`}>Seller Resolved</div>
                                            </div>
                                            <div className="flex gap-3">
                                                <button onClick={() => window.location.href = `/trade/${issue.tradeId}`} className="flex-1 bg-white/10 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/20 transition">Join Chat</button>
                                                <button onClick={() => handleFinalizeIssue(issue.id)} className="flex-[2] bg-cyan-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-cyan-500/20">Finalize Resolution</button>
                                            </div>
                                        </div>
                                    )}
                                    {view === 'SOLVED_ISSUES' && (
                                        <button onClick={() => { setSelectedTrade(issue.trade); setShowRating(true); }} className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4">
                                            ⭐ Rate Seller
                                        </button>
                                    )}
                                    {view === 'SOLVED_ISSUES' && (
                                        <button onClick={() => { setSelectedTrade(issue.trade); setShowRating(true); }} className="bg-yellow-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20">
                                            ⭐ Rate Seller
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {view === 'PROFILE' && (
                            <div className="bg-white/5 border border-white/10 p-12 rounded-[3rem] text-center space-y-6">
                                <div className="w-24 h-24 bg-cyan-500 rounded-full mx-auto flex items-center justify-center text-4xl font-black text-black">
                                    {user?.email?.[0] || 'A'}
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black uppercase tracking-tighter">{user?.email}</h2>
                                    <p className="text-cyan-400 font-bold uppercase text-[10px] tracking-widest">SRM Swap Official Member</p>
                                </div>
                                <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-6 rounded-3xl">
                                        <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Status</p>
                                        <p className="text-emerald-400 font-black uppercase">Active</p>
                                    </div>
                                    <div className="bg-white/5 p-6 rounded-3xl">
                                        <p className="text-[10px] font-black uppercase text-gray-500 mb-1">Clearance</p>
                                        <p className="text-purple-400 font-black uppercase">Level 1</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {showSchedule && selectedTrade && (
                    <ScheduleModal trade={selectedTrade} onClose={() => setShowSchedule(false)} onSchedule={async (data) => {
                        await api.post(`/trades/${selectedTrade.id}/schedule`, data);
                        setShowSchedule(false);
                        fetchAllData();
                    }} />
                )}
                {showRating && selectedTrade && (
                    <RatingModal
                        tradeId={selectedTrade.id}
                        revieweeId={selectedTrade.listing.sellerId}
                        onClose={() => setShowRating(false)}
                        onSuccess={() => alert('Review Sent!')}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MemberDashboard;
