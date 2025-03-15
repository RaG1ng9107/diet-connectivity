
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Meal } from '@/components/MealLogger';
import { FeedbackItem } from '@/hooks/useMacros';
import { ChevronLeft, Edit, MessageSquare, Target, Utensils } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { format } from 'date-fns';
import MacroTracker from './MacroTracker';
import MacroPieChart from './MacroPieChart';
import ProgressChart from './ProgressChart';
import { Badge } from '@/components/ui/badge';

interface StudentDetailProps {
  student: {
    id: string;
    name: string;
    avatar?: string;
    email: string;
    lastActive: string;
    calorieTarget: number;
    currentCalories: number;
    protein: { consumed: number; goal: number };
    carbs: { consumed: number; goal: number };
    fat: { consumed: number; goal: number };
    age?: number;
    dietaryPreference?: string;
    personalGoal?: string;
  };
  meals: Meal[];
  feedback: FeedbackItem[];
  onAddFeedback: (feedback: FeedbackItem) => void;
  onBack: () => void;
}

const StudentDetail: React.FC<StudentDetailProps> = ({ 
  student, 
  meals, 
  feedback,
  onAddFeedback,
  onBack 
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const formatGoal = (goal?: string) => {
    if (!goal) return 'Not specified';
    
    return goal
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold">Student Details</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={student.avatar} alt={student.name} />
              <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{student.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{student.email}</p>
            </div>
            <div className="ml-auto">
              <FeedbackForm 
                studentId={student.id}
                studentName={student.name}
                onAddFeedback={onAddFeedback}
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Student Goals & Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">Age</p>
                  <p>{student.age || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Goal</p>
                  <p>{formatGoal(student.personalGoal)}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Dietary Preference</p>
                <Badge variant="outline" className="bg-primary/10">
                  {student.dietaryPreference 
                    ? student.dietaryPreference.charAt(0).toUpperCase() + student.dietaryPreference.slice(1)
                    : 'Not specified'}
                </Badge>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Daily Targets</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-sm">
                    <p className="font-medium">Calories</p>
                    <p>{student.calorieTarget} kcal</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Protein</p>
                    <p>{student.protein.goal}g</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Carbs</p>
                    <p>{student.carbs.goal}g</p>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Fat</p>
                    <p>{student.fat.goal}g</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <MacroTracker
          calories={{
            consumed: student.currentCalories,
            goal: student.calorieTarget,
          }}
          protein={student.protein}
          carbs={student.carbs}
          fat={student.fat}
        />
      </div>
      
      <MacroPieChart
        protein={student.protein.consumed}
        carbs={student.carbs.consumed}
        fat={student.fat.consumed}
      />
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            Recent Meals
          </CardTitle>
        </CardHeader>
        <CardContent>
          {meals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Meal Type</TableHead>
                  <TableHead>Food</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>{format(meal.timestamp, 'MMM d')}</TableCell>
                    <TableCell className="capitalize">{meal.mealType}</TableCell>
                    <TableCell>{meal.foodItemName}</TableCell>
                    <TableCell>{meal.quantity}{meal.servingUnit}</TableCell>
                    <TableCell className="text-right">{meal.calories} kcal</TableCell>
                    <TableCell className="text-right">{meal.protein}g</TableCell>
                    <TableCell className="text-right">{meal.carbs}g</TableCell>
                    <TableCell className="text-right">{meal.fat}g</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No meals logged yet
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProgressChart title="Weekly Nutrition Trends" />
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Feedback History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {feedback.length > 0 ? (
                feedback.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 border rounded-md">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <p className="font-medium text-sm">{format(item.date, 'MMM d, yyyy')}</p>
                        <p className="text-sm text-muted-foreground">{format(item.date, 'h:mm a')}</p>
                      </div>
                      <p className="mt-1">{item.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No feedback provided yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
