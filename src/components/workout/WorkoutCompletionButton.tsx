
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface WorkoutCompletionButtonProps {
  isCompleted: boolean;
  onToggle: () => void;
  disabled?: boolean;
  workoutName: string;
}

export const WorkoutCompletionButton: React.FC<WorkoutCompletionButtonProps> = ({
  isCompleted,
  onToggle,
  disabled = false,
  workoutName
}) => {
  return (
    <Button
      onClick={onToggle}
      disabled={disabled}
      size="sm"
      variant={isCompleted ? "default" : "outline"}
      className={`
        ${isCompleted 
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
          : 'border-slate-600 text-slate-300 hover:bg-slate-700'
        }
        transition-all duration-200 min-w-[100px]
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
