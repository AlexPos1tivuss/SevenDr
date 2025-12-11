import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@shared/schema";
import { useState } from "react";
import { useCartContext } from "@/hooks/useCartContext";

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (message: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(5);
  const { addToCart } = useCartContext();

  if (!product) return null;

  const handleAddToCart = () => {
    if (quantity < 5) {
      alert("Минимальное количество для заказа: 5 штук");
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      price: {
        "5": Number(product.price5),
        "20": Number(product.price20),
        "50": Number(product.price50),
      },
      quantity,
      imageUrl: product.imageUrl,
    };

    addToCart(cartItem);
    onAddToCart("Товар добавлен в корзину!");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-display font-bold">{product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-32 object-cover rounded-lg"
          />
          <p className="text-gray-600">{product.description}</p>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>5-19 шт:</span>
              <span className="font-semibold">{product.price5} руб/шт</span>
            </div>
            <div className="flex justify-between">
              <span>20-49 шт:</span>
              <span className="font-semibold">{product.price20} руб/шт</span>
            </div>
            <div className="flex justify-between">
              <span>50+ шт:</span>
              <span className="font-semibold">{product.price50} руб/шт</span>
            </div>
          </div>
          <div>
            <Label htmlFor="quantity">Количество (мин. 5 шт)</Label>
            <Input
              id="quantity"
              type="number"
              min="5"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-2"
            />
          </div>
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-primary/90"
          >
            В корзину
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
