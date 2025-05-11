
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const UserProfileForm = () => {
  const [profileData, setProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: '',
    dietPreferences: '',
  });

  const handleChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the profile data
    console.log('Profile data submitted:', profileData);
    // Show success message
    alert('Profile saved successfully!');
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
              <Label htmlFor="activityLevel">Activity Level</Label>
              <Select 
                onValueChange={(value) => handleChange('activityLevel', value)}
                value={profileData.activityLevel}
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
              <Label htmlFor="dietPreferences">Diet Preferences</Label>
              <Select 
                onValueChange={(value) => handleChange('dietPreferences', value)}
                value={profileData.dietPreferences}
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
          
          <Button type="submit" className="w-full">Save Profile</Button>
        </form>
      </CardContent>
    </Card>
  );
};
