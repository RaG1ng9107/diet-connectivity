
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MacroTrackerProps {
  calories: {
    consumed: number;
    goal: number;
  };
  protein: {
    consumed: number;
    goal: number;
  };
  carbs: {
    consumed: number;
    goal: number;
  };
  fat: {
    consumed: number;
    goal: number;
  };
}

const MacroTracker: React.FC<MacroTrackerProps> = ({
  calories,
  protein,
  carbs,
  fat,
}) => {
  const calculatePercentage = (consumed: number, goal: number) => {
    const percentage = (consumed / goal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };

  const formatMacro = (consumed: number, goal: number, unit: string = 'g') => {
    return `${consumed}${unit} / ${goal}${unit}`;
  };

  const getMacroColor = (consumed: number, goal: number) => {
    const percentage = (consumed / goal) * 100;
    if (percentage > 100) return 'text-destructive';
    if (percentage > 90) return 'text-amber-500';
    return 'text-green-500';
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Today's Macros</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Calories</span>
            <span className={`text-sm font-medium ${getMacroColor(calories.consumed, calories.goal)}`}>
              {formatMacro(calories.consumed, calories.goal, 'kcal')}
            </span>
          </div>
          <Progress value={calculatePercentage(calories.consumed, calories.goal)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Protein</span>
            <span className={`text-sm font-medium ${getMacroColor(protein.consumed, protein.goal)}`}>
              {formatMacro(protein.consumed, protein.goal)}
            </span>
          </div>
          <Progress value={calculatePercentage(protein.consumed, protein.goal)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Carbs</span>
            <span className={`text-sm font-medium ${getMacroColor(carbs.consumed, carbs.goal)}`}>
              {formatMacro(carbs.consumed, carbs.goal)}
            </span>
          </div>
          <Progress value={calculatePercentage(carbs.consumed, carbs.goal)} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Fat</span>
            <span className={`text-sm font-medium ${getMacroColor(fat.consumed, fat.goal)}`}>
              {formatMacro(fat.consumed, fat.goal)}
            </span>
          </div>
          <Progress value={calculatePercentage(fat.consumed, fat.goal)} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MacroTracker;
