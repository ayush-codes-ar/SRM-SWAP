import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../../components/FileUpload';
import Skeleton from '../../components/ui/Skeleton';

const ProfileSetupPage = () => {
    const { profile, fetchProfile, updateProfile } = useAuthStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        phone: '',
        hostelDetails: '',
        photoUrl: '' // Placeholder for actual file upload logic
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                await fetchProfile();
            } catch (e) {
                // user might not have a profile yet if we messed up creation, 
                // but our register flow creates one.
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [fetchProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Failed to update profile', error);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center relative overflow-hidden p-10">
            <div className="w-full max-w-2xl bg-white border border-gray-100 p-16 rounded-[4.5rem] shadow-2xl relative z-10">
                <div className="mb-12 space-y-4">
                    <Skeleton className="h-2 w-20 rounded-full" />
                    <Skeleton className="h-16 w-3/4 rounded-3xl" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <Skeleton className="h-16 w-full rounded-[2rem]" />
                        <Skeleton className="h-16 w-full rounded-[2rem]" />
                    </div>
                    <Skeleton className="h-16 w-full rounded-[2rem]" />
                    <Skeleton className="h-24 w-full rounded-[2rem]" />
                    <Skeleton className="h-16 w-full rounded-[3rem]" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent text-black p-10 flex items-center justify-center relative overflow-hidden">
            {/* Ambient storytelling elements */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, 30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className="absolute top-20 right-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, -30, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute bottom-20 left-20 w-96 h-96 bg-gray-100/50 rounded-full blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring' as const, damping: 25, stiffness: 120 }}
                className="w-full max-w-2xl bg-white border border-gray-100 p-16 rounded-[4.5rem] shadow-2xl shadow-gray-200/50 relative z-10"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-bl-full -mr-32 -mt-32 transition-transform hover:scale-110 duration-1000" />

                <div className="relative mb-12">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '4rem' }}
                        className="h-2 bg-blue-600 rounded-full mb-6"
                    />
                    <h1 className="text-6xl font-black text-black uppercase tracking-tighter leading-[0.9]">
                        INITIALIZE <br />
                        <span className="text-blue-600">PROFILE</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-6">Secure your identity within the SRM Hub.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Inhabitant Name</label>
                            <input
                                value={profile?.fullName || ''}
                                disabled
                                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-5 text-gray-400 font-bold text-sm cursor-not-allowed shadow-inner"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Registry ID</label>
                            <input
                                value={profile?.user?.email?.split('@')[0].toUpperCase() || ''}
                                disabled
                                className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-5 text-gray-400 font-bold text-sm cursor-not-allowed shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-4">COMMUNICATION LINK (PHONE)</label>
                        <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-5 text-black font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none shadow-sm"
                            required
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-[10px] font-black text-black uppercase tracking-widest ml-4">DORM COORDINATES (HOSTEL/ROOM)</label>
                        <input
                            type="text"
                            placeholder="e.g. Kaveri, 304"
                            value={formData.hostelDetails}
                            onChange={(e) => setFormData({ ...formData, hostelDetails: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-5 text-black font-bold focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none shadow-sm"
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <FileUpload label="Registry Identification (Photo)" onChange={(file) => {
                            if (file) setFormData({ ...formData, photoUrl: URL.createObjectURL(file) })
                        }} />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-black text-white py-6 rounded-[3rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-black/10 hover:bg-blue-600 transition-all flex items-center justify-center gap-6 group"
                    >
                        COMPLETE ONBOARDING
                        <span className="group-hover:translate-x-3 transition-transform text-lg">→</span>
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfileSetupPage;
