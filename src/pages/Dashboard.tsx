
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import MacroTracker from '@/components/MacroTracker';
import MacroPieChart from '@/components/MacroPieChart';
import MealLogger from '@/components/MealLogger';
import TrainerFeedback from '@/components/TrainerFeedback';
import ProgressChart from '@/components/ProgressChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Pencil, Trash2, Target, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Meal } from '@/components/MealLogger';
import { format } from 'date-fns';
import { useMealLogs } from '@/hooks/useMealLogs';
import { useTrainerFeedback } from '@/hooks/useTrainerFeedback';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { useFoodItems } from '@/hooks/useFoodItems';

const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { foodItems, isLoading: foodsLoading } = useFoodItems();
  const { meals, isLoading: mealsLoading, addMeal, deleteMeal } = useMealLogs({ userId: user?.id });
  const { feedback, isLoading: feedbackLoading } = useTrainerFeedback({ studentId: user?.id });
  
  // Get personalized macro goals if available in user's studentDetails
  const personalizedGoals = user?.studentDetails?.macroGoals || {
    calories: 2000,
    protein: 140,
    carbs: 220,
    fat: 60
  };
  
  // Calculate consumed nutrients from actual meals data
  const consumed = meals.reduce(
    (acc, meal) => {
      return {
        calories: acc.calories + meal.calories,
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fat: acc.fat + meal.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );
  
  const macros = {
    calories: {
      consumed: consumed.calories,
      goal: personalizedGoals.calories,
    },
    protein: {
      consumed: consumed.protein,
      goal: personalizedGoals.protein || 140,
    },
    carbs: {
      consumed: consumed.carbs,
      goal: personalizedGoals.carbs || 220,
    },
    fat: {
      consumed: consumed.fat,
      goal: personalizedGoals.fat || 60,
    },
  };
  
  const handleAddMeal = (meal: Meal) => {
    addMeal(meal);
  };
  
  const handleDeleteMeal = (mealId: string, mealName: string) => {
    deleteMeal(mealId);
  };
  
  const handleEditMeal = (meal: Meal) => {
    setSelectedMeal(meal);
    setIsEditDialogOpen(true);
  };

  const formatGoal = (goal?: string) => {
    if (!goal) return 'Not specified';
    
    return goal
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Your Goals & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Age</p>
                    <p>{user?.studentDetails?.age || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Goal</p>
                    <p>{formatGoal(user?.studentDetails?.personalGoal)}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Dietary Preference</p>
                  <Badge variant="outline" className="bg-primary/10">
                    {user?.studentDetails?.dietaryPreference 
                      ? user.studentDetails.dietaryPreference.charAt(0).toUpperCase() + user.studentDetails.dietaryPreference.slice(1)
                      : 'Not specified'}
                  </Badge>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-1">Daily Targets</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <p className="font-medium">Calories</p>
                      <p>{personalizedGoals.calories} kcal</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Protein</p>
                      <p>{personalizedGoals.protein || 'Not set'} g</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Carbs</p>
                      <p>{personalizedGoals.carbs || 'Not set'} g</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">Fat</p>
                      <p>{personalizedGoals.fat || 'Not set'} g</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <MacroTracker
            calories={macros.calories}
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
          />
        </div>
        
        <MacroPieChart
          protein={macros.protein.consumed}
          carbs={macros.carbs.consumed}
          fat={macros.fat.consumed}
        />
        
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                Meal Tracking
              </CardTitle>
              <MealLogger onAddMeal={handleAddMeal} />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="today" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="today">Today's Meals</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="today">
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-4">
                      {mealsLoading ? (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>Loading meals...</p>
                        </div>
                      ) : meals.length > 0 ? (
                        meals.map((meal) => (
                          <div 
                            key={meal.id} 
                            className="flex justify-between items-start border-b pb-3 last:border-0"
                          >
                            <div>
                              <h4 className="font-medium">{meal.foodItemName}</h4>
                              <div className="text-sm text-muted-foreground">
                                <span className="capitalize">{meal.mealType}</span> • {format(meal.timestamp, 'h:mm a')} • {meal.quantity}{meal.servingUnit}
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <div className="font-medium">{meal.calories} kcal</div>
                                <div className="text-xs text-muted-foreground">
                                  P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                                </div>
                              </div>
                              <div className="flex space-x-1">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleEditMeal(meal)}
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteMeal(meal.id, meal.foodItemName)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-6 text-muted-foreground">
                          <p>No meals logged today</p>
                          <p className="text-sm">Use the "Log Meal" button to add your meals</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="p-4 text-center text-muted-foreground">
                    <p>Meal history will be available soon</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <ProgressChart title="Weekly Nutrition Trends" />
          <TrainerFeedback feedbackItems={feedback} isLoading={feedbackLoading} />
        </div>
        
        {selectedMeal && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Meal</DialogTitle>
                <DialogDescription>
                  Update the details of your meal.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  Meal editing functionality will be available soon.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}

        <div className="mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Food Database</CardTitle>
            </CardHeader>
            <CardContent>
              <FoodDatabaseManager 
                foods={foodItems}
                onAddFood={() => {}}
                onDeleteFood={() => {}}
                isAdmin={false}
                isLoading={foodsLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
