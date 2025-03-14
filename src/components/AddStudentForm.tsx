
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);
  const { addStudent, user } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: 'Student name required',
        description: 'Please enter the student\'s name',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const tempPassword = `temp${Math.floor(Math.random() * 10000)}`;
      const trainerId = user?.id || '';
      
      const result = await addStudent(name, tempPassword, trainerId);
      
      setCredentials(result);
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
      
      // Reset the form
      setName('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add student',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setCredentials(null);
    onClose();
  };

  return (
    <Dialog open={isOpen && !credentials} onOpenChange={() => !isLoading && handleClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's name to create an account.
            A temporary password will be generated automatically.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              disabled={isLoading}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Student'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      
      {/* Credentials Sheet */}
      <Sheet open={!!credentials} onOpenChange={(open) => !open && handleClose()}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Student Added Successfully</SheetTitle>
            <SheetDescription>
              Share these credentials with the student for their first login.
              They will be required to change their password and add their email address.
            </SheetDescription>
          </SheetHeader>
          
          <div className="my-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Username/Email</h3>
              <div className="rounded-md bg-secondary p-3 font-mono text-sm">
                {credentials?.username}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Temporary Password</h3>
              <div className="rounded-md bg-secondary p-3 font-mono text-sm">
                {credentials?.password}
              </div>
            </div>
          </div>
          
          <SheetFooter>
            <Button onClick={handleClose}>Done</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </Dialog>
  );
};

export default AddStudentForm;
