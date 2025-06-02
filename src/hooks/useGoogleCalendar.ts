
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export const useGoogleCalendar = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configurationError, setConfigurationError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const GOOGLE_CLIENT_ID = '887596394611-0pqeerc2fauub04b6h23pi583a2q9vak.apps.googleusercontent.com';
  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  useEffect(() => {
    initializeGapi();
  }, []);

  const initializeGapi = async () => {
    if (!window.gapi) {
      // Load Google API script
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => loadGapi();
      script.onerror = () => {
        setConfigurationError('Failed to load Google API script');
        setIsInitialized(true);
      };
      document.head.appendChild(script);
    } else {
      loadGapi();
    }
  };

  const loadGapi = async () => {
    try {
      await new Promise((resolve) => window.gapi.load('client:auth2', resolve));
      
      await window.gapi.client.init({
        apiKey: '', // API key not needed for OAuth
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      });

      const authInstance = window.gapi.auth2.getAuthInstance();
      setIsSignedIn(authInstance.isSignedIn.get());
      setIsInitialized(true);

      // Listen for sign-in state changes
      authInstance.isSignedIn.listen(setIsSignedIn);
    } catch (error: any) {
      console.error('Error initializing Google API:', error);
      
      if (error.error === 'idpiframe_initialization_failed') {
        setConfigurationError(
          'Google Calendar integration requires domain authorization. The current domain needs to be added to the Google Cloud Console as an authorized origin.'
        );
      } else {
        setConfigurationError('Failed to initialize Google Calendar. Please check your configuration.');
      }
      
      setIsInitialized(true);
      toast({
        title: "Google Calendar Setup Required",
        description: "Please configure the authorized domains in Google Cloud Console to enable calendar sync.",
        variant: "destructive",
      });
    }
  };

  const signInToGoogle = async () => {
    if (!isInitialized || configurationError) {
      toast({
        title: "Configuration Error",
        description: configurationError || "Google Calendar is not properly configured.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signIn();
      toast({
        title: "Success",
        description: "Successfully connected to Google Calendar!",
      });
    } catch (error) {
      console.error('Error signing in to Google:', error);
      toast({
        title: "Error",
        description: "Failed to sign in to Google Calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOutFromGoogle = async () => {
    if (!isInitialized || configurationError) return;
    
    try {
      const authInstance = window.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      toast({
        title: "Success",
        description: "Disconnected from Google Calendar.",
      });
    } catch (error) {
      console.error('Error signing out from Google:', error);
    }
  };

  const createCalendarEvent = async (eventDetails: {
    summary: string;
    description: string;
    start: string;
    end: string;
    reminders?: boolean;
  }) => {
    if (!isSignedIn || configurationError) {
      toast({
        title: "Error",
        description: configurationError || "Please sign in to Google Calendar first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const event = {
        summary: eventDetails.summary,
        description: eventDetails.description,
        start: {
          dateTime: eventDetails.start,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: eventDetails.end,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 60 },
            { method: 'popup', minutes: 15 },
          ],
        },
      };

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      return response.result;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  };

  const syncWorkoutSchedule = async (workoutSchedule: Array<{
    day: string;
    workout: string;
    time: string;
    duration: string;
  }>) => {
    if (!isSignedIn || configurationError) {
      toast({
        title: "Error",
        description: configurationError || "Please sign in to Google Calendar first.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay()));

      for (let i = 0; i < workoutSchedule.length; i++) {
        const workout = workoutSchedule[i];
        
        if (workout.workout === 'Rest & Recovery' || workout.time === '-') {
          continue; // Skip rest days
        }

        const workoutDate = new Date(currentWeekStart);
        workoutDate.setDate(currentWeekStart.getDate() + i);
        
        const [hours, minutes] = workout.time.split(':');
        const startTime = new Date(workoutDate);
        startTime.setHours(parseInt(hours), parseInt(minutes.split(' ')[0]), 0);
        
        const endTime = new Date(startTime);
        const durationMinutes = parseInt(workout.duration.split(' ')[0]);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);

        await createCalendarEvent({
          summary: `🏋️ ${workout.workout}`,
          description: `Workout session: ${workout.workout}\nDuration: ${workout.duration}\n\nDon't forget to hit the gym! 💪`,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
          reminders: true,
        });
      }

      toast({
        title: "Success",
        description: "Workout schedule synced to Google Calendar with reminders!",
      });
    } catch (error) {
      console.error('Error syncing workout schedule:', error);
      toast({
        title: "Error",
        description: "Failed to sync workout schedule to calendar.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isInitialized,
    isSignedIn,
    isLoading,
    configurationError,
    signInToGoogle,
    signOutFromGoogle,
    syncWorkoutSchedule,
    createCalendarEvent,
  };
};
