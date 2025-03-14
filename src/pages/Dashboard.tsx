
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import { useMacros } from '@/hooks/useMacros';

const Dashboard = () => {
  const macros = useMacros();
  
  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Calories</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.calories.consumed} / {macros.calories.goal}
                  </span>
                </div>
                <Progress 
                  value={(macros.calories.consumed / macros.calories.goal) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protein</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.protein.consumed}g / {macros.protein.goal}g
                  </span>
                </div>
                <Progress 
                  value={(macros.protein.consumed / macros.protein.goal) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Carbs</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.carbs.consumed}g / {macros.carbs.goal}g
                  </span>
                </div>
                <Progress 
                  value={(macros.carbs.consumed / macros.carbs.goal) * 100} 
                  className="h-2"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fat</span>
                  <span className="text-sm text-muted-foreground">
                    {macros.fat.consumed}g / {macros.fat.goal}g
                  </span>
                </div>
                <Progress 
                  value={(macros.fat.consumed / macros.fat.goal) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Meals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {macros.meals.map((meal) => (
                  <div key={meal.id} className="flex justify-between items-start border-b pb-3 last:border-0">
                    <div>
                      <h4 className="font-medium">{meal.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {meal.mealType} • {meal.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{meal.calories} kcal</div>
                      <div className="text-xs text-muted-foreground">
                        P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
