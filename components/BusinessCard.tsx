'use client';

import { motion } from 'motion/react';
import { Mail, Phone, Globe, Building2 } from 'lucide-react';
import type { Card } from '@/types/database';

const CATEGORY_ACCENT: Record<string, string> = {
  technology: 'from-teal-400/20 to-teal-600/5',
  design: 'from-pink-400/20 to-pink-600/5',
  marketing: 'from-orange-400/20 to-orange-600/5',
  finance: 'from-violet-400/20 to-violet-600/5',
  healthcare: 'from-emerald-400/20 to-emerald-600/5',
  education: 'from-blue-400/20 to-blue-600/5',
  'real-estate': 'from-yellow-400/20 to-yellow-600/5',
  'food-beverage': 'from-red-400/20 to-red-600/5',
  legal: 'from-purple-400/20 to-purple-600/5',
  consulting: 'from-cyan-400/20 to-cyan-600/5',
};

const CATEGORY_BORDER: Record<string, string> = {
  technology: 'border-teal-500/20',
  design: 'border-pink-500/20',
  marketing: 'border-orange-500/20',
  finance: 'border-violet-500/20',
  healthcare: 'border-emerald-500/20',
  education: 'border-blue-500/20',
  'real-estate': 'border-yellow-500/20',
  'food-beverage': 'border-red-500/20',
  legal: 'border-purple-500/20',
  consulting: 'border-cyan-500/20',
};

const CATEGORY_BADGE: Record<string, string> = {
  technology: 'bg-teal-500/15 text-teal-300',
  design: 'bg-pink-500/15 text-pink-300',
  marketing: 'bg-orange-500/15 text-orange-300',
  finance: 'bg-violet-500/15 text-violet-300',
  healthcare: 'bg-emerald-500/15 text-emerald-300',
  education: 'bg-blue-500/15 text-blue-300',
  'real-estate': 'bg-yellow-500/15 text-yellow-300',
  'food-beverage': 'bg-red-500/15 text-red-300',
  legal: 'bg-purple-500/15 text-purple-300',
  consulting: 'bg-cyan-500/15 text-cyan-300',
};

interface BusinessCardProps {
  card: Card;
  index: number;
}

export function BusinessCard({ card, index }: BusinessCardProps) {
  const categorySlug = card.category?.slug || 'technology';
  const accent = CATEGORY_ACCENT[categorySlug] || CATEGORY_ACCENT.technology;
  const border = CATEGORY_BORDER[categorySlug] || CATEGORY_BORDER.technology;
  const badge = CATEGORY_BADGE[categorySlug] || CATEGORY_BADGE.technology;

  // DiceBear avatar URL using the adventurer style
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(card.avatar_seed)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`
        group relative rounded-2xl border ${border}
        bg-gradient-to-b ${accent}
        backdrop-blur-xl overflow-hidden
        glow-hover cursor-default
      `}
    >
      {/* Top gradient accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent" />

      <div className="p-5">
        {/* Avatar + Name */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 rounded-xl bg-surface-800/50 ring-2 ring-white/5 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt={`${card.name}'s avatar`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white truncate text-[15px] leading-snug">
              {card.name}
            </h3>
            <p className="text-sm text-surface-400 truncate">{card.title}</p>
          </div>
        </div>

        {/* Company */}
        <div className="flex items-center gap-2 mb-4 text-sm text-surface-400">
          <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{card.company}</span>
        </div>

        {/* Category badge */}
        {card.category && (
          <div className="mb-4">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}
            >
              {card.category.name}
            </span>
          </div>
        )}

        {/* Contact info */}
        <div className="space-y-2 pt-3 border-t border-white/5">
          <a
            href={`mailto:${card.email}`}
            className="flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{card.email}</span>
          </a>

          {card.phone && (
            <a
              href={`tel:${card.phone}`}
              className="flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{card.phone}</span>
            </a>
          )}

          {card.website && (
            <a
              href={card.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{card.website.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
