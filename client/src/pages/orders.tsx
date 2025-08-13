import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { Order, Chat, Message } from "@shared/schema";
import { AdminOrdersPage } from "./admin-orders";
import { Eye, MessageCircle } from "lucide-react";

export function OrdersPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const { data: orders = [], isLoading } = useQuery({
    queryKey: [`/api/orders/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: chats = [] } = useQuery({
    queryKey: [`/api/chats/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: [`/api/chats/${selectedChat?.id}/messages`],
    enabled: !!selectedChat?.id,
  });

  // Если администратор, показываем админ-панель
  if (user?.isAdmin) {
    return <AdminOrdersPage />;
  }

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleChatClick = (order: Order) => {
    const chat = chats.find((c: Chat) => c.orderId === order.id);
    if (chat) {
      setSelectedChat(chat);
      setIsChatModalOpen(true);
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", `/api/chats/${selectedChat?.id}/messages`, {
        senderId: user?.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/chats/${selectedChat?.id}/messages`],
      });
      setNewMessage("");
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat?.id) {
      sendMessageMutation.mutate(newMessage.trim());
    }
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
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleOrderClick(order)}
                    className="bg-secondary hover:bg-secondary/90"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Подробнее
                  </Button>
                  {chats.some((c: Chat) => c.orderId === order.id) && (
                    <Button
                      onClick={() => handleChatClick(order)}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Чат
                    </Button>
                  )}
                </div>
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
                        <p className="font-semibold">{(typeof item.price === 'object' ? parseFloat(item.price.selectedPrice || Object.values(item.price)[0]) : parseFloat(item.price) * item.quantity).toFixed(2)} BYN</p>
                        <p className="text-sm text-gray-600">{typeof item.price === 'object' ? `${parseFloat(item.price.selectedPrice || Object.values(item.price)[0])} BYN за шт` : `${item.price} BYN за шт`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Modal */}
      <Dialog open={isChatModalOpen} onOpenChange={setIsChatModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Чат по заказу #{selectedChat?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedChat && (
            <div className="flex flex-col h-96">
              <div className="flex-1 p-4 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                {messages.length === 0 ? (
                  <div className="text-gray-500 text-center">
                    Нет сообщений
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg max-w-xs ${
                          message.senderId === user?.id
                            ? "bg-primary text-white ml-auto"
                            : "bg-gray-100"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {new Date(message.createdAt!).toLocaleTimeString("ru-RU")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  placeholder="Напишите сообщение..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                >
                  Отправить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
