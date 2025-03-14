
/**
 * Formats a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formats a time to a readable string
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Calculate the BMI (Body Mass Index)
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @returns BMI value
 */
export const calculateBMI = (weightKg: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate the BMR (Basal Metabolic Rate) using the Mifflin-St Jeor Equation
 * @param weightKg Weight in kilograms
 * @param heightCm Height in centimeters
 * @param age Age in years
 * @param gender Male or Female
 * @returns BMR value in calories
 */
export const calculateBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female'
): number => {
  if (gender === 'male') {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
  } else {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
};

/**
 * Calculate the TDEE (Total Daily Energy Expenditure)
 * @param bmr Basal Metabolic Rate
 * @param activityLevel Activity level factor
 * @returns TDEE value in calories
 */
export const calculateTDEE = (
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const activityFactors = {
    sedentary: 1.2, // Little to no exercise
    light: 1.375, // Light exercise 1-3 days per week
    moderate: 1.55, // Moderate exercise 3-5 days per week
    active: 1.725, // Hard exercise 6-7 days per week
    very_active: 1.9, // Very hard exercise and physical job
  };
  
  return Math.round(bmr * activityFactors[activityLevel]);
};

/**
 * Calculate macronutrient distribution for a given calorie goal
 * @param calorieGoal Total calories
 * @param proteinPercentage Percentage of calories from protein
 * @param fatPercentage Percentage of calories from fat
 * @returns Object with macronutrient goals in grams
 */
export const calculateMacros = (
  calorieGoal: number,
  proteinPercentage: number = 30,
  fatPercentage: number = 25
): { protein: number; carbs: number; fat: number } => {
  const carbPercentage = 100 - proteinPercentage - fatPercentage;
  
  // Calories per gram: Protein (4), Carbs (4), Fat (9)
  const proteinGrams = Math.round((calorieGoal * (proteinPercentage / 100)) / 4);
  const fatGrams = Math.round((calorieGoal * (fatPercentage / 100)) / 9);
  const carbGrams = Math.round((calorieGoal * (carbPercentage / 100)) / 4);
  
  return {
    protein: proteinGrams,
    carbs: carbGrams,
    fat: fatGrams,
  };
};

/**
 * Generate a random ID
 */
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 10);
};
