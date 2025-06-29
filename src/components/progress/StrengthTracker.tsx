
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Dumbbell, Plus, Trophy, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface StrengthEntry {
  id: string;
  exercise_name: string;
  weight: number;
  reps: number;
  sets: number;
  recorded_date: string;
  one_rep_max: number;
}

const StrengthTracker = () => {
  const { user } = useAuth();
  const [strengthEntries, setStrengthEntries] = useState<StrengthEntry[]>([]);
  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const popularExercises = [
    'Bench Press', 'Squat', 'Deadlift', 'Overhead Press', 'Pull-ups', 
    'Barbell Row', 'Dips', 'Bicep Curls', 'Tricep Extensions', 'Lat Pulldowns'
  ];

  const chartConfig = {
    oneRepMax: {
      label: '1RM (kg)',
      color: '#8b5cf6',
    },
    weight: {
      label: 'Weight (kg)',
      color: '#06b6d4',
    }
  };

  useEffect(() => {
    if (user) {
      fetchStrengthEntries();
    }
  }, [user]);

  const fetchStrengthEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('strength_tracking' as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('recorded_date', { ascending: true });

      if (error) throw error;
      setStrengthEntries(data || []);
    } catch (error) {
      console.error('Error fetching strength entries:', error);
      toast.error('Failed to load strength data');
    }
  };

  const calculateOneRepMax = (weight: number, reps: number) => {
    // Using Brzycki formula: 1RM = weight × (36 / (37 - reps))
    if (reps === 1) return weight;
    return Math.round(weight * (36 / (37 - reps)) * 100) / 100;
  };

  const addStrengthEntry = async () => {
    if (!exerciseName || !weight || !reps || !sets || !user) return;

    const oneRepMax = calculateOneRepMax(parseFloat(weight), parseInt(reps));

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('strength_tracking' as any)
        .insert([{
          user_id: user.id,
          exercise_name: exerciseName,
          weight: parseFloat(weight),
          reps: parseInt(reps),
          sets: parseInt(sets),
          one_rep_max: oneRepMax,
          recorded_date: new Date().toISOString().split('T')[0]
        }]);

      if (error) throw error;

      setExerciseName('');
      setWeight('');
      setReps('');
      setSets('');
      fetchStrengthEntries();
      toast.success('Strength entry added successfully');
    } catch (error) {
      console.error('Error adding strength entry:', error);
      toast.error('Failed to add strength entry');
    } finally {
      setIsLoading(false);
    }
  };

  const getExerciseProgress = (exerciseName: string) => {
    return strengthEntries
      .filter(entry => entry.exercise_name === exerciseName)
      .map(entry => ({
        date: format(new Date(entry.recorded_date), 'MMM dd'),
        oneRepMax: entry.one_rep_max,
        weight: entry.weight,
        reps: entry.reps
      }));
  };

  const getUniqueExercises = () => {
    return [...new Set(strengthEntries.map(entry => entry.exercise_name))];
  };

  const getLatestRecords = () => {
    const exercises = getUniqueExercises();
    return exercises.map(exercise => {
      const exerciseEntries = strengthEntries.filter(entry => entry.exercise_name === exercise);
      const latest = exerciseEntries[exerciseEntries.length - 1];
      const previous = exerciseEntries[exerciseEntries.length - 2];
      
      return {
        exercise,
        current: latest?.one_rep_max || 0,
        previous: previous?.one_rep_max || 0,
        improvement: latest && previous ? ((latest.one_rep_max - previous.one_rep_max) / previous.one_rep_max * 100) : 0
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Strength Input Section */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Dumbbell className="h-5 w-5 text-purple-500" />
            Add Strength Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="exercise" className="text-slate-300">Exercise</Label>
              <Select value={exerciseName} onValueChange={setExerciseName}>
                <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select or type exercise" />
                </SelectTrigger>
                <SelectContent>
                  {popularExercises.map(exercise => (
                    <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                className="mt-2 bg-slate-700/50 border-slate-600 text-slate-100"
                placeholder="Or type custom exercise"
                value={exerciseName}
                onChange={(e) => setExerciseName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="weight" className="text-slate-300">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <Label htmlFor="reps" className="text-slate-300">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
              <div>
                <Label htmlFor="sets" className="text-slate-300">Sets</Label>
                <Input
                  id="sets"
                  type="number"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-slate-100"
                />
              </div>
            </div>
          </div>
          <Button 
            onClick={addStrengthEntry} 
            disabled={isLoading || !exerciseName || !weight || !reps || !sets}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Strength Entry
          </Button>
        </CardContent>
      </Card>

      {/* Latest Records */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Trophy className="h-5 w-5 text-amber-500" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getLatestRecords().map(record => (
              <div key={record.exercise} className="p-4 bg-slate-700/30 rounded-lg">
                <h4 className="font-semibold text-slate-100 mb-2">{record.exercise}</h4>
                <div className="text-2xl font-bold text-purple-500">{record.current} kg</div>
                <div className="text-sm text-slate-400">1RM Estimate</div>
                {record.improvement !== 0 && (
                  <div className={`flex items-center gap-1 text-sm mt-1 ${
                    record.improvement > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    <TrendingUp className="h-3 w-3" />
                    {record.improvement > 0 ? '+' : ''}{record.improvement.toFixed(1)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Exercise Progress Chart */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Exercise Progress</CardTitle>
          <div>
            <Select value={selectedExercise} onValueChange={setSelectedExercise}>
              <SelectTrigger className="w-64 bg-slate-700/50 border-slate-600 text-slate-100">
                <SelectValue placeholder="Select exercise to view progress" />
              </SelectTrigger>
              <SelectContent>
                {getUniqueExercises().map(exercise => (
                  <SelectItem key={exercise} value={exercise}>{exercise}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-80">
          {selectedExercise && getExerciseProgress(selectedExercise).length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getExerciseProgress(selectedExercise)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="oneRepMax" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#a78bfa', strokeWidth: 0 }}
                    name="1RM"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>No strength data available</p>
                <p className="text-sm">
                  {selectedExercise ? `No data for ${selectedExercise}` : 'Select an exercise to view progress'}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StrengthTracker;
