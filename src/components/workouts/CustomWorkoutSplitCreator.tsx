
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useWorkoutSplits, WorkoutSplit, WorkoutDay } from '@/hooks/useWorkoutSplits';

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const COMMON_EXERCISES = [
  'Bench Press', 'Squats', 'Deadlifts', 'Pull-ups', 'Push-ups', 'Overhead Press',
  'Barbell Rows', 'Incline Bench Press', 'Leg Press', 'Romanian Deadlifts',
  'Lateral Raises', 'Bicep Curls', 'Tricep Pushdowns', 'Leg Extensions',
  'Leg Curls', 'Calf Raises', 'Face Pulls', 'Dips', 'Lunges', 'Hip Thrusts'
];

export const CustomWorkoutSplitCreator = () => {
  const { saveSplit } = useWorkoutSplits();
  const [splitName, setSplitName] = useState('');
  const [splitDescription, setSplitDescription] = useState('');
  const [workoutDays, setWorkoutDays] = useState<WorkoutDay[]>([]);
  const [currentDay, setCurrentDay] = useState('');
  const [currentExercise, setCurrentExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');

  const addWorkoutDay = () => {
    if (!currentDay || workoutDays.some(day => day.name === currentDay)) return;
    
    setWorkoutDays([...workoutDays, { name: currentDay, exercises: [] }]);
    setCurrentDay('');
  };

  const removeWorkoutDay = (dayName: string) => {
    setWorkoutDays(workoutDays.filter(day => day.name !== dayName));
  };

  const addExercise = (dayName: string, exercise: string) => {
    if (!exercise) return;
    
    setWorkoutDays(workoutDays.map(day => 
      day.name === dayName 
        ? { ...day, exercises: [...day.exercises, exercise] }
        : day
    ));
  };

  const removeExercise = (dayName: string, exerciseIndex: number) => {
    setWorkoutDays(workoutDays.map(day => 
      day.name === dayName 
        ? { ...day, exercises: day.exercises.filter((_, index) => index !== exerciseIndex) }
        : day
    ));
  };

  const handleSaveCustomSplit = async () => {
    if (!splitName || workoutDays.length === 0) return;

    const customSplit: WorkoutSplit = {
      name: splitName,
      description: splitDescription || `Custom ${workoutDays.length}-day split`,
      days: workoutDays,
      advantages: ['Fully customized to your preferences', 'Fits your specific schedule'],
      suitableFor: ['All fitness levels', 'Anyone with specific workout preferences']
    };

    await saveSplit('custom', customSplit);
    
    // Reset form
    setSplitName('');
    setSplitDescription('');
    setWorkoutDays([]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Custom Workout Split</CardTitle>
        <CardDescription>
          Design your own workout split with custom days and exercises
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="split-name">Split Name</Label>
            <Input
              id="split-name"
              placeholder="e.g., My Custom Split"
              value={splitName}
              onChange={(e) => setSplitName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="split-description">Description (Optional)</Label>
            <Input
              id="split-description"
              placeholder="Brief description of your split"
              value={splitDescription}
              onChange={(e) => setSplitDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Select value={currentDay} onValueChange={setCurrentDay}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                {DAYS_OF_WEEK.map((day) => (
                  <SelectItem key={day} value={day} disabled={workoutDays.some(d => d.name === day)}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={addWorkoutDay} disabled={!currentDay}>
              <Plus className="h-4 w-4 mr-1" />
              Add Day
            </Button>
          </div>

          {workoutDays.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Workout Days</h4>
              {workoutDays.map((day) => (
                <Card key={day.name} className="border-border">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{day.name}</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeWorkoutDay(day.name)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-2">
                      <Select value="" onValueChange={(value) => addExercise(day.name, value)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Add exercise" />
                        </SelectTrigger>
                        <SelectContent>
                          {COMMON_EXERCISES.map((exercise) => (
                            <SelectItem key={exercise} value={exercise}>
                              {exercise}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Custom exercise"
                          value={customExercise}
                          onChange={(e) => setCustomExercise(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && customExercise) {
                              addExercise(day.name, customExercise);
                              setCustomExercise('');
                            }
                          }}
                        />
                        <Button
                          onClick={() => {
                            if (customExercise) {
                              addExercise(day.name, customExercise);
                              setCustomExercise('');
                            }
                          }}
                          disabled={!customExercise}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                    
                    {day.exercises.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {day.exercises.map((exercise, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {exercise}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={() => removeExercise(day.name, index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Button
          onClick={handleSaveCustomSplit}
          disabled={!splitName || workoutDays.length === 0}
          className="w-full"
        >
          Save Custom Split
        </Button>
      </CardContent>
    </Card>
  );
};
