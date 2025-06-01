// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';

export const LoginPage = () => {
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to log in. Please check your credentials.');
      console.error("Login error:", err);
    }
    setLoading(false);
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <AuthForm
        isSignUp={false}
        onSubmit={handleLogin}
        loading={loading}
        error={error}
      />
    </PageWrapper>
  );
};