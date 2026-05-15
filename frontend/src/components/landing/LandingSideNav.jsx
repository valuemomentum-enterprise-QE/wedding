import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export const LandingSideNav = ({ groom, bride }) => {
  const [expanded, setExpanded] = useState(false);
  const initials = `${groom || 'JD'}${bride || 'JC'}`;

  return (
    <nav
      className={cn(
        'fixed left-0 top-1/2 -translate-y-1/2 z-50 flex items-stretch transition-[width] duration-300 ease-out overflow-hidden',
        expanded ? 'w-[4.5rem]' : 'w-9'
      )}
      aria-label="Couple access"
    >
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className="flex shrink-0 items-center justify-center w-9 min-h-[3.5rem] bg-cream/95 backdrop-blur-sm border border-foreground/12 border-l-0 rounded-r-md shadow-sm text-foreground/45 hover:text-foreground/75 hover:bg-cream"
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse menu' : 'Open menu'}
      >
        {expanded ? (
          <ChevronLeft className="w-4 h-4" strokeWidth={1.25} />
        ) : (
          <ChevronRight className="w-4 h-4" strokeWidth={1.25} />
        )}
      </button>

      <div
        className={cn(
          'flex items-center justify-center overflow-hidden transition-all duration-300 ease-out',
          expanded ? 'w-12 opacity-100' : 'w-0 opacity-0 pointer-events-none'
        )}
      >
        <Link
          to="/login"
          className="font-display text-sm tracking-[0.35em] text-foreground/55 hover:text-foreground transition-colors [writing-mode:vertical-rl] rotate-180 py-2"
          title="Couple planner login"
        >
          {initials}
        </Link>
      </div>
    </nav>
  );
};

export default LandingSideNav;
