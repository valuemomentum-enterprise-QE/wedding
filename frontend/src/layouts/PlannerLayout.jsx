import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Navigation from '../components/Navigation';
import Dashboard from '../pages/Dashboard';
import Tasks from '../pages/Tasks';
import Budget from '../pages/Budget';
import Events from '../pages/Events';
import Vendors from '../pages/Vendors';
import Guests from '../pages/Guests';
import Decorations from '../pages/Decorations';
import Settings from '../pages/Settings';
import { logoutPlanner } from '../lib/auth';

const PLANNER_PREFIX = '/planner';

export const PlannerLayout = ({ weddingData, updateWeddingData }) => {
  const handleLogout = () => {
    logoutPlanner();
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background planner-shell">
      <Navigation weddingData={weddingData} plannerPrefix={PLANNER_PREFIX} onLogout={handleLogout} />
      <main className="pb-20 md:pb-0 md:ml-64">
        <div className="hidden md:flex justify-end px-6 py-3 border-b border-border/40 bg-card/50">
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
          <Link to="/" className="ml-6 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground">
            View site
          </Link>
        </div>
        <Routes>
          <Route path="/" element={<Dashboard weddingData={weddingData} plannerPrefix={PLANNER_PREFIX} />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/budget" element={<Budget weddingData={weddingData} />} />
          <Route path="/events" element={<Events />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/guests" element={<Guests />} />
          <Route path="/decorations" element={<Decorations />} />
          <Route
            path="/settings"
            element={<Settings weddingData={weddingData} updateWeddingData={updateWeddingData} />}
          />
          <Route path="*" element={<Navigate to="/planner" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default PlannerLayout;
