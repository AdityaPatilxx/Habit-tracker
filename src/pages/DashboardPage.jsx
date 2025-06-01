// src/pages/DashboardPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import {
  collection,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { format, startOfDay } from 'date-fns'; // For date handling

import { PageWrapper } from '../components/layout/PageWrapper';
import { AddHabitForm } from '../components/habits/AddHabitForm';
import { HabitList } from '../components/habits/HabitList';
import { Spinner } from '@/components/ui/Spinner';

const DATE_FORMAT = 'yyyy-MM-dd';

export const DashboardPage = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [loadingHabits, setLoadingHabits] = useState(true);
  const [addingHabit, setAddingHabit] = useState(false);
  const [completingHabitId, setCompletingHabitId] = useState(null);
  const [deletingHabitId, setDeletingHabitId] = useState(null);

  const todayStr = format(startOfDay(new Date()), DATE_FORMAT);

  // Fetch habits and their completion status for today
  const fetchHabitsAndCompletions = useCallback(async () => {
    if (!currentUser) return;
    setLoadingHabits(true);
    try {
      // 1. Fetch user's habits
      const habitsQuery = query(collection(db, 'habits'), where('userId', '==', currentUser.uid));
      const habitsSnapshot = await getDocs(habitsQuery);
      const userHabits = habitsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // 2. Fetch today's completions for these habits
      if (userHabits.length > 0) {
        const habitIds = userHabits.map(h => h.id);
        const completionsQuery = query(
          collection(db, 'habitCompletions'),
          where('userId', '==', currentUser.uid),
          where('habitId', 'in', habitIds),
          where('date', '==', todayStr)
        );
        const completionsSnapshot = await getDocs(completionsQuery);
        const todaysCompletions = new Set(completionsSnapshot.docs.map(doc => doc.data().habitId));

        // 3. Combine data
        const habitsWithCompletion = userHabits.map(habit => ({
          ...habit,
          completedToday: todaysCompletions.has(habit.id),
        }));
        setHabits(habitsWithCompletion);
      } else {
        setHabits([]);
      }
    } catch (error) {
      console.error("Error fetching habits:", error);
      // TODO: Show error to user
    }
    setLoadingHabits(false);
  }, [currentUser, todayStr]);


  useEffect(() => {
    fetchHabitsAndCompletions();
  }, [fetchHabitsAndCompletions]);


  const handleAddHabit = async (name) => {
    if (!currentUser) return;
    setAddingHabit(true);
    try {
      const newHabitRef = await addDoc(collection(db, 'habits'), {
        userId: currentUser.uid,
        name: name,
        createdAt: serverTimestamp(),
        // No default completion status here; check `habitCompletions`
      });
      // Optimistically update UI or refetch
      setHabits(prevHabits => [...prevHabits, { id: newHabitRef.id, name, createdAt: new Date(), completedToday: false, userId: currentUser.uid }]);
      // Or call fetchHabitsAndCompletions(); for full refresh
    } catch (error) {
      console.error("Error adding habit:", error);
      // TODO: Show error to user
    }
    setAddingHabit(false);
  };

  const handleToggleComplete = async (habitId, currentStatus) => {
    if (!currentUser) return;
    setCompletingHabitId(habitId);
    try {
      const completionsQuery = query(
        collection(db, 'habitCompletions'),
        where('userId', '==', currentUser.uid),
        where('habitId', '==', habitId),
        where('date', '==', todayStr)
      );

      if (currentStatus) { // If currently completed, unmark it (delete completion entry)
        const snapshot = await getDocs(completionsQuery);
        if (!snapshot.empty) {
          const docIdToDelete = snapshot.docs[0].id;
          await deleteDoc(doc(db, 'habitCompletions', docIdToDelete));
        }
      } else { // If not completed, mark it (add completion entry)
        await addDoc(collection(db, 'habitCompletions'), {
          userId: currentUser.uid,
          habitId: habitId,
          date: todayStr,
          completedAt: serverTimestamp(),
        });
      }
      // Update local state
      setHabits(prevHabits =>
        prevHabits.map(h =>
          h.id === habitId ? { ...h, completedToday: !currentStatus } : h
        )
      );
    } catch (error) {
      console.error("Error toggling habit completion:", error);
      // TODO: Show error to user
    }
    setCompletingHabitId(null);
  };

  const handleDeleteHabit = async (habitId) => {
    if (!currentUser) return;
    setDeletingHabitId(habitId);
    try {
      const batch = writeBatch(db);

      // 1. Delete the habit document
      batch.delete(doc(db, 'habits', habitId));

      // 2. Delete all associated completion records (important for data integrity)
      const completionsQuery = query(
        collection(db, 'habitCompletions'),
        where('userId', '==', currentUser.uid), // Ensure we only delete for the current user
        where('habitId', '==', habitId)
      );
      const completionsSnapshot = await getDocs(completionsQuery);
      completionsSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      setHabits(prevHabits => prevHabits.filter(h => h.id !== habitId));
    } catch (error) {
      console.error("Error deleting habit:", error);
      // TODO: Show error to user
    }
    setDeletingHabitId(null);
  };


  if (loadingHabits && habits.length === 0 && !currentUser) { // Initial load before user is confirmed
    return (
      <PageWrapper className="flex justify-center items-center h-screen">
        <Spinner size={48} />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Habits</h1>
        <p className="text-gray-600">Track your progress and build better routines.</p>
      </div>

      <AddHabitForm onAddHabit={handleAddHabit} isLoading={addingHabit} />

      <h2 className="text-2xl font-semibold text-gray-700 mb-4 mt-10">Today's Habits</h2>
      <HabitList
        habits={habits}
        onToggleComplete={handleToggleComplete}
        onDeleteHabit={handleDeleteHabit}
        loading={loadingHabits}
        completingHabitId={completingHabitId}
        deletingHabitId={deletingHabitId}
      />
    </PageWrapper>
  );
};