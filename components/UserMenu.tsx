'use client';

import { useAuth } from '@/hooks/useAuth';
import { User, Shield } from 'lucide-react';

export function UserMenu() {
  const { user, profile, loading } = useAuth();

  if (loading || !user) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card">
      <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center overflow-hidden">
        {profile?.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-4 h-4 text-brand-400" />
        )}
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-medium text-white truncate max-w-[150px]">
          {profile?.full_name || user.email?.split('@')[0] || 'User'}
        </p>
        <div className="flex items-center gap-1">
          {profile?.role === 'admin' && (
            <Shield className="w-3 h-3 text-amber-400" />
          )}
          <p className="text-xs text-surface-400">
            {profile?.role === 'admin' ? 'Admin' : 'User'}
          </p>
        </div>
      </div>
    </div>
  );
}
