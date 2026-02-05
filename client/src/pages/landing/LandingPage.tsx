import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import the calculator SVG
import calculatorSvg from '../../assets/hero-calculator.svg';

const LandingPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={containerRef} className="bg-[#FAFAFA]">
            {/* The Film - One continuous scroll experience */}
            <FilmExperience />

            {/* End CTA */}
            <CTASection onStart={() => navigate('/login')} />
        </div>
    );
};

// ============================================
// THE FILM - Scroll-pinned cinematic experience
// Item stays center, world changes around it
// ============================================
const FilmExperience = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Scene boundaries (0-1 scroll progress)
    // Scene 1: 0.00 - 0.25 (Unused)
    // Scene 2: 0.25 - 0.50 (Listed)
    // Scene 3: 0.50 - 0.75 (Discovered)
    // Scene 4: 0.75 - 1.00 (Exchanged)

    // Item transforms - minimal, physical movement
    const itemScale = useTransform(scrollYProgress,
        [0, 0.1, 0.25, 0.35, 0.5, 0.6, 0.75, 0.85, 1],
        [0.9, 1, 1, 0.95, 0.95, 1, 1, 0.9, 0.85]
    );
    const itemY = useTransform(scrollYProgress,
        [0, 0.25, 0.5, 0.75, 1],
        [20, 0, 0, 0, 40]
    );
    const itemShadowOpacity = useTransform(scrollYProgress,
        [0, 0.1, 0.5, 0.9, 1],
        [0.05, 0.15, 0.15, 0.1, 0.05]
    );

    // Background depth - slow parallax
    const bgY = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1]);

    // Scene opacities - text replacement, one at a time
    const scene1Opacity = useTransform(scrollYProgress, [0, 0.15, 0.22, 0.28], [0, 1, 1, 0]);
    const scene2Opacity = useTransform(scrollYProgress, [0.22, 0.3, 0.47, 0.53], [0, 1, 1, 0]);
    const scene3Opacity = useTransform(scrollYProgress, [0.47, 0.55, 0.72, 0.78], [0, 1, 1, 0]);
    const scene4Opacity = useTransform(scrollYProgress, [0.72, 0.8, 0.95, 1], [0, 1, 1, 0.8]);

    // UI card transforms (midground layer)
    const cardOpacity = useTransform(scrollYProgress, [0.28, 0.35, 0.65, 0.72], [0, 1, 1, 0]);
    const cardY = useTransform(scrollYProgress, [0.28, 0.35, 0.65, 0.72], [40, 0, 0, -40]);
    const cardScale = useTransform(scrollYProgress, [0.28, 0.35], [0.95, 1]);

    // Glow/highlight effects
    const glowOpacity = useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 0.6, 0]);

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: '400vh' }} // 4 scenes worth of scroll
        >
            {/* Sticky viewport - everything pins here */}
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* BACKGROUND LAYER - Environment/gradients */}
                <motion.div
                    style={{ y: bgY, scale: bgScale }}
                    className="absolute inset-0"
                >
                    {/* Subtle gradient that shifts */}
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            background: 'radial-gradient(ellipse at 50% 50%, rgba(245,245,245,1) 0%, rgba(250,250,250,1) 100%)'
                        }}
                    />
                    {/* Ambient light spots */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-50/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-slate-100/40 rounded-full blur-3xl" />
                </motion.div>

                {/* MIDGROUND LAYER - UI Cards */}
                <motion.div
                    style={{ opacity: cardOpacity, y: cardY, scale: cardScale }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 translate-x-32 md:translate-x-48">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#E5E5E5] p-5 shadow-lg w-56">
                            <div className="text-xs text-[#A3A3A3] mb-2">Listed on SRM-SWAP</div>
                            <div className="font-semibold text-[#0A0A0A]">Casio FX-991EX</div>
                            <div className="text-sm text-[#6B6B6B] mt-1">₹850</div>
                            <div className="flex gap-1.5 mt-3">
                                <span className="px-2 py-0.5 bg-[#F5F5F5] text-[10px] text-[#6B6B6B] rounded">Engineering</span>
                                <span className="px-2 py-0.5 bg-[#F5F5F5] text-[10px] text-[#6B6B6B] rounded">Like New</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Discovery glow effect */}
                <motion.div
                    style={{ opacity: glowOpacity }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                    <div className="w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
                </motion.div>

                {/* FOREGROUND LAYER - The Item (pinned center) */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        style={{ scale: itemScale, y: itemY }}
                        className="relative"
                    >
                        {/* Item shadow - physical grounding */}
                        <motion.div
                            style={{ opacity: itemShadowOpacity }}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 h-3 bg-black rounded-full blur-xl"
                        />
                        {/* The calculator */}
                        <img
                            src={calculatorSvg}
                            alt="Calculator"
                            className="w-44 md:w-56 lg:w-64 relative z-10"
                        />
                    </motion.div>
                </div>

                {/* TEXT LAYER - One sentence at a time */}
                <div className="absolute inset-0 flex items-end justify-center pb-24 md:pb-32 pointer-events-none">
                    <div className="text-center max-w-xl px-6 relative h-20">
                        {/* Scene 1: Unused */}
                        <motion.p
                            style={{ opacity: scene1Opacity }}
                            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight"
                        >
                            Sitting unused. Still valuable.
                        </motion.p>

                        {/* Scene 2: Listed */}
                        <motion.p
                            style={{ opacity: scene2Opacity }}
                            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight"
                        >
                            Listed in under a minute.
                        </motion.p>

                        {/* Scene 3: Discovered */}
                        <motion.p
                            style={{ opacity: scene3Opacity }}
                            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight"
                        >
                            Found by who needs it.
                        </motion.p>

                        {/* Scene 4: Exchanged */}
                        <motion.p
                            style={{ opacity: scene4Opacity }}
                            className="absolute inset-0 flex items-center justify-center text-2xl md:text-3xl font-medium text-[#0A0A0A] tracking-tight"
                        >
                            Exchanged on campus. Simple.
                        </motion.p>
                    </div>
                </div>

                {/* Progress indicator - subtle */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                    {[0, 1, 2, 3].map((i) => (
                        <SceneDot key={i} index={i} scrollYProgress={scrollYProgress} />
                    ))}
                </div>

                {/* Scroll hint - only in first scene */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.05, 0.15], [1, 1, 0])
                    }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-8 border border-[#D4D4D4] rounded-full flex justify-center pt-1.5"
                    >
                        <div className="w-1 h-1 bg-[#A3A3A3] rounded-full" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

// Scene progress dot
const SceneDot = ({ index, scrollYProgress }: { index: number; scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'] }) => {
    const sceneStart = index * 0.25;
    const sceneEnd = (index + 1) * 0.25;

    const opacity = useTransform(
        scrollYProgress,
        [sceneStart - 0.05, sceneStart, sceneEnd, sceneEnd + 0.05],
        [0.3, 1, 1, 0.3]
    );
    const scale = useTransform(
        scrollYProgress,
        [sceneStart, sceneStart + 0.05, sceneEnd - 0.05, sceneEnd],
        [1, 1.5, 1.5, 1]
    );

    return (
        <motion.div
            style={{ opacity, scale }}
            className="w-1.5 h-1.5 bg-[#A3A3A3] rounded-full"
        />
    );
};

// ============================================
// CTA - Clean ending
// ============================================
const CTASection = ({ onStart }: { onStart: () => void }) => {
    return (
        <section className="py-32 bg-[#0A0A0A]">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-semibold text-white tracking-tight"
                >
                    Ready to give it a second life?
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
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
                    transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="mt-6 text-sm text-[#6B6B6B]"
                >
                    Free for all SRM students
                </motion.p>
            </div>
        </section>
    );
};

export default LandingPage;
