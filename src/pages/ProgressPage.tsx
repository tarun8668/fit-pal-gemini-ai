
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { History, TrendingUp, Award, Scale, Dumbbell } from 'lucide-react';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';
import WeightTracker from '@/components/progress/WeightTracker';
import StrengthTracker from '@/components/progress/StrengthTracker';

const ProgressPage = () => {
  return (
    <AppLayout>
      <PremiumPageWrapper featureName="Progress Tracking">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Progress Tracking</h1>
            <div className="p-2 bg-primary/10 rounded-full">
              <History className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <TrendingUp className="h-5 w-5 text-green-500" /> Weight Progress
                </CardTitle>
                <CardDescription className="text-slate-400">Track your body weight changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">Active</div>
                <p className="text-xs text-slate-400 mt-1">Daily tracking available</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Award className="h-5 w-5 text-amber-500" /> Strength Records
                </CardTitle>
                <CardDescription className="text-slate-400">Monitor your lifting progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">Personal</div>
                <p className="text-xs text-slate-400 mt-1">Track 1RM improvements</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <History className="h-5 w-5 text-blue-500" /> Data Insights
                </CardTitle>
                <CardDescription className="text-slate-400">Comprehensive analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">Detailed</div>
                <p className="text-xs text-slate-400 mt-1">Trends and patterns</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tracking Tabs */}
          <Tabs defaultValue="weight" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger 
                value="weight" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600"
              >
                <Scale className="h-4 w-4" />
                Weight Tracking
              </TabsTrigger>
              <TabsTrigger 
                value="strength" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600"
              >
                <Dumbbell className="h-4 w-4" />
                Strength Progress
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="weight" className="mt-6">
              <WeightTracker />
            </TabsContent>
            
            <TabsContent value="strength" className="mt-6">
              <StrengthTracker />
            </TabsContent>
          </Tabs>
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default ProgressPage;
