import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">🌙</div>
        <h1 className="text-3xl font-bold text-amber-200 mb-2">
          البطاقة غير موجودة
        </h1>
        <p className="text-amber-100/70 mb-6">
          عذراً، لم نتمكن من العثور على البطاقة المطلوبة
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all"
        >
          <span>🏠</span>
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    </div>
  );
}
