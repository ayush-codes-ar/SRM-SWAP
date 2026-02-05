import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Search, Users, ShieldCheck, TrendingUp } from 'lucide-react';

// Import the calculator SVG
import calculatorSvg from '../../assets/hero-calculator.svg';

// Smooth, intentional animation config
const smoothTransition = {
    duration: 0.8,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
};

const slowTransition = {
    duration: 1.2,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number]
};

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="relative bg-white">
            <HeroSection />
            <ListingSection />
            <DiscoverySection />
            <ExchangeSection />
            <ImpactSection />
            <CTASection onStart={() => navigate('/login')} />
        </div>
    );
};

// ============================================
// SECTION 1: HERO - Minimal Realism
// ============================================
const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    const itemY = useTransform(scrollYProgress, [0, 1], [0, -60]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
    const itemScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    return (
        <section
            ref={ref}
            className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)' }}
        >
            {/* Subtle ambient light */}
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-radial from-blue-50/40 via-transparent to-transparent blur-3xl" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-gradient-radial from-slate-100/60 via-transparent to-transparent blur-3xl" />

            <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <motion.div
                    style={{ opacity: textOpacity }}
                    className="order-2 lg:order-1"
                >
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...smoothTransition, delay: 0.2 }}
                        className="text-sm font-medium text-slate-500 tracking-wide uppercase mb-4"
                    >
                        Campus Marketplace
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...smoothTransition, delay: 0.3 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 leading-tight tracking-tight"
                    >
                        Unused doesn't mean
                        <br />
                        <span className="text-slate-500">unnecessary.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...smoothTransition, delay: 0.4 }}
                        className="mt-6 text-lg text-slate-600 max-w-md leading-relaxed"
                    >
                        Give your items a second life. Trade with verified students on your campus.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...smoothTransition, delay: 0.5 }}
                        className="mt-8 flex items-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('listing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-6 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            See how it works
                        </button>
                        <button className="px-6 py-3 text-slate-600 font-medium hover:text-slate-900 transition-colors flex items-center gap-2">
                            Learn more <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>
                </motion.div>

                {/* Calculator - Realistic render */}
                <motion.div
                    style={{ y: itemY, scale: itemScale }}
                    className="order-1 lg:order-2 flex justify-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ ...slowTransition, delay: 0.3 }}
                        className="relative"
                    >
                        {/* Soft shadow beneath */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900/10 blur-xl rounded-full" />

                        <img
                            src={calculatorSvg}
                            alt="Scientific Calculator"
                            className="w-48 md:w-56 lg:w-64 drop-shadow-2xl"
                        />
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 border-2 border-slate-300 rounded-full flex justify-center pt-2"
                >
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};

// ============================================
// SECTION 2: LISTING - Product-First
// ============================================
const ListingSection = () => {
    const tags = ['Engineering', '1st Year', 'Like New', 'Casio'];

    return (
        <section
            id="listing"
            className="min-h-screen flex items-center justify-center py-24 relative"
            style={{ background: '#FFFFFF' }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Text */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={smoothTransition}
                            viewport={{ once: true }}
                            className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4"
                        >
                            List in seconds
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight"
                        >
                            Your items.
                            <br />
                            Ready to trade.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mt-4 text-slate-600 max-w-sm leading-relaxed"
                        >
                            Add a photo, set your terms, and reach every student on campus. Simple as that.
                        </motion.p>
                    </div>

                    {/* Listing Card - Glass/Frosted effect */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ ...slowTransition }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        {/* Background blur element */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/80 to-white/90 backdrop-blur-xl rounded-2xl border border-slate-200/50 shadow-xl shadow-slate-200/50" />

                        <div className="relative p-8">
                            {/* Item Preview */}
                            <div className="flex items-start gap-6 mb-6">
                                <div className="w-24 h-28 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center border border-slate-200/50">
                                    <img src={calculatorSvg} alt="Calculator" className="w-16 h-20" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900">Scientific Calculator</h3>
                                    <p className="text-slate-500 text-sm mt-1">Casio FX-991EX ClassWiz</p>
                                    <div className="mt-3 flex items-center gap-2">
                                        <span className="text-xl font-semibold text-slate-900">₹850</span>
                                        <span className="text-sm text-slate-400 line-through">₹1,200</span>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {tags.map((tag, i) => (
                                    <motion.span
                                        key={tag}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ ...smoothTransition, delay: 0.3 + i * 0.1 }}
                                        viewport={{ once: true }}
                                        className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium"
                                    >
                                        {tag}
                                    </motion.span>
                                ))}
                            </div>

                            {/* Status */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ ...smoothTransition, delay: 0.7 }}
                                viewport={{ once: true }}
                                className="flex items-center gap-2 text-emerald-600"
                            >
                                <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-sm font-medium">Listed on SRM-SWAP</span>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 3: DISCOVERY - Smart, Not Flashy
// ============================================
const DiscoverySection = () => {
    return (
        <section
            className="min-h-screen flex items-center justify-center py-24 relative"
            style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)' }}
        >
            <div className="max-w-6xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={smoothTransition}
                    viewport={{ once: true }}
                    className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4"
                >
                    Smart Discovery
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothTransition, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-semibold text-slate-900 mb-12"
                >
                    Found through campus search.
                </motion.h2>

                {/* Search Interface */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ ...slowTransition, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="max-w-xl mx-auto"
                >
                    <div className="bg-white rounded-xl border border-slate-200 shadow-lg shadow-slate-200/50 p-2">
                        <div className="flex items-center gap-3 px-4 py-3">
                            <Search className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-600 font-medium">calculator engineering batch 2024</span>
                        </div>
                    </div>
                </motion.div>

                {/* Result */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ ...slowTransition, delay: 0.5 }}
                    viewport={{ once: true }}
                    className="mt-12 inline-block"
                >
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50 p-6 flex items-center gap-6">
                        <div className="w-20 h-24 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center">
                            <img src={calculatorSvg} alt="Calculator" className="w-14 h-18" />
                        </div>
                        <div className="text-left">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">Best Match</span>
                            </div>
                            <h3 className="font-semibold text-slate-900">Casio FX-991EX</h3>
                            <p className="text-sm text-slate-500">₹850 · Like New</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 4: EXCHANGE - Trust & Simplicity
// ============================================
const ExchangeSection = () => {
    return (
        <section
            className="min-h-screen flex items-center justify-center py-24 relative"
            style={{ background: '#FFFFFF' }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={slowTransition}
                        viewport={{ once: true }}
                        className="relative flex items-center justify-center"
                    >
                        {/* Abstract silhouettes */}
                        <div className="flex items-end gap-8">
                            {/* Person 1 */}
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-slate-200 rounded-full" />
                                <div className="w-10 h-16 bg-slate-200 rounded-lg mt-2" />
                            </div>

                            {/* Item transfer */}
                            <motion.div
                                initial={{ x: -20 }}
                                whileInView={{ x: 20 }}
                                transition={{ ...slowTransition, delay: 0.5 }}
                                viewport={{ once: true }}
                                className="relative -mb-4"
                            >
                                <div className="w-8 h-10 bg-gradient-to-br from-slate-100 to-slate-200 rounded border border-slate-300 flex items-center justify-center">
                                    <div className="w-4 h-5 bg-slate-300 rounded-sm" />
                                </div>
                            </motion.div>

                            {/* Person 2 */}
                            <div className="flex flex-col items-center">
                                <div className="w-12 h-12 bg-slate-300 rounded-full" />
                                <div className="w-10 h-16 bg-slate-300 rounded-lg mt-2" />
                            </div>
                        </div>

                        {/* Check mark */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ ...smoothTransition, delay: 1 }}
                            viewport={{ once: true }}
                            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                        >
                            <Check className="w-4 h-4 text-white" />
                        </motion.div>
                    </motion.div>

                    {/* Text */}
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={smoothTransition}
                            viewport={{ once: true }}
                            className="text-sm font-medium text-blue-600 tracking-wide uppercase mb-4"
                        >
                            Trusted Exchange
                        </motion.p>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight"
                        >
                            Campus-only.
                            <br />
                            Verified. Simple.
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="mt-4 text-slate-600 max-w-sm leading-relaxed"
                        >
                            Meet in person. Exchange safely. Every user is verified with their SRM email.
                        </motion.p>

                        {/* Trust indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: 0.3 }}
                            viewport={{ once: true }}
                            className="mt-8 flex flex-wrap gap-6"
                        >
                            <div className="flex items-center gap-2 text-slate-600">
                                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                <span className="text-sm font-medium">SRM Verified</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Users className="w-5 h-5 text-blue-500" />
                                <span className="text-sm font-medium">Campus Meet-ups</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 5: IMPACT - Data-Led
// ============================================
const ImpactSection = () => {
    const stats = [
        { value: '1,247', label: 'Items Exchanged', subtext: 'this semester' },
        { value: '₹89K', label: 'Saved by Students', subtext: 'vs. buying new' },
        { value: '340kg', label: 'Waste Reduced', subtext: 'kept from landfills' },
    ];

    return (
        <section
            className="py-24 relative"
            style={{ background: 'linear-gradient(180deg, #FAFAFA 0%, #F5F5F5 100%)' }}
        >
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={smoothTransition}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-sm font-medium text-slate-500 tracking-wide uppercase mb-4">Impact</p>
                    <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
                        Numbers that matter.
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ ...smoothTransition, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl border border-slate-200/50 p-8 text-center shadow-sm"
                        >
                            <div className="text-4xl md:text-5xl font-semibold text-slate-900 mb-2 tracking-tight">
                                {stat.value}
                            </div>
                            <div className="text-slate-600 font-medium">{stat.label}</div>
                            <div className="text-slate-400 text-sm mt-1">{stat.subtext}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Simple trend indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ ...smoothTransition, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-12 flex justify-center"
                >
                    <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">+23% from last month</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 6: CTA - Clean, Confident
// ============================================
const CTASection = ({ onStart }: { onStart: () => void }) => {
    return (
        <section
            className="py-32 relative"
            style={{ background: '#FFFFFF' }}
        >
            <div className="max-w-3xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={smoothTransition}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-semibold text-slate-900 leading-tight"
                >
                    Reuse smarter.
                    <br />
                    Trade locally.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothTransition, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="mt-6 text-lg text-slate-500 max-w-md mx-auto"
                >
                    Join 1,200+ SRM students already saving money and reducing waste.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ ...smoothTransition, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mt-10"
                >
                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors inline-flex items-center gap-2 shadow-xl shadow-slate-900/10"
                    >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ ...smoothTransition, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-6 text-sm text-slate-400"
                >
                    Free for all SRM students
                </motion.p>
            </div>
        </section>
    );
};

export default LandingPage;
