'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type ThemeType = 'royal-gold' | 'neon-souq' | 'emerald-peace';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  glow: string;
  text: string;
  border: string;
}

export interface ThemeConfig {
  id: ThemeType;
  name: string;
  nameAr: string;
  icon: string;
  gradient: string;
  colors: ThemeColors;
  particleType: 'lantern' | 'neon' | 'leaf';
  particleCount: number;
  characterImage: string;
}

const themes: Record<ThemeType, ThemeConfig> = {
  'royal-gold': {
    id: 'royal-gold',
    name: 'Royal Gold',
    nameAr: 'الذهبي الملكي',
    icon: '🪔',
    gradient: 'bg-gradient-to-br from-slate-950 via-blue-950 to-amber-950',
    colors: {
      primary: 'amber-500',
      secondary: 'amber-300',
      accent: 'amber-400',
      background: 'from-slate-950 via-blue-950 to-amber-950',
      glow: 'amber-500',
      text: 'amber-50',
      border: 'amber-500/30',
    },
    particleType: 'lantern',
    particleCount: 15,
    characterImage: '🧞',
  },
  'neon-souq': {
    id: 'neon-souq',
    name: 'Neon Souq',
    nameAr: 'سوق النيون',
    icon: '🌙',
    gradient: 'bg-gradient-to-br from-purple-950 via-fuchsia-950 to-pink-950',
    colors: {
      primary: 'fuchsia-500',
      secondary: 'pink-400',
      accent: 'cyan-400',
      background: 'from-purple-950 via-fuchsia-950 to-pink-950',
      glow: 'fuchsia-500',
      text: 'fuchsia-50',
      border: 'fuchsia-500/30',
    },
    particleType: 'neon',
    particleCount: 20,
    characterImage: '🤖',
  },
  'emerald-peace': {
    id: 'emerald-peace',
    name: 'Emerald Peace',
    nameAr: 'ال emerald السلام',
    icon: '🌿',
    gradient: 'bg-gradient-to-br from-emerald-950 via-green-900 to-teal-950',
    colors: {
      primary: 'emerald-500',
      secondary: 'teal-300',
      accent: 'green-300',
      background: 'from-emerald-950 via-green-900 to-teal-950',
      glow: 'emerald-400',
      text: 'emerald-50',
      border: 'emerald-500/30',
    },
    particleType: 'leaf',
    particleCount: 18,
    characterImage: '🧚',
  },
};

interface ThemeContextType {
  currentTheme: ThemeType;
  themeConfig: ThemeConfig;
  setTheme: (theme: ThemeType) => void;
  allThemes: ThemeType[];
  getThemeConfig: (theme: ThemeType) => ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('royal-gold');

  const value: ThemeContextType = {
    currentTheme,
    themeConfig: themes[currentTheme],
    setTheme: setCurrentTheme,
    allThemes: Object.keys(themes) as ThemeType[],
    getThemeConfig: (theme: ThemeType) => themes[theme],
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { themes };
