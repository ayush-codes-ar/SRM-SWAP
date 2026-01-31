import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../../components/FileUpload';

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

    if (loading) return <div className="text-white text-center mt-20">Loading profile...</div>;

    return (
        <div className="min-h-screen bg-black text-white p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 p-8 rounded-3xl"
            >
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                    Complete Your Profile
                </h1>
                <p className="text-gray-400 mb-8">One last step before you enter the marketplace.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Full Name (Read-only)</label>
                            <input
                                value={profile?.fullName || ''}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Registration Number (Read-only)</label>
                            <input
                                value={profile?.user?.email?.split('@')[0].toUpperCase() || ''}
                                disabled
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Hostel Name & Room Number</label>
                        <input
                            type="text"
                            placeholder="e.g. Kaveri, 304"
                            value={formData.hostelDetails}
                            onChange={(e) => setFormData({ ...formData, hostelDetails: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-green-500 transition-colors"
                            required
                        />
                    </div>

                    <FileUpload label="Profile Photo" onChange={(file) => {
                        // Mock upload for now
                        if (file) setFormData({ ...formData, photoUrl: URL.createObjectURL(file) })
                    }} />

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-900/20 transition-all"
                    >
                        Save & Continue
                    </motion.button>
                </form>
            </motion.div>
        </div>
    );
};

export default ProfileSetupPage;
