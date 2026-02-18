'use client';

import { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PremiumCardProps {
  message: string;
  senderName?: string;
  recipientName?: string;
  className?: string;
  isPreview?: boolean;
}

export default function PremiumCard({
  message,
  senderName,
  recipientName,
  className,
  isPreview = false,
}: PremiumCardProps) {
  const { themeConfig } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position for tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation
  const springConfig = { stiffness: 300, damping: 30 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const themeStyles = {
    'royal-gold': {
      gradient: 'bg-gradient-to-br from-amber-900/80 via-blue-950/90 to-slate-900/95',
      border: 'border-amber-500/40',
      glow: 'shadow-amber-500/30',
      text: 'text-amber-50',
      accent: 'text-amber-300',
      highlight: 'from-amber-400/20 to-transparent',
      icon: '🪔',
    },
    'neon-souq': {
      gradient: 'bg-gradient-to-br from-fuchsia-900/80 via-purple-950/90 to-pink-950/95',
      border: 'border-fuchsia-500/40',
      glow: 'shadow-fuchsia-500/30',
      text: 'text-fuchsia-50',
      accent: 'text-cyan-300',
      highlight: 'from-cyan-400/20 to-transparent',
      icon: '🌙',
    },
    'emerald-peace': {
      gradient: 'bg-gradient-to-br from-emerald-900/80 via-green-950/90 to-teal-950/95',
      border: 'border-emerald-500/40',
      glow: 'shadow-emerald-500/30',
      text: 'text-emerald-50',
      accent: 'text-teal-300',
      highlight: 'from-emerald-400/20 to-transparent',
      icon: '🌿',
    },
  };

  const styles = themeStyles[themeConfig.id];

  return (
    <div className={cn('perspective-1000', className)}>
      <motion.div
        ref={cardRef}
        className={cn(
          'relative rounded-3xl overflow-hidden cursor-pointer',
          'backdrop-blur-xl border-2',
          styles.gradient,
          styles.border
        )}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          boxShadow: isHovered
            ? `0 25px 50px -12px ${
                themeConfig.id === 'royal-gold'
                  ? 'rgba(251, 191, 36, 0.4)'
                  : themeConfig.id === 'neon-souq'
                  ? 'rgba(232, 121, 249, 0.4)'
                  : 'rgba(52, 211, 153, 0.4)'
              }`
            : '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        animate={{
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Glass shimmer effect */}
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-br opacity-50',
            styles.highlight
          )}
        />

        {/* Inner border glow */}
        <div
          className={cn(
            'absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500',
            isHovered && 'opacity-100'
          )}
          style={{
            boxShadow: `inset 0 0 60px ${
              themeConfig.id === 'royal-gold'
                ? 'rgba(251, 191, 36, 0.2)'
                : themeConfig.id === 'neon-souq'
                ? 'rgba(232, 121, 249, 0.2)'
                : 'rgba(52, 211, 153, 0.2)'
            }`,
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-4 right-4 text-3xl opacity-60">{styles.icon}</div>
        <div className="absolute bottom-4 left-4 text-3xl opacity-60">{styles.icon}</div>

        {/* Main content */}
        <div className={cn('relative z-10 p-8 md:p-10', isPreview ? 'min-h-[280px]' : 'min-h-[380px]')}>
          {/* Header */}
          <motion.div
            className={cn('text-center mb-6', styles.accent)}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-wide drop-shadow-lg">
              رمضان كريم
            </h2>
            <div className="mt-2 text-sm opacity-70">
              {new Date().getFullYear()} {new Date().getFullYear() - 1452} هـ
            </div>
          </motion.div>

          {/* Decorative line */}
          <motion.div
            className={cn('h-px w-24 mx-auto mb-6', styles.accent.replace('text-', 'bg-'))}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />

          {/* Recipient */}
          {recipientName && (
            <motion.div
              className={cn('text-center mb-4 text-lg', styles.text)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
            >
              إلى: <span className="font-semibold">{recipientName}</span>
            </motion.div>
          )}

          {/* Message */}
          <motion.div
            className={cn(
              'text-center text-xl md:text-2xl leading-relaxed mb-6',
              styles.text
            )}
            style={{
              textShadow: `0 0 30px ${
                themeConfig.id === 'royal-gold'
                  ? 'rgba(251, 191, 36, 0.3)'
                  : themeConfig.id === 'neon-souq'
                  ? 'rgba(232, 121, 249, 0.3)'
                  : 'rgba(52, 211, 153, 0.3)'
              }`,
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {message}
          </motion.div>

          {/* Sender */}
          {senderName && (
            <motion.div
              className={cn('text-center text-base', styles.text)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6 }}
            >
              من: <span className="font-medium">{senderName}</span>
            </motion.div>
          )}

          {/* Bottom decoration */}
          <motion.div
            className={cn('flex justify-center mt-6', styles.accent)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: 'spring' }}
          >
            <span className="text-2xl">✦</span>
          </motion.div>
        </div>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: '-100%', opacity: 0 }}
          animate={{
            x: isHovered ? '100%' : '-100%',
            opacity: isHovered ? 0.3 : 0,
          }}
          transition={{ duration: 0.8 }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          }}
        />
      </motion.div>

      {/* Reflection/shadow beneath */}
      <div
        className={cn(
          'absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30',
          styles.glow.replace('shadow-', 'bg-')
        )}
      />
    </div>
  );
}
