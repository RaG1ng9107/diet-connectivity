
import React, { useState } from 'react';
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
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Meal } from '@/components/MealLogger';

const Dashboard = () => {
  const { toast } = useToast();
  const macros = useMacros();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  const handleAddMeal = (meal: Meal) => {
    macros.addMeal(meal);
    toast({
      title: "Meal added",
      description: `${meal.name} has been logged successfully.`,
    });
  };
  
  const handleDeleteMeal = (mealId: string, mealName: string) => {
    macros.deleteMeal(mealId);
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
  
  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <MacroTracker
            calories={macros.calories}
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
          />
          <MacroPieChart
            protein={macros.protein.consumed}
            carbs={macros.carbs.consumed}
            fat={macros.fat.consumed}
          />
        </div>
        
        <div className="grid gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Meal Tracking</CardTitle>
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
                      {macros.meals.length > 0 ? (
                        macros.meals.map((meal) => (
                          <div 
                            key={meal.id} 
                            className="flex justify-between items-start border-b pb-3 last:border-0"
                          >
                            <div>
                              <h4 className="font-medium">{meal.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {meal.mealType} • {meal.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                                  onClick={() => handleDeleteMeal(meal.id, meal.name)}
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
          <TrainerFeedback feedbackItems={macros.trainerFeedback} />
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
