
export interface FoodItem {
  id: string;
  name: string;
  category: 'protein' | 'carbs' | 'fat' | 'vegetable' | 'fruit' | 'dairy' | 'other';
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  recommendedServing: number; // in grams
  servingUnit: 'g' | 'ml' | 'serving';
  trainerNotes?: string;
}

// Sample food database (this would typically come from an API)
export const mockFoodDatabase: FoodItem[] = [
  {
    id: '1',
    name: 'Grilled Chicken Breast',
    category: 'protein',
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6,
    recommendedServing: 100,
    servingUnit: 'g',
  },
  {
    id: '2',
    name: 'Brown Rice',
    category: 'carbs',
    caloriesPer100g: 112,
    proteinPer100g: 2.6,
    carbsPer100g: 23.5,
    fatPer100g: 0.9,
    recommendedServing: 75,
    servingUnit: 'g',
  },
  {
    id: '3',
    name: 'Avocado',
    category: 'fat',
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 8.5,
    fatPer100g: 14.7,
    recommendedServing: 50,
    servingUnit: 'g',
    trainerNotes: 'Great source of healthy fats',
  },
  {
    id: '4',
    name: 'Spinach (Raw)',
    category: 'vegetable',
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    recommendedServing: 30,
    servingUnit: 'g',
  },
  {
    id: '5',
    name: 'Banana',
    category: 'fruit',
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
    recommendedServing: 118, // medium banana
    servingUnit: 'g',
  },
  {
    id: '6',
    name: 'Greek Yogurt',
    category: 'dairy',
    caloriesPer100g: 59,
    proteinPer100g: 10,
    carbsPer100g: 3.6,
    fatPer100g: 0.4,
    recommendedServing: 170,
    servingUnit: 'g',
    trainerNotes: 'High in protein, good for breakfast or snack',
  },
  {
    id: '7',
    name: 'Salmon Fillet',
    category: 'protein',
    caloriesPer100g: 208,
    proteinPer100g: 20,
    carbsPer100g: 0,
    fatPer100g: 13,
    recommendedServing: 100,
    servingUnit: 'g',
    trainerNotes: 'Rich in omega-3 fatty acids',
  },
  {
    id: '8',
    name: 'Sweet Potato',
    category: 'carbs',
    caloriesPer100g: 86,
    proteinPer100g: 1.6,
    carbsPer100g: 20.1,
    fatPer100g: 0.1,
    recommendedServing: 150,
    servingUnit: 'g',
  },
  {
    id: '9',
    name: 'Olive Oil',
    category: 'fat',
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
    recommendedServing: 15,
    servingUnit: 'ml',
  },
  {
    id: '10',
    name: 'Protein Shake',
    category: 'protein',
    caloriesPer100g: 120,
    proteinPer100g: 24,
    carbsPer100g: 3,
    fatPer100g: 1.5,
    recommendedServing: 1,
    servingUnit: 'serving',
    trainerNotes: 'Good for post-workout recovery',
  },
];

// Function to calculate nutrition based on quantity
export const calculateNutrition = (foodItem: FoodItem, quantity: number): {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
} => {
  const multiplier = quantity / 100; // Convert to per 100g calculation
  
  return {
    calories: Math.round(foodItem.caloriesPer100g * multiplier),
    protein: Math.round(foodItem.proteinPer100g * multiplier * 10) / 10,
    carbs: Math.round(foodItem.carbsPer100g * multiplier * 10) / 10,
    fat: Math.round(foodItem.fatPer100g * multiplier * 10) / 10,
  };
};
