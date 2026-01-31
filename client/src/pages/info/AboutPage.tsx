import { motion } from 'framer-motion';
import { Globe, Users, Heart } from 'lucide-react';

const AboutPage = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" as const }
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-black p-10 custom-scrollbar overflow-y-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/10 via-white to-gray-50/20 -z-10" />
            <div className="max-w-4xl mx-auto space-y-40 py-24">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    className="text-center space-y-12"
                >
                    <div className="space-y-4">
                        <motion.h1
                            initial={{ scale: 0.9, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1, type: 'spring' }}
                            className="text-7xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none"
                        >
                            KNOW YOUR <span className="text-blue-600">COLLEGE</span>
                        </motion.h1>
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: 96 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-2 bg-black mx-auto rounded-full"
                        />
                    </div>
                    <p className="text-2xl text-gray-500 leading-relaxed font-bold max-w-2xl mx-auto">
                        SRM Swap isn't just a marketplace. It's a <span className="text-black underline decoration-blue-600 decoration-4 underline-offset-8">trust-based ecosystem</span> for the SRM University AP community.
                    </p>
                </motion.div>

                {/* 360 Campus View Placeholder with Scroll Parallax Effect */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1 }}
                    className="relative group rounded-[4rem] overflow-hidden border border-gray-100 aspect-video bg-gray-50 shadow-2xl"
                >
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08759dfc3ef?auto=format&fit=crop&q=80&w=1200"
                        className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition duration-1000 grayscale group-hover:grayscale-0"
                        alt="SRM Campus"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="p-8 bg-black rounded-full shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <Globe size={48} className="text-white animate-spin-slow" />
                        </div>
                        <h2 className="text-3xl font-black uppercase tracking-widest mt-6 text-black drop-shadow-sm">360° Vision</h2>
                        <motion.p
                            whileHover={{ scale: 1.1 }}
                            className="text-[10px] text-black font-black uppercase tracking-[0.2em] mt-2 bg-white px-6 py-2 rounded-full shadow-lg cursor-pointer"
                        >
                            Immersive virtual experience
                        </motion.p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                        { icon: <Users size={40} />, title: "Community First", color: "text-blue-600", desc: "Built by students, for students. Zero platform fees, pure interaction." },
                        { icon: <ShieldCheck />, title: "Secure Trade", color: "text-black", desc: "Every trade is supervised by verified category lead members for total safety." },
                        { icon: <Heart size={40} />, title: "Eco Friendly", color: "text-red-500", desc: "Reuse, Recyle, and Rediscover within our own campus boundaries." },
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            whileHover={{ y: -10 }}
                            className="bg-gray-50 p-12 rounded-[3rem] border border-gray-100 group hover:bg-white hover:shadow-2xl transition-all duration-500"
                        >
                            <div className={`${feature.color} mb-8 group-hover:scale-110 transition-transform duration-300`}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-black uppercase tracking-tighter">{feature.title}</h3>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed font-bold">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple animation
const ShieldCheck = ({ className }: { className?: string }) => (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
);

export default AboutPage;
