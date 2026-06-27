import React, { useState } from 'react';
import { motion } from 'motion/react';

interface LoginScreenProps {
  onSuccess: (user: { name: string; email: string; isGuest?: boolean }) => void;
}

export default function LoginScreen({ onSuccess }: LoginScreenProps) {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    // Retrieve users from localStorage
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    const matchedUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      setError('Invalid email or password. Please try again.');
      return;
    }

    // Log in
    const userSession = { name: matchedUser.name, email: matchedUser.email };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    onSuccess(userSession);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Retrieve users from localStorage
    const usersJson = localStorage.getItem('users');
    const users = usersJson ? JSON.parse(usersJson) : [];

    // Check if email already exists
    const emailExists = users.some(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      setError('An account with this email already exists.');
      return;
    }

    // Register new user
    const newUser = { name: fullName, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Log in
    const userSession = { name: fullName, email };
    localStorage.setItem('currentUser', JSON.stringify(userSession));
    onSuccess(userSession);
  };

  const handleContinueAsGuest = () => {
    const guestUser = { name: 'Guest Traveler', email: 'guest@kinfolk.com', isGuest: true };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    onSuccess(guestUser);
  };

  return (
    <div className="min-h-screen bg-warm-parchment flex items-center justify-center px-4 py-12 selection:bg-clay/20 selection:text-ink-navy">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-warm-parchment border border-charcoal/15 p-8 md:p-10 relative shadow-sm"
      >
        {/* Editorial Accent Corners */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-clay"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-clay"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-clay"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-clay"></div>

        {/* Wordmark and Tagline */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-black text-ink-navy tracking-tight mb-2">
            Kinfolk
          </h2>
          <p className="text-xs uppercase tracking-widest text-sage font-mono font-bold">
            The trip everyone actually wants
          </p>
        </div>

        {/* Understated Text Tabs (clay underline on active, not pill buttons) */}
        <div className="flex border-b border-charcoal/10 mb-8 justify-center gap-8">
          <button
            id="tab-signin"
            type="button"
            onClick={() => {
              setActiveTab('signin');
              setError('');
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer ${
              activeTab === 'signin' ? 'text-clay' : 'text-charcoal/40 hover:text-charcoal'
            }`}
          >
            Sign In
            {activeTab === 'signin' && (
              <motion.div 
                layoutId="activeUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay" 
              />
            )}
          </button>
          <button
            id="tab-signup"
            type="button"
            onClick={() => {
              setActiveTab('signup');
              setError('');
            }}
            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative cursor-pointer ${
              activeTab === 'signup' ? 'text-clay' : 'text-charcoal/40 hover:text-charcoal'
            }`}
          >
            Sign Up
            {activeTab === 'signup' && (
              <motion.div 
                layoutId="activeUnderline" 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay" 
              />
            )}
          </button>
        </div>

        {/* Friendly Quiet Inline Error */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3 border border-clay/20 bg-clay/5 text-clay text-xs leading-relaxed"
          >
            {error}
          </motion.div>
        )}

        {/* Forms */}
        {activeTab === 'signin' ? (
          <form onSubmit={handleSignIn} className="space-y-5">
            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="signin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <button
              id="btn-signin"
              type="submit"
              className="w-full bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-widest py-3.5 transition-colors cursor-pointer mt-2"
            >
              Sign In
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Password (min 6 chars)
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold text-sage uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <input
                id="signup-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-3 rounded-none bg-warm-parchment border border-charcoal/25 focus:outline-none focus:border-clay font-mono text-charcoal placeholder-charcoal/30"
                required
              />
            </div>

            <button
              id="btn-signup"
              type="submit"
              className="w-full bg-clay hover:bg-ink-navy text-warm-parchment text-xs font-bold uppercase tracking-widest py-3.5 transition-colors cursor-pointer mt-2"
            >
              Create Account
            </button>
          </form>
        )}

        {/* Divider with "or" */}
        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-charcoal/10"></div>
          </div>
          <span className="relative bg-warm-parchment px-3 text-[10px] font-mono text-charcoal/40 uppercase tracking-widest">
            or
          </span>
        </div>

        {/* Continue as Guest Button (text-style, clay underline) */}
        <div className="text-center">
          <button
            id="btn-guest"
            type="button"
            onClick={handleContinueAsGuest}
            className="text-xs font-bold uppercase tracking-widest text-clay border-b border-clay pb-0.5 hover:text-ink-navy hover:border-ink-navy transition-colors cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>
      </motion.div>
    </div>
  );
}
