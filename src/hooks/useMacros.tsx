
import { useState, useEffect } from 'react';
import { Meal } from '@/components/MealLogger';

interface MacroData {
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

interface UseMacrosReturn extends MacroData {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  resetMeals: () => void;
}

// Default goals based on a standard diet
const DEFAULT_GOALS = {
  calories: 2000,
  protein: 140,
  carbs: 220,
  fat: 60,
};

export function useMacros(customGoals?: Partial<typeof DEFAULT_GOALS>): UseMacrosReturn {
  const [meals, setMeals] = useState<Meal[]>([]);
  
  // Merge custom goals with defaults
  const goals = {
    ...DEFAULT_GOALS,
    ...customGoals,
  };
  
  // Calculate consumed nutrients
  const calculateConsumed = () => {
    return meals.reduce(
      (acc, meal) => {
        return {
          calories: acc.calories + meal.calories,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        };
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const addMeal = (meal: Meal) => {
    setMeals((prevMeals) => [...prevMeals, meal]);
  };

  const resetMeals = () => {
    setMeals([]);
  };

  // Example pre-populated meals for demo purposes
  useEffect(() => {
    // Only add example meals if there are none
    if (meals.length === 0) {
      setMeals([
        {
          id: '1',
          name: 'Breakfast Oatmeal',
          calories: 350,
          protein: 15,
          carbs: 60,
          fat: 8,
          mealType: 'breakfast',
          timestamp: new Date(new Date().setHours(8, 30)),
        },
        {
          id: '2',
          name: 'Grilled Chicken Salad',
          calories: 450,
          protein: 40,
          carbs: 20,
          fat: 15,
          mealType: 'lunch',
          timestamp: new Date(new Date().setHours(13, 0)),
        },
      ]);
    }
  }, []);

  const consumed = calculateConsumed();

  return {
    meals,
    addMeal,
    resetMeals,
    calories: {
      consumed: consumed.calories,
      goal: goals.calories,
    },
    protein: {
      consumed: consumed.protein,
      goal: goals.protein,
    },
    carbs: {
      consumed: consumed.carbs,
      goal: goals.carbs,
    },
    fat: {
      consumed: consumed.fat,
      goal: goals.fat,
    },
  };
}
