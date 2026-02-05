import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

interface ScrollSectionProps {
    children: ReactNode;
    className?: string;
    id?: string;
}

/**
 * A wrapper for scroll-triggered sections with pinning behavior.
 * Uses Framer Motion's scroll progress for smooth animations.
 */
export const ScrollSection = ({ children, className = '', id }: ScrollSectionProps) => {
    const ref = useRef<HTMLDivElement>(null);
    // scrollYProgress available for child components if needed via context
    const { scrollYProgress: _scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });

    return (
        <section
            ref={ref}
            id={id}
            className={`min-h-screen relative ${className}`}
        >
            {children}
        </section>
    );
};

interface ParallaxItemProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

/**
 * An item that moves at a different speed than scroll (parallax effect).
 * speed > 1 = moves faster, speed < 1 = moves slower
 */
export const ParallaxItem = ({ children, speed = 0.5, className = '' }: ParallaxItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface FadeTextProps {
    children: ReactNode;
    direction?: 'up' | 'down' | 'left' | 'right';
    delay?: number;
    className?: string;
}

/**
 * Text that fades and slides in when it enters the viewport.
 */
export const FadeText = ({ children, direction = 'up', delay = 0, className = '' }: FadeTextProps) => {
    const directionOffset = {
        up: { y: 40, x: 0 },
        down: { y: -40, x: 0 },
        left: { y: 0, x: 40 },
        right: { y: 0, x: -40 }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directionOffset[direction] }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.22, 1, 0.36, 1]
            }}
            viewport={{ once: true, margin: "-100px" }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

interface FloatingParticlesProps {
    count?: number;
    color?: string;
}

/**
 * Soft floating dust/sparkle particles for ambient effect.
 */
export const FloatingParticles = ({ count = 20, color = 'rgba(255, 220, 100, 0.6)' }: FloatingParticlesProps) => {
    const particles = Array.from({ length: count }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 3 + 4,
        delay: Math.random() * 2
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full"
                    style={{
                        width: p.size,
                        height: p.size,
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        backgroundColor: color
                    }}
                    animate={{
                        y: [-20, 20, -20],
                        x: [-10, 10, -10],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: p.duration,
                        delay: p.delay,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
};

interface AnimatedCounterProps {
    value: number;
    suffix?: string;
    prefix?: string;
    className?: string;
}

/**
 * A number that animates up when it enters view.
 */
export const AnimatedCounter = ({ value, suffix = '', prefix = '', className = '' }: AnimatedCounterProps) => {
    return (
        <motion.span
            className={className}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
            >
                {prefix}
                <motion.span
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    {value.toLocaleString()}
                </motion.span>
                {suffix}
            </motion.span>
        </motion.span>
    );
};

/**
 * Hook to get scroll progress within a container.
 */
export const useScrollProgress = (ref: React.RefObject<HTMLElement | null>) => {
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"]
    });
    return scrollYProgress;
};
