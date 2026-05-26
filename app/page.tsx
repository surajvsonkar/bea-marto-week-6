import { getCards } from '@/lib/db/cards';
import { getCategories } from '@/lib/db/categories';
import { Header } from '@/components/Header';
import { CategoryFilter } from '@/components/CategoryFilter';
import { CardGrid } from '@/components/CardGrid';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category || 'all';

  const [cards, categories] = await Promise.all([
    getCards(activeCategory),
    getCategories(),
  ]);

  return (
    <main className="min-h-screen mesh-gradient">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Submit CTA */}
        <div className="flex justify-end mb-4">
          <Link
            href="/submit"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all duration-200 text-sm font-semibold shadow-lg shadow-brand-500/25"
          >
            <Plus className="w-4 h-4" />
            Submit a Card
          </Link>
        </div>

        <CategoryFilter categories={categories} activeCategory={activeCategory} />
        <CardGrid cards={cards} />

        {cards.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-surface-300 mb-2">No cards found</h3>
            <p className="text-surface-500">Try selecting a different category.</p>
          </div>
        )}
      </div>
    </main>
  );
}
