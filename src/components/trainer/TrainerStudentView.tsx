
import React from 'react';
import StudentList from '@/components/StudentList';
import StudentDetail from '@/components/StudentDetail';
import { FeedbackItem } from '@/hooks/useMacros';
import { Meal } from '@/components/MealLogger';

interface TrainerStudentViewProps {
  selectedStudent: any | null;
  students: any[];
  mealsFetcher: (studentId: string) => Meal[];
  feedbackFetcher: (studentId: string) => FeedbackItem[];
  onStudentSelect: (student: any) => void;
  onBackToList: () => void;
  onAddFeedback: (feedback: FeedbackItem) => void;
}

const TrainerStudentView: React.FC<TrainerStudentViewProps> = ({
  selectedStudent,
  students,
  mealsFetcher,
  feedbackFetcher,
  onStudentSelect,
  onBackToList,
  onAddFeedback
}) => {
  if (selectedStudent) {
    return (
      <StudentDetail
        student={selectedStudent}
        meals={mealsFetcher(selectedStudent.id)}
        feedback={feedbackFetcher(selectedStudent.id)}
        onAddFeedback={onAddFeedback}
        onBack={onBackToList}
      />
    );
  }
  
  return (
    <StudentList 
      students={students} 
      onStudentSelect={onStudentSelect}
    />
  );
};

export default TrainerStudentView;
