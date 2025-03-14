
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/dataUtils';

export interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  mealType: string;
  timestamp: Date;
}

interface MealLoggerProps {
  onAddMeal: (meal: Meal) => void;
}

const MealLogger: React.FC<MealLoggerProps> = ({ onAddMeal }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [mealType, setMealType] = useState('');
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMealType('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMeal: Meal = {
      id: generateId(),
      name,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fat: Number(fat),
      mealType,
      timestamp: new Date(),
    };
    
    onAddMeal(newMeal);
    toast({
      title: 'Meal Added',
      description: `${name} has been added to your log.`,
    });
    
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Log Meal</Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Log a Meal</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Meal Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="e.g., Chicken Salad"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mealType">Meal Type</Label>
              <Select value={mealType} onValueChange={setMealType} required>
                <SelectTrigger id="mealType">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  value={calories} 
                  onChange={(e) => setCalories(e.target.value)} 
                  required 
                  min="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input 
                  id="protein" 
                  type="number" 
                  value={protein} 
                  onChange={(e) => setProtein(e.target.value)} 
                  required 
                  min="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input 
                  id="carbs" 
                  type="number" 
                  value={carbs} 
                  onChange={(e) => setCarbs(e.target.value)} 
                  required 
                  min="0"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input 
                  id="fat" 
                  type="number" 
                  value={fat} 
                  onChange={(e) => setFat(e.target.value)} 
                  required 
                  min="0"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Meal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MealLogger;
