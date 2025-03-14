
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronRight, TrendingUp, TrendingDown, UserPlus } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  lastActive: string;
  status: 'on-track' | 'off-track' | 'new';
  calorieTarget: number;
  currentCalories: number;
}

interface StudentListProps {
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onStudentSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'on-track':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>;
      case 'off-track':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Off Track</Badge>;
      case 'new':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      default:
        return null;
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  const getCalorieIcon = (current: number, target: number) => {
    const ratio = current / target;
    
    if (ratio > 1.1) {
      return <TrendingUp className="h-4 w-4 text-red-500" />;
    } else if (ratio < 0.9) {
      return <TrendingDown className="h-4 w-4 text-amber-500" />;
    } else {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Your Students</CardTitle>
          <Button size="sm" variant="outline" className="h-8 gap-1">
            <UserPlus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Student</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="space-y-3 mt-2">
          {filteredStudents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No students found matching your search
            </div>
          ) : (
            filteredStudents.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 hover:bg-secondary/50 rounded-md cursor-pointer transition-colors"
                onClick={() => onStudentSelect(student)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={student.avatar} />
                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{student.name}</div>
                    <div className="text-sm text-muted-foreground">Last active: {student.lastActive}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex items-center">
                    {getStatusBadge(student.status)}
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-sm">
                    {getCalorieIcon(student.currentCalories, student.calorieTarget)}
                    <span>{student.currentCalories}/{student.calorieTarget} cal</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentList;
