
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChartContainer } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Plus, Scale, TrendingDown, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';

interface WeightEntry {
  id: string;
  weight: number;
  recorded_date: string;
  notes?: string;
}

const WeightTracker = () => {
  const { user } = useAuth();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [newWeight, setNewWeight] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState({
    currentWeight: 0,
    weightChange7Days: 0,
    weightChange30Days: 0,
    averageWeeklyChange: 0,
    highestWeight: 0,
    lowestWeight: 0
  });

  const chartConfig = {
    weight: {
      label: 'Weight (kg)',
      color: '#8b5cf6',
    },
  };

  useEffect(() => {
    if (user) {
      fetchWeightEntries();
    }
  }, [user]);

  useEffect(() => {
    calculateInsights();
  }, [weightEntries]);

  const fetchWeightEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('weight_tracking' as any)
        .select('*')
        .eq('user_id', user?.id)
        .order('recorded_date', { ascending: true });

      if (error) throw error;
      setWeightEntries(data || []);
    } catch (error) {
      console.error('Error fetching weight entries:', error);
      toast.error('Failed to load weight data');
    }
  };

  const addWeightEntry = async () => {
    if (!newWeight || !user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('weight_tracking' as any)
        .insert([{
          user_id: user.id,
          weight: parseFloat(newWeight),
          recorded_date: selectedDate,
          notes
        }]);

      if (error) throw error;

      setNewWeight('');
      setNotes('');
      setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
      fetchWeightEntries();
      toast.success('Weight entry added successfully');
    } catch (error) {
      console.error('Error adding weight entry:', error);
      toast.error('Failed to add weight entry');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateInsights = () => {
    if (weightEntries.length === 0) return;

    const sortedEntries = [...weightEntries].sort((a, b) => 
      new Date(b.recorded_date).getTime() - new Date(a.recorded_date).getTime()
    );

    const currentWeight = sortedEntries[0]?.weight || 0;
    const weights = weightEntries.map(e => e.weight);
    const highestWeight = Math.max(...weights);
    const lowestWeight = Math.min(...weights);

    // Weight change calculations
    const today = new Date();
    const sevenDaysAgo = subDays(today, 7);
    const thirtyDaysAgo = subDays(today, 30);

    const weight7DaysAgo = weightEntries
      .filter(entry => new Date(entry.recorded_date) >= sevenDaysAgo)
      .sort((a, b) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime())[0]?.weight || currentWeight;

    const weight30DaysAgo = weightEntries
      .filter(entry => new Date(entry.recorded_date) >= thirtyDaysAgo)
      .sort((a, b) => new Date(a.recorded_date).getTime() - new Date(b.recorded_date).getTime())[0]?.weight || currentWeight;

    const weightChange7Days = currentWeight - weight7DaysAgo;
    const weightChange30Days = currentWeight - weight30DaysAgo;
    const averageWeeklyChange = weightChange30Days / 4;

    setInsights({
      currentWeight,
      weightChange7Days,
      weightChange30Days,
      averageWeeklyChange,
      highestWeight,
      lowestWeight
    });
  };

  const chartData = weightEntries.map(entry => ({
    date: format(new Date(entry.recorded_date), 'MMM dd'),
    weight: entry.weight
  }));

  return (
    <div className="space-y-6">
      {/* Weight Input Section */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-100">
            <Scale className="h-5 w-5 text-purple-500" />
            Add Weight Entry
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight" className="text-slate-300">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter weight"
                className="bg-slate-700/50 border-slate-600 text-slate-100"
              />
            </div>
            <div>
              <Label htmlFor="date" className="text-slate-300">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-slate-100"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={addWeightEntry} 
                disabled={isLoading || !newWeight}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="notes" className="text-slate-300">Notes (optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your progress..."
              className="bg-slate-700/50 border-slate-600 text-slate-100"
            />
          </div>
        </CardContent>
      </Card>

      {/* Weight Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{insights.currentWeight.toFixed(1)}</div>
              <p className="text-xs text-slate-400">Current Weight</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                insights.weightChange7Days < 0 ? 'text-green-500' : insights.weightChange7Days > 0 ? 'text-red-500' : 'text-slate-400'
              }`}>
                {insights.weightChange7Days < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {Math.abs(insights.weightChange7Days).toFixed(1)}
              </div>
              <p className="text-xs text-slate-400">7-Day Change</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                insights.weightChange30Days < 0 ? 'text-green-500' : insights.weightChange30Days > 0 ? 'text-red-500' : 'text-slate-400'
              }`}>
                {insights.weightChange30Days < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                {Math.abs(insights.weightChange30Days).toFixed(1)}
              </div>
              <p className="text-xs text-slate-400">30-Day Change</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{insights.averageWeeklyChange.toFixed(2)}</div>
              <p className="text-xs text-slate-400">Avg Weekly Change</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-500">{insights.highestWeight.toFixed(1)}</div>
              <p className="text-xs text-slate-400">Highest Weight</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{insights.lowestWeight.toFixed(1)}</div>
              <p className="text-xs text-slate-400">Lowest Weight</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weight Chart */}
      <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-md border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Weight Progress Chart</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          {chartData.length > 0 ? (
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="date" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      color: '#f3f4f6'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#8b5cf6', strokeWidth: 0 }}
                    activeDot={{ r: 7, fill: '#a78bfa', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <Scale className="h-12 w-12 mx-auto mb-4 text-slate-600" />
                <p>No weight data available</p>
                <p className="text-sm">Add your first weight entry above</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WeightTracker;
