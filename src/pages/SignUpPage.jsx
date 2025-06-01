// src/pages/SignUpPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { PageWrapper } from '../components/layout/PageWrapper';

export const SignUpPage = () => {
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async ({ email, password, confirmPassword }) => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      await signup(email, password);
      navigate('/dashboard'); // Navigate to dashboard after successful signup
    } catch (err) {
      setError(err.message || 'Failed to create an account. Please try again.');
      console.error("Signup error:", err);
    }
    setLoading(false);
  };

  return (
    <PageWrapper className="flex min-h-screen items-center justify-center bg-gray-50 py-12">
      <AuthForm
        isSignUp={true}
        onSubmit={handleSignUp}
        loading={loading}
        error={error}
      />
    </PageWrapper>
  );
};