
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple } from 'lucide-react';

type Meal = {
  title: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type DietPlan = {
  name: string;
  description: string;
  meals: Meal[];
  dailySummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

const DIET_PLANS: Record<string, DietPlan> = {
  'weight-loss': {
    name: 'Weight Loss Plan',
    description: 'A calorie-deficit diet with higher protein to maintain muscle mass while losing fat.',
    meals: [
      {
        title: 'Breakfast',
        description: 'Greek yogurt with berries and a tablespoon of honey, plus a small handful of almonds',
        calories: 350,
        protein: 25,
        carbs: 30,
        fat: 15
      },
      {
        title: 'Morning Snack',
        description: 'Apple with 1 tablespoon of peanut butter',
        calories: 200,
        protein: 5,
        carbs: 25,
        fat: 8
      },
      {
        title: 'Lunch',
        description: 'Grilled chicken salad with mixed greens, cherry tomatoes, cucumber, and balsamic vinaigrette',
        calories: 400,
        protein: 35,
        carbs: 20,
        fat: 18
      },
      {
        title: 'Afternoon Snack',
        description: 'Protein shake with 1 scoop whey protein and water',
        calories: 120,
        protein: 25,
        carbs: 3,
        fat: 1
      },
      {
        title: 'Dinner',
        description: 'Baked salmon with roasted vegetables and quinoa',
        calories: 450,
        protein: 35,
        carbs: 35,
        fat: 15
      }
    ],
    dailySummary: {
      calories: 1520,
      protein: 125,
      carbs: 113,
      fat: 57
    }
  },
  'muscle-gain': {
    name: 'Muscle Gain Plan',
    description: 'A calorie surplus diet with high protein to support muscle growth and recovery.',
    meals: [
      {
        title: 'Breakfast',
        description: '4 scrambled eggs with spinach, 2 slices whole grain toast, and 1 banana',
        calories: 550,
        protein: 35,
        carbs: 55,
        fat: 20
      },
      {
        title: 'Morning Snack',
        description: 'Protein smoothie with whey, banana, peanut butter, and milk',
        calories: 400,
        protein: 30,
        carbs: 40,
        fat: 15
      },
      {
        title: 'Lunch',
        description: '6oz chicken breast, 1 cup brown rice, and 1 cup steamed broccoli',
        calories: 500,
        protein: 45,
        carbs: 50,
        fat: 10
      },
      {
        title: 'Afternoon Snack',
        description: '1 cup greek yogurt with 1/4 cup granola and honey',
        calories: 350,
        protein: 25,
        carbs: 40,
        fat: 10
      },
      {
        title: 'Dinner',
        description: '8oz lean steak, sweet potato, and mixed vegetables',
        calories: 600,
        protein: 50,
        carbs: 45,
        fat: 20
      },
      {
        title: 'Before Bed',
        description: 'Casein protein shake with almond milk',
        calories: 200,
        protein: 30,
        carbs: 5,
        fat: 5
      }
    ],
    dailySummary: {
      calories: 2600,
      protein: 215,
      carbs: 235,
      fat: 80
    }
  },
  'maintenance': {
    name: 'Maintenance Plan',
    description: 'A balanced diet to maintain your current weight while supporting overall fitness.',
    meals: [
      {
        title: 'Breakfast',
        description: 'Oatmeal with berries, 1 tablespoon honey, and 2 scrambled eggs',
        calories: 400,
        protein: 20,
        carbs: 50,
        fat: 12
      },
      {
        title: 'Morning Snack',
        description: 'Apple and 1oz (small handful) of mixed nuts',
        calories: 220,
        protein: 5,
        carbs: 25,
        fat: 12
      },
      {
        title: 'Lunch',
        description: 'Turkey and avocado wrap with whole grain tortilla and side salad',
        calories: 450,
        protein: 30,
        carbs: 40,
        fat: 18
      },
      {
        title: 'Afternoon Snack',
        description: 'Greek yogurt with a drizzle of honey',
        calories: 180,
        protein: 20,
        carbs: 15,
        fat: 3
      },
      {
        title: 'Dinner',
        description: 'Grilled fish, quinoa, and roasted vegetables',
        calories: 500,
        protein: 35,
        carbs: 45,
        fat: 15
      }
    ],
    dailySummary: {
      calories: 1750,
      protein: 110,
      carbs: 175,
      fat: 60
    }
  },
  'low-carb': {
    name: 'Low Carb Plan',
    description: 'A low carbohydrate diet that focuses on protein and healthy fats while reducing carb intake.',
    meals: [
      {
        title: 'Breakfast',
        description: '3-egg omelet with spinach, mushrooms, and cheddar cheese',
        calories: 350,
        protein: 25,
        carbs: 5,
        fat: 25
      },
      {
        title: 'Morning Snack',
        description: '1/4 cup almonds',
        calories: 170,
        protein: 6,
        carbs: 6,
        fat: 15
      },
      {
        title: 'Lunch',
        description: 'Grilled chicken salad with olive oil dressing and avocado',
        calories: 450,
        protein: 35,
        carbs: 10,
        fat: 30
      },
      {
        title: 'Afternoon Snack',
        description: 'Celery sticks with 2 tablespoons of cream cheese',
        calories: 120,
        protein: 3,
        carbs: 3,
        fat: 10
      },
      {
        title: 'Dinner',
        description: 'Grilled salmon with asparagus and cauliflower mash',
        calories: 500,
        protein: 40,
        carbs: 15,
        fat: 30
      }
    ],
    dailySummary: {
      calories: 1590,
      protein: 109,
      carbs: 39,
      fat: 110
    }
  }
};

export const DietPlanGenerator = () => {
  const [selectedDiet, setSelectedDiet] = useState('weight-loss');

  const handleDietChange = (value: string) => {
    setSelectedDiet(value);
  };

  const currentDiet = DIET_PLANS[selectedDiet];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diet Plan Generator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="diet-type">Select Diet Plan</Label>
            <Select onValueChange={handleDietChange} value={selectedDiet}>
              <SelectTrigger>
                <SelectValue placeholder="Select a diet plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Building</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="low-carb">Low Carb</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium">{currentDiet.name}</h3>
            <p className="text-gray-500 mt-1 mb-4">{currentDiet.description}</p>
            
            <div className="grid grid-cols-4 gap-2 text-center pt-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Calories</p>
                <p className="text-lg font-bold">{currentDiet.dailySummary.calories}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Protein</p>
                <p className="text-lg font-bold">{currentDiet.dailySummary.protein}g</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Carbs</p>
                <p className="text-lg font-bold">{currentDiet.dailySummary.carbs}g</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Fat</p>
                <p className="text-lg font-bold">{currentDiet.dailySummary.fat}g</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Daily Meal Plan</h3>
            {currentDiet.meals.map((meal, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="flex">
                  <div className="bg-primary/10 p-4 flex items-center justify-center">
                    <Apple className="h-6 w-6 text-primary" />
                  </div>
                  <CardContent className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{meal.title}</h4>
                        <p className="text-sm text-gray-600">{meal.description}</p>
                      </div>
                      <span className="text-sm font-bold">{meal.calories} cal</span>
                    </div>
                    <div className="flex gap-4 mt-2 text-xs">
                      <span>Protein: {meal.protein}g</span>
                      <span>Carbs: {meal.carbs}g</span>
                      <span>Fat: {meal.fat}g</span>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
          
          <Button className="w-full">
            Get Personalized Diet Plan via AI
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
