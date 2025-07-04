import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";

interface AuthPageProps {
  onNavigate: (page: string) => void;
}

export function AuthPage({ onNavigate }: AuthPageProps) {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await apiRequest("POST", "/api/auth/login", { email, password });
      const data = await response.json();
      login(data.user);
      onNavigate("shop");
    } catch (error) {
      setError("Неверный email или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.target as HTMLFormElement);
    
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Ошибка регистрации");
      }

      const data = await response.json();
      login(data.user);
      onNavigate("shop");
    } catch (error) {
      setError("Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold text-dark mb-2">Добро пожаловать!</h2>
              <p className="text-gray-600">Войдите в личный кабинет или зарегистрируйтесь</p>
            </div>
            
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Вход</TabsTrigger>
                <TabsTrigger value="register">Регистрация</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? "Входим..." : "Войти"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="register" className="space-y-4">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="companyName">Название компании</Label>
                      <Input
                        id="companyName"
                        name="companyName"
                        placeholder="ООО Название"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="unp">УНП</Label>
                      <Input
                        id="unp"
                        name="unp"
                        placeholder="123456789"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="directorName">ФИО Директора</Label>
                    <Input
                      id="directorName"
                      name="directorName"
                      placeholder="Иванов Иван Иванович"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="regEmail">Email</Label>
                    <Input
                      id="regEmail"
                      name="email"
                      type="email"
                      placeholder="company@example.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+375 (29) 123-45-67"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Адрес</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="г. Минск, ул. Примерная, д. 1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="logo">Логотип компании</Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                    />
                  </div>
                  <div>
                    <Label htmlFor="regPassword">Пароль</Label>
                    <Input
                      id="regPassword"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isLoading ? "Регистрируем..." : "Зарегистрироваться"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:w-1/2 bg-gradient-to-br from-secondary to-primary p-8 flex items-center justify-center">
            <div className="text-white text-center">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
                alt="Детские игрушки"
                className="rounded-xl shadow-lg mb-6 animate-float"
              />
              <h3 className="text-2xl font-display font-bold mb-4">Более 2000 видов игрушек</h3>
              <p className="text-lg opacity-90 mb-6">
                Развивающие игрушки для детей всех возрастов. Безопасные материалы, яркие цвета, доступные цены.
              </p>
              <div className="flex justify-center space-x-4">
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">🛡️</div>
                  <div className="text-sm">100% безопасно</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">⭐</div>
                  <div className="text-sm">Высокое качество</div>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                  <div className="text-2xl mb-2">❤️</div>
                  <div className="text-sm">Детям нравится</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
