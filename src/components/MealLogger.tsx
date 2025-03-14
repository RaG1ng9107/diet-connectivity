
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateId } from '@/utils/dataUtils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { SearchIcon } from 'lucide-react';

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
  const [date, setDate] = useState<Date>(new Date());
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('g');
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setMealType('');
    setDate(new Date());
    setQuantity('');
    setUnit('g');
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
      timestamp: date,
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
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Log Meal
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log a Meal</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Meal Name</Label>
                <div className="relative mt-1">
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="e.g., Chicken Salad"
                    className="pl-8"
                  />
                  <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="mealDate">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="mealType">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType} required>
                  <SelectTrigger id="mealType" className="mt-1">
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
              
              <div className="col-span-2 grid grid-cols-3 gap-2 items-end">
                <div className="col-span-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    required 
                    min="0"
                    className="mt-1"
                    placeholder="Amount"
                  />
                </div>
                <div>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="g">grams</SelectItem>
                      <SelectItem value="ml">ml</SelectItem>
                      <SelectItem value="serving">serving</SelectItem>
                      <SelectItem value="oz">oz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="calories">Calories</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  value={calories} 
                  onChange={(e) => setCalories(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input 
                  id="protein" 
                  type="number" 
                  value={protein} 
                  onChange={(e) => setProtein(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input 
                  id="carbs" 
                  type="number" 
                  value={carbs} 
                  onChange={(e) => setCarbs(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input 
                  id="fat" 
                  type="number" 
                  value={fat} 
                  onChange={(e) => setFat(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
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
