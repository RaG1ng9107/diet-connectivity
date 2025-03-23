
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Meal } from '@/components/MealLogger';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface UseMealLogsOptions {
  userId?: string;
  studentId?: string; // Optional for trainers to view a specific student's meals
}

export const useMealLogs = ({ userId, studentId }: UseMealLogsOptions = {}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Use the studentId if provided (for trainers viewing student data), otherwise use userId
  const targetUserId = studentId || userId;

  useEffect(() => {
    const fetchMeals = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('meal_logs')
          .select(`
            *,
            food_items:food_item_id (
              name,
              serving_unit
            )
          `)
          .eq('user_id', targetUserId)
          .order('logged_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const transformedMeals: Meal[] = data.map(meal => ({
            id: meal.id,
            foodItemId: meal.food_item_id,
            foodItemName: meal.food_items?.name || 'Unknown Food',
            quantity: parseFloat(meal.quantity),
            servingUnit: meal.food_items?.serving_unit || 'g',
            calories: meal.calories,
            protein: parseFloat(meal.protein || '0'),
            carbs: parseFloat(meal.carbs || '0'),
            fat: parseFloat(meal.fat || '0'),
            mealType: meal.meal_type,
            timestamp: new Date(meal.logged_at),
          }));

          setMeals(transformedMeals);
        }
      } catch (error) {
        console.error('Error fetching meal logs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load meal logs. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [targetUserId, toast]);

  const addMeal = async (meal: Meal) => {
    if (!userId) {
      toast({
        title: 'Error',
        description: 'You must be logged in to add a meal.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('meal_logs')
        .insert({
          user_id: userId,
          food_item_id: meal.foodItemId,
          quantity: meal.quantity,
          meal_type: meal.mealType,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          logged_at: meal.timestamp.toISOString(),
        })
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        const newMeal: Meal = {
          id: data[0].id,
          foodItemId: data[0].food_item_id,
          foodItemName: meal.foodItemName, // Use the name from the input meal
          quantity: parseFloat(data[0].quantity),
          servingUnit: meal.servingUnit, // Use the unit from the input meal
          calories: data[0].calories,
          protein: parseFloat(data[0].protein || '0'),
          carbs: parseFloat(data[0].carbs || '0'),
          fat: parseFloat(data[0].fat || '0'),
          mealType: data[0].meal_type,
          timestamp: new Date(data[0].logged_at),
        };

        setMeals(prevMeals => [newMeal, ...prevMeals]);
        
        toast({
          title: 'Success',
          description: `${meal.foodItemName} has been added to your log.`,
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to add meal. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteMeal = async (mealId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('meal_logs')
        .delete()
        .eq('id', mealId);
      
      if (error) {
        throw error;
      }
      
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== mealId));
      
      toast({
        title: 'Success',
        description: 'Meal has been deleted from your log.',
      });
      
      return true;
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete meal. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { meals, isLoading, addMeal, deleteMeal };
};
