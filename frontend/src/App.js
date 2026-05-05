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
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [weddingData, setWeddingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeData = async () => {
      const { data } = await supabase
        .from('wedding_settings')
        .select('*')
        .eq('id', 'default')
        .maybeSingle();

      if (data) {
        setWeddingData({
          couple: {
            bride: data.bride,
            groom: data.groom,
            weddingDate: data.wedding_date,
            location: data.location,
          },
          settings: {
            primaryCurrency: data.primary_currency,
            secondaryCurrency: data.secondary_currency,
            exchangeRate: Number(data.exchange_rate),
            emails: data.emails || [],
            theme: data.theme || 'light',
          },
        });
      } else {
        const defaultData = {
          couple: {
            bride: 'JC',
            groom: 'JD',
            weddingDate: '2026-08-16',
            location: 'USA',
          },
          settings: {
            primaryCurrency: 'USD',
            secondaryCurrency: 'INR',
            exchangeRate: 83.5,
            emails: [],
            theme: 'light',
          },
        };
        await supabase.from('wedding_settings').insert({
          id: 'default',
          bride: 'JC',
          groom: 'JD',
          wedding_date: '2026-08-16',
          location: 'USA',
          primary_currency: 'USD',
          secondary_currency: 'INR',
          exchange_rate: 83.5,
          emails: [],
          theme: 'light',
        });
        setWeddingData(defaultData);
      }
      setLoading(false);
    };

    initializeData();
  }, []);

  const updateWeddingData = async (updates) => {
    const newData = { ...weddingData, ...updates };
    setWeddingData(newData);
    await supabase.from('wedding_settings').upsert({
      id: 'default',
      bride: newData.couple.bride,
      groom: newData.couple.groom,
      wedding_date: newData.couple.weddingDate,
      location: newData.couple.location,
      primary_currency: newData.settings.primaryCurrency,
      secondary_currency: newData.settings.secondaryCurrency,
      exchange_rate: newData.settings.exchangeRate,
      emails: newData.settings.emails,
      theme: newData.settings.theme,
      updated_at: new Date().toISOString(),
    });
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