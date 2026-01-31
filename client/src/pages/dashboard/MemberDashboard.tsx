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
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${view === target ? 'bg-black text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50 hover:text-black'}`}
        >
            <Icon size={20} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-black flex">
            {/* Sidebar */}
            <aside className="w-80 border-r border-gray-100 bg-white p-6 flex flex-col gap-2 sticky top-0 h-screen shadow-sm z-50">
                <div className="mb-10 px-6">
                    <h2 className="text-2xl font-black italic tracking-tighter text-blue-600">SRM SWAP</h2>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Supervisor Terminal</p>
                </div>

                <div className="space-y-1">
                    <p className="px-6 text-[10px] font-black uppercase text-gray-300 mb-2">Market Management</p>
                    <NavButton target="PENDING_DEALS" label="Pending Deals" icon={Clock} />
                    <NavButton target="APPROVED_DEALS" label="Approved Deals" icon={BadgeCheck} />
                    <NavButton target="COMPLETED_DEALS" label="Closed Archive" icon={CheckCircle} />
                </div>

                <div className="mt-8 space-y-1">
                    <p className="px-6 text-[10px] font-black uppercase text-gray-300 mb-2">Conflict Resolution</p>
                    <NavButton target="NEW_ISSUES" label="New Issues" icon={ShieldAlert} />
                    <NavButton target="PENDING_ISSUES" label="Pending Resolution" icon={MessageSquare} />
                    <NavButton target="SOLVED_ISSUES" label="Solved List" icon={CheckCircle} />
                </div>

                <div className="mt-auto space-y-1">
                    <NavButton target="PROFILE" label="My Profile" icon={User} />
                    <button
                        onClick={() => { useAuthStore.getState().logout(); window.location.href = '/login'; }}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest font-black text-xs"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-16 overflow-y-auto bg-gray-50/30">
                <header className="mb-16 flex justify-between items-end">
                    <div>
                        <h1 className="text-6xl font-black uppercase tracking-tighter text-black">{view.replace('_', ' ')}</h1>
                        <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-2 px-1">Active session: {user?.email}</p>
                    </div>
                </header>

                {loading ? (
                    <div className="animate-pulse text-cyan-500 font-bold uppercase tracking-widest">Syncing with Node...</div>
                ) : (
                    <div className="grid gap-6">
                        {view.includes('DEAL') && trades.map(trade => (
                            <div key={trade.id} className="bg-white border border-gray-100 p-8 rounded-[2.5rem] flex justify-between items-center group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter text-black">{trade.listing.title}</h3>
                                    <div className="flex gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2"><User size={12} className="text-blue-600" /> BUYER: {trade.buyer.profile.fullName}</span>
                                        <span className="text-gray-100">|</span>
                                        <span className="flex items-center gap-2"><User size={12} className="text-black" /> SELLER: {trade.listing.seller.profile.fullName}</span>
                                    </div>
                                    <div className="flex gap-8 mt-6 p-6 bg-gray-50 rounded-[2rem] border border-gray-100 text-[10px] font-black uppercase tracking-widest">
                                        <div className="flex items-center gap-3"><MapPin size={16} className="text-blue-600" /> {trade.location || 'TBD'}</div>
                                        <div className="flex items-center gap-3 border-l border-gray-200 pl-8"><Calendar size={16} className="text-black" /> {trade.scheduledAt ? new Date(trade.scheduledAt).toLocaleString() : 'TBD'}</div>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    {view === 'PENDING_DEALS' && (
                                        <button onClick={() => { setSelectedTrade(trade); setShowSchedule(true); }} className="bg-blue-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all">Verify & Schedule</button>
                                    )}
                                    {view === 'APPROVED_DEALS' && (
                                        <>
                                            {trade.supervisorConfirmed ? (
                                                <button disabled className="bg-gray-100 text-gray-400 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] cursor-not-allowed border border-gray-100 flex items-center gap-3">
                                                    <Clock size={16} className="animate-pulse" />
                                                    Waiting for User Seal
                                                </button>
                                            ) : (
                                                <button onClick={() => handleMarkDone(trade.id)} className="bg-black text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-blue-600 transition-all shadow-xl shadow-black/10">
                                                    🤝 Execute Closure
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
                            <div key={issue.id} className="bg-white border-2 border-red-50 p-8 rounded-[2.5rem] space-y-6 shadow-sm relative overflow-hidden">
                                <div className="absolute top-0 right-0 bg-red-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] uppercase tracking-widest">Urgent Dispute</div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
                                            <AlertCircle className="text-red-500" /> {issue.trade.listing.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 px-1">Reporter: {issue.reporter.profile.fullName}</p>
                                    </div>
                                </div>
                                <div className="p-6 bg-red-50/50 rounded-2xl italic border border-red-100">
                                    <p className="text-gray-600 font-bold leading-relaxed">"{issue.description}"</p>
                                </div>
                                <div className="flex gap-4">
                                    {view === 'NEW_ISSUES' && (
                                        <button onClick={() => handleClaimIssue(issue.id)} className="bg-red-600 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-lg shadow-red-500/20">Intercept Issue</button>
                                    )}
                                    {view === 'PENDING_ISSUES' && (
                                        <div className="w-full space-y-6">
                                            <div className="flex gap-3">
                                                <div className={`py-3 px-6 rounded-full flex-1 text-center text-[9px] font-black uppercase tracking-widest ${issue.trade.buyerFinished ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'bg-gray-100 text-gray-300'}`}>Buyer Resolved</div>
                                                <div className={`py-3 px-6 rounded-full flex-1 text-center text-[9px] font-black uppercase tracking-widest ${issue.trade.sellerFinished ? 'bg-black text-white shadow-lg shadow-black/10' : 'bg-gray-100 text-gray-300'}`}>Seller Resolved</div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={() => window.location.href = `/trade/${issue.tradeId}`} className="flex-1 bg-white text-black py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs border border-gray-100 hover:bg-gray-50 transition-all shadow-sm">Join Resolution Hub</button>
                                                <button onClick={() => handleFinalizeIssue(issue.id)} className="flex-[1.5] bg-blue-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">Finalize Closure</button>
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
                            <div className="bg-white border border-gray-100 p-16 rounded-[4rem] text-center space-y-8 shadow-xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-bl-full -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                                <div className="w-32 h-32 bg-black rounded-full mx-auto flex items-center justify-center text-5xl font-black text-white border-8 border-gray-50 shadow-2xl relative z-10">
                                    {user?.email?.[0].toUpperCase() || 'A'}
                                </div>
                                <div className="relative z-10">
                                    <h2 className="text-4xl font-black uppercase tracking-tighter text-black">{user?.email.split('@')[0]}</h2>
                                    <p className="text-blue-600 font-black uppercase text-[10px] tracking-widest mt-2 bg-blue-50 inline-block px-4 py-1.5 rounded-full">SRM Swap Official Member</p>
                                </div>
                                <div className="pt-12 border-t border-gray-50 grid grid-cols-2 gap-8 relative z-10">
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Status</p>
                                        <p className="text-emerald-500 font-black uppercase tracking-widest">Active Duty</p>
                                    </div>
                                    <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                                        <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Clearance</p>
                                        <p className="text-blue-600 font-black uppercase tracking-widest">Level 1</p>
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
