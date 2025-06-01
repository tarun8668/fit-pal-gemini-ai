import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const CalorieCalculator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: '',
    goal: '',
  });
  const [result, setResult] = useState({
    bmr: 0,
    maintenanceCalories: 0,
    targetCalories: 0,
  });
  const [calculated, setCalculated] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveCalculation = async (calculationData: any) => {
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from('calorie_calculations')
        .insert({
          user_id: user.id,
          age: parseInt(formData.age),
          weight: parseFloat(formData.weight),
          height: parseFloat(formData.height),
          gender: formData.gender,
          activity_level: formData.activityLevel,
          goal: formData.goal,
          bmr: calculationData.bmr,
          maintenance_calories: calculationData.maintenanceCalories,
          target_calories: calculationData.targetCalories,
        });

      if (error) {
        console.error('Error saving calculation:', error);
        toast({
          title: "Error",
          description: "Failed to save calculation",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Calculation saved successfully",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const calculateCalories = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse form values
    const age = parseInt(formData.age);
    const weight = parseInt(formData.weight);
    const height = parseInt(formData.height);
    const gender = formData.gender;
    const activityLevel = formData.activityLevel;
    const goal = formData.goal;
    
    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    
    // Apply activity multiplier
    let maintenanceCalories = 0;
    switch (activityLevel) {
      case 'sedentary':
        maintenanceCalories = bmr * 1.2;
        break;
      case 'light':
        maintenanceCalories = bmr * 1.375;
        break;
      case 'moderate':
        maintenanceCalories = bmr * 1.55;
        break;
      case 'active':
        maintenanceCalories = bmr * 1.725;
        break;
      case 'extreme':
        maintenanceCalories = bmr * 1.9;
        break;
      default:
        maintenanceCalories = bmr * 1.2;
    }
    
    // Adjust for goal
    let targetCalories = maintenanceCalories;
    switch (goal) {
      case 'lose':
        targetCalories = maintenanceCalories - 500; // Deficit for weight loss
        break;
      case 'gain':
        targetCalories = maintenanceCalories + 300; // Surplus for muscle gain
        break;
      default:
        targetCalories = maintenanceCalories; // Maintenance
    }
    
    const calculationResult = {
      bmr: Math.round(bmr),
      maintenanceCalories: Math.round(maintenanceCalories),
      targetCalories: Math.round(targetCalories)
    };

    setResult(calculationResult);
    setCalculated(true);

    // Save to database
    await saveCalculation(calculationResult);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calorie Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        {!calculated ? (
          <form onSubmit={calculateCalories} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  onValueChange={(value) => handleChange('gender', value)}
                  value={formData.gender}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={formData.weight}
                  onChange={(e) => handleChange('weight', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={formData.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Activity Level</Label>
                <Select 
                  onValueChange={(value) => handleChange('activityLevel', value)}
                  value={formData.activityLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary</SelectItem>
                    <SelectItem value="light">Lightly Active</SelectItem>
                    <SelectItem value="moderate">Moderately Active</SelectItem>
                    <SelectItem value="active">Very Active</SelectItem>
                    <SelectItem value="extreme">Extremely Active</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="goal">Goal</Label>
                <Select 
                  onValueChange={(value) => handleChange('goal', value)}
                  value={formData.goal}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Weight Loss</SelectItem>
                    <SelectItem value="maintain">Maintenance</SelectItem>
                    <SelectItem value="gain">Muscle Gain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full bg-primary" disabled={saving}>
              {saving ? 'Calculating & Saving...' : 'Calculate Calories'}
            </Button>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Basal Metabolic Rate</h3>
                <p className="text-3xl font-bold">{result.bmr} calories</p>
                <p className="text-xs text-gray-500">Calories your body burns at rest</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Maintenance Calories</h3>
                <p className="text-3xl font-bold">{result.maintenanceCalories} calories</p>
                <p className="text-xs text-gray-500">Daily calories to maintain your weight</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Target Calories</h3>
                <p className="text-4xl font-bold text-primary">{result.targetCalories} calories</p>
                <p className="text-sm">
                  {formData.goal === 'lose' 
                    ? 'Daily calorie target for weight loss'
                    : formData.goal === 'gain'
                      ? 'Daily calorie target for muscle gain'
                      : 'Daily calorie target for maintenance'
                  }
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => setCalculated(false)} 
              variant="outline" 
              className="w-full"
            >
              Recalculate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
