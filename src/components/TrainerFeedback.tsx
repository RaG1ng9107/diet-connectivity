
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeedbackItem } from '@/hooks/useMacros';
import { format } from 'date-fns';
import { MessageSquare, Loader2 } from 'lucide-react';

interface TrainerFeedbackProps {
  feedbackItems: FeedbackItem[];
  isLoading?: boolean;
}

const TrainerFeedback: React.FC<TrainerFeedbackProps> = ({ 
  feedbackItems, 
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Trainer Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>Loading feedback...</span>
          </div>
        ) : feedbackItems && feedbackItems.length > 0 ? (
          <div className="space-y-4">
            {feedbackItems.map((item) => (
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
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto opacity-20 mb-2" />
            <p>No feedback from your trainer yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrainerFeedback;
