
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FoodItem } from '@/data/foodDatabase';
import { Search, Edit, Trash2, Filter, Loader2 } from 'lucide-react';
import FoodManagementForm from './FoodManagementForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface FoodDatabaseManagerProps {
  foods: FoodItem[];
  onAddFood: (food: FoodItem) => void;
  onDeleteFood: (foodId: string) => void;
  isAdmin?: boolean;
  isLoading?: boolean;
}

const FoodDatabaseManager: React.FC<FoodDatabaseManagerProps> = ({ 
  foods, 
  onAddFood,
  onDeleteFood,
  isAdmin = false,
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const { toast } = useToast();
  
  const handleDelete = (foodId: string, foodName: string) => {
    if (confirm(`Are you sure you want to delete ${foodName}?`)) {
      onDeleteFood(foodId);
      toast({
        title: 'Food Item Deleted',
        description: `${foodName} has been removed from the database.`,
        variant: 'destructive',
      });
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || food.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (category: FoodItem['category']) => {
    const colors: Record<FoodItem['category'], { bg: string; text: string }> = {
      protein: { bg: 'bg-red-100', text: 'text-red-800' },
      carbs: { bg: 'bg-amber-100', text: 'text-amber-800' },
      fat: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      vegetable: { bg: 'bg-green-100', text: 'text-green-800' },
      fruit: { bg: 'bg-purple-100', text: 'text-purple-800' },
      dairy: { bg: 'bg-blue-100', text: 'text-blue-800' },
      other: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    
    return (
      <Badge variant="outline" className={`${colors[category].bg} ${colors[category].text}`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <CardTitle className="text-lg font-semibold">Food Database</CardTitle>
          {isAdmin && <FoodManagementForm onAddFood={onAddFood} />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search foods..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {categoryFilter === 'all' 
                    ? 'All Categories' 
                    : categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup value={categoryFilter} onValueChange={setCategoryFilter}>
                <DropdownMenuRadioItem value="all">All Categories</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="protein">Protein</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="carbs">Carbs</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fat">Fat</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="vegetable">Vegetable</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="fruit">Fruit</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dairy">Dairy</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="other">Other</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="border rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-lg font-medium">Loading food database...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein</TableHead>
                  <TableHead className="text-right">Carbs</TableHead>
                  <TableHead className="text-right">Fat</TableHead>
                  {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFoods.length > 0 ? (
                  filteredFoods.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell className="font-medium">{food.name}</TableCell>
                      <TableCell>{getCategoryBadge(food.category)}</TableCell>
                      <TableCell className="text-right">{food.caloriesPer100g} kcal</TableCell>
                      <TableCell className="text-right">{food.proteinPer100g}g</TableCell>
                      <TableCell className="text-right">{food.carbsPer100g}g</TableCell>
                      <TableCell className="text-right">{food.fatPer100g}g</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={() => toast({
                              title: 'Coming Soon',
                              description: 'Edit functionality will be available in a future update'
                            })}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDelete(food.id, food.name)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 7 : 6} className="text-center py-6 text-muted-foreground">
                      {searchQuery || categoryFilter !== 'all' 
                        ? 'No food items found matching your search criteria.'
                        : 'No food items in the database. Add some to get started!'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodDatabaseManager;
