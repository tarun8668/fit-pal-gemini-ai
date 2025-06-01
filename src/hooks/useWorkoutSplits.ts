
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type WorkoutDay = {
  name: string;
  exercises: string[];
};

export type WorkoutSplit = {
  name: string;
  description: string;
  days: WorkoutDay[];
  advantages: string[];
  suitableFor: string[];
};

export type SavedWorkoutSplit = {
  id: string;
  split_type: string;
  split_name: string;
  split_data: WorkoutSplit;
  created_at: string;
  updated_at: string;
};

export const useWorkoutSplits = () => {
  const [savedSplit, setSavedSplit] = useState<SavedWorkoutSplit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchSavedSplit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_workout_splits')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching workout split:', error);
        return;
      }

      setSavedSplit(data);
    } catch (error) {
      console.error('Error fetching workout split:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSplit = async (splitType: string, splitData: WorkoutSplit) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to save workout splits",
          variant: "destructive",
        });
        return;
      }

      // First, check if user already has a split
      const { data: existingSplit } = await supabase
        .from('user_workout_splits')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let result;
      if (existingSplit) {
        // Update existing split
        result = await supabase
          .from('user_workout_splits')
          .update({
            split_type: splitType,
            split_name: splitData.name,
            split_data: splitData,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .select()
          .single();
      } else {
        // Insert new split
        result = await supabase
          .from('user_workout_splits')
          .insert({
            user_id: user.id,
            split_type: splitType,
            split_name: splitData.name,
            split_data: splitData,
          })
          .select()
          .single();
      }

      if (result.error) {
        console.error('Error saving workout split:', result.error);
        toast({
          title: "Error",
          description: "Failed to save workout split",
          variant: "destructive",
        });
        return;
      }

      setSavedSplit(result.data);
      toast({
        title: "Success",
        description: "Workout split saved successfully!",
      });
    } catch (error) {
      console.error('Error saving workout split:', error);
      toast({
        title: "Error",
        description: "Failed to save workout split",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchSavedSplit();
  }, []);

  return {
    savedSplit,
    isLoading,
    saveSplit,
    refetchSplit: fetchSavedSplit,
  };
};
