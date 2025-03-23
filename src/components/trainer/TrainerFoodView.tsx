
import React from 'react';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { FoodItem } from '@/data/foodDatabase';
import { useFoodItems } from '@/hooks/useFoodItems';
import { useFoodOperations } from '@/hooks/useFoodOperations';
import { useAuth } from '@/context/AuthContext';

const TrainerFoodView: React.FC = () => {
  const { foodItems, isLoading, setFoodItems } = useFoodItems();
  const { user } = useAuth();
  const { addFood, deleteFood, isSubmitting } = useFoodOperations(foodItems, setFoodItems);
  
  const handleAddFood = async (food: FoodItem) => {
    return addFood(food, user?.id);
  };
  
  return (
    <FoodDatabaseManager 
      foods={foodItems}
      onAddFood={handleAddFood}
      onDeleteFood={deleteFood}
      isAdmin={true}
      isLoading={isLoading || isSubmitting}
    />
  );
};

export default TrainerFoodView;
