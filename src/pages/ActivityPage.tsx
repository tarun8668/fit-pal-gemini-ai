
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, BarChart3, Heart, Clock, TrendingUp, Calendar } from 'lucide-react';
import { PremiumPageWrapper } from '@/components/membership/PremiumPageWrapper';
import { useWorkoutSessions } from '@/hooks/useWorkoutSessions';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityPage = () => {
  const { sessions, getSessionStats, isLoading } = useWorkoutSessions();

  const stats = getSessionStats();

  // Prepare data for charts
  const getWeeklyData = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayWorkouts = sessions.filter(s => 
        s.session_date === dateStr && s.status === 'completed'
      );
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        workouts: dayWorkouts.length,
        duration: dayWorkouts.reduce((sum, s) => sum + (s.duration_minutes || 0), 0)
      });
    }
    return last7Days;
  };

  const getWorkoutTypeData = () => {
    const completedSessions = sessions.filter(s => s.status === 'completed');
    const typeMap = new Map();
    
    completedSessions.forEach(session => {
      const type = session.workout_name;
      if (typeMap.has(type)) {
        typeMap.set(type, typeMap.get(type) + 1);
      } else {
        typeMap.set(type, 1);
      }
    });

    return Array.from(typeMap.entries()).map(([name, count]) => ({
      name,
      count
    }));
  };

  const weeklyData = getWeeklyData();
  const workoutTypeData = getWorkoutTypeData();

  if (isLoading) {
    return (
      <AppLayout>
        <PremiumPageWrapper featureName="Activity Tracking">
          <div className="space-y-6">
            <div className="text-center">Loading activity data...</div>
          </div>
        </PremiumPageWrapper>
      </AppLayout>
    );
  }

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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Calendar className="h-5 w-5 text-blue-500" /> Total Workouts
                </CardTitle>
                <CardDescription className="text-slate-400">All time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">{stats.totalWorkouts}</div>
                <p className="text-xs text-slate-400 mt-1">This week: {stats.thisWeekWorkouts}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Clock className="h-5 w-5 text-green-500" /> Total Time
                </CardTitle>
                <CardDescription className="text-slate-400">Minutes exercised</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">{stats.totalMinutes}</div>
                <p className="text-xs text-slate-400 mt-1">
                  {Math.round(stats.totalMinutes / 60)} hours total
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <BarChart3 className="h-5 w-5 text-purple-500" /> Average Duration
                </CardTitle>
                <CardDescription className="text-slate-400">Per workout</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">{stats.averageDuration} min</div>
                <p className="text-xs text-slate-400 mt-1">Consistency is key!</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <TrendingUp className="h-5 w-5 text-orange-500" /> This Week
                </CardTitle>
                <CardDescription className="text-slate-400">Weekly progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-100">{stats.thisWeekWorkouts}</div>
                <p className="text-xs text-slate-400 mt-1">
                  {stats.thisWeekWorkouts >= 3 ? 'Great consistency!' : 'Keep pushing!'}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Weekly Workout Frequency</CardTitle>
                <CardDescription className="text-slate-400">
                  Number of workouts per day over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="workouts" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Daily Workout Duration</CardTitle>
                <CardDescription className="text-slate-400">
                  Total minutes exercised per day
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {workoutTypeData.length > 0 && (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Workout Distribution</CardTitle>
                <CardDescription className="text-slate-400">
                  Most popular workout types
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workoutTypeData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" stroke="#9CA3AF" />
                    <YAxis dataKey="name" type="category" stroke="#9CA3AF" width={120} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '6px'
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {stats.totalWorkouts > 0 && (
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">💡 Insights & Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-slate-300">
                  {stats.thisWeekWorkouts >= 4 && (
                    <p className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      Excellent consistency! You're on track for a great week.
                    </p>
                  )}
                  {stats.thisWeekWorkouts < 3 && (
                    <p className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-orange-400" />
                      Try to aim for at least 3 workouts this week for optimal results.
                    </p>
                  )}
                  {stats.averageDuration > 45 && (
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-400" />
                      Your average workout duration is impressive! Great stamina.
                    </p>
                  )}
                  {stats.averageDuration < 30 && stats.totalWorkouts > 3 && (
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-400" />
                      Consider extending your workouts slightly for maximum benefit.
                    </p>
                  )}
                  {stats.totalWorkouts >= 10 && (
                    <p className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-400" />
                      You're building a strong fitness habit! Keep it up.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </PremiumPageWrapper>
    </AppLayout>
  );
};

export default ActivityPage;
