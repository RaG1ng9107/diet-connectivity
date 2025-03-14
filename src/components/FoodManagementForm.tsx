
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/data/foodDatabase';
import { generateId } from '@/utils/dataUtils';
import { Plus, Utensils } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface FoodManagementFormProps {
  onAddFood: (food: FoodItem) => void;
}

const FoodManagementForm: React.FC<FoodManagementFormProps> = ({ onAddFood }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FoodItem['category']>('other');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [recommendedServing, setRecommendedServing] = useState('');
  const [servingUnit, setServingUnit] = useState<FoodItem['servingUnit']>('g');
  const [trainerNotes, setTrainerNotes] = useState('');
  
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setCategory('other');
    setCaloriesPer100g('');
    setProteinPer100g('');
    setCarbsPer100g('');
    setFatPer100g('');
    setRecommendedServing('');
    setServingUnit('g');
    setTrainerNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !caloriesPer100g || !recommendedServing) {
      toast({
        title: 'Missing Information',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    const newFood: FoodItem = {
      id: generateId(),
      name,
      category,
      caloriesPer100g: Number(caloriesPer100g),
      proteinPer100g: Number(proteinPer100g),
      carbsPer100g: Number(carbsPer100g),
      fatPer100g: Number(fatPer100g),
      recommendedServing: Number(recommendedServing),
      servingUnit,
      trainerNotes: trainerNotes.trim() || undefined,
    };
    
    onAddFood(newFood);
    toast({
      title: 'Food Item Added',
      description: `${name} has been added to the food database.`,
    });
    
    resetForm();
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Add Food Item
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Utensils className="mr-2 h-5 w-5" />
              Add Food to Database
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Food Name*</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Food Category</Label>
                <Select value={category} onValueChange={(value: FoodItem['category']) => setCategory(value)}>
                  <SelectTrigger id="category" className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protein">Protein</SelectItem>
                    <SelectItem value="carbs">Carbs</SelectItem>
                    <SelectItem value="fat">Fat</SelectItem>
                    <SelectItem value="vegetable">Vegetable</SelectItem>
                    <SelectItem value="fruit">Fruit</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="calories">Calories per 100g*</Label>
                <Input 
                  id="calories" 
                  type="number" 
                  value={caloriesPer100g} 
                  onChange={(e) => setCaloriesPer100g(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="protein">Protein per 100g (g)</Label>
                <Input 
                  id="protein" 
                  type="number" 
                  value={proteinPer100g} 
                  onChange={(e) => setProteinPer100g(e.target.value)} 
                  min="0"
                  step="0.1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="carbs">Carbs per 100g (g)</Label>
                <Input 
                  id="carbs" 
                  type="number" 
                  value={carbsPer100g} 
                  onChange={(e) => setCarbsPer100g(e.target.value)} 
                  min="0"
                  step="0.1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="fat">Fat per 100g (g)</Label>
                <Input 
                  id="fat" 
                  type="number" 
                  value={fatPer100g} 
                  onChange={(e) => setFatPer100g(e.target.value)} 
                  min="0"
                  step="0.1"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="recommendedServing">Recommended Serving*</Label>
                <Input 
                  id="recommendedServing" 
                  type="number" 
                  value={recommendedServing} 
                  onChange={(e) => setRecommendedServing(e.target.value)} 
                  required 
                  min="0"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="servingUnit">Serving Unit</Label>
                <Select value={servingUnit} onValueChange={(value: FoodItem['servingUnit']) => setServingUnit(value)}>
                  <SelectTrigger id="servingUnit" className="mt-1">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">Grams (g)</SelectItem>
                    <SelectItem value="ml">Milliliters (ml)</SelectItem>
                    <SelectItem value="serving">Servings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2">
                <Label htmlFor="trainerNotes">Trainer Notes (optional)</Label>
                <Textarea 
                  id="trainerNotes" 
                  value={trainerNotes} 
                  onChange={(e) => setTrainerNotes(e.target.value)} 
                  className="mt-1"
                  placeholder="Add notes about this food (nutrition benefits, recommended pairings, etc.)"
                />
              </div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Food Item</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FoodManagementForm;
