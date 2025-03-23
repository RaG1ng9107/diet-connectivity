
import React from 'react';
import StudentList from '@/components/StudentList';
import StudentDetail from '@/components/StudentDetail';
import { Meal } from '@/components/MealLogger';
import { FeedbackItem } from '@/hooks/useMacros';

interface TrainerStudentViewProps {
  selectedStudent: any | null;
  students: any[];
  mealsFetcher: (studentId: string) => Meal[];
  feedbackFetcher: (studentId: string) => FeedbackItem[];
  onStudentSelect: (student: any) => void;
  onBackToList: () => void;
  onAddFeedback: (feedback: any) => void;
  isLoading?: {
    meals?: boolean;
    feedback?: boolean;
  };
}

const TrainerStudentView: React.FC<TrainerStudentViewProps> = ({
  selectedStudent,
  students,
  mealsFetcher,
  feedbackFetcher,
  onStudentSelect,
  onBackToList,
  onAddFeedback,
  isLoading = { meals: false, feedback: false }
}) => {
  // If no student is selected, show the student list
  if (!selectedStudent) {
    return <StudentList students={students} onStudentSelect={onStudentSelect} />;
  }
  
  // If a student is selected, show their details
  const studentMeals = mealsFetcher(selectedStudent.id);
  const studentFeedback = feedbackFetcher(selectedStudent.id);
  
  return (
    <StudentDetail
      student={selectedStudent}
      meals={studentMeals}
      feedback={studentFeedback}
      onAddFeedback={(feedback) => onAddFeedback({
        ...feedback,
        studentId: selectedStudent.id
      })}
      onBack={onBackToList}
      isLoading={isLoading}
    />
  );
};

export default TrainerStudentView;
