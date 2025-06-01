// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <PageWrapper className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-center">
      <AlertTriangle size={64} className="text-yellow-500 mb-6" />
      <h1 className="text-5xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8">
        Oops! The page you're looking for doesn't seem to exist.
      </p>
      <Button asChild size="lg">
        <Link to="/dashboard">Go to Dashboard</Link>
      </Button>
    </PageWrapper>
  );
};