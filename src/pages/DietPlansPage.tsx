
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DietPlanGenerator } from '@/components/diet/DietPlanGenerator';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';

const DietPlansPage = () => {
  return (
    <AppLayout>
      <PremiumPageWrapper featureName="Diet Plans">
        <div className="space-y-6 bg-white dark:bg-black min-h-screen">
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
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default DietPlansPage;
