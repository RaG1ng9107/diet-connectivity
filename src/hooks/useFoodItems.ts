
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FoodItem } from '@/data/foodDatabase';
import { useToast } from '@/hooks/use-toast';

export const useFoodItems = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('food_items')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          const transformedData: FoodItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            caloriesPer100g: item.calories_per_100g,
            proteinPer100g: parseFloat(item.protein_per_100g || '0'),
            carbsPer100g: parseFloat(item.carbs_per_100g || '0'),
            fatPer100g: parseFloat(item.fat_per_100g || '0'),
            recommendedServing: item.recommended_serving || 100,
            servingUnit: item.serving_unit || 'g',
            trainerNotes: item.trainer_notes,
          }));
          
          setFoodItems(transformedData);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load food database. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodItems();
  }, [toast]);

  return { foodItems, isLoading };
};
