
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalorieCalculator } from '@/components/calculators/CalorieCalculator';

const CaloriesPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Calorie Calculator</CardTitle>
            <CardDescription>Calculate your daily calorie needs based on your goals and activity level</CardDescription>
          </CardHeader>
          <CardContent>
            <CalorieCalculator />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CaloriesPage;
