
import React from 'react';
import { Activity } from 'lucide-react';

interface NutritionCalculatorProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const NutritionCalculator: React.FC<NutritionCalculatorProps> = ({ nutrition }) => {
  return (
    <div className="border rounded-md p-3 flex flex-col justify-center">
      <div className="flex items-center mb-1">
        <Activity className="h-4 w-4 mr-1 text-primary" />
        <span className="font-medium text-sm">Calculated Nutrition:</span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-sm">
        <span>Calories:</span>
        <span className="font-mono">{nutrition.calories} kcal</span>
        <span>Protein:</span>
        <span className="font-mono">{nutrition.protein}g</span>
        <span>Carbs:</span>
        <span className="font-mono">{nutrition.carbs}g</span>
        <span>Fat:</span>
        <span className="font-mono">{nutrition.fat}g</span>
      </div>
    </div>
  );
};

export default NutritionCalculator;
