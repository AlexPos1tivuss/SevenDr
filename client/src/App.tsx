import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCartContext";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { LandingPage } from "@/pages/landing";
import { AuthPage } from "@/pages/auth";
import { ShopPage } from "@/pages/shop";
import { OrdersPage } from "@/pages/orders";
import { AdminPage } from "@/pages/admin";
import { AdminShopPage } from "@/pages/admin-shop";
import { AdminOrdersPage } from "@/pages/admin-orders";
import { CartModal } from "@/components/cart-modal";
import { Notification } from "@/components/notification";

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState("landing");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notification, setNotification] = useState({
    message: "",
    type: "success" as "success" | "error",
    isVisible: false,
  });

  const handleNavigate = (page: string) => {
    if (page === "cart") {
      setIsCartOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const showNotification = (message: string, type: "success" | "error" = "success") => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  const renderPage = () => {
    if (!user) {
      switch (currentPage) {
        case "auth":
          return <AuthPage onNavigate={handleNavigate} />;
        default:
          return <LandingPage onNavigate={handleNavigate} />;
      }
    }

    switch (currentPage) {
      case "landing":
        return <LandingPage onNavigate={handleNavigate} />;
      case "shop":
        return <ShopPage onShowNotification={showNotification} />;
      case "orders":
        return <OrdersPage />;
      case "admin":
        return <AdminPage />;
      case "admin-shop":
        return <AdminShopPage />;
      case "admin-orders":
        return <AdminOrdersPage />;
      default:
        return <ShopPage onShowNotification={showNotification} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-light">
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <main>{renderPage()}</main>
            
            {user && (
              <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                onOrderPlaced={showNotification}
              />
            )}
            
            <Notification
              message={notification.message}
              type={notification.type}
              isVisible={notification.isVisible}
              onClose={hideNotification}
            />
          </div>
          <Toaster />
        </TooltipProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
