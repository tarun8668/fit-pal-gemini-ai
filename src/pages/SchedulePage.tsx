
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

const SchedulePage = () => {
  const workoutSchedule = [
    { day: 'Monday', workout: 'Push Day', time: '6:00 AM', duration: '45 min', completed: true },
    { day: 'Tuesday', workout: 'Pull Day', time: '6:00 AM', duration: '50 min', completed: true },
    { day: 'Wednesday', workout: 'Legs Day', time: '6:00 AM', duration: '55 min', completed: false },
    { day: 'Thursday', workout: 'Rest & Recovery', time: '-', duration: '-', completed: false },
    { day: 'Friday', workout: 'Upper Body', time: '6:00 AM', duration: '45 min', completed: false },
    { day: 'Saturday', workout: 'Lower Body', time: '7:00 AM', duration: '50 min', completed: false },
    { day: 'Sunday', workout: 'Rest & Recovery', time: '-', duration: '-', completed: false },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Workout Schedule</h1>
          <div className="p-2 bg-primary/10 rounded-full">
            <CalendarIcon className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardHeader>
            <CardTitle className="text-slate-100">This Week</CardTitle>
            <CardDescription className="text-slate-400">Your scheduled workouts for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutSchedule.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-300">{item.day.substring(0, 3)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-100">{item.workout}</h3>
                      {item.time !== '-' && (
                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {item.time} • {item.duration}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {item.completed ? (
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Completed</Badge>
                    ) : item.time === '-' ? (
                      <Badge className="bg-slate-600/50 text-slate-300 hover:bg-slate-600/80">Rest Day</Badge>
                    ) : (
                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Upcoming</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Monthly Overview</CardTitle>
              <CardDescription className="text-slate-400">Your workout calendar</CardDescription>
            </CardHeader>
            <CardContent className="h-72">
              <div className="h-full flex items-center justify-center">
                <p className="text-slate-400">Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
            <CardHeader>
              <CardTitle className="text-slate-100">Workout Notes</CardTitle>
              <CardDescription className="text-slate-400">Reminders for your training</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2 text-slate-300">
                  <span className="text-primary">•</span>
                  <span>Increase bench press by 5lbs this week</span>
                </li>
                <li className="flex items-start space-x-2 text-slate-300">
                  <span className="text-primary">•</span>
                  <span>Focus on proper squat form, go deeper</span>
                </li>
                <li className="flex items-start space-x-2 text-slate-300">
                  <span className="text-primary">•</span>
                  <span>Remember to stretch after leg day</span>
                </li>
                <li className="flex items-start space-x-2 text-slate-300">
                  <span className="text-primary">•</span>
                  <span>Increase water intake during workouts</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default SchedulePage;
