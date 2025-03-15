
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/dataUtils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus, Activity, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FoodItem, calculateNutrition } from '@/data/foodDatabase';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import MealForm from '@/components/meal/MealForm';
import NutritionCalculator from '@/components/meal/NutritionCalculator';
import { useFoodItems } from '@/hooks/useFoodItems';

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
