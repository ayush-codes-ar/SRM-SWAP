import { motion } from 'framer-motion';
import { HelpCircle, ChevronDown, MessageCircle, ShieldCheck, Zap, Globe, Smartphone, Edit3, AlertTriangle, Tag, Box, CreditCard } from 'lucide-react';

const FAQPage = () => {
    const faqs = [
        {
            q: "What is SRM Swap?",
            a: "SRM Swap is a campus-only marketplace for SRM University students where you can buy, sell, or exchange items like books, gadgets, cycles, accessories, and more with fellow students.",
            icon: <Globe className="text-blue-500" size={20} />
        },
        {
            q: "Who can use SRM Swap?",
            a: "Only SRM University AP students can use SRM Swap. You must register using your official college email ID to keep the platform safe and trusted.",
            icon: <ShieldCheck className="text-green-500" size={20} />
        },
        {
            q: "How do I create an account?",
            a: "Click on Register, enter your name, registration number, official SRM email, and set a secure password. Verify your details and you’re good to go!",
            icon: <Zap className="text-yellow-500" size={20} />
        },
        {
            q: "Is SRM Swap free to use?",
            a: "Yes! SRM Swap is completely free to use. There are no listing fees or hidden charges.",
            icon: <CreditCard className="text-purple-500" size={20} />
        },
        {
            q: "What kind of items can I sell?",
            a: "You can sell or exchange Books & study materials, Electronics & gadgets, Cycles & accessories, Hostel essentials, and other student-use items. (Illegal or prohibited items are strictly not allowed.)",
            icon: <Box className="text-orange-500" size={20} />
        },
        {
            q: "How do buyers and sellers contact each other?",
            a: "Once you list an item, interested buyers can contact you through the platform. You can then decide the price, meeting point, and payment method between yourselves.",
            icon: <MessageCircle className="text-cyan-500" size={20} />
        },
        {
            q: "Is it safe to use SRM Swap?",
            a: "Yes! Since only verified SRM students can join, it’s much safer than public marketplaces. Still, always meet in public places on campus and stay cautious while dealing.",
            icon: <ShieldCheck className="text-blue-600" size={20} />
        },
        {
            q: "What are tags and categories used for?",
            a: "Tags and categories help other students find your item easily when they search. For example, a cricket bat can have tags like #cricket, #bat, #sports.",
            icon: <Tag className="text-pink-500" size={20} />
        },
        {
            q: "Can I edit or delete my listing?",
            a: "Yes, you can edit or delete your listings anytime from your dashboard.",
            icon: <Edit3 className="text-amber-500" size={20} />
        },
        {
            q: "What if someone posts inappropriate or fake items?",
            a: "You can report such listings. Our team will review them and take necessary action to keep the community safe.",
            icon: <AlertTriangle className="text-red-500" size={20} />
        },
        {
            q: "Can I use SRM Swap on mobile?",
            a: "Yes! SRM Swap works on both desktop and mobile browsers for easy access anywhere on campus.",
            icon: <Smartphone className="text-indigo-500" size={20} />
        }
    ];

    return (
        <div className="min-h-screen bg-white py-20 px-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-black uppercase tracking-widest text-[10px] mb-6">
                        <HelpCircle size={14} /> Help Center
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-black tracking-tighter uppercase mb-4">
                        Got Questions?
                    </h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">
                        Everything you need to know about trading on SRM SWAP
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group bg-gray-50 hover:bg-white border border-gray-100 p-8 rounded-[2.5rem] transition-all hover:shadow-2xl hover:shadow-gray-200/50 cursor-pointer"
                        >
                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white rounded-2xl border border-gray-100 transition-colors group-hover:border-blue-100 group-hover:bg-blue-50/30">
                                        {faq.icon}
                                    </div>
                                    <h3 className="text-lg font-black text-black uppercase tracking-tight">{faq.q}</h3>
                                </div>
                                <div className="p-2 rounded-full bg-white border border-gray-100 text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <ChevronDown size={20} />
                                </div>
                            </div>
                            <div className="mt-4 pl-16">
                                <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">{faq.a}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="mt-20 bg-black rounded-[3.5rem] p-12 text-center text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <HelpCircle size={120} />
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 relative z-10">Still Unsure?</h2>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8 relative z-10">Our team is always here to help you navigate the hub.</p>
                    <button className="bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-[0.2em] text-[10px] hover:bg-blue-400 hover:text-white transition-all shadow-2xl relative z-10">
                        Contact Support
                    </button>
                </motion.div>
            </div>
        </div>
    );
};

export default FAQPage;
