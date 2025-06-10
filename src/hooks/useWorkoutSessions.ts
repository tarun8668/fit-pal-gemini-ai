
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface WorkoutSession {
  id: string;
  user_id: string;
  workout_name: string;
  workout_day: string;
  start_time: string;
  end_time?: string;
  duration_minutes?: number;
  session_date: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useWorkoutSessions = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSessions, setActiveSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSessions();
      fetchActiveSessions();
    }
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching workout sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress');

      if (error) throw error;
      setActiveSessions(data || []);
    } catch (error) {
      console.error('Error fetching active sessions:', error);
    }
  };

  const startWorkoutSession = async (workoutName: string, workoutDay: string) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          workout_name: workoutName,
          workout_day: workoutDay,
          start_time: new Date().toISOString(),
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Workout Started! 💪",
        description: `Timer started for ${workoutName}`,
      });

      fetchActiveSessions();
      return data;
    } catch (error) {
      console.error('Error starting workout session:', error);
      toast({
        title: "Error",
        description: "Failed to start workout session.",
        variant: "destructive",
      });
      return null;
    }
  };

  const endWorkoutSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const endTime = new Date();
      const session = activeSessions.find(s => s.id === sessionId);
      if (!session) return;

      const startTime = new Date(session.start_time);
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

      const { error } = await supabase
        .from('workout_sessions')
        .update({
          end_time: endTime.toISOString(),
          duration_minutes: durationMinutes,
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Workout Completed! 🎉",
        description: `Great job! You worked out for ${durationMinutes} minutes.`,
      });

      fetchSessions();
      fetchActiveSessions();
    } catch (error) {
      console.error('Error ending workout session:', error);
      toast({
        title: "Error",
        description: "Failed to end workout session.",
        variant: "destructive",
      });
    }
  };

  const cancelWorkoutSession = async (sessionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: "Workout Cancelled",
        description: "Workout session has been cancelled.",
      });

      fetchSessions();
      fetchActiveSessions();
    } catch (error) {
      console.error('Error cancelling workout session:', error);
    }
  };

  const getSessionStats = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const totalWorkouts = completedSessions.length;
    const totalMinutes = completedSessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);
    const averageDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;

    return {
      totalWorkouts,
      totalMinutes,
      averageDuration,
      thisWeekWorkouts: completedSessions.filter(s => {
        const sessionDate = new Date(s.session_date);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return sessionDate >= oneWeekAgo;
      }).length
    };
  };

  return {
    sessions,
    activeSessions,
    isLoading,
    startWorkoutSession,
    endWorkoutSession,
    cancelWorkoutSession,
    getSessionStats,
    refreshSessions: fetchSessions
  };
};
