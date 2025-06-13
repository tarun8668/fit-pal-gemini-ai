
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DailyCalorieTracker } from '@/components/diet/DailyCalorieTracker';

const DietPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diet Tracking</CardTitle>
            <CardDescription>Track your daily calorie intake and monitor your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <DailyCalorieTracker />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DietPage;
