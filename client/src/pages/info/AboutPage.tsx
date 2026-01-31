import { motion } from 'framer-motion';
import { Globe, Users, Heart } from 'lucide-react';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-4xl mx-auto text-center space-y-8"
            >
                <h1 className="text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent uppercase tracking-tighter">
                    KNOW YOUR COLLEGE
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed font-light">
                    SRM Swap isn't just a marketplace. It's a <span className="text-white font-bold">trust-based ecosystem</span> for the SRM University AP community. We barter, we lend, and we build connections that last beyond the campus gates.
                </p>

                {/* 360 Campus View Placeholder */}
                <div className="relative group rounded-3xl overflow-hidden border border-white/10 aspect-video bg-gray-900 shadow-2xl">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition duration-1000"
                        alt="SRM Campus"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                        <Globe size={48} className="text-cyan-400 mb-4 animate-spin-slow" />
                        <h2 className="text-2xl font-bold uppercase tracking-widest">360° Campus View</h2>
                        <p className="text-sm text-gray-400 mt-2">Coming soon: Immersive virtual experience</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <Users className="text-cyan-400 mb-4" />
                        <h3 className="text-xl font-bold">Community First</h3>
                        <p className="text-sm text-gray-500 mt-2">Built by students, for students. Zero platform fees.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <ShieldCheck className="text-green-400 mb-4" />
                        <h3 className="text-xl font-bold">Secure Trade</h3>
                        <p className="text-sm text-gray-500 mt-2">Every trade is supervised by verified category lead members.</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-3xl border border-white/10">
                        <Heart className="text-red-400 mb-4" />
                        <h3 className="text-xl font-bold">Eco Friendly</h3>
                        <p className="text-sm text-gray-500 mt-2">Reuse, Recyle, and Rediscover within our own campus.</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// Simple animation
const ShieldCheck = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);

export default AboutPage;
