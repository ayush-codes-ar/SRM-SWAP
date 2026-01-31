import { motion } from 'framer-motion';
import { Zap, Shield, MessageSquare, Search, Trophy, Globe, PlusCircle, MessageCircle, Handshake, Fingerprint } from 'lucide-react';

const FeaturesPage = () => {
    const features = [
        {
            title: "Secure Barter",
            desc: "Trade items directly or with partial cash. Our hybrid engine handles the complexity.",
            icon: <Zap className="text-yellow-400" size={32} />,
            color: "bg-yellow-400/10"
        },
        {
            title: "Identity Verified",
            desc: "Only official @srmap.edu.in inhabitants can participate. Trust is the foundation.",
            icon: <Shield className="text-blue-400" size={32} />,
            color: "bg-blue-400/10"
        },
        {
            title: "Real-time Negotiation",
            desc: "Chat directly with buyers and sellers in our responsive cinematic chat rooms.",
            icon: <MessageSquare className="text-cyan-400" size={32} />,
            color: "bg-cyan-400/10"
        },
        {
            title: "Smart Discovery",
            desc: "Advanced tagging and category filters help you find exactly what you need.",
            icon: <Search className="text-purple-400" size={32} />,
            color: "bg-purple-400/10"
        },
        {
            title: "Trust Scores",
            desc: "Rate your trading partners. Build reputation through successful exchanges.",
            icon: <Trophy className="text-orange-400" size={32} />,
            color: "bg-orange-400/10"
        },
        {
            title: "Mobile Optimized",
            desc: "Trade on the go. Entirely responsive experience for your smartphone.",
            icon: <Globe className="text-indigo-400" size={32} />,
            color: "bg-indigo-400/10"
        }
    ];

    return (
        <div className="min-h-screen bg-white py-24 px-6">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-24"
                >
                    <h1 className="text-7xl md:text-9xl font-black text-black tracking-tighter uppercase mb-6 leading-none">
                        Built for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Excellence</span>
                    </h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-xs">A premium suite of tools for the SRM tribe</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="p-10 rounded-[3.5rem] bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-2xl hover:shadow-gray-200/50 transition-all group"
                        >
                            <div className={`w-20 h-20 ${f.color} rounded-[2rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                                {f.icon}
                            </div>
                            <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-4">{f.title}</h3>
                            <p className="text-gray-500 font-medium leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const HowItWorksPage = () => {
    const steps = [
        {
            step: "01",
            title: "Vibe In",
            desc: "Register with your official SRM email and verify your student identity.",
            icon: <Fingerprint size={24} />
        },
        {
            step: "02",
            title: "Showcase",
            desc: "List your books, gadgets, or cycles with photos, tags, and price/barter types.",
            icon: <PlusCircle size={24} />
        },
        {
            step: "03",
            title: "Negotiate",
            desc: "Discuss deals in real-time. Propose hybrid trades (Money + Item) seamlessly.",
            icon: <MessageCircle size={24} />
        },
        {
            step: "04",
            title: "Exchange",
            desc: "Meet on campus in supervised zones to safely finalize your transaction.",
            icon: <Handshake size={24} />
        }
    ];

    return (
        <div className="min-h-screen bg-white py-24 px-6 text-black overflow-hidden relative">
            <div className="max-w-6xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="mb-32"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter uppercase leading-none">
                        Four Steps <br />
                        To <span className="text-blue-600">Freedom</span>
                    </h1>
                </motion.div>

                <div className="space-y-32">
                    {steps.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row items-center gap-20"
                        >
                            <div className="text-[12rem] font-black leading-none text-gray-50 select-none">{s.step}</div>
                            <div className="space-y-6 max-w-xl">
                                <h3 className="text-5xl font-black uppercase tracking-tighter flex items-center gap-6">
                                    <span className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center rotate-12 shadow-2xl shadow-blue-600/40">
                                        <div className="text-white">★</div>
                                    </span>
                                    {s.title}
                                </h3>
                                <p className="text-gray-500 text-xl font-medium leading-relaxed">{s.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesPage;
