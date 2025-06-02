
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WorkoutCompletion {
  id: string;
  user_id: string;
  workout_day: string;
  workout_name: string;
  completion_date: string;
  created_at: string;
}

export const useWorkoutCompletions = () => {
  const [completions, setCompletions] = useState<WorkoutCompletion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchCompletions();
    }
  }, [user]);

  const fetchCompletions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_completions')
        .select('*')
        .eq('user_id', user.id)
        .order('completion_date', { ascending: false });

      if (error) throw error;

      setCompletions(data || []);
      calculateStreak(data || []);
    } catch (error) {
      console.error('Error fetching workout completions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStreak = (completionsData: WorkoutCompletion[]) => {
    if (completionsData.length === 0) {
      setStreak(0);
      return;
    }

    // Get unique completion dates
    const uniqueDates = Array.from(
      new Set(completionsData.map(c => c.completion_date))
    ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < uniqueDates.length; i++) {
      const completionDate = new Date(uniqueDates[i]);
      completionDate.setHours(0, 0, 0, 0);
      
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);

      if (completionDate.getTime() === expectedDate.getTime()) {
        currentStreak++;
      } else {
        break;
      }
    }

    setStreak(currentStreak);
  };

  const markWorkoutComplete = async (workoutDay: string, workoutName: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_completions')
        .insert({
          user_id: user.id,
          workout_day: workoutDay,
          workout_name: workoutName,
          completion_date: new Date().toISOString().split('T')[0]
        });

      if (error) throw error;

      toast({
        title: "Workout Completed! 🎉",
        description: `Great job completing your ${workoutName}!`,
      });

      fetchCompletions(); // Refresh data
    } catch (error: any) {
      if (error.code === '23505') {
        toast({
          title: "Already Completed",
          description: "You've already marked this workout as complete today!",
          variant: "destructive",
        });
      } else {
        console.error('Error marking workout complete:', error);
        toast({
          title: "Error",
          description: "Failed to mark workout as complete.",
          variant: "destructive",
        });
      }
    }
  };

  const unmarkWorkoutComplete = async (workoutDay: string) => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('workout_completions')
        .delete()
        .eq('user_id', user.id)
        .eq('workout_day', workoutDay)
        .eq('completion_date', today);

      if (error) throw error;

      toast({
        title: "Workout Unmarked",
        description: "Workout completion removed.",
      });

      fetchCompletions(); // Refresh data
    } catch (error) {
      console.error('Error unmarking workout:', error);
      toast({
        title: "Error",
        description: "Failed to unmark workout.",
        variant: "destructive",
      });
    }
  };

  const isWorkoutCompletedToday = (workoutDay: string) => {
    const today = new Date().toISOString().split('T')[0];
    return completions.some(
      c => c.workout_day === workoutDay && c.completion_date === today
    );
  };

  return {
    completions,
    isLoading,
    streak,
    markWorkoutComplete,
    unmarkWorkoutComplete,
    isWorkoutCompletedToday,
    refreshCompletions: fetchCompletions
  };
};
