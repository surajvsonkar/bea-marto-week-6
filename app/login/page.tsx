'use client';

import { signInWithGoogle } from '@/lib/auth/actions';
import { Sparkles, Chrome } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Card<span className="text-brand-400">Vault</span>
          </h1>
          <p className="text-surface-400">
            Sign in to manage your business card directory
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8">
          <form
            action={async () => {
              await signInWithGoogle();
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-all duration-200 cursor-pointer shadow-lg shadow-white/5"
            >
              <Chrome className="w-5 h-5" />
              Continue with Google
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-surface-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
          >
            ← Back to Directory
          </a>
        </div>
      </div>
    </div>
  );
}
