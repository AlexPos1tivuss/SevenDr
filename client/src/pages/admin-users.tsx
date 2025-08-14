import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { User, Order } from "@shared/schema";
import { Eye, Users, ShoppingBag, Calendar } from "lucide-react";

export function AdminUsersPage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: userOrders = [] } = useQuery<Order[]>({
    queryKey: [`/api/users/${selectedUser?.id}/orders`],
    enabled: !!selectedUser?.id,
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTotalSpent = (orders: Order[]) => {
    return orders.reduce((total, order) => total + parseFloat(order.total.toString()), 0).toFixed(2);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "В обработке": "bg-yellow-100 text-yellow-800",
      "Собирается": "bg-blue-100 text-blue-800", 
      "Доставляется": "bg-purple-100 text-purple-800",
      "Подтверждение": "bg-orange-100 text-orange-800",
      "Завершен": "bg-green-100 text-green-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-display font-bold text-dark mb-8">Управление пользователями</h2>
      
      {/* Users Statistics */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Всего пользователей</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Активных пользователей</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user: User) => !user.isAdmin).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Администраторов</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter((user: User) => user.isAdmin).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Список пользователей</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Компания</TableHead>
                <TableHead>Тип</TableHead>
                <TableHead>Дата регистрации</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.companyName || "—"}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "destructive" : "default"}>
                      {user.isAdmin ? "Администратор" : "Клиент"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt?.toString() || "")}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUserClick(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Детали
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* User Details Modal */}
      <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Информация о пользователе</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* User Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Основная информация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="font-medium">ID:</span> {selectedUser.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {selectedUser.email}
                    </div>
                    <div>
                      <span className="font-medium">Компания:</span> {selectedUser.companyName || "Не указано"}
                    </div>
                    <div>
                      <span className="font-medium">Директор:</span> {selectedUser.directorName || "Не указано"}
                    </div>
                    <div>
                      <span className="font-medium">Телефон:</span> {selectedUser.phone || "Не указан"}
                    </div>
                    <div>
                      <span className="font-medium">Адрес:</span> {selectedUser.address || "Не указан"}
                    </div>
                    <div>
                      <span className="font-medium">Тип:</span>{" "}
                      <Badge variant={selectedUser.isAdmin ? "destructive" : "default"}>
                        {selectedUser.isAdmin ? "Администратор" : "Клиент"}
                      </Badge>
                    </div>
                    <div>
                      <span className="font-medium">Дата регистрации:</span> {formatDate(selectedUser.createdAt?.toString() || "")}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Статистика заказов</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{userOrders.length}</div>
                        <div className="text-sm text-gray-600">Всего заказов</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{getTotalSpent(userOrders)} BYN</div>
                        <div className="text-sm text-gray-600">Общая сумма</div>
                      </div>
                      <div className="text-center p-3 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          {userOrders.filter((order: Order) => order.status !== "Завершен").length}
                        </div>
                        <div className="text-sm text-gray-600">Активных заказов</div>
                      </div>
                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {userOrders.filter((order: Order) => order.status === "Завершен").length}
                        </div>
                        <div className="text-sm text-gray-600">Завершенных</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Orders History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">История заказов</CardTitle>
                </CardHeader>
                <CardContent>
                  {userOrders.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      У пользователя пока нет заказов
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID заказа</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead>Сумма</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead>Товаров</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {userOrders.map((order: Order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{formatDate(order.createdAt?.toString() || "")}</TableCell>
                            <TableCell>{order.total?.toString() || "0"} BYN</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(order.status || "")}>
                                {order.status || ""}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {Array.isArray(order.items) ? order.items.length : 0} шт
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}