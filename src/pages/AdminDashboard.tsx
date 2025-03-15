
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { useMacros } from '@/hooks/useMacros';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import AdminUserList from '@/components/AdminUserList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FoodItem } from '@/data/foodDatabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const macros = useMacros();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('food_items')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data from Supabase to match our FoodItem type
          const transformedData: FoodItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            caloriesPer100g: item.calories_per_100g,
            proteinPer100g: parseFloat(item.protein_per_100g),
            carbsPer100g: parseFloat(item.carbs_per_100g),
            fatPer100g: parseFloat(item.fat_per_100g),
            servingSize: item.recommended_serving || 100,
            servingUnit: item.serving_unit || 'g',
          }));
          
          setFoodItems(transformedData);
        }
      } catch (error) {
        console.error('Error fetching food items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load food database. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFoodItems();
  }, [toast]);
  
  const handleAddFood = async (food: FoodItem) => {
    try {
      // Insert the new food item into Supabase
      const { data, error } = await supabase
        .from('food_items')
        .insert({
          id: food.id,
          name: food.name,
          category: food.category,
          calories_per_100g: food.caloriesPer100g,
          protein_per_100g: food.proteinPer100g,
          carbs_per_100g: food.carbsPer100g,
          fat_per_100g: food.fatPer100g,
          recommended_serving: food.servingSize,
          serving_unit: food.servingUnit,
          created_by: user?.id
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add to local state for immediate UI update
      if (data) {
        const newFood: FoodItem = {
          id: data[0].id,
          name: data[0].name,
          category: data[0].category,
          caloriesPer100g: data[0].calories_per_100g,
          proteinPer100g: parseFloat(data[0].protein_per_100g),
          carbsPer100g: parseFloat(data[0].carbs_per_100g),
          fatPer100g: parseFloat(data[0].fat_per_100g),
          servingSize: data[0].recommended_serving || 100,
          servingUnit: data[0].serving_unit || 'g',
        };
        
        setFoodItems(prevFoods => [...prevFoods, newFood]);
        
        toast({
          title: 'Success',
          description: `${food.name} has been added to the database.`,
        });
      }
    } catch (error) {
      console.error('Error adding food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to add food item. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteFood = async (foodId: string) => {
    try {
      // Delete the food item from Supabase
      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', foodId);
      
      if (error) {
        throw error;
      }
      
      // Remove from local state for immediate UI update
      setFoodItems(prevFoods => prevFoods.filter(food => food.id !== foodId));
      
      toast({
        title: 'Success',
        description: 'Food item has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting food item:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete food item. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  return (
    <PageTransition>
      <div className="container max-w-6xl py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid gap-6 mb-8">
          <UserProfile />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-4">
            <TabsTrigger value="foods">Food Database</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="trainers">Trainers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="foods">
            <FoodDatabaseManager 
              foods={foodItems}
              onAddFood={handleAddFood}
              onDeleteFood={handleDeleteFood}
              isLoading={isLoading}
              isAdmin={true}
            />
          </TabsContent>
          
          <TabsContent value="students">
            <AdminUserList role="student" />
          </TabsContent>
          
          <TabsContent value="trainers">
            <AdminUserList role="trainer" />
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
};

export default AdminDashboard;
