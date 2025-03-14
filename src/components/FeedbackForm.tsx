
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { FeedbackItem } from '@/hooks/useMacros';
import { generateId } from '@/utils/dataUtils';

interface FeedbackFormProps {
  studentId: string;
  studentName: string;
  onAddFeedback: (feedback: FeedbackItem) => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ 
  studentId, 
  studentName,
  onAddFeedback 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast({
        title: 'Empty Message',
        description: 'Please enter feedback before submitting',
        variant: 'destructive',
      });
      return;
    }
    
    const feedback: FeedbackItem = {
      id: generateId(),
      trainerId: 'trainer1', // In a real app, this would come from auth context
      trainerName: 'Sarah Johnson', // In a real app, this would come from auth context
      studentId,
      message: message.trim(),
      date: new Date(),
    };
    
    onAddFeedback(feedback);
    toast({
      title: 'Feedback Sent',
      description: `Your feedback has been sent to ${studentName}`,
    });
    
    setMessage('');
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center" 
        onClick={() => setIsOpen(true)}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Send Feedback
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send Feedback to {studentName}</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                placeholder="Enter your feedback, recommendations, or encouragement..."
                className="min-h-[150px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FeedbackForm;
