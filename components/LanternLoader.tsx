'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LanternLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LanternLoader({
  size = 'md',
  text = 'جاري توليد التهنئة...',
  className,
}: LanternLoaderProps) {
  const { themeConfig } = useTheme();

  const sizeClasses = {
    sm: 'w-16 h-24 text-2xl',
    md: 'w-24 h-36 text-4xl',
    lg: 'w-32 h-48 text-5xl',
  };

  const glowColor =
    themeConfig.id === 'royal-gold'
      ? 'shadow-amber-500/60'
      : themeConfig.id === 'neon-souq'
      ? 'shadow-fuchsia-500/60'
      : 'shadow-emerald-500/60';

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {/* Lantern swinging animation */}
      <div className="relative">
        {/* String */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/30"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Lantern body */}
        <motion.div
          className={cn(
            'relative mt-12',
            sizeClasses[size]
          )}
          animate={{
            rotateZ: [-8, 8, -8],
            y: [0, -5, 0],
          }}
          transition={{
            rotateZ: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
          }}
          style={{ transformOrigin: 'top center' }}
        >
          {/* Inner glow pulse */}
          <motion.div
            className={cn(
              'absolute inset-0 rounded-full blur-xl',
              themeConfig.id === 'royal-gold' && 'bg-amber-500',
              themeConfig.id === 'neon-souq' && 'bg-fuchsia-500',
              themeConfig.id === 'emerald-peace' && 'bg-emerald-500'
            )}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Lantern emoji */}
          <motion.div
            className="relative z-10 text-center"
            animate={{
              filter: [
                'drop-shadow(0 0 10px currentColor)',
                'drop-shadow(0 0 30px currentColor)',
                'drop-shadow(0 0 10px currentColor)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span
              className={cn(
                themeConfig.id === 'royal-gold' && 'text-amber-400',
                themeConfig.id === 'neon-souq' && 'text-fuchsia-400',
                themeConfig.id === 'emerald-peace' && 'text-emerald-400'
              )}
            >
              🪔
            </span>
          </motion.div>

          {/* Light rays */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                'absolute top-1/2 left-1/2 w-px h-16 -translate-x-1/2 -translate-y-1/2',
                themeConfig.id === 'royal-gold' && 'bg-gradient-to-b from-amber-400/60 to-transparent',
                themeConfig.id === 'neon-souq' && 'bg-gradient-to-b from-fuchsia-400/60 to-transparent',
                themeConfig.id === 'emerald-peace' && 'bg-gradient-to-b from-emerald-400/60 to-transparent'
              )}
              style={{
                transform: `translateX(-50%) translateY(-50%) rotate(${i * 45}deg)`,
                transformOrigin: 'center',
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                scaleY: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </motion.div>

        {/* Floating particles around lantern */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute w-2 h-2 rounded-full',
              themeConfig.id === 'royal-gold' && 'bg-amber-400',
              themeConfig.id === 'neon-souq' && 'bg-fuchsia-400',
              themeConfig.id === 'emerald-peace' && 'bg-emerald-400'
            )}
            style={{
              left: `${20 + i * 15}%`,
              bottom: '20%',
            }}
            animate={{
              y: [0, -30 - Math.random() * 20],
              x: [0, (Math.random() - 0.5) * 20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <motion.p
        className={cn(
          'mt-8 text-lg font-medium text-center',
          themeConfig.id === 'royal-gold' && 'text-amber-200',
          themeConfig.id === 'neon-souq' && 'text-fuchsia-200',
          themeConfig.id === 'emerald-peace' && 'text-emerald-200'
        )}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {text}
      </motion.p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              'w-2 h-2 rounded-full',
              themeConfig.id === 'royal-gold' && 'bg-amber-400',
              themeConfig.id === 'neon-souq' && 'bg-fuchsia-400',
              themeConfig.id === 'emerald-peace' && 'bg-emerald-400'
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
