import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-stone-900">404 — Page Not Found</h1>
      <p className="text-sm text-stone-500 max-w-md mt-2 mb-6">
        The leaf, crop, or route you are looking for does not exist in our greenhouse records.
      </p>
      <Button variant="primary" onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
}
