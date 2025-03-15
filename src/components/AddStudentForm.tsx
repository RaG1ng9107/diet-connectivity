
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface AddStudentFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddStudentForm: React.FC<AddStudentFormProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('standard');
  const [personalGoal, setPersonalGoal] = useState('weight-loss');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [proteinGoal, setProteinGoal] = useState('');
  const [carbsGoal, setCarbsGoal] = useState('');
  const [fatGoal, setFatGoal] = useState('');
  
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
    
    if (!calorieGoal) {
      toast({
        title: 'Calorie goal required',
        description: 'Please enter the daily calorie goal',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const tempPassword = `temp${Math.floor(Math.random() * 10000)}`;
      const trainerId = user?.id || '';
      
      const studentDetails = {
        age: age ? parseInt(age) : undefined,
        dietaryPreference: dietaryPreference as any,
        personalGoal: personalGoal as any,
        macroGoals: {
          calories: parseInt(calorieGoal),
          protein: proteinGoal ? parseInt(proteinGoal) : undefined,
          carbs: carbsGoal ? parseInt(carbsGoal) : undefined,
          fat: fatGoal ? parseInt(fatGoal) : undefined,
        }
      };
      
      const result = await addStudent(name, tempPassword, trainerId, studentDetails);
      
      setCredentials(result);
      toast({
        title: 'Success',
        description: 'Student added successfully',
      });
      
      // Reset the form
      setName('');
      setAge('');
      setDietaryPreference('standard');
      setPersonalGoal('weight-loss');
      setCalorieGoal('');
      setProteinGoal('');
      setCarbsGoal('');
      setFatGoal('');
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
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the student's details to create an account.
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min="12"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 30"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dietaryPreference">Dietary Preference</Label>
              <Select 
                value={dietaryPreference}
                onValueChange={setDietaryPreference}
                disabled={isLoading}
              >
                <SelectTrigger id="dietaryPreference">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="keto">Keto</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="personalGoal">Personal Goal</Label>
            <Select 
              value={personalGoal}
              onValueChange={setPersonalGoal}
              disabled={isLoading}
            >
              <SelectTrigger id="personalGoal">
                <SelectValue placeholder="Select goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weight-loss">Weight Loss</SelectItem>
                <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="general-health">General Health</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Daily Macro Goals</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <Label htmlFor="calorieGoal" className="text-xs">Calories (kcal) *</Label>
                <Input
                  id="calorieGoal"
                  type="number"
                  min="1000"
                  max="5000"
                  required
                  value={calorieGoal}
                  onChange={(e) => setCalorieGoal(e.target.value)}
                  placeholder="e.g. 2000"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="proteinGoal" className="text-xs">Protein (g)</Label>
                <Input
                  id="proteinGoal"
                  type="number"
                  min="0"
                  max="400"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(e.target.value)}
                  placeholder="e.g. 150"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="carbsGoal" className="text-xs">Carbs (g)</Label>
                <Input
                  id="carbsGoal"
                  type="number"
                  min="0"
                  max="600"
                  value={carbsGoal}
                  onChange={(e) => setCarbsGoal(e.target.value)}
                  placeholder="e.g. 200"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="fatGoal" className="text-xs">Fat (g)</Label>
                <Input
                  id="fatGoal"
                  type="number"
                  min="0"
                  max="200"
                  value={fatGoal}
                  onChange={(e) => setFatGoal(e.target.value)}
                  placeholder="e.g. 65"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="mt-6">
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
