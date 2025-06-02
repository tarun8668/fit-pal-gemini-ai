
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, Target } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  isLoading?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, isLoading = false }) => {
  const getStreakColor = (streakDays: number) => {
    if (streakDays >= 30) return 'from-purple-500 to-pink-500';
    if (streakDays >= 14) return 'from-orange-500 to-red-500';
    if (streakDays >= 7) return 'from-yellow-500 to-orange-500';
    if (streakDays >= 3) return 'from-green-500 to-blue-500';
    return 'from-blue-500 to-indigo-500';
  };

  const getStreakMessage = (streakDays: number) => {
    if (streakDays >= 30) return "Legendary! You're on fire! 🔥";
    if (streakDays >= 14) return "Amazing streak! Keep it up! 💪";
    if (streakDays >= 7) return "One week strong! 🎯";
    if (streakDays >= 3) return "Building momentum! 🚀";
    if (streakDays >= 1) return "Great start! 🌟";
    return "Ready to start your streak? 💫";
  };

  const getStreakIcon = (streakDays: number) => {
    if (streakDays >= 30) return <Trophy className="h-8 w-8" />;
    if (streakDays >= 7) return <Flame className="h-8 w-8" />;
    if (streakDays >= 3) return <Target className="h-8 w-8" />;
    return <Calendar className="h-8 w-8" />;
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-slate-700 animate-pulse"></div>
            <div className="space-y-2">
              <div className="h-6 w-32 bg-slate-700 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-slate-700 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-400" />
          Workout Streak
        </CardTitle>
        <CardDescription className="text-slate-400">
          {getStreakMessage(streak)}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${getStreakColor(streak)} flex items-center justify-center text-white shadow-lg`}>
              {getStreakIcon(streak)}
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-100">{streak}</div>
              <div className="text-sm text-slate-400">
                {streak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
          
          <div className="text-right">
            {streak > 0 && (
              <Badge className={`bg-gradient-to-r ${getStreakColor(streak)} text-white border-none`}>
                {streak >= 30 ? 'Legendary' : 
                 streak >= 14 ? 'On Fire' : 
                 streak >= 7 ? 'Week Strong' : 
                 streak >= 3 ? 'Building' : 'Started'}
              </Badge>
            )}
          </div>
        </div>
        
        {streak >= 7 && (
          <div className="mt-4 grid grid-cols-7 gap-1">
            {Array.from({ length: Math.min(streak, 21) }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm bg-gradient-to-r ${getStreakColor(streak)} opacity-80`}
                title={`Day ${i + 1}`}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
