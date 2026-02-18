'use client';

import { motion } from 'framer-motion';
import { themes, Theme } from '@/config/themes';

interface ThemeSelectorProps {
  selectedTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemeSelector({
  selectedTheme,
  onSelect,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-amber-200 text-sm font-medium">
        اختر تصميم البطاقة
      </label>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {themes.map((theme) => (
          <motion.button
            key={theme.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(theme.id)}
            className={`relative flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden transition-all duration-300 ${
              selectedTheme === theme.id
                ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            {/* Theme preview background */}
            <div className={`absolute inset-0 ${theme.gradient}`} />
            <div className="absolute inset-0 glass" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-2 text-center">
              <span className="text-2xl mb-2">{theme.icon}</span>
              <span className={`text-xs font-medium ${theme.textColor}`}>
                {theme.nameAr}
              </span>
            </div>

            {/* Selected indicator */}
            {selectedTheme === theme.id && (
              <motion.div
                layoutId="selected"
                className="absolute inset-0 border-2 border-amber-400 rounded-xl"
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
