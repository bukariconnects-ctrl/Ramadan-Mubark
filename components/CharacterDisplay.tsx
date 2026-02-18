'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CharacterDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CharacterDisplay({ size = 'md', className }: CharacterDisplayProps) {
  const { themeConfig } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring animation for parallax
  const springConfig = { stiffness: 100, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), springConfig);
  
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Normalize to -0.5 to 0.5
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2);
      
      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const sizeClasses = {
    sm: 'w-24 h-24 text-5xl',
    md: 'w-40 h-40 text-7xl',
    lg: 'w-56 h-56 text-9xl',
  };

  const glowColors = {
    'royal-gold': 'shadow-amber-500/50',
    'neon-souq': 'shadow-fuchsia-500/50',
    'emerald-peace': 'shadow-emerald-500/50',
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn('relative', className)}
      style={{
        perspective: 1000,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect behind character */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full blur-3xl opacity-40',
          glowColors[themeConfig.id]
        )}
        animate={{
          scale: isHovered ? 1.3 : [1, 1.2, 1],
          opacity: isHovered ? 0.6 : [0.3, 0.5, 0.3],
        }}
        transition={{
          scale: { duration: 0.3 },
          opacity: { duration: 3, repeat: Infinity },
        }}
      />

      {/* Main character container with 3D tilt */}
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-3xl',
          sizeClasses[size]
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          y: [0, -15, 0],
          rotateZ: [0, 2, -2, 0],
        }}
        transition={{
          y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          rotateZ: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Character emoji with shadow layers for 3D effect */}
        <motion.div
          className="relative"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Shadow layers for depth */}
          <div
            className="absolute inset-0 blur-sm opacity-30"
            style={{
              textShadow: '0 20px 40px rgba(0,0,0,0.5)',
              transform: 'translateY(10px) scale(0.9)',
            }}
          >
            {themeConfig.characterImage}
          </div>
          
          {/* Main character */}
          <motion.div
            className="relative z-10 drop-shadow-2xl"
            style={{
              filter: `drop-shadow(0 0 30px ${
                themeConfig.id === 'royal-gold' 
                  ? 'rgba(251, 191, 36, 0.6)' 
                  : themeConfig.id === 'neon-souq'
                  ? 'rgba(232, 121, 249, 0.6)'
                  : 'rgba(52, 211, 153, 0.6)'
              })`,
            }}
          >
            {themeConfig.characterImage}
          </motion.div>

          {/* Floating sparkles around character */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute text-lg',
                themeConfig.id === 'royal-gold' && 'text-amber-300',
                themeConfig.id === 'neon-souq' && 'text-fuchsia-300',
                themeConfig.id === 'emerald-peace' && 'text-emerald-300'
              )}
              style={{
                top: `${20 + i * 25}%`,
                left: i % 2 === 0 ? '-20%' : '110%',
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>

        {/* Ground shadow */}
        <motion.div
          className="absolute -bottom-4 w-1/2 h-4 bg-black/20 rounded-full blur-md"
          animate={{
            scale: [1, 0.8, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Interactive tooltip on hover */}
      <motion.div
        className={cn(
          'absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap',
          'glass-strong backdrop-blur-md',
          themeConfig.id === 'royal-gold' && 'text-amber-200 border-amber-500/30',
          themeConfig.id === 'neon-souq' && 'text-fuchsia-200 border-fuchsia-500/30',
          themeConfig.id === 'emerald-peace' && 'text-emerald-200 border-emerald-500/30'
        )}
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: isHovered ? 1 : 0, 
          y: isHovered ? 0 : 10 
        }}
        transition={{ duration: 0.2 }}
      >
        أهلاً بك في {themeConfig.nameAr}!
      </motion.div>
    </motion.div>
  );
}
