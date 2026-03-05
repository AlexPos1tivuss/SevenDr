import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, MessageSquare, Clock, User } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chats = [], isLoading: chatsLoading } = useQuery<Chat[]>({
    queryKey: ["/api/chats"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/chats/${selectedChatId}/messages`],
    enabled: !!selectedChatId,
    refetchInterval: 5000,
  });

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sortedMessages.length]);

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { chatId: number; content: string }) => {
      return await apiRequest("POST", `/api/chats/${data.chatId}/messages`, {
        content: data.content,
        senderId: user?.id,
      });
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: [`/api/chats/${selectedChatId}/messages`] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: () => {
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
      return format(new Date(dateString), "dd MMM, HH:mm", { locale: ru });
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="h-4 w-4" />
              Чаты
            </CardTitle>
            <CardDescription className="text-xs">
              Активных: {chats.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0 max-h-[580px] overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <MessageSquare className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">Нет активных чатов</p>
                </div>
              ) : (
                chats.map((chat: Chat) => (
                  <div
                    key={chat.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedChatId === chat.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""
                    }`}
                    onClick={() => setSelectedChatId(chat.id)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-3 w-3 text-gray-400" />
                      <span className="font-medium text-sm truncate">
                        {chat.userEmail || `Пользователь ${chat.userId}`}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs mb-1">
                      Заказ #{chat.orderId}
                    </Badge>
                    {chat.lastMessage && (
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {chat.lastMessage}
                      </p>
                    )}
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDate(chat.lastMessageAt || chat.createdAt)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedChatId ? (
            <>
              <CardHeader className="flex-shrink-0 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Заказ #{chats.find((c: Chat) => c.id === selectedChatId)?.orderId}
                </CardTitle>
                <CardDescription className="text-xs">
                  {chats.find((c: Chat) => c.id === selectedChatId)?.userEmail}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messagesLoading ? (
                    <div className="text-center text-gray-500 py-8 text-sm">
                      Загрузка сообщений...
                    </div>
                  ) : sortedMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">Сообщений пока нет</p>
                    </div>
                  ) : (
                    sortedMessages.map((message: Message) => {
                      const isAdmin = message.senderId === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isAdmin ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] px-3 py-2 rounded-lg ${
                              isAdmin
                                ? "bg-primary text-white rounded-br-none"
                                : "bg-gray-100 text-gray-900 rounded-bl-none"
                            }`}
                          >
                            {!isAdmin && (
                              <p className="text-xs font-medium text-gray-600 mb-1">
                                {message.senderEmail}
                              </p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                isAdmin ? "text-white/60" : "text-gray-400"
                              }`}
                            >
                              {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <div className="border-t p-3 flex-shrink-0">
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
                      className="flex-1 min-h-[44px] max-h-[100px] resize-none border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      size="sm"
                      className="self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="font-medium mb-1">Выберите чат</p>
                <p className="text-sm">Выберите чат из списка слева</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
