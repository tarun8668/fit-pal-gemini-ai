
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Square, Pause } from 'lucide-react';

interface WorkoutTimerProps {
  sessionId: string;
  workoutName: string;
  startTime: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const WorkoutTimer: React.FC<WorkoutTimerProps> = ({
  sessionId,
  workoutName,
  startTime,
  onComplete,
  onCancel
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const startTimeMs = new Date(startTime).getTime();
    
    const interval = setInterval(() => {
      if (isRunning) {
        const now = new Date().getTime();
        const elapsed = Math.floor((now - startTimeMs) / 1000);
        setElapsedTime(elapsed);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, isRunning]);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <Card className="bg-gradient-to-br from-green-800/50 to-green-900/50 backdrop-blur-md border-green-700">
      <CardContent className="p-4 text-center">
        <h3 className="text-lg font-semibold text-green-100 mb-2">
          {workoutName} - In Progress
        </h3>
        <div className="text-3xl font-bold text-green-300 mb-4">
          {formatTime(elapsedTime)}
        </div>
        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            size="sm"
            variant="outline"
            className="border-green-600 text-green-300 hover:bg-green-700"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isRunning ? 'Pause' : 'Resume'}
          </Button>
          <Button
            onClick={onComplete}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Square className="h-4 w-4 mr-1" />
            Complete
          </Button>
          <Button
            onClick={onCancel}
            size="sm"
            variant="outline"
            className="border-red-600 text-red-300 hover:bg-red-700"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
