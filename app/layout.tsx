import type { Metadata } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import AnimatedBackground from '@/components/AnimatedBackground';

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-cairo',
});

export const metadata: Metadata = {
  title: 'Ramadan Wishes AI - تهاني رمضان الذكية',
  description: 'أنشئ تهاني رمضان مخصصة باستخدام الذكاء الاصطناعي وشاركها مع أحبائك عبر واتساب',
  keywords: 'رمضان, تهاني, ذكاء اصطناعي, واتساب, بطاقات تهنئة',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairo.variable} font-arabic`}>
        <ThemeProvider>
          <AnimatedBackground />
          <main className="relative z-10 min-h-screen">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
