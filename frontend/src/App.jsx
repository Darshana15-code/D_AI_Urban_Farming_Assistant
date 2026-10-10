import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { PlantsPage } from './pages/PlantsPage';
import { PlantDetailPage } from './pages/PlantDetailPage';
import { ScannerPage } from './pages/ScannerPage';
import { DiagnosisResultPage } from './pages/DiagnosisResultPage';
import { CarePlannerPage } from './pages/CarePlannerPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { NotFoundPage } from './pages/NotFoundPage';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-forest-800 flex items-center justify-center text-white text-2xl shadow-elevated animate-pulse">
            🌱
          </div>
          <p className="text-xs font-semibold text-stone-500 tracking-wide uppercase">
            Loading FloraPulse Garden...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{
          from: location,
          message: 'Please sign in to access your private garden dashboard.'
        }}
        replace
      />
    );
  }

  return children;
}

export function App() {
  return (
    <Routes>
      {/* 1. Public Homepage */}
      <Route path="/" element={<HomePage />} />

      {/* 2. Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 3. Protected Routes wrapped in ProtectedRoute & AppShell */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/plants" element={<PlantsPage />} />
        <Route path="/plants/:plantId" element={<PlantDetailPage />} />
        <Route path="/scan" element={<ScannerPage />} />
        <Route path="/scan/:scanId" element={<DiagnosisResultPage />} />
        <Route path="/care" element={<CarePlannerPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* 4. 404 Catch-All */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
