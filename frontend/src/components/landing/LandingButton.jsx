import React from 'react';
import { cn } from '@/lib/utils';

export const LandingButton = ({ children, className, variant = 'outline', ...props }) => (
  <button
    type="button"
    className={cn(
      'landing-btn font-body text-xs sm:text-sm tracking-[0.2em] uppercase px-8 py-2.5 rounded-full transition-all duration-300',
      variant === 'outline' &&
        'border border-foreground/80 bg-cream/60 text-foreground hover:bg-cream hover:shadow-sm',
      variant === 'filled' &&
        'border border-foreground bg-foreground text-cream hover:bg-foreground/90',
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default LandingButton;
