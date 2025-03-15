
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/dataUtils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FoodItem, calculateNutrition } from '@/data/foodDatabase';
import { Badge } from '@/components/ui/badge';
import { Meal } from '@/components/MealLogger';
import NutritionCalculator from './NutritionCalculator';

interface MealFormProps {
  foodItems: FoodItem[];
  isLoading: boolean;
  onSubmit: (meal: Meal) => void;
  onCancel: () => void;
}

const MealForm: React.FC<MealFormProps> = ({ foodItems, isLoading, onSubmit, onCancel }) => {
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

  useEffect(() => {
    if (selectedFoodId && quantity) {
      const foodItem = foodItems.find(item => item.id === selectedFoodId);
      if (foodItem) {
        const nutrition = calculateNutrition(foodItem, Number(quantity));
        setCalculatedNutrition(nutrition);
      }
    } else {
      setCalculatedNutrition({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    }
  }, [selectedFoodId, quantity, foodItems]);

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
    
    const foodItem = foodItems.find(item => item.id === selectedFoodId);
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
    
    onSubmit(newMeal);
    toast({
      title: 'Meal Added',
      description: `${foodItem.name} has been added to your log.`,
    });
    
    resetForm();
  };

  return (
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
          {isLoading ? (
            <div className="flex items-center justify-center py-2 mt-1">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading food database...</span>
            </div>
          ) : (
            <Select value={selectedFoodId} onValueChange={setSelectedFoodId} required>
              <SelectTrigger id="foodItem" className="mt-1">
                <SelectValue placeholder="Select from approved food list" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                <div className="flex flex-col gap-1 py-1 px-2">
                  {foodItems.map((food) => (
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
          )}
          
          {selectedFoodId && (
            <div className="text-xs text-muted-foreground mt-1">
              {foodItems.find(f => f.id === selectedFoodId)?.trainerNotes && (
                <p className="italic">
                  <span className="font-medium">Trainer note:</span> {foodItems.find(f => f.id === selectedFoodId)?.trainerNotes}
                </p>
              )}
            </div>
          )}
        </div>
        
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="quantity">Quantity ({selectedFoodId ? 
              foodItems.find(f => f.id === selectedFoodId)?.servingUnit : 'g'})</Label>
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
                Recommended: {foodItems.find(f => f.id === selectedFoodId)?.recommendedServing}
                {foodItems.find(f => f.id === selectedFoodId)?.servingUnit}
              </div>
            )}
          </div>
          
          <NutritionCalculator nutrition={calculatedNutrition} />
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Meal</Button>
      </DialogFooter>
    </form>
  );
};

export default MealForm;
