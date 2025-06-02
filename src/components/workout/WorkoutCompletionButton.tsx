
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, Lock } from 'lucide-react';

interface WorkoutCompletionButtonProps {
  isCompleted: boolean;
  onToggle: () => void;
  disabled?: boolean;
  workoutName: string;
  canMarkToday?: boolean;
}

export const WorkoutCompletionButton: React.FC<WorkoutCompletionButtonProps> = ({
  isCompleted,
  onToggle,
  disabled = false,
  workoutName,
  canMarkToday = true
}) => {
  const isDisabled = disabled || !canMarkToday;

  if (!canMarkToday) {
    return (
      <Button
        disabled={true}
        size="sm"
        variant="outline"
        className="border-slate-600 text-slate-500 bg-slate-800/30 min-w-[100px] cursor-not-allowed"
      >
        <Lock className="h-4 w-4 mr-1" />
        Past Day
      </Button>
    );
  }

  return (
    <Button
      onClick={onToggle}
      disabled={isDisabled}
      size="sm"
      variant={isCompleted ? "default" : "outline"}
      className={`
        ${isCompleted 
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg shadow-green-600/25' 
          : 'border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'
        }
        transition-all duration-300 min-w-[100px] hover:scale-105
      `}
    >
      {isCompleted ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Completed
        </>
      ) : (
        <>
          <X className="h-4 w-4 mr-1" />
          Mark Done
        </>
      )}
    </Button>
  );
};
