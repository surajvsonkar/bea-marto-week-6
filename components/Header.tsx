'use client';

import { Sparkles } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';
import { UserMenu } from '@/components/UserMenu';

export function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Card<span className="text-brand-400">Vault</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <UserMenu />
            <AuthButton />
          </div>
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Supabase
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Your Professional
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Network Directory
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto leading-relaxed">
            Discover and connect with professionals across industries.
            Sign in with Google to manage your cards.
          </p>
        </div>
      </div>
    </header>
  );
}
