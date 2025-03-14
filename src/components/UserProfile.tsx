
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

interface UserProfileProps {
  compact?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ compact = false }) => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  // Mock data that would come from a real database
  const profileData = {
    goalType: 'Weight Loss',
    currentWeight: '72 kg',
    targetWeight: '68 kg',
    height: '175 cm',
    age: 28,
    activityLevel: 'Moderate',
    dietaryPreference: 'No restrictions',
  };

  if (compact) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/avatar.png" />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">
                  {user.role === 'student' ? 'Student' : 'Trainer'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src="/avatar.png" />
            <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          
          <div className="text-center sm:text-left space-y-2 sm:space-y-4 flex-grow">
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-2">
                <Badge variant="outline">
                  {user.role === 'student' ? 'Student' : 'Trainer'}
                </Badge>
              </div>
            </div>
            
            {user.role === 'student' && (
              <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm mt-4">
                <div className="flex justify-between">
                  <span className="font-medium">Goal:</span>
                  <span>{profileData.goalType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Current Weight:</span>
                  <span>{profileData.currentWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Target Weight:</span>
                  <span>{profileData.targetWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Height:</span>
                  <span>{profileData.height}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Age:</span>
                  <span>{profileData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Activity Level:</span>
                  <span>{profileData.activityLevel}</span>
                </div>
                <div className="flex justify-between col-span-2">
                  <span className="font-medium">Dietary Preference:</span>
                  <span>{profileData.dietaryPreference}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
