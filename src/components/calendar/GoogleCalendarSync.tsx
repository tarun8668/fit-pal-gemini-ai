
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar, Clock, Bell, AlertTriangle } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

interface GoogleCalendarSyncProps {
  workoutSchedule: Array<{
    day: string;
    workout: string;
    time: string;
    duration: string;
    completed: boolean;
  }>;
}

export const GoogleCalendarSync: React.FC<GoogleCalendarSyncProps> = ({ workoutSchedule }) => {
  const { 
    isInitialized, 
    isSignedIn, 
    isLoading, 
    configurationError,
    signInToGoogle, 
    signOutFromGoogle, 
    syncWorkoutSchedule 
  } = useGoogleCalendar();

  const handleSync = () => {
    syncWorkoutSchedule(workoutSchedule);
  };

  if (!isInitialized) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Google Calendar Sync
          </CardTitle>
          <CardDescription className="text-slate-400">
            Loading Google Calendar integration...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
      <CardHeader>
        <CardTitle className="text-slate-100 flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Google Calendar Sync
        </CardTitle>
        <CardDescription className="text-slate-400">
          Sync your workout schedule with Google Calendar and get reminders
        </CardDescription>
        {isSignedIn && !configurationError && (
          <Badge className="bg-green-500/20 text-green-400 w-fit">
            Connected to Google Calendar
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {configurationError ? (
          <Alert className="border-amber-600 bg-amber-900/20">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-200">
              <strong>Configuration Required:</strong> {configurationError}
              <br />
              <br />
              To enable Google Calendar sync:
              <br />
              1. Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline text-amber-100">Google Cloud Console</a>
              <br />
              2. Add this domain as an authorized origin: <code className="bg-slate-800 px-1 rounded text-xs">{window.location.origin}</code>
              <br />
              3. Refresh this page after making changes
            </AlertDescription>
          </Alert>
        ) : !isSignedIn ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Bell className="h-4 w-4" />
              <span>Get reminders 1 hour and 15 minutes before workouts</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="h-4 w-4" />
              <span>Automatically sync your weekly workout schedule</span>
            </div>
            <Button 
              onClick={signInToGoogle} 
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Connecting...' : 'Connect Google Calendar'}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Bell className="h-4 w-4 text-green-400" />
              <span>Reminders will be set 1 hour before and 15 minutes before each workout</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-300">
              <Clock className="h-4 w-4 text-green-400" />
              <span>Events will be created for this week's workout schedule</span>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSync} 
                disabled={isLoading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isLoading ? 'Syncing...' : 'Sync to Calendar'}
              </Button>
              <Button 
                onClick={signOutFromGoogle} 
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
