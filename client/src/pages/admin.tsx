import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminOrdersPage } from "./admin-orders";
import { AdminUsersPage } from "./admin-users";
import { AdminShopPage } from "./admin-shop";
import { AdminChatsPage } from "./admin-chats";
import { MessageSquare, Package, Users, ShoppingCart } from "lucide-react";

export function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-dark mb-8">Панель администратора</h2>
      
      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Заказы и статистика
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Пользователи
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Чат с заказчиками
          </TabsTrigger>
          <TabsTrigger value="products" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Товары
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-6">
          <AdminOrdersPage />
        </TabsContent>
        
        <TabsContent value="users" className="mt-6">
          <AdminUsersPage />
        </TabsContent>
        
        <TabsContent value="chats" className="mt-6">
          <AdminChatsPage />
        </TabsContent>
        
        <TabsContent value="products" className="mt-6">
          <AdminShopPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}