import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { History, TrendingUp, Award } from 'lucide-react';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';

const ProgressPage = () => {
  // Sample data for the charts
  const weightData = [
    { name: 'Jan', value: 87 },
    { name: 'Feb', value: 86.2 },
    { name: 'Mar', value: 85.3 },
    { name: 'Apr', value: 84.7 },
    { name: 'May', value: 83.9 },
    { name: 'Jun', value: 83.2 },
    { name: 'Jul', value: 82.5 },
  ];

  const strengthData = [
    { name: 'Bench', previous: 180, current: 195 },
    { name: 'Squat', previous: 250, current: 275 },
    { name: 'Deadlift', previous: 300, current: 315 },
    { name: 'OHP', previous: 125, current: 135 },
  ];

  // Chart configuration objects for the ChartContainer component
  const weightChartConfig = {
    weight: {
      label: 'Weight',
      color: '#8b5cf6',
    },
  };

  const strengthChartConfig = {
    previous: {
      label: 'Previous',
      color: '#6366f1',
    },
    current: {
      label: 'Current',
      color: '#8b5cf6',
    },
  };

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
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <TrendingUp className="h-5 w-5 text-green-500" /> Weight Loss
                </CardTitle>
                <CardDescription className="text-slate-400">Total progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">-4.5 kg</div>
                <p className="text-xs text-slate-400 mt-1">Since January 2025</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Award className="h-5 w-5 text-amber-500" /> Strength Gain
                </CardTitle>
                <CardDescription className="text-slate-400">Overall increase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">+15%</div>
                <p className="text-xs text-slate-400 mt-1">In the last 6 months</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <History className="h-5 w-5 text-blue-500" /> Workout Streak
                </CardTitle>
                <CardDescription className="text-slate-400">Consecutive workouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-500">17 days</div>
                <p className="text-xs text-slate-400 mt-1">Keep going strong!</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Weight Tracking</CardTitle>
              <CardDescription className="text-slate-400">Your weight over time</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ChartContainer config={weightChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
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
                      dataKey="value" 
                      stroke="#8b5cf6" 
                      strokeWidth={2} 
                      dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                      activeDot={{ r: 6, fill: '#a78bfa', strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Strength Progress</CardTitle>
              <CardDescription className="text-slate-400">Previous vs current lifting stats</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <ChartContainer config={strengthChartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={strengthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#f3f4f6'
                      }} 
                    />
                    <Bar dataKey="previous" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="current" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default ProgressPage;
