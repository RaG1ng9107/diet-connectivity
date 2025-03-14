
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle } from 'lucide-react';

interface FeedbackItem {
  id: string;
  trainerId: string;
  trainerName: string;
  trainerAvatar?: string;
  message: string;
  date: Date;
}

interface TrainerFeedbackProps {
  feedbackItems: FeedbackItem[];
}

const TrainerFeedback: React.FC<TrainerFeedbackProps> = ({ feedbackItems }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">Trainer Feedback</CardTitle>
        <MessageCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbackItems.length > 0 ? (
            feedbackItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={item.trainerAvatar} alt={item.trainerName} />
                  <AvatarFallback>{item.trainerName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-sm">{item.trainerName}</h4>
                    <span className="text-xs text-muted-foreground">
                      {item.date.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
              <MessageCircle className="h-8 w-8 mb-2" />
              <p>No feedback yet from your trainer</p>
              <p className="text-xs">Check back later for personalized recommendations</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainerFeedback;
