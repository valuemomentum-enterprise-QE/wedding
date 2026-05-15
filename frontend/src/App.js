import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import Landing from './pages/Landing';
import Login from './pages/Login';
import PlannerLayout from './layouts/PlannerLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

function App() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = () => {
      const plannerStorageVersion = '2';
      if (localStorage.getItem('plannerStorageVersion') !== plannerStorageVersion) {
        localStorage.setItem('tasks', JSON.stringify([]));
        localStorage.setItem('budgetItems', JSON.stringify([]));
        localStorage.setItem('plannerStorageVersion', plannerStorageVersion);
      }

      const savedData = localStorage.getItem('weddingPlannerData');

      if (savedData) {
        setWeddingData(JSON.parse(savedData));
      } else {
        const defaultData = {
          couple: {
            bride: 'Jahnavi',
            groom: 'Jayadeep',
            brideFullName: 'Jahnavi Chintakindi',
            groomFullName: 'Jayadeep Ram Guttikonda',
            weddingDate: '2026-08-16',
            location: 'New Jersey,USA',
          },
          venue: {
            time: '3:00 PM onwards',
            name: 'Ceremony Venue',
            address: 'Details coming soon',
            accessible: true,
          },
          settings: {
            primaryCurrency: 'USD',
            secondaryCurrency: 'INR',
            exchangeRate: 83.5,
            emails: [],
            theme: 'light',
            plannerPasscode: '16102026',
          },
        };
        setWeddingData(defaultData);
        localStorage.setItem('weddingPlannerData', JSON.stringify(defaultData));
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const updateWeddingData = (updates) => {
    const newData = {
      ...weddingData,
      couple: { ...weddingData?.couple, ...updates.couple },
      venue: { ...weddingData?.venue, ...updates.venue },
      settings: { ...weddingData?.settings, ...updates.settings },
    };
    setWeddingData(newData);
    localStorage.setItem('weddingPlannerData', JSON.stringify(newData));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-foreground/40" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/planner/*"
          element={
            <ProtectedRoute>
              <PlannerLayout weddingData={weddingData} updateWeddingData={updateWeddingData} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </Router>
  );
}

export default App;
