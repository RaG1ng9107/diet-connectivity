
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  ChevronRight, 
  TrendingUp, 
  TrendingDown, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  XCircle 
} from 'lucide-react';
import AddStudentForm from './AddStudentForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  lastActive: string;
  status: 'on-track' | 'off-track' | 'new';
  calorieTarget: number;
  currentCalories: number;
  status?: 'pending' | 'active' | 'inactive';
  firstLogin?: boolean;
}

interface StudentListProps {
  students: Student[];
  onStudentSelect: (student: Student) => void;
}

const StudentList: React.FC<StudentListProps> = ({ students, onStudentSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const { resetStudentPassword, toggleStudentStatus, user } = useAuth();
  const { toast } = useToast();

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (student: Student) => {
    // Check for account status first (if available)
    if (student.status === 'pending') {
      return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">First Login Pending</Badge>;
    } else if (student.status === 'inactive') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Inactive</Badge>;
    } else if (student.status === 'active') {
      if (student.status === 'on-track') {
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>;
      } else if (student.status === 'off-track') {
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Off Track</Badge>;
      } else if (student.status === 'new') {
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
      }
    }
    
    // Fall back to the original status if account status is not available
    if (student.status === 'on-track') {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">On Track</Badge>;
    } else if (student.status === 'off-track') {
      return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Off Track</Badge>;
    } else if (student.status === 'new') {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">New</Badge>;
    }
    
    return null;
  };
  
  const getStatusIcon = (student: Student) => {
    if (student.status === 'pending') {
      return <Clock className="h-4 w-4 text-amber-500" />;
    } else if (student.status === 'inactive') {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else if (student.status === 'active') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    return null;
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

  const handleResetPassword = async (studentId: string, studentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const newPassword = await resetStudentPassword(studentId);
      
      toast({
        title: 'Password Reset',
        description: `New temporary password for ${studentName}: ${newPassword}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reset password',
        variant: 'destructive',
      });
    }
  };
  
  const handleToggleStatus = async (studentId: string, currentStatus: string, studentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
    const action = newStatus === 'active' ? 'activated' : 'deactivated';
    
    try {
      await toggleStudentStatus(studentId, newStatus as 'active' | 'inactive' | 'pending');
      
      toast({
        title: `Account ${action}`,
        description: `${studentName}'s account has been ${action}`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action.slice(0, -1)} account`,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold">Your Students</CardTitle>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-8 gap-1"
              onClick={() => setShowAddForm(true)}
            >
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
                      <div className="font-medium flex items-center gap-2">
                        {student.name}
                        {getStatusIcon(student)}
                      </div>
                      <div className="text-sm text-muted-foreground">Last active: {student.lastActive}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center">
                      {getStatusBadge(student)}
                    </div>
                    <div className="hidden sm:flex items-center gap-1 text-sm">
                      {getCalorieIcon(student.currentCalories, student.calorieTarget)}
                      <span>{student.currentCalories}/{student.calorieTarget} cal</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="hidden sm:flex h-8"
                        onClick={(e) => handleResetPassword(student.id, student.name, e)}
                      >
                        Reset PW
                      </Button>
                      {student.status !== 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`hidden sm:flex h-8 ${student.status === 'inactive' ? 'text-green-600' : 'text-red-600'}`}
                          onClick={(e) => handleToggleStatus(student.id, student.status || 'active', student.name, e)}
                        >
                          {student.status === 'inactive' ? 'Activate' : 'Deactivate'}
                        </Button>
                      )}
                    </div>
                    
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <AddStudentForm 
        isOpen={showAddForm} 
        onClose={() => setShowAddForm(false)} 
      />
    </>
  );
};

export default StudentList;
