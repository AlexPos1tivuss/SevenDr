import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Chat, Message, Order } from "@shared/schema";

export function AdminPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const { data: chats = [] } = useQuery({
    queryKey: user?.isAdmin ? ["/api/chats"] : [`/api/chats/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: orders = [] } = useQuery({
    queryKey: user?.isAdmin ? ["/api/orders"] : [`/api/orders/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: messages = [] } = useQuery({
    queryKey: [`/api/chats/${activeChatId}/messages`],
    enabled: !!activeChatId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", `/api/chats/${activeChatId}/messages`, {
        senderId: user?.id,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`/api/chats/${activeChatId}/messages`],
      });
      setNewMessage("");
    },
  });

  const handleSendMessage = () => {
    if (newMessage.trim() && activeChatId) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  const getOrderForChat = (chat: Chat) => {
    return orders.find((order: Order) => order.id === chat.orderId);
  };

  const activeChat = chats.find((chat: Chat) => chat.id === activeChatId);
  const activeChatOrder = activeChat ? getOrderForChat(activeChat) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-dark mb-8">
        {user?.isAdmin ? "Панель администратора" : "Чат с администратором"}
      </h2>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Chat List */}
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Чаты</h3>
              {chats.length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                  Нет активных чатов
                </div>
              ) : (
                <div className="space-y-2">
                  {chats.map((chat: Chat) => {
                    const order = getOrderForChat(chat);
                    return (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChatId(chat.id)}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                          activeChatId === chat.id
                            ? "bg-primary text-white"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className="font-semibold text-sm">
                          Заказ #{chat.orderId}
                        </div>
                        <div className="text-xs opacity-75">
                          {new Date(chat.createdAt!).toLocaleDateString("ru-RU")}
                        </div>
                        {order && (
                          <div className="text-xs opacity-75">
                            {Number(order.total).toFixed(2)} руб
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Chat Window */}
            <div className="md:col-span-2">
              <div className="border border-gray-200 rounded-lg h-96 flex flex-col">
                <div className="bg-gray-50 p-4 border-b">
                  <h4 className="font-semibold">
                    {activeChatId
                      ? `Заказ #${activeChat?.orderId}${
                          activeChatOrder ? ` (${Number(activeChatOrder.total).toFixed(2)} руб)` : ""
                        }`
                      : "Выберите чат"}
                  </h4>
                </div>
                
                <div className="flex-1 p-4 overflow-y-auto">
                  {!activeChatId ? (
                    <div className="text-gray-500 text-center">
                      Выберите чат для начала переписки
                    </div>
                  ) : messages.length === 0 ? (
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
                
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Напишите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={!activeChatId}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!activeChatId || !newMessage.trim()}
                      className="bg-primary hover:bg-primary/90"
                    >
                      📤
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
