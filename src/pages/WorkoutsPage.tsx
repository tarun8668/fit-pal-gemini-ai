
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WorkoutSplitGenerator } from '@/components/workouts/WorkoutSplitGenerator';

const WorkoutsPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6 min-h-screen p-4">
        <Card>
          <CardHeader>
            <CardTitle>Workout Plans</CardTitle>
            <CardDescription>Find the perfect workout split based on your goals and schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <WorkoutSplitGenerator />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default WorkoutsPage;
