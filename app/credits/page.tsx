'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Code, Sparkles, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DeveloperCardProps {
  name: string;
  role: string;
  emoji: string;
  delay: number;
}

function DeveloperCard({ name, role, emoji, delay }: DeveloperCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.8, type: 'spring' }}
      whileHover={{ scale: 1.05, y: -10 }}
      className="relative group"
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-500 to-emerald-500 rounded-3xl blur-xl opacity-25 group-hover:opacity-60 transition duration-1000"
        animate={{
          background: [
            'linear-gradient(to right, #f59e0b, #8b5cf6, #10b981)',
            'linear-gradient(to right, #8b5cf6, #10b981, #f59e0b)',
            'linear-gradient(to right, #10b981, #f59e0b, #8b5cf6)',
          ],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
        }}
      />

      {/* Card */}
      <div className="relative p-8 rounded-3xl bg-slate-950/80 border border-white/10 backdrop-blur-xl overflow-hidden">
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />

        {/* Content */}
        <div className="relative z-10 text-center">
          {/* Character emoji */}
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            {emoji}
          </motion.div>

          {/* Name with glow */}
          <motion.h3
            className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-2"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.5))',
            }}
          >
            {name}
          </motion.h3>

          {/* Role */}
          <p className="text-slate-400 text-sm md:text-base">{role}</p>

          {/* Decorative line */}
          <motion.div
            className="w-16 h-0.5 mx-auto mt-4 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: delay + 0.3, duration: 0.8 }}
          />
        </div>

        {/* Floating sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-amber-400/40"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + (i % 2) * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 3,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          >
            <Sparkles size={16} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function CreditsPage() {
  const developers = [
    {
      name: 'Ahmed Nazih Al-Maqtari',
      role: 'Tech Lead',
      emoji: '👨‍💻',
    },
    {
      name: 'Mohammed Jameel Al-Kholidi',
      role: 'Creative Director',
      emoji: '🎨',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Animated stars */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
            }}
          />
        ))}

        {/* Light rays */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-amber-500/10 via-transparent to-transparent"
            style={{
              left: `${30 + i * 20}%`,
              transform: `rotate(${-10 + i * 10}deg)`,
              transformOrigin: 'top center',
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              delay: i * 2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-8 left-8"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
            <span>العودة</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🌙
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-4">
            Developed with
          </h1>
          <motion.div
            className="flex items-center justify-center gap-2 text-2xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <Heart className="text-red-500 fill-red-500" size={28} />
            <span className="text-slate-300">by</span>
          </motion.div>
        </motion.div>

        {/* Developer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
          {developers.map((dev, index) => (
            <DeveloperCard
              key={dev.name}
              name={dev.name}
              role={dev.role}
              emoji={dev.emoji}
              delay={0.3 + index * 0.2}
            />
          ))}
        </div>

        {/* Tech stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
            <Code size={16} />
            <span className="text-sm">Built with</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            {['Next.js 14', 'Tailwind CSS', 'Framer Motion', 'Supabase', 'Hugging Face'].map(
              (tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/20 transition-all"
                >
                  {tech}
                </motion.span>
              )
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-16 text-center text-slate-600 text-sm"
        >
          <p>© {new Date().getFullYear()} Ramadan Wishes AI</p>
          <p className="mt-1">رمضان كريم 🌙</p>
        </motion.div>
      </div>
    </div>
  );
}
