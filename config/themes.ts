export interface Theme {
  id: string;
  name: string;
  nameAr: string;
  gradient: string;
  textColor: string;
  accentColor: string;
  borderColor: string;
  icon: string;
}

export const themes: Theme[] = [
  {
    id: 'golden-night',
    name: 'Golden Night',
    nameAr: 'الليلة الذهبية',
    gradient: 'bg-gradient-to-br from-slate-900 via-amber-950 to-yellow-950',
    textColor: 'text-amber-100',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    icon: '🌙',
  },
  {
    id: 'minimalist-green',
    name: 'Minimalist Green',
    nameAr: 'الأخضر البسيط',
    gradient: 'bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-800',
    textColor: 'text-emerald-50',
    accentColor: 'text-emerald-300',
    borderColor: 'border-emerald-500/30',
    icon: '🌿',
  },
  {
    id: 'modern-purple',
    name: 'Modern Purple',
    nameAr: 'البنفسجي العصري',
    gradient: 'bg-gradient-to-br from-purple-900 via-pink-900 to-purple-800',
    textColor: 'text-purple-50',
    accentColor: 'text-pink-300',
    borderColor: 'border-pink-500/30',
    icon: '✨',
  },
];

export function getThemeById(id: string): Theme {
  return themes.find((theme) => theme.id === id) || themes[0];
}
