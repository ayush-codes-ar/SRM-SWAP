import { motion } from 'framer-motion';
import React, { useRef, useState } from 'react';

interface AnimatedButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationRestart'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        setMousePos({ x: x * 0.15, y: y * 0.15 });
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
            setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);

        if (props.onClick) props.onClick(e);
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
    };

    const variants = {
        primary: 'bg-black text-white hover:bg-blue-600 shadow-xl shadow-black/10 hover:animate-[glow_2s_infinite]',
        secondary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20 hover:animate-[glow_2s_infinite]',
        outline: 'bg-white text-black border-2 border-gray-100 hover:border-black hover:bg-gray-50',
        danger: 'bg-red-500 text-white hover:bg-red-600 shadow-xl shadow-red-500/20'
    };

    const sizes = {
        sm: 'px-4 py-2 text-[10px]',
        md: 'px-8 py-4 text-xs',
        lg: 'px-12 py-5 text-sm'
    };

    return (
        <motion.button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            animate={{ x: mousePos.x, y: mousePos.y }}
            transition={{ type: 'spring' as const, stiffness: 200, damping: 20, mass: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
                relative overflow-hidden font-black uppercase tracking-[0.2em] rounded-full transition-all duration-500
                ${variants[variant]} 
                ${sizes[size]} 
                ${className}
            `}
            {...props}
        >
            <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="ripple-circle"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: '20px',
                        height: '20px',
                        marginLeft: '-10px',
                        marginTop: '-10px'
                    }}
                />
            ))}
        </motion.button>
    );
};

export default AnimatedButton;
