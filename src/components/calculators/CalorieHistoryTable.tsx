
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export const CalorieHistoryTable = () => {
  const { user } = useAuth();

  const { data: calculations, isLoading } = useQuery({
    queryKey: ['calorie-calculations', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('calorie_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching calculations:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!user,
  });

  const getGoalBadge = (goal: string) => {
    switch (goal) {
      case 'lose':
        return <Badge variant="destructive">Weight Loss</Badge>;
      case 'gain':
        return <Badge variant="default">Muscle Gain</Badge>;
      case 'maintain':
        return <Badge variant="secondary">Maintenance</Badge>;
      default:
        return <Badge variant="outline">{goal}</Badge>;
    }
  };

  const getActivityLevel = (level: string) => {
    const levels: Record<string, string> = {
      sedentary: 'Sedentary',
      light: 'Lightly Active',
      moderate: 'Moderately Active',
      active: 'Very Active',
      extreme: 'Extremely Active',
    };
    return levels[level] || level;
  };

  const calculateDeficit = (maintenance: number, target: number) => {
    const deficit = maintenance - target;
    if (deficit > 0) {
      return `${deficit} cal deficit`;
    } else if (deficit < 0) {
      return `${Math.abs(deficit)} cal surplus`;
    }
    return 'Maintenance';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  if (!calculations || calculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calculation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            No calculations yet. Use the calculator above to get started!
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Goal</TableHead>
                <TableHead>Activity Level</TableHead>
                <TableHead>Maintenance</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Deficit/Surplus</TableHead>
                <TableHead>BMR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map((calc) => (
                <TableRow key={calc.id}>
                  <TableCell>
                    {new Date(calc.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {getGoalBadge(calc.goal)}
                  </TableCell>
                  <TableCell>
                    {getActivityLevel(calc.activity_level)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {calc.maintenance_calories} cal
                  </TableCell>
                  <TableCell className="font-medium">
                    {calc.target_calories} cal
                  </TableCell>
                  <TableCell>
                    <span className={
                      calc.maintenance_calories > calc.target_calories 
                        ? 'text-red-600' 
                        : calc.maintenance_calories < calc.target_calories
                        ? 'text-green-600'
                        : 'text-gray-600'
                    }>
                      {calculateDeficit(calc.maintenance_calories, calc.target_calories)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {calc.bmr} cal
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
