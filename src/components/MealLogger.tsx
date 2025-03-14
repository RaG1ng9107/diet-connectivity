
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

interface MealLoggerProps {
  onAddMeal: (meal: Meal) => void;
  meals: Meal[];
}

const MealLogger: React.FC<MealLoggerProps> = ({ onAddMeal, meals }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMealType('breakfast');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !calories || !protein || !carbs || !fat) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please fill in all the fields",
      });
      return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      name,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
      mealType,
      timestamp: new Date(),
    };

    onAddMeal(newMeal);
    toast({
      title: "Meal added",
      description: `${name} has been added to your log.`,
    });
    
    resetForm();
    setOpen(false);
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast':
        return '🍳';
      case 'lunch':
        return '🥗';
      case 'dinner':
        return '🍽️';
      case 'snack':
        return '🍎';
      default:
        return '🍴';
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Meal Log</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-8 gap-1">
                <Plus className="h-4 w-4" />
                <span>Add Meal</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a meal</DialogTitle>
                <DialogDescription>
                  Enter the details of your meal to track your nutrition.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Meal Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Grilled Chicken Salad"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="mealType">Meal Type</Label>
                    <Select 
                      value={mealType} 
                      onValueChange={(value) => setMealType(value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select meal type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="calories">Calories</Label>
                      <Input
                        id="calories"
                        type="number"
                        value={calories}
                        onChange={(e) => setCalories(e.target.value)}
                        placeholder="kcal"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="protein">Protein</Label>
                      <Input
                        id="protein"
                        type="number"
                        value={protein}
                        onChange={(e) => setProtein(e.target.value)}
                        placeholder="grams"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="carbs">Carbs</Label>
                      <Input
                        id="carbs"
                        type="number"
                        value={carbs}
                        onChange={(e) => setCarbs(e.target.value)}
                        placeholder="grams"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="fat">Fat</Label>
                      <Input
                        id="fat"
                        type="number"
                        value={fat}
                        onChange={(e) => setFat(e.target.value)}
                        placeholder="grams"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Meal
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {meals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No meals logged today</p>
            <p className="text-sm mt-1">Start tracking by adding your first meal</p>
          </div>
        ) : (
          <div className="space-y-4">
            {meals.map((meal) => (
              <div 
                key={meal.id} 
                className="flex items-start p-3 rounded-lg border border-border bg-secondary/20"
              >
                <div className="flex-shrink-0 text-2xl mr-3">
                  {getMealTypeIcon(meal.mealType)}
                </div>
                <div className="flex-grow">
                  <h4 className="font-medium text-sm">{meal.name}</h4>
                  <div className="text-xs text-muted-foreground mt-1">
                    Calories: {meal.calories}kcal | P: {meal.protein}g | C: {meal.carbs}g | F: {meal.fat}g
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="flex-shrink-0 h-6 w-6">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealLogger;
