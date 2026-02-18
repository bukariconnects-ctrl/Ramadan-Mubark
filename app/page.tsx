'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, Send, Wand2, Info } from 'lucide-react';
import { useTheme, themes, ThemeType } from '@/context/ThemeContext';
import PremiumCard from '@/components/PremiumCard';
import LanternLoader from '@/components/LanternLoader';
import Link from 'next/link';
import Image from 'next/image';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FormData {
  senderName: string;
  recipientName: string;
  relation: string;
  tone: string;
  userText: string;
  wordCount: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

// Animation for Golden String - Gentle Breeze
const stringSwayAnimation = {
  skewX: [-1, 1, -1],
  rotate: [-0.5, 0.5, -0.5],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

const stringGlowAnimation = {
  opacity: [0.9, 1, 0.9],
  scale: [1, 1.02, 1],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  },
};

export default function Home() {
  const { currentTheme, setTheme, themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<'manual' | 'magic'>('manual');
  const [formData, setFormData] = useState<FormData>({
    senderName: '',
    recipientName: '',
    relation: '',
    tone: 'warm',
    userText: '',
    wordCount: 50,
  });
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const tones = [
    { value: 'warm', label: 'دافئ' },
    { value: 'formal', label: 'رسمي' },
    { value: 'funny', label: 'مرح' },
    { value: 'religious', label: 'ديني' },
    { value: 'poetic', label: 'شاعري' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'wordCount' ? parseInt(value) || 50 : value 
    }));
  };

  const handleGenerate = async () => {
    setError('');
    setIsGenerating(true);

    try {
      const requestBody =
        activeTab === 'manual'
          ? {
              mode: 'manual',
              senderName: formData.senderName,
              recipientName: formData.recipientName,
              relation: formData.relation,
              tone: formData.tone,
              wordCount: formData.wordCount,
            }
          : {
              mode: 'magic',
              userText: formData.userText,
              wordCount: formData.wordCount,
            };

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate greeting');
      }

      const data = await response.json();
      setGeneratedMessage(data.message);
      setShowPreview(true);
    } catch (err) {
      setError('حدث خطأ أثناء توليد التهنئة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!formData.recipientName || !generatedMessage) return;

    setIsSharing(true);

    try {
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_name: formData.senderName,
          recipient_name: formData.recipientName,
          relation_type: formData.relation || 'صديق',
          message_content: generatedMessage,
          theme_id: currentTheme,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save card');
      }

      const data = await response.json();
      const cardUrl = `${window.location.origin}/card/${data.id}`;

      const whatsappText = `السلام عليكم ${formData.recipientName}، أرسلت لك تهنئة خاصة بمناسبة رمضان 🌙\n\n${cardUrl}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;

      window.open(whatsappUrl, '_blank');
    } catch (err) {
      setError('حدث خطأ أثناء حفظ البطاقة. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSharing(false);
    }
  };

  const isFormValid =
    activeTab === 'manual'
      ? formData.recipientName && formData.relation
      : formData.userText.length > 10;

  const themeStyles = {
    'royal-gold': {
      primary: 'from-amber-500 to-amber-600',
      hover: 'from-amber-400 to-amber-500',
      glow: 'shadow-amber-500/40',
      text: 'text-amber-200',
      border: 'border-amber-500/30',
    },
    'neon-souq': {
      primary: 'from-fuchsia-500 to-pink-600',
      hover: 'from-fuchsia-400 to-pink-500',
      glow: 'shadow-fuchsia-500/40',
      text: 'text-fuchsia-200',
      border: 'border-fuchsia-500/30',
    },
    'emerald-peace': {
      primary: 'from-emerald-500 to-teal-600',
      hover: 'from-emerald-400 to-teal-500',
      glow: 'shadow-emerald-500/40',
      text: 'text-emerald-200',
      border: 'border-emerald-500/30',
    },
  };

  const currentStyles = themeStyles[currentTheme];

  return (
    <motion.div
      className="min-h-screen p-4 md:p-8 relative"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Golden String Header Decoration */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-0 pointer-events-none"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <motion.div
          animate={{
            skewX: stringSwayAnimation.skewX,
            rotate: stringSwayAnimation.rotate,
          }}
          transition={stringSwayAnimation.transition}
          style={{ transformOrigin: 'top center' }}
        >
          <motion.div
            animate={{
              opacity: stringGlowAnimation.opacity,
              scale: stringGlowAnimation.scale,
            }}
            transition={stringGlowAnimation.transition}
            className="relative w-full"
          >
            <Image
              src="/images/1.png"
              alt="Golden Lantern String"
              width={1920}
              height={300}
              className="w-full h-auto object-contain"
              priority
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="max-w-4xl mx-auto relative z-10 pt-20">
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1
            className={cn(
              'text-4xl md:text-5xl font-bold mb-3',
              currentStyles.text
            )}
            style={{
              textShadow: `0 0 40px ${
                currentTheme === 'royal-gold'
                  ? 'rgba(251, 191, 36, 0.5)'
                  : currentTheme === 'neon-souq'
                  ? 'rgba(232, 121, 249, 0.5)'
                  : 'rgba(52, 211, 153, 0.5)'
              }`,
            }}
          >
            تهاني رمضان الذكية
          </motion.h1>
          <p className={cn('text-lg opacity-70', currentStyles.text)}>
            أنشئ تهنئة مخصصة وشاركها مع أحبائك
          </p>
        </motion.div>

        {/* Theme Selector */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center gap-3 mb-8 overflow-x-auto pb-2"
        >
          {(Object.keys(themes) as ThemeType[]).map((theme) => (
            <motion.button
              key={theme}
              onClick={() => setTheme(theme)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'relative flex-shrink-0 px-4 py-3 rounded-xl transition-all duration-300',
                'border backdrop-blur-sm',
                currentTheme === theme
                  ? cn(
                      'bg-gradient-to-r shadow-lg',
                      themeStyles[theme].primary,
                      themeStyles[theme].border,
                      'text-white'
                    )
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="text-lg mr-2">{themes[theme].icon}</span>
              <span className="text-sm font-medium">{themes[theme].nameAr}</span>
              {currentTheme === theme && (
                <motion.div
                  layoutId="activeTheme"
                  className="absolute inset-0 rounded-xl ring-2 ring-white/30"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Main Form */}
        <motion.div
          variants={itemVariants}
          className={cn(
            'rounded-3xl p-6 md:p-8 mb-8 backdrop-blur-xl border relative',
            'bg-white/5',
            currentStyles.border
          )}
        >
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('manual')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all',
                activeTab === 'manual'
                  ? cn(
                      'bg-gradient-to-r text-white shadow-lg',
                      themeStyles[currentTheme].primary
                    )
                  : 'text-white/50 hover:text-white/70 bg-white/5'
              )}
            >
              <MessageCircle size={18} />
              <span>تخصيص دقيق</span>
            </button>
            <button
              onClick={() => setActiveTab('magic')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl transition-all',
                activeTab === 'magic'
                  ? cn(
                      'bg-gradient-to-r text-white shadow-lg',
                      themeStyles[currentTheme].primary
                    )
                  : 'text-white/50 hover:text-white/70 bg-white/5'
              )}
            >
              <Wand2 size={18} />
              <span>الوضع السحري</span>
            </button>
          </div>

          {/* Form Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'manual' ? (
              <motion.div
                key="manual"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                      اسم المرسل
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      placeholder="اسمك"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                        currentStyles.border,
                        currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                        currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                        currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                      )}
                    />
                  </div>
                  <div>
                    <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                      اسم المستلم *
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      placeholder="اسم الشخص"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                        currentStyles.border,
                        currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                        currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                        currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                    العلاقة *
                  </label>
                  <input
                    type="text"
                    name="relation"
                    value={formData.relation}
                    onChange={handleInputChange}
                    placeholder="مثال: أبي، صديقي، مديري"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                      'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                      currentStyles.border,
                      currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                      currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                      currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                    )}
                  />
                </div>

                <div>
                  <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                    نبرة التهنئة
                  </label>
                  <select
                    name="tone"
                    value={formData.tone}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-white/5 border text-white',
                      'focus:outline-none focus:ring-2 focus:ring-opacity-50 appearance-none cursor-pointer',
                      currentStyles.border,
                      currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                      currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                      currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                    )}
                  >
                    {tones.map((tone) => (
                      <option key={tone.value} value={tone.value} className="bg-slate-800">
                        {tone.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Word Count Slider */}
                <div>
                  <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                    طول التهنئة: {formData.wordCount} كلمة
                  </label>
                  <input
                    type="range"
                    name="wordCount"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.wordCount}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full h-2 rounded-lg appearance-none cursor-pointer',
                      'bg-white/20 accent-current',
                      currentTheme === 'royal-gold' && 'accent-amber-400',
                      currentTheme === 'neon-souq' && 'accent-fuchsia-400',
                      currentTheme === 'emerald-peace' && 'accent-emerald-400'
                    )}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>10 كلمات</span>
                    <span>100 كلمة</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="magic"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                    اكتب ما تريد بالعربية
                  </label>
                  <textarea
                    name="userText"
                    value={formData.userText}
                    onChange={handleInputChange}
                    placeholder="مثال: أريد تهنئة قوية لابن عمي محمد اللي مسافر..."
                    rows={4}
                    className={cn(
                      'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                      'focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none',
                      currentStyles.border,
                      currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                      currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                      currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                      اسمك
                    </label>
                    <input
                      type="text"
                      name="senderName"
                      value={formData.senderName}
                      onChange={handleInputChange}
                      placeholder="اسم المرسل"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                        currentStyles.border,
                        currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                        currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                        currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                      )}
                    />
                  </div>
                  <div>
                    <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                      اسم المستلم
                    </label>
                    <input
                      type="text"
                      name="recipientName"
                      value={formData.recipientName}
                      onChange={handleInputChange}
                      placeholder="اسم الشخص"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-white/30',
                        'focus:outline-none focus:ring-2 focus:ring-opacity-50',
                        currentStyles.border,
                        currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                        currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                        currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                      )}
                    />
                  </div>
                </div>

                {/* Word Count Slider */}
                <div>
                  <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                    طول التهنئة: {formData.wordCount} كلمة
                  </label>
                  <input
                    type="range"
                    name="wordCount"
                    min="10"
                    max="100"
                    step="5"
                    value={formData.wordCount}
                    onChange={handleInputChange}
                    className={cn(
                      'w-full h-2 rounded-lg appearance-none cursor-pointer',
                      'bg-white/20 accent-current',
                      currentTheme === 'royal-gold' && 'accent-amber-400',
                      currentTheme === 'neon-souq' && 'accent-fuchsia-400',
                      currentTheme === 'emerald-peace' && 'accent-emerald-400'
                    )}
                  />
                  <div className="flex justify-between text-xs text-white/50 mt-1">
                    <span>10 كلمات</span>
                    <span>100 كلمة</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Generate Button with Glow Effect */}
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating}
            className={cn(
              'w-full mt-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2',
              'transition-all duration-300 relative overflow-hidden',
              isFormValid
                ? cn(
                    'bg-gradient-to-r text-white',
                    currentStyles.primary,
                    'hover:shadow-lg',
                    currentStyles.glow
                  )
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            )}
            style={{
              boxShadow: isFormValid
                ? `0 0 30px ${
                    currentTheme === 'royal-gold'
                      ? 'rgba(251, 191, 36, 0.4)'
                      : currentTheme === 'neon-souq'
                      ? 'rgba(232, 121, 249, 0.4)'
                      : 'rgba(52, 211, 153, 0.4)'
                  }`
                : 'none',
            }}
          >
            {isGenerating ? (
              <LanternLoader size="sm" text="" />
            ) : (
              <>
                <motion.div
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Sparkles size={20} />
                </motion.div>
                <span>توليد التهنئة</span>
              </>
            )}

            {/* Pulse glow animation for CTA */}
            {isFormValid && !isGenerating && (
              <motion.div
                className="absolute inset-0 rounded-xl"
                animate={{
                  boxShadow: [
                    `0 0 20px ${
                      currentTheme === 'royal-gold'
                        ? 'rgba(251, 191, 36, 0.3)'
                        : currentTheme === 'neon-souq'
                        ? 'rgba(232, 121, 249, 0.3)'
                        : 'rgba(52, 211, 153, 0.3)'
                    }`,
                    `0 0 40px ${
                      currentTheme === 'royal-gold'
                        ? 'rgba(251, 191, 36, 0.6)'
                        : currentTheme === 'neon-souq'
                        ? 'rgba(232, 121, 249, 0.6)'
                        : 'rgba(52, 211, 153, 0.6)'
                    }`,
                    `0 0 20px ${
                      currentTheme === 'royal-gold'
                        ? 'rgba(251, 191, 36, 0.3)'
                        : currentTheme === 'neon-souq'
                        ? 'rgba(232, 121, 249, 0.3)'
                        : 'rgba(52, 211, 153, 0.3)'
                    }`,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}
          </motion.button>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 rounded-lg bg-red-500/20 text-red-200 text-center"
            >
              {error}
            </motion.div>
          )}
        </motion.div>

        {/* Preview & Share */}
        <AnimatePresence>
          {showPreview && generatedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Premium Card Preview */}
              <PremiumCard
                message={generatedMessage}
                senderName={formData.senderName}
                recipientName={formData.recipientName}
                isPreview
              />

              {/* Edit Message */}
              <motion.div
                variants={itemVariants}
                className={cn(
                  'rounded-2xl p-4 backdrop-blur-xl border',
                  'bg-white/5',
                  currentStyles.border
                )}
              >
                <label className={cn('block mb-2 text-sm font-medium', currentStyles.text)}>
                  تعديل التهنئة
                </label>
                <textarea
                  value={generatedMessage}
                  onChange={(e) => setGeneratedMessage(e.target.value)}
                  rows={3}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl bg-white/5 border text-white',
                    'focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none',
                    currentStyles.border,
                    currentTheme === 'royal-gold' && 'focus:ring-amber-500',
                    currentTheme === 'neon-souq' && 'focus:ring-fuchsia-500',
                    currentTheme === 'emerald-peace' && 'focus:ring-emerald-500'
                  )}
                />
              </motion.div>

              {/* Share Button */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                disabled={isSharing || !formData.recipientName}
                className={cn(
                  'w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2',
                  'bg-gradient-to-r from-green-500 to-emerald-600 text-white',
                  'hover:from-green-400 hover:to-emerald-500 transition-all',
                  isSharing || !formData.recipientName
                    ? 'opacity-50 cursor-not-allowed'
                    : 'shadow-lg shadow-green-500/25'
                )}
              >
                {isSharing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    <span>جاري الحفظ...</span>
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    <span>مشاركة على واتساب</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer with Credits Link */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <Link
            href="/credits"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 transition-all text-sm"
          >
            <Info size={14} />
            <span>من نحن</span>
          </Link>
          <p className="mt-4 text-white/20 text-xs">
            © {new Date().getFullYear()} Ramadan Wishes AI - رمضان كريم 🌙
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
