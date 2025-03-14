
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';

const TrainerDashboard = () => {
  // Mock data for demonstration
  const students = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      goal: 'Weight Loss',
      progress: 'On Track',
      lastActivity: '2 hours ago',
    },
    {
      id: '2',
      name: 'David Chen',
      email: 'david@example.com',
      goal: 'Muscle Gain',
      progress: 'Behind',
      lastActivity: '1 day ago',
    },
    {
      id: '3',
      name: 'Emma Wilson',
      email: 'emma@example.com',
      goal: 'Maintenance',
      progress: 'On Track',
      lastActivity: '5 hours ago',
    },
    {
      id: '4',
      name: 'Michael Brown',
      email: 'michael@example.com',
      goal: 'Athletic Performance',
      progress: 'Ahead',
      lastActivity: '3 hours ago',
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getProgressBadge = (progress: string) => {
    switch (progress) {
      case 'On Track':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">On Track</Badge>;
      case 'Behind':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Behind</Badge>;
      case 'Ahead':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Ahead</Badge>;
      default:
        return <Badge variant="outline">{progress}</Badge>;
    }
  };

  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Trainer Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="/avatar.png" />
                      <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">{student.name}</h4>
                      <p className="text-sm text-muted-foreground">{student.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Goal: {student.goal}</p>
                      <p className="text-xs text-muted-foreground">Last active: {student.lastActivity}</p>
                    </div>
                    {getProgressBadge(student.progress)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
};

export default TrainerDashboard;
