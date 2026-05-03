import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Budget from './pages/Budget';
import Events from './pages/Events';
import Vendors from './pages/Vendors';
import Guests from './pages/Guests';
import Settings from './pages/Settings';
import './App.css';

function App() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize wedding data from localStorage or create default
    const initializeData = () => {
      const savedData = localStorage.getItem('weddingPlannerData');
      
      if (savedData) {
        setWeddingData(JSON.parse(savedData));
      } else {
        // Default wedding data structure
        const defaultData = {
          couple: {
            bride: 'JC',
            groom: 'JD',
            weddingDate: '2026-08-16',
            location: 'USA'
          },
          settings: {
            primaryCurrency: 'USD',
            secondaryCurrency: 'INR',
            exchangeRate: 83.5,
            emails: [],
            theme: 'light'
          }
        };
        setWeddingData(defaultData);
        localStorage.setItem('weddingPlannerData', JSON.stringify(defaultData));
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const updateWeddingData = (updates) => {
    const newData = { ...weddingData, ...updates };
    setWeddingData(newData);
    localStorage.setItem('weddingPlannerData', JSON.stringify(newData));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pb-20 md:pb-0 md:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard weddingData={weddingData} />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/budget" element={<Budget weddingData={weddingData} />} />
            <Route path="/events" element={<Events />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/guests" element={<Guests />} />
            <Route path="/settings" element={<Settings weddingData={weddingData} updateWeddingData={updateWeddingData} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}

export default App;