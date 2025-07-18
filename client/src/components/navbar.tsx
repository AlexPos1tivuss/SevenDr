import { Button } from "@/components/ui/button";
import { ShoppingCart, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import logoSvg from "@/assets/logo.svg";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img src={logoSvg} alt="Семь Драконов" className="w-10 h-10" />
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
              <button
                onClick={() => onNavigate("orders")}
                className={`text-dark hover:text-primary transition-colors duration-200 font-medium ${
                  currentPage === "orders" ? "text-primary" : ""
                }`}
              >
                Мои заказы
              </button>
              <button
                onClick={() => onNavigate("admin")}
                className={`text-dark hover:text-primary transition-colors duration-200 font-medium ${
                  currentPage === "admin" ? "text-primary" : ""
                }`}
              >
                Администратор
              </button>
              <div className="flex items-center space-x-3">
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
                <Button
                  onClick={logout}
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
