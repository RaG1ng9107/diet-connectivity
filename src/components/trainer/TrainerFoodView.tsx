
import React from 'react';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { FoodItem } from '@/data/foodDatabase';

interface TrainerFoodViewProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => Promise<boolean>;
  onDeleteFood: (foodId: string) => Promise<boolean>;
  isLoading: boolean;
}

const TrainerFoodView: React.FC<TrainerFoodViewProps> = ({
  foods,
  onAddFood,
  onDeleteFood,
  isLoading
}) => {
  return (
    <FoodDatabaseManager 
      foods={foods}
      onAddFood={onAddFood}
      onDeleteFood={onDeleteFood}
      isAdmin={false}
      isLoading={isLoading}
    />
  );
};

export default TrainerFoodView;
