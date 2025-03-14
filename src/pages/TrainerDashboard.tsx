
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import StudentList from '@/components/StudentList';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import StudentDetail from '@/components/StudentDetail';
import { useMacros, FeedbackItem } from '@/hooks/useMacros';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFoodDatabase } from '@/data/foodDatabase';
import { Meal } from '@/components/MealLogger';
import { useAuth } from '@/context/AuthContext';

// Mock meals for students
const getMockMealsForStudent = (studentId: string): Meal[] => {
  if (studentId === '1') {
    return [
      {
        id: '101',
        foodItemId: '1',
        foodItemName: 'Grilled Chicken Breast',
        quantity: 150,
        servingUnit: 'g',
        calories: 248,
        protein: 46.5,
        carbs: 0,
        fat: 5.4,
        mealType: 'lunch',
        timestamp: new Date(new Date().setHours(13, 0)),
      },
      {
        id: '102',
        foodItemId: '6',
        foodItemName: 'Greek Yogurt',
        quantity: 150,
        servingUnit: 'g',
        calories: 88,
        protein: 15,
        carbs: 5.4,
        fat: 0.6,
        mealType: 'breakfast',
        timestamp: new Date(new Date().setHours(8, 30)),
      },
    ];
  } else if (studentId === '2') {
    return [
      {
        id: '201',
        foodItemId: '8',
        foodItemName: 'Sweet Potato',
        quantity: 200,
        servingUnit: 'g',
        calories: 172,
        protein: 3.2,
        carbs: 40.2,
        fat: 0.2,
        mealType: 'dinner',
        timestamp: new Date(new Date().setHours(19, 0)),
      },
    ];
  } else if (studentId === '3') {
    return [
      {
        id: '301',
        foodItemId: '2',
        foodItemName: 'Brown Rice',
        quantity: 100,
        servingUnit: 'g',
        calories: 112,
        protein: 2.6,
        carbs: 23.5,
        fat: 0.9,
        mealType: 'lunch',
        timestamp: new Date(new Date().setHours(12, 30)),
      },
      {
        id: '302',
        foodItemId: '7',
        foodItemName: 'Salmon Fillet',
        quantity: 120,
        servingUnit: 'g',
        calories: 250,
        protein: 24,
        carbs: 0,
        fat: 15.6,
        mealType: 'dinner',
        timestamp: new Date(new Date().setHours(19, 30)),
      },
    ];
  }
  return [];
};

// Mock feedback for students
const getMockFeedbackForStudent = (studentId: string): FeedbackItem[] => {
  if (studentId === '1') {
    return [
      {
        id: '501',
        trainerId: 'trainer1',
        trainerName: 'Sarah Johnson',
        studentId: '1',
        message: 'Great job hitting your protein targets this week! Consider adding more vegetables to your meals for better micronutrients.',
        date: new Date(new Date().setDate(new Date().getDate() - 2)),
      },
    ];
  } else if (studentId === '2') {
    return [
      {
        id: '601',
        trainerId: 'trainer1',
        trainerName: 'Sarah Johnson',
        studentId: '2',
        message: 'I noticed you\'re not hitting your daily calorie goal. Try adding an additional protein-rich snack in the afternoon.',
        date: new Date(new Date().setDate(new Date().getDate() - 1)),
      },
      {
        id: '602',
        trainerId: 'trainer1',
        trainerName: 'Sarah Johnson',
        studentId: '2',
        message: 'Remember to log all your meals so we can track your progress accurately.',
        date: new Date(new Date().setDate(new Date().getDate() - 5)),
      },
    ];
  } else if (studentId === '3') {
    return [
      {
        id: '701',
        trainerId: 'trainer1',
        trainerName: 'Sarah Johnson',
        studentId: '3',
        message: 'Your macros look well balanced. Keep up the great work with your meal planning!',
        date: new Date(),
      },
    ];
  }
  return [];
};

const TrainerDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState<any[]>([]);
  const macros = useMacros();
  const { user, getAllStudents } = useAuth();
  
  useEffect(() => {
    if (user?.id) {
      // Get students managed by this trainer
      const managedStudents = getAllStudents(user.id);
      
      // Map to the format expected by StudentList
      const mappedStudents = managedStudents.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        lastActive: '2 hours ago', // In a real app, this would come from actual tracking
        accountStatus: student.status || 'active',
        dietaryStatus: 'on-track', // This would come from actual tracking in a real app
        calorieTarget: 2200, // In a real app, this would be stored per student
        currentCalories: 1950, // In a real app, this would be calculated from meals
        protein: { consumed: 120, goal: 135 },
        carbs: { consumed: 180, goal: 220 },
        fat: { consumed: 60, goal: 70 },
        firstLogin: student.firstLogin,
      }));
      
      setStudents(mappedStudents);
    }
  }, [user?.id, getAllStudents]);
  
  const handleStudentSelect = (student: typeof students[0]) => {
    setSelectedStudent(student);
  };
  
  const handleBackToList = () => {
    setSelectedStudent(null);
  };
  
  const handleAddFeedback = (feedback: FeedbackItem) => {
    macros.addFeedback(feedback);
  };

  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Trainer Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="foods">Food Database</TabsTrigger>
          </TabsList>
          
          <TabsContent value="students">
            {selectedStudent ? (
              <StudentDetail 
                student={selectedStudent}
                meals={getMockMealsForStudent(selectedStudent.id)}
                feedback={getMockFeedbackForStudent(selectedStudent.id)}
                onAddFeedback={handleAddFeedback}
                onBack={handleBackToList}
              />
            ) : (
              <StudentList 
                students={students} 
                onStudentSelect={handleStudentSelect}
              />
            )}
          </TabsContent>
          
          <TabsContent value="foods">
            <FoodDatabaseManager 
              foods={macros.foodDatabase}
              onAddFood={macros.addFoodItem}
              onDeleteFood={macros.deleteFoodItem}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default TrainerDashboard;
