
import React, { useState, useEffect } from 'react';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import AdminUserList from '@/components/AdminUserList';
import { useFoodItems } from '@/hooks/useFoodItems';
import { useFoodOperations } from '@/hooks/useFoodOperations';
import { FoodItem } from '@/data/foodDatabase';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const { foodItems, isLoading } = useFoodItems();
  const [foodItemsState, setFoodItemsState] = useState<FoodItem[]>([]);
  const { user } = useAuth();
  
  // Sync the foodItems from the hook with our local state when they change
  useEffect(() => {
    if (foodItems) {
      setFoodItemsState(foodItems);
    }
  }, [foodItems]);
  
  const { addFood, deleteFood, isSubmitting } = useFoodOperations(foodItemsState, setFoodItemsState);
  
  const handleAddFood = async (food: FoodItem) => {
    // Since we're in the admin dashboard, we can proceed even without a user ID
    // The backend will still ensure proper permissions through RLS
    return addFood(food, user?.id);
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
              foods={foodItemsState}
              onAddFood={handleAddFood}
              onDeleteFood={deleteFood}
              isLoading={isLoading || isSubmitting}
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
