import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Clock, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface Chat {
  id: number;
  orderId: number;
  userId: number;
  userName?: string;
  userEmail?: string;
  createdAt: string;
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  senderEmail?: string;
}

export function AdminChatsPage() {
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Получаем все чаты
  const { data: chats = [], isLoading: chatsLoading } = useQuery({
    queryKey: ["/api/chats"],
  });

  // Получаем сообщения выбранного чата
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chats", selectedChatId, "messages"],
    enabled: !!selectedChatId,
  });

  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { chatId: number; content: string }) => {
      return await apiRequest(`/api/chats/${data.chatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          content: data.content,
          senderId: 2 // ID администратора
        }),
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedChatId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
      toast({
        title: "Сообщение отправлено",
        description: "Ваше сообщение успешно отправлено клиенту",
      });
    },
    onError: (error) => {
      console.error("Ошибка отправки сообщения:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить сообщение",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!selectedChatId || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      chatId: selectedChatId,
      content: newMessage.trim(),
    });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy, HH:mm", { locale: ru });
    } catch {
      return dateString;
    }
  };

  if (chatsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Загрузка чатов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Список чатов */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Чаты с заказчиками
            </CardTitle>
            <CardDescription>
              Всего активных чатов: {chats.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 max-h-[600px] overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Нет активных чатов</p>
                </div>
              ) : (
                chats.map((chat: Chat) => (
                  <div
                    key={chat.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChatId === chat.id ? "bg-blue-50 border-blue-200" : ""
                    }`}
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-sm">
                            {chat.userEmail || `Пользователь ${chat.userId}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Заказ #{chat.orderId}
                          </Badge>
                        </div>
                        {chat.lastMessage && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {chat.lastMessage}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {formatDate(chat.lastMessageAt || chat.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Окно чата */}
      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedChatId ? (
            <>
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Чат по заказу #{chats.find(c => c.id === selectedChatId)?.orderId}
                </CardTitle>
                <CardDescription>
                  Клиент: {chats.find(c => c.id === selectedChatId)?.userEmail}
                </CardDescription>
              </CardHeader>
              
              {/* Сообщения */}
              <CardContent className="flex-1 flex flex-col p-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
                  {messagesLoading ? (
                    <div className="text-center text-gray-500 py-8">
                      Загрузка сообщений...
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p>Сообщений пока нет</p>
                    </div>
                  ) : (
                    messages.map((message: Message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderEmail?.includes("admin") ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderEmail?.includes("admin")
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderEmail?.includes("admin")
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {formatDate(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Форма отправки сообщения */}
                <div className="border-t p-4 flex-shrink-0">
                  <div className="flex gap-2">
                    <textarea
                      placeholder="Напишите сообщение..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="flex-1 min-h-[60px] resize-none border border-gray-300 rounded-md p-2"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Enter для отправки, Shift+Enter для новой строки
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
                <p>Выберите чат из списка слева, чтобы начать общение с клиентом</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}