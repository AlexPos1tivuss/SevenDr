import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderPlaced: (message: string) => void;
}

export function CartModal({ isOpen, onClose, onOrderPlaced }: CartModalProps) {
  const { cart, removeFromCart, clearCart, getItemPrice, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const handlePlaceOrder = async () => {
    if (!user || cart.length === 0 || !deliveryAddress.trim()) return;

    setIsPlacingOrder(true);
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        total: getTotalPrice(),
        deliveryAddress: deliveryAddress.trim(),
      };

      await apiRequest("POST", "/api/orders", orderData);
      clearCart();
      onOrderPlaced("Заказ успешно отправлен!");
      onClose();
    } catch (error) {
      console.error("Order placement error:", error);
      onOrderPlaced("Ошибка при оформлении заказа");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">Корзина</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8">Корзина пуста</div>
          ) : (
            <>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-dark">{item.name}</h4>
                      <div className="text-sm text-gray-600">
                        {item.quantity} шт × {getItemPrice(item)} руб = {(item.quantity * getItemPrice(item)).toFixed(2)} руб
                      </div>
                    </div>
                    <Button
                      onClick={() => removeFromCart(item.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-primary">{getTotalPrice().toFixed(2)} руб</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Адрес доставки</Label>
                    <Input
                      id="address"
                      placeholder="Улица, дом, квартира"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={!deliveryAddress.trim() || isPlacingOrder}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    {isPlacingOrder ? "Оформляем..." : "Заказать"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
