'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export function AuthButton() {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-surface-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (user) {
    return (
      <button
        onClick={signOut}
        className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-surface-300 hover:text-white hover:border-red-500/30 transition-all duration-200 text-sm font-medium cursor-pointer"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    );
  }

  return (
    <a
      href="/login"
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-all duration-200 text-sm font-medium"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </a>
  );
}
