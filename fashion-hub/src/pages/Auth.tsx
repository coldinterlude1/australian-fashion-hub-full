import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import MagicLinkForm from '@/components/auth/MagicLinkForm';

type AuthMode = 'login' | 'signup' | 'magic-link';

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F3] to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginForm
            onSwitchToSignup={() => setMode('signup')}
            onSwitchToMagicLink={() => setMode('magic-link')}
          />
        )}
        {mode === 'signup' && (
          <SignupForm onSwitchToLogin={() => setMode('login')} />
        )}
        {mode === 'magic-link' && (
          <MagicLinkForm onSwitchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

