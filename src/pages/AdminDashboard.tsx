
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import UserProfile from '@/components/UserProfile';
import PageTransition from '@/components/layout/PageTransition';
import FoodDatabaseManager from '@/components/FoodDatabaseManager';
import { useMacros } from '@/hooks/useMacros';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import AdminUserList from '@/components/AdminUserList';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const macros = useMacros();
  const { user } = useAuth();
  
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
              foods={macros.foodDatabase}
              onAddFood={macros.addFoodItem}
              onDeleteFood={macros.deleteFoodItem}
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
