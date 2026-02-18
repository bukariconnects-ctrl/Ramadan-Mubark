import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCardById } from '@/lib/supabaseClient';
import { getThemeById } from '@/config/themes';
import ThemeCard from '@/components/ThemeCard';
import Link from 'next/link';

interface CardPageProps {
  params: { id: string };
}

// For static export, we need to pre-render some paths
export async function generateStaticParams() {
  // Use a valid UUID format for placeholder
  return [{ id: '00000000-0000-0000-0000-000000000000' }];
}

export async function generateMetadata({ params }: CardPageProps): Promise<Metadata> {
  // Skip metadata generation for placeholder during build
  if (params.id === '00000000-0000-0000-0000-000000000000') {
    return {
      title: 'Ramadan Wishes AI',
    };
  }

  const card = await getCardById(params.id);
  
  if (!card) {
    return {
      title: 'بطاقة غير موجودة - Ramadan Wishes AI',
    };
  }

  return {
    title: `تهنئة رمضان لـ ${card.recipient_name} - Ramadan Wishes AI`,
    description: card.message_content.slice(0, 150),
  };
}

export default async function CardPage({ params }: CardPageProps) {
  // During static build, show placeholder content
  if (params.id === '00000000-0000-0000-0000-000000000000') {
    const theme = getThemeById('golden-night');
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          <ThemeCard
            theme={theme}
            message="رمضان كريم! 🌙 تقبل الله صيامك وقيامك. كل عام وأنت بخير! 🌟"
            senderName="صديق"
            recipientName="عزيزي"
          />
          <div className="mt-8 text-center">
            <p className="text-amber-100/70 mb-4">
              هل تريد إرسال تهنئة مخصصة لأحبائك أيضاً؟
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <span>🌙</span>
              <span>أنشئ تهنئتك الخاصة</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const card = await getCardById(params.id);

  if (!card) {
    notFound();
  }

  const theme = getThemeById(card.theme_id);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-lg mx-auto">
        {/* Card Display */}
        <ThemeCard
          theme={theme}
          message={card.message_content}
          senderName={card.sender_name}
          recipientName={card.recipient_name}
        />

        {/* Viral Loop - Create Your Own */}
        <div className="mt-8 text-center">
          <p className="text-amber-100/70 mb-4">
            هل تريد إرسال تهنئة مخصصة لأحبائك أيضاً؟
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg hover:shadow-amber-500/25"
          >
            <span>🌙</span>
            <span>أنشئ تهنئتك الخاصة</span>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-amber-100/40 text-sm">
          <p>تم إنشاء هذه البطاقة باستخدام</p>
          <p className="font-semibold text-amber-300 mt-1">Ramadan Wishes AI</p>
        </div>
      </div>
    </div>
  );
}
