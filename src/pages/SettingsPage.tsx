import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Settings, Bell, Moon, Sun, Shield, Database, User, Calendar, Clock } from 'lucide-react';
import { useGoogleCalendar } from '@/hooks/useGoogleCalendar';

const SettingsPage = () => {
  const { 
    isInitialized, 
    isSignedIn, 
    isLoading, 
    configurationError,
    signInToGoogle, 
    signOutFromGoogle 
  } = useGoogleCalendar();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
          <div className="p-2 bg-primary/10 rounded-full">
            <Settings className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <User className="h-5 w-5" /> Profile
                </CardTitle>
                <CardDescription className="text-slate-400">Manage your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Account Information</Button>
                <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
                <Button variant="outline" className="w-full justify-start">Change Password</Button>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-slate-100">
                  <Shield className="h-5 w-5" /> Privacy
                </CardTitle>
                <CardDescription className="text-slate-400">Control your data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">Privacy Settings</Button>
                <Button variant="outline" className="w-full justify-start">Data Export</Button>
                <Button variant="outline" className="w-full justify-start text-red-400">Delete Account</Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Google Calendar Integration
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
                {!isInitialized ? (
                  <div className="flex items-center justify-center p-4">
                    <p className="text-slate-400">Loading Google Calendar integration...</p>
                  </div>
                ) : configurationError ? (
                  <div className="space-y-3">
                    <div className="p-4 border border-amber-600 bg-amber-900/20 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-400">⚠️</span>
                        <div>
                          <p className="text-amber-200 font-medium">Configuration Required</p>
                          <p className="text-amber-200/80 text-sm mt-1">{configurationError}</p>
                          <div className="mt-3 text-xs text-amber-200/60">
                            <p>To enable Google Calendar sync:</p>
                            <ol className="list-decimal list-inside mt-1 space-y-1">
                              <li>Go to <a href="https://console.developers.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                              <li>Add this domain as authorized origin: <code className="bg-slate-800 px-1 rounded">{window.location.origin}</code></li>
                              <li>Refresh this page after making changes</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Bell className="h-4 w-4 text-green-400" />
                        <span>Calendar sync is enabled</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Clock className="h-4 w-4 text-green-400" />
                        <span>Reminders are active for your workouts</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-0.5">
                        <Label htmlFor="calendar-sync" className="text-slate-100">Auto-sync workouts</Label>
                        <span className="text-xs text-slate-400">Automatically add new workouts to calendar</span>
                      </div>
                      <Switch id="calendar-sync" defaultChecked />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                        asChild
                      >
                        <a href="/schedule">Go to Schedule</a>
                      </Button>
                      <Button 
                        onClick={signOutFromGoogle} 
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600/10"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">App Settings</CardTitle>
                <CardDescription className="text-slate-400">Customize your experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="theme-mode" className="text-slate-100">Dark Mode</Label>
                      <span className="text-xs text-slate-400">Enable dark theme</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4 text-slate-400" />
                      <Switch id="theme-mode" defaultChecked />
                      <Moon className="h-4 w-4 text-slate-200" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="notifications" className="text-slate-100">Notifications</Label>
                      <span className="text-xs text-slate-400">Enable push notifications</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="notifications" defaultChecked />
                      <Bell className="h-4 w-4 text-slate-200" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="offline-mode" className="text-slate-100">Offline Mode</Label>
                      <span className="text-xs text-slate-400">Access core features without internet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch id="offline-mode" />
                      <Database className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-100">Fitness Settings</CardTitle>
                <CardDescription className="text-slate-400">Customize your fitness experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="units" className="text-slate-100">Metric Units</Label>
                      <span className="text-xs text-slate-400">Use kg/cm instead of lbs/inches</span>
                    </div>
                    <Switch id="units" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="workout-reminders" className="text-slate-100">Workout Reminders</Label>
                      <span className="text-xs text-slate-400">Get notified before scheduled workouts</span>
                    </div>
                    <Switch id="workout-reminders" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                      <Label htmlFor="weekly-summary" className="text-slate-100">Weekly Summary</Label>
                      <span className="text-xs text-slate-400">Receive progress reports every week</span>
                    </div>
                    <Switch id="weekly-summary" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
