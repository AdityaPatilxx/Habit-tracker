// src/components/habits/HabitList.jsx
import React from 'react';
import { HabitItem } from './HabitItem';
import { Spinner } from '@/components/ui/Spinner'; // Your custom spinner

export const HabitList = ({ habits, onToggleComplete, onDeleteHabit, loading, completingHabitId, deletingHabitId }) => {
  if (loading && habits.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Spinner size={40} />
      </div>
    );
  }

  if (!loading && habits.length === 0) {
    return (
      <div className="text-center py-10 px-6 bg-white rounded-lg shadow">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No habits yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a new habit above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          habit={habit}
          onToggleComplete={onToggleComplete}
          onDeleteHabit={onDeleteHabit}
          isCompleting={completingHabitId === habit.id}
          isDeleting={deletingHabitId === habit.id}
        />
      ))}
    </div>
  );
};