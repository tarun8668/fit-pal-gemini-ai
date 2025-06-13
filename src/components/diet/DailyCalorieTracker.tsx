
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

type MealEntry = {
  id?: string;
  meal_type: string;
  meal_name: string;
  food_items: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export const DailyCalorieTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dailyGoal, setDailyGoal] = useState(2000);
  const [totalCalories, setTotalCalories] = useState(0);
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [newMeal, setNewMeal] = useState<MealEntry>({
    meal_type: 'breakfast',
    meal_name: '',
    food_items: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDailyGoal();
      fetchTodaysMeals();
    }
  }, [user]);

  const fetchDailyGoal = async () => {
    try {
      const { data, error } = await supabase
        .from('calorie_calculations')
        .select('target_calories')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      
      if (data && data.length > 0) {
        setDailyGoal(data[0].target_calories);
      }
    } catch (error) {
      console.error('Error fetching daily goal:', error);
    }
  };

  const fetchTodaysMeals = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('meal_tracking')
        .select('*')
        .eq('user_id', user?.id)
        .eq('meal_date', today);

      if (error) throw error;
      
      if (data) {
        setMeals(data);
        const total = data.reduce((sum, meal) => sum + meal.calories, 0);
        setTotalCalories(total);
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  const addMeal = async () => {
    if (!newMeal.meal_name || !newMeal.food_items || newMeal.calories <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('meal_tracking')
        .insert({
          user_id: user?.id,
          ...newMeal,
        })
        .select()
        .single();

      if (error) throw error;

      setMeals([...meals, data]);
      setTotalCalories(totalCalories + newMeal.calories);
      setNewMeal({
        meal_type: 'breakfast',
        meal_name: '',
        food_items: '',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
      setShowAddMeal(false);

      toast({
        title: "Success",
        description: "Meal added successfully",
      });
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        title: "Error",
        description: "Failed to add meal",
        variant: "destructive",
      });
    }
  };

  const deleteMeal = async (mealId: string, calories: number) => {
    try {
      const { error } = await supabase
        .from('meal_tracking')
        .delete()
        .eq('id', mealId);

      if (error) throw error;

      setMeals(meals.filter(meal => meal.id !== mealId));
      setTotalCalories(totalCalories - calories);

      toast({
        title: "Success",
        description: "Meal deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: "Error",
        description: "Failed to delete meal",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = Math.min((totalCalories / dailyGoal) * 100, 100);

  const CircularProgress = ({ percentage, calories, goal }: { percentage: number, calories: number, goal: number }) => {
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-300"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="text-primary transition-all duration-300 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{calories}</span>
          <span className="text-sm text-gray-500">/ {goal} cal</span>
          <span className="text-xs text-gray-400">{Math.round(percentage)}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CircularProgress 
          percentage={progressPercentage} 
          calories={totalCalories} 
          goal={dailyGoal} 
        />
        <p className="mt-4 text-sm text-gray-600">
          {totalCalories < dailyGoal 
            ? `${dailyGoal - totalCalories} calories remaining`
            : `${totalCalories - dailyGoal} calories over goal`
          }
        </p>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Today's Meals</h3>
        <Button onClick={() => setShowAddMeal(!showAddMeal)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Meal
        </Button>
      </div>

      {showAddMeal && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Meal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select 
                  value={newMeal.meal_type} 
                  onValueChange={(value) => setNewMeal({...newMeal, meal_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meal-name">Meal Name</Label>
                <Input
                  id="meal-name"
                  placeholder="e.g., Grilled Chicken Salad"
                  value={newMeal.meal_name}
                  onChange={(e) => setNewMeal({...newMeal, meal_name: e.target.value})}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="food-items">Food Items</Label>
                <Input
                  id="food-items"
                  placeholder="e.g., Chicken breast, Mixed greens, Olive oil"
                  value={newMeal.food_items}
                  onChange={(e) => setNewMeal({...newMeal, food_items: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="0"
                  value={newMeal.calories || ''}
                  onChange={(e) => setNewMeal({...newMeal, calories: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="0"
                  value={newMeal.protein || ''}
                  onChange={(e) => setNewMeal({...newMeal, protein: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="0"
                  value={newMeal.carbs || ''}
                  onChange={(e) => setNewMeal({...newMeal, carbs: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  type="number"
                  placeholder="0"
                  value={newMeal.fat || ''}
                  onChange={(e) => setNewMeal({...newMeal, fat: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={addMeal}>Add Meal</Button>
              <Button variant="outline" onClick={() => setShowAddMeal(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {meals.map((meal) => (
          <Card key={meal.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{meal.meal_type}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="font-medium">{meal.meal_name}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{meal.food_items}</p>
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>{meal.calories} cal</span>
                  <span>{meal.protein}g protein</span>
                  <span>{meal.carbs}g carbs</span>
                  <span>{meal.fat}g fat</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMeal(meal.id!, meal.calories)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {meals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No meals logged today. Add your first meal to start tracking!
        </div>
      )}
    </div>
  );
};
