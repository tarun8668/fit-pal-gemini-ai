
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Flame, Calendar, Trophy, Target, Zap } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  isLoading?: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ streak, isLoading = false }) => {
  const getStreakConfig = (streakDays: number) => {
    if (streakDays >= 30) return {
      gradient: 'from-purple-400 via-pink-400 to-red-400',
      bgGradient: 'from-purple-500/10 to-pink-500/10',
      icon: Trophy,
      message: "Legendary Champion! 👑",
      badge: "Legendary",
      ring: "ring-purple-400/50"
    };
    if (streakDays >= 14) return {
      gradient: 'from-orange-400 via-red-400 to-pink-400',
      bgGradient: 'from-orange-500/10 to-red-500/10',
      icon: Flame,
      message: "On Fire! Keep Burning! 🔥",
      badge: "On Fire",
      ring: "ring-orange-400/50"
    };
    if (streakDays >= 7) return {
      gradient: 'from-yellow-400 via-orange-400 to-red-400',
      bgGradient: 'from-yellow-500/10 to-orange-500/10',
      icon: Zap,
      message: "Week Warrior! ⚡",
      badge: "Week Strong",
      ring: "ring-yellow-400/50"
    };
    if (streakDays >= 3) return {
      gradient: 'from-green-400 via-blue-400 to-purple-400',
      bgGradient: 'from-green-500/10 to-blue-500/10',
      icon: Target,
      message: "Building Momentum! 🚀",
      badge: "Building",
      ring: "ring-green-400/50"
    };
    if (streakDays >= 1) return {
      gradient: 'from-blue-400 to-indigo-400',
      bgGradient: 'from-blue-500/10 to-indigo-500/10',
      icon: Calendar,
      message: "Great Start! ⭐",
      badge: "Started",
      ring: "ring-blue-400/50"
    };
    return {
      gradient: 'from-slate-400 to-slate-500',
      bgGradient: 'from-slate-500/10 to-slate-600/10',
      icon: Calendar,
      message: "Ready to Begin? 💫",
      badge: "Ready",
      ring: "ring-slate-400/50"
    };
  };

  const config = getStreakConfig(streak);
  const IconComponent = config.icon;

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden bg-black/40 backdrop-blur-xl border-slate-800/50">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-8 w-40 bg-slate-800/50 rounded-lg animate-pulse"></div>
              <div className="h-5 w-32 bg-slate-800/50 rounded animate-pulse"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} backdrop-blur-xl border-slate-800/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl`}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r ${config.gradient} rounded-full opacity-20 animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-32 h-32 bg-gradient-to-r ${config.gradient} rounded-full opacity-10 animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-center justify-between">
          <CardTitle className="text-slate-100 flex items-center gap-3 text-xl">
            <div className={`p-2 rounded-xl bg-gradient-to-r ${config.gradient} shadow-lg`}>
              <Flame className="h-6 w-6 text-white" />
            </div>
            Workout Streak
          </CardTitle>
          {streak > 0 && (
            <Badge className={`bg-gradient-to-r ${config.gradient} text-white border-none px-4 py-1 shadow-lg animate-pulse`}>
              {config.badge}
            </Badge>
          )}
        </div>
        <CardDescription className="text-slate-400 mt-2 text-base">
          {config.message}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-8 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className={`relative w-20 h-20 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-2xl ring-4 ${config.ring} transition-all duration-300 hover:scale-110`}>
              <IconComponent className="h-10 w-10 text-white drop-shadow-lg" />
              {streak > 0 && (
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin" style={{ animationDuration: '3s' }}></div>
              )}
            </div>
            <div className="space-y-1">
              <div className={`text-5xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent animate-pulse`}>
                {streak}
              </div>
              <div className="text-slate-400 text-sm font-medium">
                {streak === 1 ? 'day' : 'days'}
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress visualization for streaks >= 3 */}
        {streak >= 3 && (
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-400">Streak Progress</span>
              <span className="text-xs text-slate-400">
                {Math.min(streak, 30)}/30 days
              </span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                style={{ width: `${Math.min((streak / 30) * 100, 100)}%` }}
              >
                <div className="h-full bg-gradient-to-r from-white/30 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
        
        {/* Visual streak representation */}
        {streak >= 7 && (
          <div className="mt-6">
            <div className="text-xs text-slate-400 mb-3">Recent Activity</div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: Math.min(streak, 21) }, (_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded bg-gradient-to-r ${config.gradient} opacity-90 animate-fade-in shadow-sm hover:scale-110 transition-transform duration-200`}
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                  title={`Day ${streak - i}`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
