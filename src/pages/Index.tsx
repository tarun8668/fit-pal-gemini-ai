
import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Dumbbell, Apple, Weight, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CalorieCalculator } from '@/components/calculators/CalorieCalculator';
import { UserProfileForm } from '@/components/profile/UserProfileForm';
import { StreakDisplay } from '@/components/streak/StreakDisplay';
import { useAuth } from '@/context/AuthContext';
import { useWorkoutCompletions } from '@/hooks/useWorkoutCompletions';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  // Sample data for the charts
  const weightData = [
    { name: 'Week 1', value: 85 },
    { name: 'Week 2', value: 84.2 },
    { name: 'Week 3', value: 83.7 },
    { name: 'Week 4', value: 82.9 },
    { name: 'Week 5', value: 82.5 },
    { name: 'Week 6', value: 81.8 },
  ];

  const caloriesData = [
    { name: 'Mon', value: 2100 },
    { name: 'Tue', value: 2050 },
    { name: 'Wed', value: 1950 },
    { name: 'Thu', value: 2200 },
    { name: 'Fri', value: 2000 },
    { name: 'Sat', value: 2300 },
    { name: 'Sun', value: 2100 },
  ];

  const { user } = useAuth();
  const { streak, isLoading: streakLoading } = useWorkoutCompletions();
  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error checking profile:', error);
        } else {
          setProfileExists(!!data);
        }
      } catch (error) {
        console.error('Unexpected error checking profile:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserProfile();
  }, [user]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Welcome Card */}
          <Card className="col-span-1 md:col-span-2">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome to Consist AI</h1>
                  <p className="text-gray-500 mb-4">Your AI-powered fitness companion. Get personalized workout plans, diet advice, and track your progress with intelligent insights.</p>
                  <div className="flex flex-wrap gap-3">
                    {!loading && !profileExists && (
                      <Link to="/profile">
                        <Button variant="outline">Complete Your Profile</Button>
                      </Link>
                    )}
                    <Link to="/chat">
                      <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Chat with AI Assistant
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="hidden md:block bg-blue-100 rounded-full p-6">
                  <div className="h-24 w-24 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Dumbbell className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Streak Display */}
          <div className="col-span-1 md:col-span-2">
            <StreakDisplay streak={streak} isLoading={streakLoading} />
          </div>
          
          {/* Feature Cards */}
          <Link to="/workouts" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Workout Splits</h3>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Dumbbell className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Generate customized workout plans based on your goals, available equipment, and schedule.</p>
                <div className="mt-auto">
                  <Button variant="link" className="p-0">
                    Explore Workouts →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/diet" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Diet Plans</h3>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Apple className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Get personalized meal plans tailored to your dietary preferences, goals, and nutritional needs.</p>
                <div className="mt-auto">
                  <Button variant="link" className="p-0">
                    View Diet Plans →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/calories" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Calorie Calculator</h3>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Weight className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Calculate your daily calorie needs based on your goals, activity level, and body metrics.</p>
                <div className="mt-auto">
                  <Button variant="link" className="p-0">
                    Calculate Calories →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/chat" className="block">
            <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">AI Assistant</h3>
                  <div className="p-2 bg-primary/10 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mb-4">Chat with our AI assistant to get personalized fitness advice, nutrition tips, and workout recommendations.</p>
                <div className="mt-auto">
                  <Button variant="link" className="p-0">
                    Chat Now →
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!loading && !profileExists && (
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Profile Setup</CardTitle>
                <CardDescription>Complete your profile to get personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <UserProfileForm />
              </CardContent>
            </Card>
          )}
          
          <Card className={`col-span-1 ${loading || !profileExists ? '' : 'md:col-span-2'}`}>
            <CardHeader>
              <CardTitle>Calorie Calculator</CardTitle>
              <CardDescription>Find your ideal daily calorie intake</CardDescription>
            </CardHeader>
            <CardContent>
              <CalorieCalculator />
            </CardContent>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
