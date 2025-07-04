import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/order-modal";
import { useAuth } from "@/hooks/useAuth";
import { Order } from "@shared/schema";

export function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: [`/api/orders/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
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
                      Дата: {new Date(order.createdAt!).toLocaleDateString("ru-RU")}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {Number(order.total).toFixed(2)} руб
                    </div>
                    <div className="text-sm text-gray-600">Статус: {order.status}</div>
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
                  Подробности
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <OrderModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
      />
    </div>
  );
}
