
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from "lucide-react";
import { FoodItem } from '@/data/foodDatabase';
import { useFoodItems } from '@/hooks/useFoodItems';
import MealForm from '@/components/meal/MealForm';

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
  const { foodItems, isLoading } = useFoodItems();
  
  const handleMealSubmit = (meal: Meal) => {
    onAddMeal(meal);
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
          
          <MealForm 
            foodItems={foodItems}
            isLoading={isLoading}
            onSubmit={handleMealSubmit}
            onCancel={() => setIsOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealLogger;
