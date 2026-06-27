/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import OnboardingWizard from './components/OnboardingWizard';
import AppShell from './components/AppShell';

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; isGuest?: boolean } | null>(() => {
    const stored = localStorage.getItem('currentUser');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [userProfile, setUserProfile] = useState<any>(() => {
    const stored = localStorage.getItem('userProfile');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [view, setView] = useState<'landing' | 'login' | 'onboarding' | 'app_shell'>(() => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProfile = localStorage.getItem('userProfile');
    if (storedUser && storedProfile) {
      return 'app_shell';
    }
    if (storedUser) {
      return 'onboarding';
    }
    return 'landing';
  });

  const handleGetStarted = () => {
    const storedUser = localStorage.getItem('currentUser');
    const storedProfile = localStorage.getItem('userProfile');

    if (storedUser && storedProfile) {
      setView('app_shell');
    } else if (storedUser) {
      setView('onboarding');
    } else {
      setView('login');
    }
    window.scrollTo({ top: 0 });
  };

  const handleLoginSuccess = (user: { name: string; email: string; isGuest?: boolean }) => {
    setCurrentUser(user);
    const storedProfile = localStorage.getItem('userProfile');
    if (storedProfile) {
      try {
        setUserProfile(JSON.parse(storedProfile));
        setView('app_shell');
      } catch {
        setView('onboarding');
      }
    } else {
      setView('onboarding');
    }
    window.scrollTo({ top: 0 });
  };

  const handleOnboardingComplete = (profile: any) => {
    setUserProfile(profile);
    setView('app_shell');
    window.scrollTo({ top: 0 });
  };

  const handleLogOut = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    setCurrentUser(null);
    setUserProfile(null);
    setView('landing');
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="min-h-screen text-navy antialiased">
      {view === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}
      {view === 'login' && (
        <LoginScreen onSuccess={handleLoginSuccess} />
      )}
      {view === 'onboarding' && currentUser && (
        <OnboardingWizard currentUser={currentUser} onComplete={handleOnboardingComplete} />
      )}
      {view === 'app_shell' && currentUser && (
        <AppShell onLogOut={handleLogOut} userEmail={currentUser.email} />
      )}
    </div>
  );
}


