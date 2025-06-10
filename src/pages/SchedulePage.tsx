
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import { useWorkoutSplits } from '@/hooks/useWorkoutSplits';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { WorkoutTimer } from '@/components/workout/WorkoutTimer';

const SchedulePage = () => {
  const { savedSplit, isLoading: splitsLoading } = useWorkoutSplits();
  const { 
    activeSessions, 
    startWorkoutSession, 
    endWorkoutSession, 
    cancelWorkoutSession,
    isLoading: sessionsLoading 
  } = useWorkoutSessions();

  const getCurrentWeekDays = () => {
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const monday = new Date(today);
    monday.setDate(today.getDate() - currentDayOfWeek + (currentDayOfWeek === 0 ? -6 : 1));

    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDays.push({
        name: date.toLocaleDateString('en-US', { weekday: 'long' }),
        date: date.toISOString().split('T')[0],
        dayIndex: i
      });
    }
    return weekDays;
  };

  const getWorkoutsForDay = (dayIndex: number) => {
    if (!savedSplit?.split_data?.days) return [];
    
    // Map the day index to the workout split days
    const splitDays = savedSplit.split_data.days;
    if (dayIndex < splitDays.length) {
      const splitDay = splitDays[dayIndex];
      return [{
        name: splitDay.name,
        exercises: splitDay.exercises,
        duration: '60 mins', // Default duration
        type: 'Strength'
      }];
    }
    return [];
  };

  const handleStartWorkout = async (workoutName: string, workoutDay: string) => {
    await startWorkoutSession(workoutName, workoutDay);
  };

  const handleCompleteWorkout = async (sessionId: string) => {
    await endWorkoutSession(sessionId);
  };

  const handleCancelWorkout = async (sessionId: string) => {
    await cancelWorkoutSession(sessionId);
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const getActiveSessionForDay = (dateString: string) => {
    return activeSessions.find(session => 
      session.workout_day === dateString && session.status === 'in_progress'
    );
  };

  const weekDays = getCurrentWeekDays();

  if (splitsLoading || sessionsLoading) {
    return (
      <AppLayout>
        <PremiumPageWrapper featureName="Workout Schedule">
          <div className="space-y-6">
            <div className="text-center">Loading workout schedule...</div>
          </div>
        </PremiumPageWrapper>
      </AppLayout>
    );
  }

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

          {activeSessions.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Active Workouts</h2>
              {activeSessions.map((session) => (
                <WorkoutTimer
                  key={session.id}
                  sessionId={session.id}
                  workoutName={session.workout_name}
                  startTime={session.start_time}
                  onComplete={() => handleCompleteWorkout(session.id)}
                  onCancel={() => handleCancelWorkout(session.id)}
                />
              ))}
            </div>
          )}
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">This Week's Schedule</CardTitle>
              <CardDescription className="text-slate-400">
                {savedSplit 
                  ? `Following your ${savedSplit.split_name} workout split`
                  : "Set up your workout split in the Workouts page to see your personalized schedule"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!savedSplit ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">
                    No workout split found. Create one in the Workouts page to see your schedule here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                  {weekDays.map((day) => {
                    const workouts = getWorkoutsForDay(day.dayIndex);
                    const activeSession = getActiveSessionForDay(day.date);
                    
                    return (
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
                          {workouts.length === 0 ? (
                            <p className="text-xs text-slate-500">Rest Day</p>
                          ) : (
                            workouts.map((workout, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-slate-200">{workout.name}</p>
                                  <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                                    {workout.duration}
                                  </Badge>
                                </div>
                                <p className="text-xs text-slate-400">{workout.type}</p>
                                
                                {activeSession ? (
                                  <div className="text-xs text-green-400">
                                    Workout in progress...
                                  </div>
                                ) : (
                                  <Button
                                    onClick={() => handleStartWorkout(workout.name, day.date)}
                                    disabled={!isToday(day.date)}
                                    size="sm"
                                    className={`
                                      ${isToday(day.date) 
                                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                      }
                                      w-full transition-all duration-300
                                    `}
                                  >
                                    <Play className="h-4 w-4 mr-1" />
                                    {isToday(day.date) ? 'Start Workout' : 'Not Today'}
                                  </Button>
                                )}
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default SchedulePage;
