
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DietPlanGenerator } from '@/components/diet/DietPlanGenerator';

const DietPlansPage = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Diet Plans</CardTitle>
            <CardDescription>Personalized nutrition plans tailored to your fitness goals</CardDescription>
          </CardHeader>
          <CardContent>
            <DietPlanGenerator />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default DietPlansPage;
