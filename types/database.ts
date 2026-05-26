export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  created_at: string;
}

export interface Card {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string | null;
  website: string | null;
  category_id: string;
  avatar_seed: string;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface Submission {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string | null;
  website: string | null;
  category_id: string;
  photo_url: string | null;
  status: SubmissionStatus;
  session_id: string;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: Category;
        Insert: Omit<Category, 'id' | 'created_at'>;
        Update: Partial<Omit<Category, 'id' | 'created_at'>>;
      };
      cards: {
        Row: Card;
        Insert: Omit<Card, 'id' | 'created_at' | 'updated_at' | 'category'>;
        Update: Partial<Omit<Card, 'id' | 'created_at' | 'category'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      submissions: {
        Row: Submission;
        Insert: Omit<Submission, 'id' | 'created_at' | 'updated_at' | 'category'>;
        Update: Partial<Omit<Submission, 'id' | 'created_at' | 'category'>>;
      };
    };
  };
}
