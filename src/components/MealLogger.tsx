
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/dataUtils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Activity } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FoodItem, mockFoodDatabase, calculateNutrition } from '@/data/foodDatabase';
import { Badge } from '@/components/ui/badge';

export interface Meal {
  id: string;
  foodItemId: string;
  foodItemName: string;
  quantity: number;
  servingUnit: 'g' | 'ml' | 'serving';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  timestamp: Date;
}

interface MealLoggerProps {
  onAddMeal: (meal: Meal) => void;
}

const MealLogger: React.FC<MealLoggerProps> = ({ onAddMeal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [mealType, setMealType] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [calculatedNutrition, setCalculatedNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });
  const { toast } = useToast();

  const resetForm = () => {
    setSelectedFoodId('');
    setQuantity('');
    setMealType('');
    setDate(new Date());
    setCalculatedNutrition({
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0
    });
  };

  // Calculate nutrition when food or quantity changes
  useEffect(() => {
    if (selectedFoodId && quantity) {
      const foodItem = mockFoodDatabase.find(item => item.id === selectedFoodId);
      if (foodItem) {
        const nutrition = calculateNutrition(foodItem, Number(quantity));
        setCalculatedNutrition(nutrition);
      }
    } else {
      setCalculatedNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
  }, [selectedFoodId, quantity]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFoodId || !quantity || !mealType) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const foodItem = mockFoodDatabase.find(item => item.id === selectedFoodId);
    if (!foodItem) return;
    
    const newMeal: Meal = {
      id: generateId(),
      foodItemId: selectedFoodId,
      foodItemName: foodItem.name,
      quantity: Number(quantity),
      servingUnit: foodItem.servingUnit,
      calories: calculatedNutrition.calories,
      protein: calculatedNutrition.protein,
      carbs: calculatedNutrition.carbs,
      fat: calculatedNutrition.fat,
      mealType,
      timestamp: date,
    };
    
    onAddMeal(newMeal);
    toast({
      title: 'Meal Added',
      description: `${foodItem.name} has been added to your log.`,
    });
    
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Log Meal
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log a Meal</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mealDate">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType} required>
                  <SelectTrigger id="mealType" className="mt-1">
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
              
              <div className="col-span-2">
                <Label htmlFor="foodItem">Food Item</Label>
                <Select value={selectedFoodId} onValueChange={setSelectedFoodId} required>
                  <SelectTrigger id="foodItem" className="mt-1">
                    <SelectValue placeholder="Select from approved food list" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <div className="flex flex-col gap-1 py-1 px-2">
                      {mockFoodDatabase.map((food) => (
                        <SelectItem key={food.id} value={food.id} className="flex items-center">
                          <div className="flex flex-col">
                            <span>{food.name}</span>
                            <div className="flex gap-1 mt-1">
                              <Badge variant="outline" className="text-xs bg-primary/10">
                                {food.caloriesPer100g} kcal/100g
                              </Badge>
                              <Badge variant="outline" className="text-xs bg-primary/10">
                                P: {food.proteinPer100g}g
                              </Badge>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </div>
                  </SelectContent>
                </Select>
                
                {selectedFoodId && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {mockFoodDatabase.find(f => f.id === selectedFoodId)?.trainerNotes && (
                      <p className="italic">
                        <span className="font-medium">Trainer note:</span> {mockFoodDatabase.find(f => f.id === selectedFoodId)?.trainerNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quantity">Quantity ({selectedFoodId ? 
                    mockFoodDatabase.find(f => f.id === selectedFoodId)?.servingUnit : 'g'})</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    required 
                    min="0"
                    className="mt-1"
                    placeholder="Amount"
                  />
                  {selectedFoodId && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Recommended: {mockFoodDatabase.find(f => f.id === selectedFoodId)?.recommendedServing}
                      {mockFoodDatabase.find(f => f.id === selectedFoodId)?.servingUnit}
                    </div>
                  )}
                </div>
                
                <div className="border rounded-md p-3 flex flex-col justify-center">
                  <div className="flex items-center mb-1">
                    <Activity className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium text-sm">Calculated Nutrition:</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm">
                    <span>Calories:</span>
                    <span className="font-mono">{calculatedNutrition.calories} kcal</span>
                    <span>Protein:</span>
                    <span className="font-mono">{calculatedNutrition.protein}g</span>
                    <span>Carbs:</span>
                    <span className="font-mono">{calculatedNutrition.carbs}g</span>
                    <span>Fat:</span>
                    <span className="font-mono">{calculatedNutrition.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Meal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealLogger;
