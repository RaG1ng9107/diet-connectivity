
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, BarChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Example data - in a real app, this would come from props or an API
const calorieData = [
  { day: 'Mon', calories: 2100, target: 2000 },
  { day: 'Tue', calories: 1950, target: 2000 },
  { day: 'Wed', calories: 2300, target: 2000 },
  { day: 'Thu', calories: 1800, target: 2000 },
  { day: 'Fri', calories: 2050, target: 2000 },
  { day: 'Sat', calories: 2400, target: 2000 },
  { day: 'Sun', calories: 1700, target: 2000 },
];

const macroData = [
  { day: 'Mon', protein: 120, carbs: 180, fat: 60 },
  { day: 'Tue', protein: 130, carbs: 160, fat: 55 },
  { day: 'Wed', protein: 100, carbs: 220, fat: 70 },
  { day: 'Thu', protein: 110, carbs: 150, fat: 50 },
  { day: 'Fri', protein: 125, carbs: 170, fat: 65 },
  { day: 'Sat', protein: 140, carbs: 210, fat: 75 },
  { day: 'Sun', protein: 105, carbs: 140, fat: 45 },
];

const weightData = [
  { day: 'Week 1', weight: 75 },
  { day: 'Week 2', weight: 74.5 },
  { day: 'Week 3', weight: 74.2 },
  { day: 'Week 4', weight: 73.8 },
  { day: 'Week 5', weight: 73.5 },
  { day: 'Week 6', weight: 73.1 },
  { day: 'Week 7', weight: 72.8 },
];

interface ProgressChartProps {
  title?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ 
  title = "Nutrition Progress" 
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calories">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="macros">Macros</TabsTrigger>
            <TabsTrigger value="weight">Weight</TabsTrigger>
          </TabsList>
          
          <TabsContent value="calories" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={calorieData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorCalories)" 
                  name="Calories"
                />
                <Area 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#d1d5db" 
                  strokeDasharray="5 5" 
                  fill="none" 
                  name="Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="macros" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={macroData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }} 
                />
                <Legend />
                <Bar dataKey="protein" name="Protein" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="carbs" name="Carbs" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fat" name="Fat" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="weight" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={weightData}
                margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
                  }} 
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorWeight)" 
                  name="Weight (kg)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
