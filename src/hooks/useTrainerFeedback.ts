
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FeedbackItem } from '@/hooks/useMacros';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export interface UseTrainerFeedbackOptions {
  studentId?: string;
}

export const useTrainerFeedback = ({ studentId }: UseTrainerFeedbackOptions = {}) => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!studentId) {
      setIsLoading(false);
      return;
    }

    const fetchFeedback = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('trainer_feedback')
          .select(`
            *,
            trainer:trainer_id (
              name,
              email
            )
          `)
          .eq('student_id', studentId)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          const transformedFeedback: FeedbackItem[] = data.map(item => ({
            id: item.id,
            trainerId: item.trainer_id,
            trainerName: item.trainer?.name || 'Unknown Trainer',
            studentId: item.student_id,
            message: item.message,
            date: new Date(item.created_at),
          }));

          setFeedback(transformedFeedback);
        }
      } catch (error) {
        console.error('Error fetching trainer feedback:', error);
        toast({
          title: 'Error',
          description: 'Failed to load feedback. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, [studentId, toast]);

  const addFeedback = async (feedbackItem: Omit<FeedbackItem, 'id' | 'date' | 'trainerId' | 'trainerName'>) => {
    if (!user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in as a trainer to add feedback.',
        variant: 'destructive',
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('trainer_feedback')
        .insert({
          trainer_id: user.id,
          student_id: feedbackItem.studentId,
          message: feedbackItem.message,
        })
        .select(`
          *,
          trainer:trainer_id (
            name,
            email
          )
        `);

      if (error) {
        throw error;
      }

      if (data) {
        const newFeedback: FeedbackItem = {
          id: data[0].id,
          trainerId: data[0].trainer_id,
          trainerName: data[0].trainer?.name || user.name || 'Unknown Trainer',
          studentId: data[0].student_id,
          message: data[0].message,
          date: new Date(data[0].created_at),
        };

        setFeedback(prevFeedback => [newFeedback, ...prevFeedback]);
        
        toast({
          title: 'Success',
          description: 'Feedback has been sent to the student.',
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error adding feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to send feedback. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { feedback, isLoading, addFeedback };
};
