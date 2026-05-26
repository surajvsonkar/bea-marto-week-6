'use client';

import { BusinessCard } from '@/components/BusinessCard';
import type { Card } from '@/types/database';

interface CardGridProps {
  cards: Card[];
}

export function CardGrid({ cards }: CardGridProps) {
  return (
    <section id="directory" className="py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-surface-500">
          Showing <span className="text-surface-300 font-medium">{cards.length}</span> professionals
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {cards.map((card, index) => (
          <BusinessCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
