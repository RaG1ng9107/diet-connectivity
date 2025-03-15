
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';

interface AdminUserListProps {
  role: 'student' | 'trainer';
}

const AdminUserList: React.FC<AdminUserListProps> = ({ role }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { getAllStudents, getAllTrainers } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  
  useEffect(() => {
    if (role === 'student') {
      const students = getAllStudents('all');
      setUsers(students);
    } else {
      const trainers = getAllTrainers();
      setUsers(trainers);
    }
  }, [role, getAllStudents, getAllTrainers]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">
            {role === 'student' ? 'All Students' : 'All Trainers'}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Search ${role}s...`}
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                {role === 'student' && (
                  <>
                    <TableHead>Status</TableHead>
                    <TableHead>Trainer</TableHead>
                    <TableHead>Dietary Pref</TableHead>
                    <TableHead>Goal</TableHead>
                    <TableHead className="text-right">Calories</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    {role === 'student' && (
                      <>
                        <TableCell>
                          {user.status === 'active' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">Active</Badge>
                          )}
                          {user.status === 'pending' && (
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>
                          )}
                          {user.status === 'inactive' && (
                            <Badge variant="outline" className="bg-red-50 text-red-700">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.trainer || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {user.studentDetails?.dietaryPreference 
                            ? user.studentDetails.dietaryPreference.charAt(0).toUpperCase() + 
                              user.studentDetails.dietaryPreference.slice(1)
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {user.studentDetails?.personalGoal
                            ? user.studentDetails.personalGoal.split('-').map(
                                word => word.charAt(0).toUpperCase() + word.slice(1)
                              ).join(' ')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.studentDetails?.macroGoals?.calories || 'N/A'}
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={role === 'student' ? 7 : 2} className="text-center py-6 text-muted-foreground">
                    No {role}s found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminUserList;
