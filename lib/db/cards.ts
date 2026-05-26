import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Card } from '@/types/database';

export async function getCards(categorySlug?: string): Promise<Card[]> {
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from('cards')
    .select('*, category:categories(*)')
    .order('name', { ascending: true });

  if (categorySlug && categorySlug !== 'all') {
    query = query.eq('category.slug', categorySlug);

    // When filtering by category via join, use inner join approach
    const { data, error } = await supabase
      .from('cards')
      .select('*, category:categories!inner(*)')
      .eq('categories.slug', categorySlug)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching cards:', error);
      return [];
    }

    return (data as Card[]) || [];
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching cards:', error);
    return [];
  }

  return (data as Card[]) || [];
}

export async function getCardById(id: string): Promise<Card | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cards')
    .select('*, category:categories(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching card:', error);
    return null;
  }

  return data as Card;
}
