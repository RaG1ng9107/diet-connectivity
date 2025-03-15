
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import { useMacros } from '@/hooks/useMacros';
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

const Dashboard = () => {
  const { toast } = useToast();
  const macros = useMacros();
  const { user } = useAuth();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Get personalized macro goals if available in user's studentDetails
  const personalizedGoals = user?.studentDetails?.macroGoals || {
    calories: 2000,
    protein: 140,
    carbs: 220,
    fat: 60
  };
  
  // Override the default goals with personalized goals
  const customMacros = useMacros({
    calories: personalizedGoals.calories,
    protein: personalizedGoals.protein || 140,
    carbs: personalizedGoals.carbs || 220,
    fat: personalizedGoals.fat || 60
  });
  
  const handleAddMeal = (meal: Meal) => {
    customMacros.addMeal(meal);
    toast({
      title: "Meal added",
      description: `${meal.foodItemName} has been logged successfully.`,
    });
  };
  
  const handleDeleteMeal = (mealId: string, mealName: string) => {
    customMacros.deleteMeal(mealId);
    toast({
      title: "Meal deleted",
      description: `${mealName} has been removed from your log.`,
      variant: "destructive",
    });
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
            calories={customMacros.calories}
            protein={customMacros.protein}
            carbs={customMacros.carbs}
            fat={customMacros.fat}
          />
        </div>
        
        <MacroPieChart
          protein={customMacros.protein.consumed}
          carbs={customMacros.carbs.consumed}
          fat={customMacros.fat.consumed}
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
                      {customMacros.meals.length > 0 ? (
                        customMacros.meals.map((meal) => (
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
          <TrainerFeedback feedbackItems={customMacros.trainerFeedback} />
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
      </div>
    </PageTransition>
  );
};

export default Dashboard;
