
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/components/ui/use-toast';

export const UserProfileForm = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activity_level: '',
    goal: '',
    diet_preferences: '',
  });
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;
        
        if (data) {
          setProfileData({
            age: data.age?.toString() || '',
            weight: data.weight?.toString() || '',
            height: data.height?.toString() || '',
            gender: data.gender || '',
            activity_level: data.activity_level || '',
            goal: data.goal || '',
            diet_preferences: data.diet_preferences || '',
          });
          setProfileExists(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save your profile",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Convert string values to appropriate types
      const formattedData = {
        id: user.id,
        age: profileData.age ? parseInt(profileData.age) : null,
        weight: profileData.weight ? parseFloat(profileData.weight) : null,
        height: profileData.height ? parseFloat(profileData.height) : null,
        gender: profileData.gender,
        activity_level: profileData.activity_level,
        goal: profileData.goal,
        diet_preferences: profileData.diet_preferences,
      };

      let error;
      
      if (profileExists) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(formattedData)
          .eq('id', user.id);
        
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert([formattedData]);
        
        error = insertError;
        if (!error) setProfileExists(true);
      }

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Profile saved successfully!",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Fitness Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={profileData.age}
                onChange={(e) => handleChange('age', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select 
                onValueChange={(value) => handleChange('gender', value)}
                value={profileData.gender}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                placeholder="Enter your weight"
                value={profileData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter your height"
                value={profileData.height}
                onChange={(e) => handleChange('height', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="activity_level">Activity Level</Label>
              <Select 
                onValueChange={(value) => handleChange('activity_level', value)}
                value={profileData.activity_level}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (office job, little exercise)</SelectItem>
                  <SelectItem value="light">Lightly Active (light exercise 1-3 days/week)</SelectItem>
                  <SelectItem value="moderate">Moderately Active (moderate exercise 3-5 days/week)</SelectItem>
                  <SelectItem value="active">Very Active (hard exercise 6-7 days/week)</SelectItem>
                  <SelectItem value="extreme">Extremely Active (physical job & hard training)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select 
                onValueChange={(value) => handleChange('goal', value)}
                value={profileData.goal}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose">Weight Loss</SelectItem>
                  <SelectItem value="maintain">Maintenance</SelectItem>
                  <SelectItem value="gain">Muscle Gain</SelectItem>
                  <SelectItem value="strength">Strength</SelectItem>
                  <SelectItem value="endurance">Endurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="diet_preferences">Diet Preferences</Label>
              <Select 
                onValueChange={(value) => handleChange('diet_preferences', value)}
                value={profileData.diet_preferences}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select diet preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-restrictions">No Restrictions</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
