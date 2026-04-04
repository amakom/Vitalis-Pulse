'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';

export default function LoginPage() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (isSignUp) {
      const { error } = await signUp(email, password);
      if (error) {
        setError(error);
      } else {
        setSuccess('Check your email to confirm your account.');
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
      } else {
        router.push('/watchlist');
      }
    }

    setLoading(false);
  };

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center px-4 py-12">
      <div className="w-full rounded-xl border border-border bg-card p-6 sm:p-8">
        <div className="mb-6 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-teal">
            <path d="M3 12h4l3-9 4 18 3-9h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="text-xl font-bold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isSignUp ? 'Track your favorite projects with a watchlist' : 'Sign in to access your watchlist'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal"
              placeholder="Min. 6 characters"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-500">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal/90 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          {isSignUp ? (
            <>
              Already have an account?{' '}
              <button onClick={() => { setIsSignUp(false); setError(''); setSuccess(''); }} className="font-medium text-teal hover:underline">
                Sign in
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{' '}
              <button onClick={() => { setIsSignUp(true); setError(''); setSuccess(''); }} className="font-medium text-teal hover:underline">
                Sign up
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Back to Leaderboard</Link>
        </div>
      </div>
    </div>
  );
}
