
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Meal } from '@/components/MealLogger';
import { FeedbackItem } from '@/hooks/useMacros';
import { ChevronLeft, Edit, MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import { format } from 'date-fns';
import MacroTracker from './MacroTracker';
import MacroPieChart from './MacroPieChart';
import ProgressChart from './ProgressChart';

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
        <MacroTracker
          calories={{
            consumed: student.currentCalories,
            goal: student.calorieTarget,
          }}
          protein={student.protein}
          carbs={student.carbs}
          fat={student.fat}
        />
        
        <MacroPieChart
          protein={student.protein.consumed}
          carbs={student.carbs.consumed}
          fat={student.fat.consumed}
        />
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Recent Meals</CardTitle>
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
