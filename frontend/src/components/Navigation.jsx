import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, DollarSign, Calendar, Users, UserCheck, Settings, Menu, X, Heart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { parseWeddingDate, formatWeddingDateShort } from '../lib/weddingUtils';

const buildNavItems = (prefix) => [
  { path: prefix, icon: Home, label: 'Dashboard', end: true },
  { path: `${prefix}/tasks`, icon: CheckSquare, label: 'Tasks' },
  { path: `${prefix}/budget`, icon: DollarSign, label: 'Budget' },
  { path: `${prefix}/events`, icon: Calendar, label: 'Events' },
  { path: `${prefix}/vendors`, icon: Users, label: 'Vendors' },
  { path: `${prefix}/guests`, icon: UserCheck, label: 'Guests' },
  { path: `${prefix}/settings`, icon: Settings, label: 'Settings' },
];

export const Navigation = ({ weddingData, plannerPrefix = '/planner', onLogout }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const navItems = buildNavItems(plannerPrefix);
  const weddingDateLabel = formatWeddingDateShort(
    parseWeddingDate(weddingData?.couple?.weddingDate)
  );
  const initials = `${weddingData?.couple?.groom || 'G'} & ${weddingData?.couple?.bride || 'B'}`;

  const isActive = (path, end) => {
    if (end) return location.pathname === path || location.pathname === `${path}/`;
    return location.pathname.startsWith(path);
  };

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
        <div className="w-10 h-10 rounded-full bg-peach flex items-center justify-center border border-border/60">
          <Heart className="w-5 h-5 text-foreground" strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="font-display text-base tracking-[0.12em] text-foreground">{initials}</h1>
          <p className="text-xs text-muted-foreground font-body">{weddingDateLabel}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path, item.end);

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 font-body ${
                active
                  ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-border/50 space-y-3">
        <div className="p-4 rounded-lg bg-peach/40 border border-border/40">
          <p className="text-xs font-display tracking-widest text-foreground mb-1">South Indian Wedding</p>
          <p className="text-xs text-muted-foreground font-body">Your private planning space</p>
        </div>
        {onLogout && (
          <button
            type="button"
            onClick={onLogout}
            className="flex md:hidden w-full items-center justify-center gap-2 text-xs tracking-widest uppercase text-muted-foreground py-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        )}
      </div>
    </>
  );

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-peach flex items-center justify-center">
              <Heart className="w-4 h-4 text-foreground" strokeWidth={1.5} />
            </div>
            <span className="font-display text-sm tracking-widest">{initials}</span>
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0 bg-cream">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border/50">
        <NavContent />
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/50">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.end);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  active ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="md:hidden h-14" />
    </>
  );
};

export default Navigation;
