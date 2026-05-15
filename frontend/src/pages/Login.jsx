import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FloralDecoration } from '../components/landing/FloralDecoration';
import { LandingButton } from '../components/landing/LandingButton';
import { loginWithPasscode } from '../lib/auth';
import { useWeddingSiteData } from '../hooks/useWeddingSiteData';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { couple } = useWeddingSiteData();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');

  const from = location.state?.from || '/planner';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loginWithPasscode(passcode.trim())) {
      navigate(from, { replace: true });
      return;
    }
    setError('Incorrect passcode. Please try again.');
  };

  const initials = `${couple.groom || 'G'} & ${couple.bride || 'B'}`;

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-16 relative overflow-hidden font-body">
      <FloralDecoration position="top-left" className="top-0 left-0 opacity-60" />
      <FloralDecoration position="bottom-right" className="bottom-0 right-0 opacity-60" />

      <div className="relative z-10 w-full max-w-md text-center">
        <p className="font-display text-sm tracking-[0.3em] text-foreground/60 mb-2">{initials}</p>
        <h1 className="font-display text-2xl sm:text-3xl tracking-[0.15em] mb-2">COUPLE LOGIN</h1>
        <p className="text-sm text-foreground/70 mb-8">
          Enter your private passcode to access the wedding planner.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            placeholder="Passcode"
            value={passcode}
            onChange={(e) => {
              setPasscode(e.target.value);
              setError('');
            }}
            className="w-full px-4 py-3 rounded-full border border-foreground/30 bg-cream/80 text-center text-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage"
          />
          {error && <p className="text-xs text-floral-red">{error}</p>}
          <LandingButton type="submit" variant="filled" className="w-full">
            Enter Planner
          </LandingButton>
        </form>

        <Link
          to="/"
          className="inline-block mt-10 text-xs tracking-widest text-foreground/50 hover:text-foreground transition-colors"
        >
          ← Back to wedding site
        </Link>
      </div>
    </div>
  );
};

export default Login;
