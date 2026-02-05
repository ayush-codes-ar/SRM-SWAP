import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FadeText, FloatingParticles, AnimatedCounter } from '../../components/scrollytelling/ScrollUtils';
import { Recycle, DollarSign, Leaf, ShoppingBag, ArrowLeftRight, Shield, Search, Sparkles } from 'lucide-react';

// Import the calculator SVG
import calculatorSvg from '../../assets/hero-calculator.svg';

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative">
            {/* Section 1: Hero - "Forgotten on a Shelf" */}
            <HeroSection />

            {/* Section 2: Realization - "Still Useful" */}
            <RealizationSection />

            {/* Section 3: Listing the Item */}
            <ListingSection />

            {/* Section 4: Discovery via Smart Search */}
            <DiscoverySection />

            {/* Section 5: On-Campus Exchange */}
            <ExchangeSection />

            {/* Section 6: New Life with a New Student */}
            <NewLifeSection />

            {/* Section 7: Impact Section */}
            <ImpactSection />

            {/* Section 8: Platform Reveal */}
            <PlatformSection />

            {/* Section 9: Final CTA */}
            <CTASection onStart={() => navigate('/login')} />
        </div>
    );
};

// ============================================
// SECTION 1: HERO
// ============================================
const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const itemY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const itemRotate = useTransform(scrollYProgress, [0, 1], [-5, 5]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

    return (
        <section
            ref={ref}
            className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #FEF9E7 0%, #E8F8F5 50%, #EBF5FB 100%)'
            }}
        >
            {/* Sunlight effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-yellow-200/40 via-transparent to-transparent rounded-full blur-3xl" />

            <FloatingParticles count={15} color="rgba(253, 230, 138, 0.5)" />

            {/* Shelf */}
            <div className="absolute bottom-1/3 w-full max-w-lg">
                <div className="h-4 bg-gradient-to-r from-amber-100 via-amber-50 to-amber-100 rounded-full shadow-lg mx-8" />
                <div className="h-2 bg-amber-200/50 rounded-b-lg mx-12" />
            </div>

            {/* The Calculator - Main Character */}
            <motion.div
                style={{ y: itemY, rotate: itemRotate }}
                className="relative z-10 mb-20"
            >
                <motion.img
                    src={calculatorSvg}
                    alt="Calculator"
                    className="w-40 h-48 drop-shadow-2xl"
                    animate={{
                        y: [0, -8, 0],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                {/* Dust particles near item */}
                <motion.div
                    className="absolute -top-2 -right-2 w-2 h-2 bg-yellow-300/60 rounded-full"
                    animate={{ y: [-5, 5, -5], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                    className="absolute top-4 -left-4 w-1.5 h-1.5 bg-amber-200/50 rounded-full"
                    animate={{ y: [5, -5, 5], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            </motion.div>

            {/* Hero Text */}
            <motion.div
                style={{ opacity: textOpacity }}
                className="text-center px-6 relative z-10"
            >
                <FadeText delay={0.3}>
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-700 mb-4 font-nunito">
                        Some things still have
                    </h1>
                </FadeText>
                <FadeText delay={0.5}>
                    <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-400 font-nunito">
                        a lot of life left in them.
                    </h1>
                </FadeText>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 flex flex-col items-center text-slate-400"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-sm mb-2">Scroll to explore</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </motion.div>
        </section>
    );
};

// ============================================
// SECTION 2: REALIZATION
// ============================================
const RealizationSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const glowScale = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
    const glowOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0, 1, 0.8]);

    return (
        <section
            ref={ref}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #EBF5FB 0%, #F5EEF8 50%, #FDEDEC 100%)'
            }}
        >
            {/* Abstract background shapes */}
            <motion.div
                className="absolute w-96 h-96 rounded-full bg-gradient-to-br from-lavender-200/30 to-pink-100/20 blur-3xl"
                style={{ scale: glowScale, opacity: glowOpacity }}
            />

            <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
                {/* Calculator with glow */}
                <motion.div
                    className="relative"
                    whileInView={{ scale: [0.9, 1] }}
                    transition={{ duration: 0.8 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-teal-400/30 rounded-3xl blur-2xl"
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <img
                        src={calculatorSvg}
                        alt="Calculator"
                        className="w-48 h-56 relative z-10 drop-shadow-xl"
                    />
                    {/* Sparkle effect */}
                    <motion.div
                        className="absolute -top-4 -right-4"
                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    >
                        <Sparkles className="w-8 h-8 text-yellow-400" />
                    </motion.div>
                </motion.div>

                {/* Text */}
                <div className="text-center md:text-left">
                    <FadeText direction="right">
                        <p className="text-2xl md:text-4xl text-slate-600 font-light leading-relaxed">
                            Used once.
                        </p>
                    </FadeText>
                    <FadeText direction="right" delay={0.2}>
                        <p className="text-2xl md:text-4xl text-slate-600 font-light leading-relaxed mt-2">
                            Still useful.
                        </p>
                    </FadeText>
                    <FadeText direction="right" delay={0.4}>
                        <p className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 mt-4">
                            Just waiting.
                        </p>
                    </FadeText>
                </div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 3: LISTING
// ============================================
const ListingSection = () => {
    const tags = ['#calculator', '#engineering', '#firstyear', '#good-condition'];

    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
            style={{
                background: 'linear-gradient(180deg, #FDEDEC 0%, #FDEBD0 50%, #FEF9E7 100%)'
            }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                <FadeText>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-700 mb-12">
                        List it on <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">SRM-SWAP</span>
                    </h2>
                </FadeText>

                {/* Listing Card */}
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-auto border border-slate-100"
                    initial={{ y: 100, opacity: 0, scale: 0.9 }}
                    whileInView={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                >
                    {/* Item drops into card */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.6, type: "spring", bounce: 0.4 }}
                        viewport={{ once: true }}
                        className="mb-6"
                    >
                        <img src={calculatorSvg} alt="Calculator" className="w-24 h-28 mx-auto drop-shadow-lg" />
                    </motion.div>

                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Scientific Calculator</h3>
                    <p className="text-slate-500 text-sm mb-4">Casio FX-991EX • Works perfectly</p>

                    {/* Tags animate in */}
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                        {tags.map((tag, i) => (
                            <motion.span
                                key={tag}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.15, duration: 0.4, type: "spring" }}
                                viewport={{ once: true }}
                                className="px-3 py-1 bg-gradient-to-r from-blue-50 to-teal-50 text-blue-600 rounded-full text-sm font-medium border border-blue-100"
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </div>

                    {/* Confirmation */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center gap-2 text-green-500 font-medium"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: 1.3, type: "spring", bounce: 0.5 }}
                            viewport={{ once: true }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </motion.div>
                        Listed on SRM-SWAP
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 4: DISCOVERY
// ============================================
const DiscoverySection = () => {
    const searchText = "calculator engineering";

    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #FEF9E7 0%, #E8F8F5 50%, #D5F5E3 100%)'
            }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Floating search UI */}
                <motion.div
                    className="bg-white rounded-2xl shadow-xl p-6 max-w-lg mx-auto mb-12 border border-slate-100"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
                        <Search className="w-5 h-5 text-slate-400" />
                        <motion.span
                            className="text-slate-600 font-medium"
                            initial={{ width: 0 }}
                            whileInView={{ width: "auto" }}
                            transition={{ duration: 1.5, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            {searchText.split('').map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    transition={{ delay: 0.5 + i * 0.05 }}
                                    viewport={{ once: true }}
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </motion.span>
                        <motion.div
                            className="w-0.5 h-5 bg-blue-500"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                        />
                    </div>
                </motion.div>

                {/* Item being found */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
                    viewport={{ once: true }}
                    className="relative inline-block"
                >
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full blur-2xl scale-150"
                        animate={{ scale: [1.5, 1.7, 1.5], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <img src={calculatorSvg} alt="Calculator" className="w-32 h-40 relative z-10 drop-shadow-xl" />
                </motion.div>

                <FadeText delay={1.8}>
                    <p className="text-2xl md:text-4xl text-slate-600 font-light mt-12">
                        The right item.
                    </p>
                </FadeText>
                <FadeText delay={2}>
                    <p className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500 mt-2">
                        Found at the right time.
                    </p>
                </FadeText>
            </div>
        </section>
    );
};

// ============================================
// SECTION 5: EXCHANGE
// ============================================
const ExchangeSection = () => {
    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #D5F5E3 0%, #D4E6F1 50%, #E8DAEF 100%)'
            }}
        >
            {/* Simple campus illustration */}
            <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-green-100/50 to-transparent" />

            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Two figures with item exchange */}
                <div className="flex items-center justify-center gap-8 md:gap-16 mb-12">
                    {/* Person 1 */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full mb-2" />
                        <div className="w-12 h-20 md:w-16 md:h-24 bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-2xl" />
                    </motion.div>

                    {/* Item moving between */}
                    <motion.div
                        initial={{ x: -80 }}
                        whileInView={{ x: 80 }}
                        transition={{
                            delay: 0.5,
                            duration: 1.5,
                            ease: [0.22, 1, 0.36, 1]
                        }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <motion.div
                            animate={{
                                y: [0, -30, 0],
                            }}
                            transition={{
                                duration: 1.5,
                                ease: "easeInOut"
                            }}
                        >
                            <img src={calculatorSvg} alt="Calculator" className="w-16 h-20 drop-shadow-lg" />
                        </motion.div>

                        {/* Sparkles on exchange */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.8, duration: 0.3 }}
                            viewport={{ once: true }}
                            className="absolute -top-4 -right-4"
                        >
                            <Sparkles className="w-6 h-6 text-yellow-400" />
                        </motion.div>
                    </motion.div>

                    {/* Person 2 */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full mb-2" />
                        <div className="w-12 h-20 md:w-16 md:h-24 bg-gradient-to-b from-pink-300 to-pink-400 rounded-t-2xl" />
                    </motion.div>
                </div>

                {/* Checkmark */}
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ delay: 2, type: "spring", bounce: 0.5 }}
                    viewport={{ once: true }}
                    className="w-12 h-12 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </motion.div>

                <FadeText delay={2.2}>
                    <p className="text-2xl md:text-4xl text-slate-600 font-light">
                        No shipping. No strangers.
                    </p>
                </FadeText>
                <FadeText delay={2.4}>
                    <p className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-purple-500 mt-2">
                        Just campus to campus.
                    </p>
                </FadeText>
            </div>
        </section>
    );
};

// ============================================
// SECTION 6: NEW LIFE
// ============================================
const NewLifeSection = () => {
    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #E8DAEF 0%, #FADBD8 50%, #FCF3CF 100%)'
            }}
        >
            <div className="max-w-4xl mx-auto px-6 text-center">
                {/* Calculator "in use" */}
                <motion.div
                    className="relative mb-12"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <img src={calculatorSvg} alt="Calculator" className="w-40 h-48 mx-auto drop-shadow-xl" />

                    {/* "Active" indicators */}
                    <motion.div
                        className="absolute top-2 right-1/3 w-3 h-3 bg-green-400 rounded-full"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 1, 0.7]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />

                    {/* Floating numbers to show activity */}
                    <motion.span
                        className="absolute -top-6 right-1/4 text-2xl font-mono text-blue-400/60"
                        animate={{ y: [0, -20], opacity: [1, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        42
                    </motion.span>
                    <motion.span
                        className="absolute top-0 left-1/4 text-xl font-mono text-teal-400/60"
                        animate={{ y: [0, -15], opacity: [1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                    >
                        π
                    </motion.span>
                </motion.div>

                <FadeText>
                    <p className="text-2xl md:text-4xl text-slate-600 font-light">
                        One small exchange.
                    </p>
                </FadeText>
                <FadeText delay={0.2}>
                    <p className="text-3xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mt-2">
                        A big difference.
                    </p>
                </FadeText>
            </div>
        </section>
    );
};

// ============================================
// SECTION 7: IMPACT
// ============================================
const ImpactSection = () => {
    const stats = [
        { icon: Recycle, value: 1247, label: 'Items Reused', color: 'from-green-400 to-teal-400' },
        { icon: DollarSign, value: 89000, label: 'Money Saved', prefix: '₹', color: 'from-blue-400 to-indigo-400' },
        { icon: Leaf, value: 340, label: 'KG Waste Reduced', color: 'from-emerald-400 to-green-400' },
    ];

    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
            style={{
                background: 'linear-gradient(180deg, #FCF3CF 0%, #D5F5E3 50%, #D4E6F1 100%)'
            }}
        >
            <div className="max-w-5xl mx-auto px-6">
                <FadeText>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-700 text-center mb-16">
                        Every swap makes an <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">impact</span>
                    </h2>
                </FadeText>

                {/* Stats grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2, duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 text-center shadow-xl border border-white"
                        >
                            <motion.div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-4`}
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <stat.icon className="w-8 h-8 text-white" />
                            </motion.div>
                            <div className="text-4xl font-bold text-slate-800 mb-2">
                                <AnimatedCounter value={stat.value} prefix={stat.prefix || ''} suffix="+" />
                            </div>
                            <p className="text-slate-500 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Floating items representing community */}
                <motion.div
                    className="flex justify-center gap-4 mt-16"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                >
                    {[...Array(5)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="w-8 h-10 bg-gradient-to-b from-slate-200 to-slate-300 rounded-lg opacity-60"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2,
                                delay: i * 0.2,
                                repeat: Infinity
                            }}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 8: PLATFORM REVEAL
// ============================================
const PlatformSection = () => {
    const features = [
        { icon: ShoppingBag, title: 'Buy & Sell', desc: 'Fair prices, verified students' },
        { icon: ArrowLeftRight, title: 'Exchange', desc: 'Trade what you have for what you need' },
        { icon: Shield, title: 'Campus Trust', desc: 'SRM verified, safe meetups' },
        { icon: Search, title: 'Smart Search', desc: 'Find items by tags & categories' },
    ];

    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
            style={{
                background: 'linear-gradient(180deg, #D4E6F1 0%, #EBF5FB 50%, #FDFEFE 100%)'
            }}
        >
            <div className="max-w-6xl mx-auto px-6 text-center">
                <FadeText>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-700 mb-4">
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-violet-500">SRM-SWAP</span>
                    </h2>
                </FadeText>
                <FadeText delay={0.2}>
                    <p className="text-xl text-slate-500 mb-16">
                        The campus marketplace built for students, by students.
                    </p>
                </FadeText>

                {/* Features around central item */}
                <div className="relative">
                    {/* Central item */}
                    <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 0.8, type: "spring" }}
                        viewport={{ once: true }}
                        className="w-24 h-28 mx-auto mb-12 relative"
                    >
                        <img src={calculatorSvg} alt="Calculator" className="w-full h-full drop-shadow-lg" />
                        <motion.div
                            className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl"
                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        />
                    </motion.div>

                    {/* Feature cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {features.map((feature, i) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 cursor-pointer"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <feature.icon className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-semibold text-slate-800 mb-1">{feature.title}</h3>
                                <p className="text-sm text-slate-500">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 9: CTA
// ============================================
const CTASection = ({ onStart }: { onStart: () => void }) => {
    return (
        <section
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{
                background: 'linear-gradient(180deg, #FDFEFE 0%, #E8F8F5 50%, #D5F5E3 100%)'
            }}
        >
            <div className="max-w-2xl mx-auto px-6 text-center">
                {/* Logo morph from calculator */}
                <motion.div
                    initial={{ scale: 1 }}
                    whileInView={{ scale: [1, 0.8, 1] }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <motion.div
                        className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-teal-400 to-green-400"
                    >
                        SRM-SWAP
                    </motion.div>
                </motion.div>

                <FadeText delay={0.3}>
                    <p className="text-2xl md:text-3xl text-slate-600 font-light mb-4">
                        Every item has a story.
                    </p>
                </FadeText>
                <FadeText delay={0.5}>
                    <p className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-500 mb-12">
                        Let it continue.
                    </p>
                </FadeText>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    viewport={{ once: true }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.3)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onStart}
                    className="px-12 py-5 bg-gradient-to-r from-blue-500 to-teal-400 text-white text-xl font-semibold rounded-full shadow-xl"
                >
                    Start Swapping
                </motion.button>

                {/* Subtle footer text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    viewport={{ once: true }}
                    className="mt-8 text-slate-400 text-sm"
                >
                    Join 1,200+ SRM students already swapping
                </motion.p>
            </div>
        </section>
    );
};

export default LandingPage;
