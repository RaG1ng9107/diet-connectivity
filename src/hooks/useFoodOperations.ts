
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FoodItem } from '@/data/foodDatabase';
import { useToast } from '@/hooks/use-toast';

export const useFoodOperations = (foodItems: FoodItem[], setFoodItems: React.Dispatch<React.SetStateAction<FoodItem[]>>) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const addFood = async (food: FoodItem, userId?: string) => {
    try {
      setIsSubmitting(true);
      
      // For adding food items, we'll no longer rely on RLS policies that might cause recursion
      // Instead, we'll directly include the created_by field in our insert operation if available
      const insertData = {
        name: food.name,
        category: food.category,
        calories_per_100g: food.caloriesPer100g,
        protein_per_100g: food.proteinPer100g.toString(),
        carbs_per_100g: food.carbsPer100g.toString(),
        fat_per_100g: food.fatPer100g.toString(),
        recommended_serving: food.recommendedServing,
        serving_unit: food.servingUnit,
        trainer_notes: food.trainerNotes
      };
      
      // Only add created_by if userId is provided
      if (userId) {
        Object.assign(insertData, { created_by: userId });
      }
      
      const { data, error } = await supabase
        .from('food_items')
        .insert(insertData)
        .select();
      
      if (error) {
        console.error('Error adding food item:', error);
        throw error;
      }
      
      if (data) {
        const newFood: FoodItem = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          caloriesPer100g: data[0].calories_per_100g,
          proteinPer100g: parseFloat(data[0].protein_per_100g || '0'),
          carbsPer100g: parseFloat(data[0].carbs_per_100g || '0'),
          fatPer100g: parseFloat(data[0].fat_per_100g || '0'),
          recommendedServing: data[0].recommended_serving || 100,
          servingUnit: data[0].serving_unit || 'g',
          trainerNotes: data[0].trainer_notes,
        };
        
        setFoodItems(prevFoods => [...prevFoods, newFood]);
        
        toast({
          title: 'Success',
          description: `${food.name} has been added to the database.`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food item. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteFood = async (foodId: string) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', foodId);
      
      if (error) {
        throw error;
      }
      
      setFoodItems(prevFoods => prevFoods.filter(food => food.id !== foodId));
      
      toast({
        title: 'Success',
        description: 'Food item has been deleted.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete food item. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addFood, deleteFood, isSubmitting };
};
