import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import logoSvg from "@/assets/logo.svg";
import { useEffect, useReducer } from "react";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  
  // Слушаем обновления корзины
  useEffect(() => {
    const handleCartUpdate = () => {
      // Принудительно обновляем компонент
      forceUpdate();
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);
  
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => onNavigate("landing")}
          >
            <div className="w-10 h-10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 80" fill="currentColor">
                <path d="M20 50c-5 0-8 3-8 7s3 7 8 7c3 0 5-1 7-3l2 2c8-3 15-8 20-15 2-3 3-6 3-9 0-8-6-14-14-14-4 0-8 2-10 5-1-2-3-3-5-3-3 0-5 2-5 5 0 2 1 3 2 4z"/>
                <path d="M45 35c2-4 6-7 11-7 6 0 11 4 11 10 0 2-1 4-2 6-4 6-10 10-17 12l-3-2c-1 1-2 2-4 2-4 0-7-3-7-7s3-7 7-7c2 0 3 1 4 2z"/>
                <path d="M75 25c8 0 15 6 15 14 0 3-1 6-3 8-5 8-13 13-22 16l-5-3c-2 2-5 3-8 3-6 0-11-4-11-10s5-10 11-10c3 0 6 1 8 3l5-3c4-2 7-5 9-8 1-2 1-4 1-6 0-2-2-4-4-4z"/>
                <path d="M95 40c0-3 2-5 5-5s5 2 5 5-2 5-5 5-5-2-5-5z"/>
                <path d="M30 25c3 0 5 2 5 5s-2 5-5 5-5-2-5-5 2-5 5-5z"/>
                <path d="M15 35c2 0 4 1 4 3s-2 3-4 3-4-1-4-3 2-3 4-3z"/>
                <path d="M85 15c4 0 7 3 7 7s-3 7-7 7-7-3-7-7 3-7 7-7z"/>
              </svg>
            </div>
            <h1 className="text-xl font-display font-bold text-dark">Семь Драконов</h1>
          </div>
          
          {user ? (
            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate("shop")}
                className={`text-dark hover:text-primary transition-colors duration-200 font-medium ${
                  currentPage === "shop" ? "text-primary" : ""
                }`}
              >
                Магазин
              </button>
              {!user.isAdmin && (
                <button
                  onClick={() => onNavigate("orders")}
                  className={`text-dark hover:text-primary transition-colors duration-200 font-medium ${
                    currentPage === "orders" ? "text-primary" : ""
                  }`}
                >
                  Мои заказы
                </button>
              )}
              {user.isAdmin && (
                <button
                  onClick={() => onNavigate("admin")}
                  className={`text-dark hover:text-primary transition-colors duration-200 font-medium ${
                    currentPage === "admin" ? "text-primary" : ""
                  }`}
                >
                  Админ-панель
                </button>
              )}
              <div className="flex items-center space-x-3">
                {!user.isAdmin && (
                  <button
                    onClick={() => onNavigate("cart")}
                    className="relative"
                  >
                    <ShoppingCart className="w-5 h-5 text-dark" />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </button>
                )}
                <Button
                  onClick={() => {
                    logout();
                    onNavigate("landing");
                  }}
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => onNavigate("auth")}
                className="bg-primary hover:bg-primary/90"
              >
                Войти
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
