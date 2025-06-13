
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useWorkoutSplits } from '@/hooks/useWorkoutSplits';
import { CustomWorkoutSplitCreator } from './CustomWorkoutSplitCreator';

type WorkoutSplit = {
  name: string;
  description: string;
  days: {
    name: string;
    exercises: string[];
  }[];
  advantages: string[];
  suitableFor: string[];
};

const WORKOUT_SPLITS: Record<string, WorkoutSplit> = {
  'ppl': {
    name: 'Push/Pull/Legs',
    description: 'A 6-day split that focuses on pushing movements, pulling movements, and leg exercises separately.',
    days: [
      {
        name: 'Push (Day 1)',
        exercises: ['Bench Press', 'Overhead Press', 'Incline Dumbbell Press', 'Tricep Dips', 'Lateral Raises', 'Tricep Pushdowns']
      },
      {
        name: 'Pull (Day 2)',
        exercises: ['Deadlifts', 'Pull-ups', 'Barbell Rows', 'Face Pulls', 'Bicep Curls', 'Hammer Curls']
      },
      {
        name: 'Legs (Day 3)',
        exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Leg Extensions', 'Leg Curls', 'Calf Raises']
      },
      {
        name: 'Push (Day 4)',
        exercises: ['Overhead Press', 'Incline Bench Press', 'Cable Flyes', 'Dips', 'Skull Crushers', 'Lateral Raises']
      },
      {
        name: 'Pull (Day 5)',
        exercises: ['Weighted Pull-ups', 'T-Bar Rows', 'Lat Pulldowns', 'Seated Rows', 'Preacher Curls', 'Rear Delt Flyes']
      },
      {
        name: 'Legs (Day 6)',
        exercises: ['Front Squats', 'Hack Squats', 'Walking Lunges', 'Bulgarian Split Squats', 'Seated Calf Raises', 'Hip Thrusts']
      }
    ],
    advantages: [
      'Allows for higher frequency per muscle group',
      'Good balance between volume and recovery',
      'Can be adapted to 3 days if needed'
    ],
    suitableFor: ['Intermediate to advanced lifters', 'Those who can train 5-6 days per week', 'People focused on hypertrophy']
  },
  'upper-lower': {
    name: 'Upper/Lower',
    description: 'A 4-day split that alternates between upper body and lower body workouts.',
    days: [
      {
        name: 'Upper Body (Day 1)',
        exercises: ['Bench Press', 'Barbell Rows', 'Overhead Press', 'Pull-ups', 'Incline Dumbbell Press', 'Face Pulls', 'Tricep Extensions', 'Bicep Curls']
      },
      {
        name: 'Lower Body (Day 2)',
        exercises: ['Squats', 'Romanian Deadlifts', 'Leg Press', 'Leg Curls', 'Leg Extensions', 'Calf Raises']
      },
      {
        name: 'Upper Body (Day 3)',
        exercises: ['Overhead Press', 'Weighted Pull-ups', 'Incline Bench Press', 'Seated Rows', 'Lateral Raises', 'Rear Delt Flyes', 'Skull Crushers', 'Hammer Curls']
      },
      {
        name: 'Lower Body (Day 4)',
        exercises: ['Deadlifts', 'Front Squats', 'Bulgarian Split Squats', 'Hip Thrusts', 'Leg Extensions', 'Standing Calf Raises']
      }
    ],
    advantages: [
      'Good balance of frequency and recovery',
      'Flexible scheduling (can be done Mon/Tue/Thu/Fri)',
      'Suitable for most experience levels'
    ],
    suitableFor: ['Beginners to advanced lifters', 'Those who can train 4 days per week', 'Anyone focused on strength or hypertrophy']
  },
  'full-body': {
    name: 'Full Body',
    description: 'A 3-day full body workout that hits all major muscle groups each session.',
    days: [
      {
        name: 'Full Body (Day 1)',
        exercises: ['Squats', 'Bench Press', 'Barbell Rows', 'Overhead Press', 'Romanian Deadlifts', 'Bicep Curls', 'Tricep Pushdowns']
      },
      {
        name: 'Full Body (Day 2)',
        exercises: ['Deadlifts', 'Incline Bench Press', 'Pull-ups', 'Dumbbell Shoulder Press', 'Leg Press', 'Lateral Raises', 'Skull Crushers']
      },
      {
        name: 'Full Body (Day 3)',
        exercises: ['Front Squats', 'Dips', 'Seated Rows', 'Lunges', 'Push-ups', 'Face Pulls', 'Hammer Curls']
      }
    ],
    advantages: [
      'High frequency for each muscle group',
      'Efficient use of time',
      'Great for beginners or time-constrained individuals'
    ],
    suitableFor: ['Beginners', 'Those with limited time to train', 'Anyone who can only commit to 3 days per week']
  },
  'bro-split': {
    name: 'Body Part Split',
    description: 'A traditional bodybuilding split that focuses on one major muscle group per day.',
    days: [
      {
        name: 'Chest',
        exercises: ['Bench Press', 'Incline Dumbbell Press', 'Cable Flyes', 'Dips', 'Push-ups', 'Pec Deck']
      },
      {
        name: 'Back',
        exercises: ['Deadlifts', 'Pull-ups', 'Barbell Rows', 'Lat Pulldowns', 'Seated Rows', 'Face Pulls']
      },
      {
        name: 'Legs',
        exercises: ['Squats', 'Leg Press', 'Romanian Deadlifts', 'Leg Extensions', 'Leg Curls', 'Calf Raises']
      },
      {
        name: 'Shoulders',
        exercises: ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Rear Delt Flyes', 'Face Pulls', 'Shrugs']
      },
      {
        name: 'Arms',
        exercises: ['Barbell Curls', 'Tricep Pushdowns', 'Hammer Curls', 'Skull Crushers', 'Preacher Curls', 'Dips']
      }
    ],
    advantages: [
      'High volume per muscle group',
      'More recovery time between training the same muscles',
      'Good for isolating specific weaknesses'
    ],
    suitableFor: ['Intermediate to advanced lifters', 'Bodybuilders', 'Those who can train 5 days per week']
  }
};

export const WorkoutSplitGenerator = () => {
  const [selectedSplit, setSelectedSplit] = useState('ppl');
  const [activeTab, setActiveTab] = useState('0');
  const [viewMode, setViewMode] = useState<'preset' | 'custom'>('preset');
  const { savedSplit, saveSplit } = useWorkoutSplits();

  const handleSplitChange = (value: string) => {
    setSelectedSplit(value);
    setActiveTab('0'); // Reset to first tab when changing split
  };

  const handleSaveSplit = () => {
    const currentSplit = WORKOUT_SPLITS[selectedSplit];
    saveSplit(selectedSplit, currentSplit);
  };

  const currentSplit = WORKOUT_SPLITS[selectedSplit];

  return (
    <div className="space-y-6">
      {savedSplit && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-300">
            <strong>Current saved split:</strong> {savedSplit.split_name}
          </p>
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <Button
          variant={viewMode === 'preset' ? 'default' : 'outline'}
          onClick={() => setViewMode('preset')}
        >
          Preset Splits
        </Button>
        <Button
          variant={viewMode === 'custom' ? 'default' : 'outline'}
          onClick={() => setViewMode('custom')}
        >
          Create Custom Split
        </Button>
      </div>

      {viewMode === 'custom' ? (
        <CustomWorkoutSplitCreator />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Preset Workout Splits</CardTitle>
            <CardDescription>
              Choose from proven workout split templates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="split-type">Select Workout Split</Label>
                <Select onValueChange={handleSplitChange} value={selectedSplit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a workout split" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppl">Push/Pull/Legs</SelectItem>
                    <SelectItem value="upper-lower">Upper/Lower</SelectItem>
                    <SelectItem value="full-body">Full Body</SelectItem>
                    <SelectItem value="bro-split">Body Part Split</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium">{currentSplit.name}</h3>
                <p className="text-muted-foreground mt-1 mb-4">{currentSplit.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Advantages:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {currentSplit.advantages.map((advantage, i) => (
                        <li key={i}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-2">Suitable For:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {currentSplit.suitableFor.map((suitability, i) => (
                        <li key={i}>{suitability}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-4">Workout Schedule</h3>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6">
                    {currentSplit.days.map((day, i) => (
                      <TabsTrigger key={i} value={i.toString()}>
                        Day {i + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {currentSplit.days.map((day, i) => (
                    <TabsContent key={i} value={i.toString()}>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{day.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {day.exercises.map((exercise, j) => (
                              <li key={j} className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-primary"></span>
                                <span>{exercise}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
              
              <Button className="w-full" onClick={handleSaveSplit}>
                Save This Split
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
