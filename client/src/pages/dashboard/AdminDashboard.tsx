import { useEffect, useState } from 'react';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Users, ShieldAlert, CheckCircle, XCircle, UserPlus } from 'lucide-react';

const AdminDashboard = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [pendingItems, setPendingItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [uRes, iRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/items/pending')
            ]);
            setUsers(uRes.data);
            setPendingItems(iRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleVerifyUser = async (userId: string, status: boolean) => {
        try {
            await api.put(`/admin/users/${userId}/verify`, { isVerified: status });
            fetchData();
        } catch (e) { alert('Failed'); }
    };

    const handleVerifyItem = async (itemId: string, status: string) => {
        try {
            await api.put(`/admin/items/${itemId}/verify`, { status });
            fetchData();
        } catch (e) { alert('Failed'); }
    };

    const promoteUser = async (userId: string) => {
        const role = prompt('Enter role (STUDENT, MEMBER, ADMIN):');
        if (role) {
            try {
                await api.put(`/admin/users/${userId}/role`, { role });
                fetchData();
            } catch (e) { alert('Failed'); }
        }
    };

    if (loading) return <div className="text-white p-10">Admin access loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 text-black p-10 space-y-16">
            <header className="flex justify-between items-center border-b border-gray-100 pb-10">
                <h1 className="text-6xl font-black uppercase tracking-tighter text-black">Master Control</h1>
                <div className="bg-black text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">System Administrator</div>
            </header>

            {/* User Management */}
            <section className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <div className="p-2 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-500/20">
                        <Users size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Citizen Directory ({users.length})</h2>
                </div>
                <div className="bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="p-6">Identity</th>
                                <th className="p-6">Access Layer</th>
                                <th className="p-6">Trust</th>
                                <th className="p-6">Status</th>
                                <th className="p-6 text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="p-6">
                                        <div className="font-black text-lg text-black">{u.profile?.fullName || 'ANONYMOUS'}</div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{u.email}</div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-[10px] px-4 py-1.5 rounded-full uppercase font-black tracking-widest border ${u.role === 'ADMIN' ? 'bg-black text-white border-black' : u.role === 'MEMBER' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="p-6 font-black text-lg text-blue-600">{u.trustScore}</td>
                                    <td className="p-6">
                                        {u.isVerified ? (
                                            <span className="text-emerald-500 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><CheckCircle size={14} /> Verified</span>
                                        ) : (
                                            <span className="text-gray-300 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"><XCircle size={14} /> Restricted</span>
                                        )}
                                    </td>
                                    <td className="p-6">
                                        <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleVerifyUser(u.id, !u.isVerified)} className="p-3 bg-white border border-gray-100 rounded-xl text-emerald-500 hover:bg-emerald-50 shadow-sm transition-all" title="Toggle Verification"><CheckCircle size={20} /></button>
                                            <button onClick={() => promoteUser(u.id)} className="p-3 bg-white border border-gray-100 rounded-xl text-blue-600 hover:bg-blue-50 shadow-sm transition-all" title="Redefine Role"><UserPlus size={20} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Item Verification */}
            <section className="space-y-8">
                <div className="flex items-center gap-4 px-2">
                    <div className="p-2 bg-black rounded-lg text-white shadow-lg shadow-black/20">
                        <ShieldAlert size={24} />
                    </div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter">Verification Nexus ({pendingItems.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pendingItems.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0.98, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white border border-gray-100 p-8 rounded-[3rem] shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col justify-between group"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-2xl font-black uppercase tracking-tighter text-black">{item.title}</h3>
                                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">{item.type}</span>
                                </div>
                                <p className="text-gray-400 text-sm font-medium leading-relaxed italic">"{item.description}"</p>
                                <div className="mt-6 flex items-center gap-3 border-t border-gray-50 pt-6">
                                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-black text-xs">
                                        {item.seller.profile.fullName[0]}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-black uppercase tracking-widest">{item.seller.profile.fullName}</p>
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Listing Authority</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button onClick={() => handleVerifyItem(item.id, 'VERIFIED')} className="flex-1 bg-black text-white p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-black/10 hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle size={16} /> Authenticate
                                </button>
                                <button onClick={() => handleVerifyItem(item.id, 'REMOVED')} className="flex-1 bg-white text-red-500 border border-red-100 p-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
                                    <XCircle size={16} /> Purge
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {pendingItems.length === 0 && (
                        <div className="col-span-full p-20 border-2 border-dashed border-gray-100 rounded-[4rem] text-center">
                            <p className="text-gray-300 font-black uppercase tracking-widest text-sm">Nexus queue is currently vacant.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
