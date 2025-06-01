// src/components/habits/AddHabitForm.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Optional, can use placeholder
import { PlusCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/Spinner';

export const AddHabitForm = ({ onAddHabit, isLoading }) => {
  const [habitName, setHabitName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return; // Don't add empty habits
    onAddHabit(habitName.trim());
    setHabitName(''); // Clear input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Add New Habit</h2>
      <div className="flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-grow">
          <Label htmlFor="habitName" className="sr-only">Habit Name</Label> {/* Screen-reader only label */}
          <Input
            id="habitName"
            type="text"
            value={habitName}
            onChange={(e) => setHabitName(e.target.value)}
            placeholder="e.g., Read for 30 minutes"
            className="text-base"
            required
          />
        </div>
        <Button type="submit" disabled={isLoading || !habitName.trim()} className="w-full sm:w-auto">
          {isLoading ? <Spinner size={20} className="mr-2" /> : <PlusCircle size={20} className="mr-2" />}
          Add Habit
        </Button>
      </div>
    </form>
  );
};