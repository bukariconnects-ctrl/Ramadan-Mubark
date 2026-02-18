'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 0.5 + 0.5,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.5 + 0.3,
  }));
}

function Lantern({ particle, index }: { particle: Particle; index: number }) {
  return (
    <motion.div
      key={particle.id}
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 10, -10, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: particle.duration,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className={cn(
          'text-3xl filter drop-shadow-lg',
          index % 3 === 0 ? 'text-amber-400' : index % 3 === 1 ? 'text-yellow-400' : 'text-orange-400'
        )}
        style={{
          fontSize: `${particle.size * 2 + 1}rem`,
          opacity: particle.opacity,
          filter: `drop-shadow(0 0 ${particle.size * 20}px rgba(251, 191, 36, 0.6))`,
        }}
      >
        🪔
      </div>
    </motion.div>
  );
}

function NeonCrescent({ particle, index }: { particle: Particle; index: number }) {
  return (
    <motion.div
      key={particle.id}
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
      }}
      animate={{
        y: [0, -20, 0],
        rotate: [0, 15, -15, 0],
        scale: [1, 1.2, 1],
        opacity: [particle.opacity, particle.opacity * 1.5, particle.opacity],
      }}
      transition={{
        duration: particle.duration * 0.8,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className={cn(
          index % 3 === 0 ? 'text-fuchsia-400' : index % 3 === 1 ? 'text-cyan-400' : 'text-pink-400'
        )}
        style={{
          fontSize: `${particle.size * 2 + 0.5}rem`,
          filter: `drop-shadow(0 0 ${particle.size * 30}px currentColor)`,
        }}
      >
        🌙
      </div>
    </motion.div>
  );
}

function FloatingLeaf({ particle, index }: { particle: Particle; index: number }) {
  return (
    <motion.div
      key={particle.id}
      className="absolute pointer-events-none"
      style={{
        left: `${particle.x}%`,
        top: `${particle.y}%`,
      }}
      animate={{
        y: [0, -40, 0],
        x: [0, 20, -20, 0],
        rotate: [0, 45, -45, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: particle.duration * 1.2,
        delay: particle.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <div
        className={cn(
          index % 3 === 0 ? 'text-emerald-400' : index % 3 === 1 ? 'text-teal-300' : 'text-green-300'
        )}
        style={{
          fontSize: `${particle.size * 1.5 + 0.5}rem`,
          opacity: particle.opacity * 0.8,
          filter: `drop-shadow(0 0 ${particle.size * 15}px currentColor)`,
        }}
      >
        {index % 4 === 0 ? '🍃' : index % 4 === 1 ? '🌿' : index % 4 === 2 ? '🕊️' : '☁️'}
      </div>
    </motion.div>
  );
}

export function AnimatedBackground() {
  const { themeConfig } = useTheme();
  const particles = generateParticles(themeConfig.particleCount);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <motion.div
        className={cn(
          'absolute inset-0 bg-gradient-to-br',
          themeConfig.gradient.replace('bg-gradient-to-br ', '')
        )}
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 200%',
        }}
      />

      {/* Particles */}
      {particles.map((particle, index) => {
        if (themeConfig.particleType === 'lantern') {
          return <Lantern key={particle.id} particle={particle} index={index} />;
        } else if (themeConfig.particleType === 'neon') {
          return <NeonCrescent key={particle.id} particle={particle} index={index} />;
        } else {
          return <FloatingLeaf key={particle.id} particle={particle} index={index} />;
        }
      })}

      {/* Light rays for emerald theme */}
      {themeConfig.particleType === 'leaf' && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-full w-1 bg-gradient-to-b from-white/10 via-white/5 to-transparent"
              style={{
                left: `${20 + i * 15}%`,
                transform: `rotate(${-15 + i * 7}deg)`,
                transformOrigin: 'top center',
              }}
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scaleY: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 8,
                delay: i * 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      )}

      {/* Gold dust for royal theme */}
      {themeConfig.particleType === 'lantern' && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-amber-400"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                delay: Math.random() * 5,
                repeat: Infinity,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AnimatedBackground;
