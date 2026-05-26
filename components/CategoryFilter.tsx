'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { LayoutGrid } from 'lucide-react';
import type { Category } from '@/types/database';

/** Maps category slugs to Tailwind color classes */
const CATEGORY_COLORS: Record<string, string> = {
  technology: 'cat-technology',
  design: 'cat-design',
  marketing: 'cat-marketing',
  finance: 'cat-finance',
  healthcare: 'cat-healthcare',
  education: 'cat-education',
  'real-estate': 'cat-real-estate',
  'food-beverage': 'cat-food-beverage',
  legal: 'cat-legal',
  consulting: 'cat-consulting',
};

const COLOR_DOTS: Record<string, string> = {
  technology: 'bg-teal-400',
  design: 'bg-pink-400',
  marketing: 'bg-orange-400',
  finance: 'bg-violet-400',
  healthcare: 'bg-emerald-400',
  education: 'bg-blue-400',
  'real-estate': 'bg-yellow-400',
  'food-beverage': 'bg-red-400',
  legal: 'bg-purple-400',
  consulting: 'bg-cyan-400',
};

interface CategoryFilterProps {
  categories: Category[];
  activeCategory: string;
}

export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const searchParams = useSearchParams();

  return (
    <section id="categories" className="py-8">
      <div className="flex items-center gap-3 mb-6">
        <LayoutGrid className="w-5 h-5 text-brand-400" />
        <h2 className="text-lg font-semibold text-surface-200">Filter by Category</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* "All" button */}
        <Link
          href="/"
          className={`
            inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
            transition-all duration-200
            ${
              activeCategory === 'all'
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                : 'glass-card text-surface-300 hover:text-white hover:border-brand-500/30'
            }
          `}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          All
        </Link>

        {categories.map((cat) => {
          const isActive = activeCategory === cat.slug;
          const dotColor = COLOR_DOTS[cat.slug] || 'bg-surface-400';

          return (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`
                inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
                    : 'glass-card text-surface-300 hover:text-white hover:border-brand-500/30'
                }
              `}
            >
              <span
                className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : dotColor}`}
              />
              {cat.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
