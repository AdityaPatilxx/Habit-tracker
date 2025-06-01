// src/components/habits/HabitItem.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'; // Shadcn UI Checkbox
import { Trash2, Edit3 } from 'lucide-react'; // Edit icon for future use

export const HabitItem = ({ habit, onToggleComplete, onDeleteHabit, isCompleting, isDeleting }) => {
  const handleToggle = () => {
    onToggleComplete(habit.id, habit.completedToday);
  };

  const handleDelete = () => {
    // Could add a confirmation dialog here using Shadcn's Dialog or AlertDialo
    if (window.confirm(`Are you sure you want to delete "${habit.name}"? This action cannot be undone.`)) {
      onDeleteHabit(habit.id);
    }
  };

  return (
    <div className={`flex items-center justify-between p-4 bg-white rounded-lg shadow transition-colors duration-200 ${habit.completedToday ? 'bg-green-50 border-l-4 border-green-500' : 'border-l-4 border-transparent'}`}>
      <div className="flex items-center space-x-3">
        <Checkbox
          id={`habit-${habit.id}`}
          checked={habit.completedToday}
          onCheckedChange={handleToggle}
          disabled={isCompleting} // Disable while the toggle action is in progress
          aria-label={`Mark ${habit.name} as ${habit.completedToday ? 'incomplete' : 'complete'}`}
        />
        <label
          htmlFor={`habit-${habit.id}`}
          className={`text-lg font-medium cursor-pointer ${habit.completedToday ? 'line-through text-gray-500' : 'text-gray-800'}`}
        >
          {habit.name}
        </label>
      </div>
      <div className="flex items-center space-x-2">
        {/* MVP: Delete only. Edit can be added later. */}
        {/* <Button variant="ghost" size="icon" className="text-gray-500 hover:text-blue-600" onClick={() => console.log("Edit habit", habit.id)} title="Edit habit">
          <Edit3 size={18} />
        </Button> */}
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:text-red-600"
          onClick={handleDelete}
          disabled={isDeleting}
          title="Delete habit"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
};