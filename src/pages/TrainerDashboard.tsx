
import React, { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import TrainerStudentView from '@/components/trainer/TrainerStudentView';
import TrainerFoodView from '@/components/trainer/TrainerFoodView';
import { useMealLogs } from '@/hooks/useMealLogs';
import { useTrainerFeedback } from '@/hooks/useTrainerFeedback';
import { FeedbackItem } from '@/hooks/useMacros';

const TrainerDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState<any[]>([]);
  const { user, getAllStudents } = useAuth();
  
  // These hooks will be used when a student is selected
  const { meals: selectedStudentMeals, isLoading: mealsLoading } = useMealLogs({
    studentId: selectedStudent?.id
  });
  
  const { 
    feedback: selectedStudentFeedback, 
    isLoading: feedbackLoading,
    addFeedback 
  } = useTrainerFeedback({
    studentId: selectedStudent?.id
  });
  
  useEffect(() => {
    if (user?.id) {
      const managedStudents = getAllStudents(user.id);
      
      const mappedStudents = managedStudents.map(student => ({
        id: student.id,
        name: student.name,
        email: student.email,
        lastActive: '2 hours ago',
        accountStatus: student.status || 'active',
        dietaryStatus: 'on-track',
        calorieTarget: student.studentDetails?.macroGoals?.calories || 2200,
        currentCalories: 0, // Will be calculated from real data
        protein: { 
          consumed: 0, // Will be calculated from real data 
          goal: student.studentDetails?.macroGoals?.protein || 135 
        },
        carbs: { 
          consumed: 0, // Will be calculated from real data
          goal: student.studentDetails?.macroGoals?.carbs || 220 
        },
        fat: { 
          consumed: 0, // Will be calculated from real data
          goal: student.studentDetails?.macroGoals?.fat || 70 
        },
        firstLogin: student.firstLogin,
        age: student.studentDetails?.age,
        dietaryPreference: student.studentDetails?.dietaryPreference,
        personalGoal: student.studentDetails?.personalGoal,
      }));
      
      setStudents(mappedStudents);
    }
  }, [user?.id, getAllStudents]);

  // Update the selected student's consumed macros based on real data
  useEffect(() => {
    if (selectedStudent && selectedStudentMeals.length > 0) {
      // Calculate the total macros from the meals
      const consumed = selectedStudentMeals.reduce(
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
      
      // Update the selected student with real consumption data
      setSelectedStudent(prevStudent => ({
        ...prevStudent,
        currentCalories: consumed.calories,
        protein: { 
          ...prevStudent.protein,
          consumed: consumed.protein
        },
        carbs: { 
          ...prevStudent.carbs,
          consumed: consumed.carbs
        },
        fat: { 
          ...prevStudent.fat,
          consumed: consumed.fat
        },
      }));
    }
  }, [selectedStudent, selectedStudentMeals]);
  
  const handleStudentSelect = (student: typeof students[0]) => {
    setSelectedStudent(student);
  };
  
  const handleBackToList = () => {
    setSelectedStudent(null);
  };
  
  const handleAddFeedback = (feedback: Omit<FeedbackItem, 'id' | 'date' | 'trainerId' | 'trainerName'>) => {
    addFeedback(feedback);
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
            <TrainerStudentView
              selectedStudent={selectedStudent}
              students={students}
              mealsFetcher={() => selectedStudentMeals}
              feedbackFetcher={() => selectedStudentFeedback}
              onStudentSelect={handleStudentSelect}
              onBackToList={handleBackToList}
              onAddFeedback={handleAddFeedback}
              isLoading={{
                meals: mealsLoading,
                feedback: feedbackLoading
              }}
            />
          </TabsContent>
          
          <TabsContent value="foods">
            <TrainerFoodView />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default TrainerDashboard;
