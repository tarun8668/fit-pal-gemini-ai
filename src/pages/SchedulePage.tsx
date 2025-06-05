
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { WorkoutCompletionButton } from '@/components/workout/WorkoutCompletionButton';
import { useWorkoutCompletions } from '@/hooks/useWorkoutCompletions';

const weekDays = [
  {
    name: 'Monday',
    date: '2024-08-26',
    workouts: [
      { name: 'Chest & Triceps', duration: '60 mins', type: 'Strength' },
      { name: 'HIIT Cardio', duration: '30 mins', type: 'Cardio' },
    ],
  },
  {
    name: 'Tuesday',
    date: '2024-08-27',
    workouts: [
      { name: 'Back & Biceps', duration: '60 mins', type: 'Strength' },
      { name: 'Yoga', duration: '45 mins', type: 'Flexibility' },
    ],
  },
  {
    name: 'Wednesday',
    date: '2024-08-28',
    workouts: [
      { name: 'Legs & Shoulders', duration: '75 mins', type: 'Strength' },
      { name: 'Swimming', duration: '45 mins', type: 'Cardio' },
    ],
  },
  {
    name: 'Thursday',
    date: '2024-08-29',
    workouts: [
      { name: 'Full Body Circuit', duration: '60 mins', type: 'Strength' },
      { name: 'Pilates', duration: '60 mins', type: 'Flexibility' },
    ],
  },
];

const SchedulePage = () => {
  const { 
    isWorkoutCompletedToday, 
    markWorkoutComplete, 
    unmarkWorkoutComplete, 
    canMarkWorkoutForDay 
  } = useWorkoutCompletions();

  const handleToggleWorkout = async (workoutDay: string, workoutName: string, dayName: string) => {
    const isCompleted = isWorkoutCompletedToday(workoutDay);
    
    if (isCompleted) {
      await unmarkWorkoutComplete(workoutDay);
    } else {
      await markWorkoutComplete(workoutDay, workoutName);
    }
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <AppLayout>
      <PremiumPageWrapper featureName="Workout Schedule">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Workout Schedule</h1>
            <div className="p-2 bg-primary/10 rounded-full">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">This Week's Schedule</CardTitle>
              <CardDescription className="text-slate-400">
                Your personalized workout plan for maximum results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {weekDays.map((day) => (
                  <Card key={day.name} className="bg-slate-800/30 border-slate-600">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-100">
                          {day.name}
                        </CardTitle>
                        <span className="text-xs text-slate-400">{day.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {day.workouts.map((workout, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-200">{workout.name}</p>
                            <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                              {workout.duration}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-400">{workout.type}</p>
                          
                          <WorkoutCompletionButton
                            isCompleted={isWorkoutCompletedToday(day.date)}
                            onToggle={() => handleToggleWorkout(day.date, workout.name, day.name)}
                            workoutName={workout.name}
                            canMarkToday={isToday(day.date)}
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default SchedulePage;
