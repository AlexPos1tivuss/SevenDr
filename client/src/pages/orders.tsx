import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@shared/schema";
import { AdminOrdersPage } from "./admin-orders";
import { Eye } from "lucide-react";

export function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Если администратор, показываем админ-панель
  if (user?.isAdmin) {
    return <AdminOrdersPage />;
  }

  const { data: orders = [], isLoading } = useQuery({
    queryKey: [`/api/orders/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      "В обработке": "bg-yellow-100 text-yellow-800",
      "Собирается": "bg-blue-100 text-blue-800",
      "Доставляется": "bg-purple-100 text-purple-800",
      "Подтверждение": "bg-orange-100 text-orange-800",
      "Завершен": "bg-green-100 text-green-800",
      "Новый": "bg-gray-100 text-gray-800"
    };
    
    return (
      <Badge className={statusColors[status] || "bg-gray-100 text-gray-800"}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка заказов...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-dark mb-8">Мои заказы</h2>
      
      {orders.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          У вас пока нет заказов
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order: Order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-dark">Заказ #{order.id}</h3>
                    <p className="text-gray-600">
                      Дата: {formatDate(order.createdAt!)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {order.total} BYN
                    </div>
                    <div className="mt-2">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Адрес доставки: {order.deliveryAddress}
                  </p>
                  {order.deliveryDate && (
                    <p className="text-sm text-gray-600">
                      Дата доставки: {order.deliveryDate}
                    </p>
                  )}
                </div>
                <Button
                  onClick={() => handleOrderClick(order)}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Подробнее
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOrderModalOpen} onOpenChange={setIsOrderModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Подробности заказа #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Информация о заказе</h4>
                  <p className="text-sm text-gray-600">Дата: {formatDate(selectedOrder.createdAt!)}</p>
                  <p className="text-sm text-gray-600">Сумма: {selectedOrder.total} BYN</p>
                  <div className="mt-2">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Доставка</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress}</p>
                  {selectedOrder.deliveryDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Дата доставки: {selectedOrder.deliveryDate}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Товары в заказе</h4>
                <div className="space-y-3">
                  {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Количество: {item.quantity} шт</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)} BYN</p>
                        <p className="text-sm text-gray-600">{item.price} BYN за шт</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
