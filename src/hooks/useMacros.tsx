
import { useState, useEffect } from 'react';
import { Meal } from '@/components/MealLogger';
import { generateId } from '@/utils/dataUtils';

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

export interface FeedbackItem {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  message: string;
  date: Date;
}

interface UseMacrosReturn extends MacroData {
  meals: Meal[];
  addMeal: (meal: Meal) => void;
  resetMeals: () => void;
  deleteMeal: (mealId: string) => void;
  updateMeal: (updatedMeal: Meal) => void;
  trainerFeedback: FeedbackItem[];
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
  const [trainerFeedback, setTrainerFeedback] = useState<FeedbackItem[]>([]);
  
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

  const deleteMeal = (mealId: string) => {
    setMeals((prevMeals) => prevMeals.filter(meal => meal.id !== mealId));
  };

  const updateMeal = (updatedMeal: Meal) => {
    setMeals((prevMeals) => 
      prevMeals.map(meal => meal.id === updatedMeal.id ? updatedMeal : meal)
    );
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

    // Add example trainer feedback
    if (trainerFeedback.length === 0) {
      setTrainerFeedback([
        {
          id: generateId(),
          trainerId: 'trainer1',
          trainerName: 'Sarah Johnson',
          message: 'Great job meeting your protein goals this week! Consider adding more complex carbs for sustained energy during your workouts.',
          date: new Date(new Date().setDate(new Date().getDate() - 2)),
        },
        {
          id: generateId(),
          trainerId: 'trainer1',
          trainerName: 'Sarah Johnson',
          message: 'I notice you\'ve been skipping breakfast. Try a quick protein shake to start your day!',
          date: new Date(),
        }
      ]);
    }
  }, []);

  const consumed = calculateConsumed();

  return {
    meals,
    addMeal,
    resetMeals,
    deleteMeal,
    updateMeal,
    trainerFeedback,
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
