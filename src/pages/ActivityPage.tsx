import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, Heart } from 'lucide-react';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';

const ActivityPage = () => {
  return (
    <AppLayout>
      <PremiumPageWrapper featureName="Activity Tracking">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Activity Tracking</h1>
            <div className="p-2 bg-primary/10 rounded-full">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Heart className="h-5 w-5 text-red-500" /> Heart Rate
                </CardTitle>
                <CardDescription className="text-slate-400">Today's average</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">72 BPM</div>
                <p className="text-xs text-slate-400 mt-1">Resting: 68 BPM</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <BarChart3 className="h-5 w-5 text-blue-500" /> Steps
                </CardTitle>
                <CardDescription className="text-slate-400">Today's count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">8,245</div>
                <p className="text-xs text-slate-400 mt-1">Goal: 10,000 steps</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full" style={{ width: '82.45%' }}></div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Activity className="h-5 w-5 text-green-500" /> Active Minutes
                </CardTitle>
                <CardDescription className="text-slate-400">Today's activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">45 mins</div>
                <p className="text-xs text-slate-400 mt-1">Goal: 60 mins</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Weekly Activity Summary</CardTitle>
              <CardDescription className="text-slate-400">Your activity for the past week</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">Activity data visualization coming soon</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default ActivityPage;
