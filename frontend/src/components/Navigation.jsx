import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, DollarSign, Calendar, Users, UserCheck, Settings, Menu, X, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard' },
  { path: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { path: '/budget', icon: DollarSign, label: 'Budget' },
  { path: '/events', icon: Calendar, label: 'Events' },
  { path: '/vendors', icon: Users, label: 'Vendors' },
  { path: '/guests', icon: UserCheck, label: 'Guests' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export const Navigation = () => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-[var(--shadow-soft)]">
          <Heart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">Wedding Planner</h1>
          <p className="text-xs text-muted-foreground">August 16, 2026</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-[var(--shadow-soft)]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom accent */}
      <div className="px-6 py-4 border-t border-border/50">
        <div className="p-4 rounded-lg bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border border-primary/10">
          <p className="text-xs font-medium text-foreground mb-1">South Indian Wedding</p>
          <p className="text-xs text-muted-foreground">Traditional elegance meets modern planning</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border/50 shadow-[var(--shadow-soft)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Heart className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Wedding Planner</span>
          </div>
          
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <NavContent />
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border/50 shadow-[var(--shadow-soft)]">
        <NavContent />
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border/50 shadow-[0_-2px_8px_hsl(var(--primary)_/_0.08)]">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                  ${
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer for mobile */}
      <div className="md:hidden h-14" />
    </>
  );
};

export default Navigation;