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
        <div className="min-h-screen bg-black text-white p-8 space-y-12">
            <h1 className="text-5xl font-black bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">ADMIN CONTROL</h1>

            {/* User Management */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <Users className="text-purple-500" />
                    <h2 className="text-2xl font-bold uppercase">Users ({users.length})</h2>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-white/10 text-gray-400 uppercase text-xs">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Trust</th>
                                <th className="p-4">Verified</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-white/5 transition">
                                    <td className="p-4 font-bold">{u.profile?.fullName || 'N/A'}</td>
                                    <td className="p-4 text-gray-400">{u.email}</td>
                                    <td className="p-4"><span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full uppercase font-bold">{u.role}</span></td>
                                    <td className="p-4 font-mono text-cyan-400">{u.trustScore}</td>
                                    <td className="p-4">{u.isVerified ? '✅' : '❌'}</td>
                                    <td className="p-4 flex gap-2 justify-center">
                                        <button onClick={() => handleVerifyUser(u.id, !u.isVerified)} className="p-2 hover:bg-white/10 rounded-lg text-green-500" title="Verify User"><CheckCircle size={18} /></button>
                                        <button onClick={() => promoteUser(u.id)} className="p-2 hover:bg-white/10 rounded-lg text-blue-500" title="Change Role"><UserPlus size={18} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Item Verification */}
            <section>
                <div className="flex items-center gap-4 mb-6">
                    <ShieldAlert className="text-orange-500" />
                    <h2 className="text-2xl font-bold uppercase">Verification Queue ({pendingItems.length})</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingItems.map(item => (
                        <motion.div
                            key={item.id}
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col justify-between"
                        >
                            <div>
                                <h3 className="text-xl font-bold">{item.title}</h3>
                                <p className="text-gray-400 text-sm mt-1">{item.description}</p>
                                <p className="text-xs text-cyan-500 mt-2">Seller: {item.seller.profile.fullName}</p>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <button onClick={() => handleVerifyItem(item.id, 'VERIFIED')} className="flex-1 bg-green-600 hover:bg-green-500 p-2 rounded-xl font-bold flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> Verify
                                </button>
                                <button onClick={() => handleVerifyItem(item.id, 'REMOVED')} className="flex-1 bg-red-600/20 hover:bg-red-600/40 p-2 rounded-xl text-red-500 font-bold flex items-center justify-center gap-2">
                                    <XCircle size={18} /> Reject
                                </button>
                            </div>
                        </motion.div>
                    ))}
                    {pendingItems.length === 0 && <p className="text-gray-500 italic">No items pending verification.</p>}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;
