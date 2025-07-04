import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onBuyClick: (product: Product) => void;
}

export function ProductCard({ product, onBuyClick }: ProductCardProps) {
  return (
    <Card className="overflow-hidden card-hover">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-dark mb-2">{product.name}</h3>
        <div className="text-sm text-gray-600 mb-4">
          <div>{product.category} • {product.ageGroup}</div>
          <div>{product.material} • {product.country}</div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-600">Цена за штуку:</div>
          <div className="text-primary font-semibold">
            от {product.price5} руб (5+ шт) • от {product.price20} руб (20+ шт) • от {product.price50} руб (50+ шт)
          </div>
        </div>
        <Button
          onClick={() => onBuyClick(product)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Купить
        </Button>
      </CardContent>
    </Card>
  );
}
