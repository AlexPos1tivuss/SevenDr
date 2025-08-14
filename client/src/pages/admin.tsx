import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOrdersPage } from "./admin-orders";
import { AdminUsersPage } from "./admin-users";
import { AdminShopPage } from "./admin-shop";

export function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-dark mb-8">Панель администратора</h2>
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Статистика и заказы</TabsTrigger>
          <TabsTrigger value="users">Управление пользователями</TabsTrigger>
          <TabsTrigger value="shop">Управление товарами</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <AdminOrdersPage />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <AdminUsersPage />
        </TabsContent>
        
        <TabsContent value="shop" className="mt-6">
          <AdminShopPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}