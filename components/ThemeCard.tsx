'use client';

import { motion } from 'framer-motion';
import { Theme } from '@/config/themes';

interface ThemeCardProps {
  theme: Theme;
  message: string;
  senderName?: string;
  recipientName?: string;
  isPreview?: boolean;
}

export default function ThemeCard({
  theme,
  message,
  senderName,
  recipientName,
  isPreview = false,
}: ThemeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-2xl shadow-2xl ${theme.gradient} ${
        isPreview ? 'min-h-[300px] p-6' : 'min-h-[400px] p-8'
      }`}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 glass-strong" />

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 text-4xl opacity-50">
        {theme.icon}
      </div>
      <div className="absolute bottom-4 left-4 text-4xl opacity-50">
        {theme.icon}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        {/* Ramadan greeting header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className={`text-2xl font-bold mb-4 ${theme.accentColor}`}
        >
          رمضان كريم
        </motion.div>

        {/* Recipient name */}
        {recipientName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={`text-lg mb-4 ${theme.textColor} opacity-80`}
          >
            إلى: {recipientName}
          </motion.div>
        )}

        {/* Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className={`text-xl leading-relaxed mb-6 ${theme.textColor}`}
        >
          {message}
        </motion.div>

        {/* Sender name */}
        {senderName && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className={`text-base ${theme.textColor} opacity-70`}
          >
            من: {senderName}
          </motion.div>
        )}

        {/* Decorative divider */}
        <div
          className={`w-16 h-0.5 mt-6 rounded-full ${theme.accentColor.replace(
            'text-',
            'bg-'
          )} opacity-50`}
        />
      </div>
    </motion.div>
  );
}
