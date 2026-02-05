import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Shield, MapPin, Repeat } from 'lucide-react';

// Import the calculator SVG
import calculatorSvg from '../../assets/hero-calculator.svg';

// Cinematic easing - no bounce, no elastic
const smoothEase = [0.22, 1, 0.36, 1] as [number, number, number, number];

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-white">
            <HeroSection />
            <ValueSection />
            <HowItWorksSection />
            <TrustSection />
            <CTASection onStart={() => navigate('/login')} />
        </div>
    );
};

// ============================================
// SECTION 1: HERO - Apple Product Page Style
// One idea: The product, front and center
// ============================================
const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    // Camera-like parallax (item moves slower than scroll)
    const itemY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const itemScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
    const itemOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    return (
        <section
            ref={ref}
            className="h-screen flex flex-col items-center justify-center relative overflow-hidden"
        >
            {/* Clean white background */}
            <div className="absolute inset-0 bg-[#FAFAFA]" />

            {/* Content - centered, minimal */}
            <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
                {/* Headline - Linear style: sharp, confident */}
                <motion.h1
                    style={{ y: textY }}
                    className="text-5xl md:text-7xl lg:text-8xl font-semibold text-[#0A0A0A] tracking-tight leading-[0.95]"
                >
                    Give it a
                    <br />
                    second life.
                </motion.h1>

                {/* Subhead - minimal */}
                <motion.p
                    style={{ y: textY }}
                    className="mt-6 text-lg md:text-xl text-[#6B6B6B] max-w-md mx-auto"
                >
                    Trade items with verified students on your campus.
                </motion.p>
            </div>

            {/* Product - Apple style: centered, hero treatment */}
            <motion.div
                style={{ y: itemY, scale: itemScale, opacity: itemOpacity }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2"
            >
                <img
                    src={calculatorSvg}
                    alt="Calculator"
                    className="w-40 md:w-52 lg:w-64"
                />
                {/* Subtle reflection */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-2 bg-black/5 blur-xl rounded-full" />
            </motion.div>

            {/* Scroll hint - minimal */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-8 border border-[#D4D4D4] rounded-full flex justify-center pt-1.5"
                >
                    <div className="w-1 h-1 bg-[#A3A3A3] rounded-full" />
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 2: VALUE - One idea: Why this matters
// Stripe-style spacing and grid
// ============================================
const ValueSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

    return (
        <section
            ref={ref}
            className="min-h-screen flex items-center py-32 bg-white"
        >
            <div className="max-w-6xl mx-auto px-6 w-full">
                <motion.div style={{ opacity, y }}>
                    {/* Section label */}
                    <p className="text-xs font-medium text-[#0066FF] tracking-widest uppercase mb-6">
                        The Problem
                    </p>

                    {/* Big statement - one idea */}
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0A0A0A] tracking-tight leading-tight max-w-3xl">
                        Every semester, students buy new.
                        <span className="text-[#A3A3A3]"> Most of it sits unused.</span>
                    </h2>

                    {/* Stats grid - Stripe style */}
                    <div className="mt-20 grid md:grid-cols-3 gap-1">
                        {[
                            { value: '₹2.4L+', label: 'Worth of items sitting idle on campus' },
                            { value: '340kg', label: 'Potential waste reduction this year' },
                            { value: '2 min', label: 'Average time to list an item' },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: smoothEase }}
                                viewport={{ once: true }}
                                className="p-8 bg-[#FAFAFA] first:rounded-l-2xl last:rounded-r-2xl"
                            >
                                <div className="text-3xl md:text-4xl font-semibold text-[#0A0A0A] tracking-tight">
                                    {stat.value}
                                </div>
                                <div className="mt-2 text-sm text-[#6B6B6B]">
                                    {stat.label}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 3: HOW IT WORKS - Notion style storytelling
// Clean steps, real product feel
// ============================================
const HowItWorksSection = () => {
    const steps = [
        {
            number: '01',
            title: 'List your item',
            description: 'Take a photo, set your price or trade terms. Takes under 2 minutes.',
        },
        {
            number: '02',
            title: 'Get discovered',
            description: 'Smart tags connect your item with students who need it.',
        },
        {
            number: '03',
            title: 'Meet on campus',
            description: 'Exchange in person. Verified students only. No shipping needed.',
        },
    ];

    return (
        <section className="py-32 bg-[#FAFAFA]">
            <div className="max-w-6xl mx-auto px-6">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="max-w-2xl"
                >
                    <p className="text-xs font-medium text-[#0066FF] tracking-widest uppercase mb-6">
                        How it works
                    </p>
                    <h2 className="text-4xl md:text-5xl font-semibold text-[#0A0A0A] tracking-tight">
                        Simple by design.
                    </h2>
                </motion.div>

                {/* Steps - clean grid */}
                <div className="mt-20 grid md:grid-cols-3 gap-12">
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.number}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: smoothEase }}
                            viewport={{ once: true }}
                        >
                            <div className="text-sm font-medium text-[#A3A3A3] mb-4">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-semibold text-[#0A0A0A] mb-3">
                                {step.title}
                            </h3>
                            <p className="text-[#6B6B6B] leading-relaxed">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Product showcase - centered item */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="mt-24 flex justify-center"
                >
                    <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm max-w-md w-full">
                        <div className="flex items-start gap-5">
                            <div className="w-20 h-24 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                                <img src={calculatorSvg} alt="Calculator" className="w-14" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-[#0A0A0A]">Casio FX-991EX</h4>
                                <p className="text-sm text-[#6B6B6B] mt-0.5">Scientific Calculator</p>
                                <div className="flex items-baseline gap-2 mt-3">
                                    <span className="text-xl font-semibold text-[#0A0A0A]">₹850</span>
                                    <span className="text-sm text-[#A3A3A3] line-through">₹1,200</span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <span className="px-2.5 py-1 bg-[#F5F5F5] text-xs text-[#6B6B6B] rounded-md">Engineering</span>
                                    <span className="px-2.5 py-1 bg-[#F5F5F5] text-xs text-[#6B6B6B] rounded-md">Like New</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 4: TRUST - Airbnb style human trust
// Stripe-level credibility
// ============================================
const TrustSection = () => {
    const trustPoints = [
        {
            icon: Shield,
            title: 'SRM Verified',
            description: 'Every user verified with their official SRM email. No outsiders.',
        },
        {
            icon: MapPin,
            title: 'Campus Only',
            description: 'Meet in familiar spots. No shipping, no strangers.',
        },
        {
            icon: Repeat,
            title: 'Fair Exchange',
            description: 'Ratings and reviews keep the community accountable.',
        },
    ];

    return (
        <section className="py-32 bg-white">
            <div className="max-w-6xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="text-center max-w-2xl mx-auto"
                >
                    <p className="text-xs font-medium text-[#0066FF] tracking-widest uppercase mb-6">
                        Built on trust
                    </p>
                    <h2 className="text-4xl md:text-5xl font-semibold text-[#0A0A0A] tracking-tight">
                        Trade with confidence.
                    </h2>
                </motion.div>

                {/* Trust grid */}
                <div className="mt-20 grid md:grid-cols-3 gap-8">
                    {trustPoints.map((point, i) => (
                        <motion.div
                            key={point.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1, ease: smoothEase }}
                            viewport={{ once: true }}
                            className="text-center p-8"
                        >
                            <div className="w-12 h-12 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-5">
                                <point.icon className="w-5 h-5 text-[#0A0A0A]" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-semibold text-[#0A0A0A] mb-2">
                                {point.title}
                            </h3>
                            <p className="text-[#6B6B6B] text-sm leading-relaxed">
                                {point.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// SECTION 5: CTA - Linear style: clean, confident
// ============================================
const CTASection = ({ onStart }: { onStart: () => void }) => {
    return (
        <section className="py-32 bg-[#0A0A0A]">
            <div className="max-w-4xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight"
                >
                    Reuse smarter.
                    <br />
                    Trade locally.
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="mt-6 text-[#A3A3A3] text-lg"
                >
                    Join 1,200+ SRM students already on the platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="mt-10"
                >
                    <button
                        onClick={onStart}
                        className="px-8 py-4 bg-white text-[#0A0A0A] font-medium rounded-full hover:bg-[#F5F5F5] transition-colors inline-flex items-center gap-2"
                    >
                        Get started
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: smoothEase }}
                    viewport={{ once: true }}
                    className="mt-6 text-xs text-[#6B6B6B]"
                >
                    Free for all SRM students
                </motion.p>
            </div>
        </section>
    );
};

export default LandingPage;
