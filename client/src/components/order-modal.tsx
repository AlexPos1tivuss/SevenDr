import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order } from "@shared/schema";

interface OrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ order, isOpen, onClose }: OrderModalProps) {
  if (!order) return null;

  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">Заказ #{order.id}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {items.map((item: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h4 className="font-semibold">{item.name}</h4>
                <div className="text-sm text-gray-600">
                  {item.quantity} шт × {item.price} руб = {(item.quantity * item.price).toFixed(2)} руб
                </div>
              </div>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Итого:</span>
              <span className="text-xl font-bold text-primary">{Number(order.total).toFixed(2)} руб</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Адрес доставки: {order.deliveryAddress}
            </div>
            <div className="mt-1 text-sm text-gray-600">
              Статус: {order.status}
            </div>
            {order.deliveryDate && (
              <div className="mt-1 text-sm text-gray-600">
                Дата доставки: {order.deliveryDate}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
