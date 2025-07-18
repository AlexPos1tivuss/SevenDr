import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/product-card";
import { ProductModal } from "@/components/product-modal";
import { FilterSidebar } from "@/components/filter-sidebar";
import { AdminShopPage } from "./admin-shop";
import { useAuth } from "@/hooks/useAuth";
import { Product } from "@shared/schema";
import { FilterOptions } from "@/lib/types";

interface ShopPageProps {
  onShowNotification: (message: string) => void;
}

export function ShopPage({ onShowNotification }: ShopPageProps) {
  const { user } = useAuth();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({});

  // Если администратор, показываем админ-панель управления товарами
  if (user?.isAdmin) {
    return <AdminShopPage />;
  }

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products.filter((product: Product) => {
    // Search filter
    if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(product.category)) {
        return false;
      }
    }

    // Age group filter
    if (filters.ageGroup && filters.ageGroup.length > 0) {
      if (!filters.ageGroup.includes(product.ageGroup)) {
        return false;
      }
    }

    // Material filter
    if (filters.material && filters.material.length > 0) {
      if (!filters.material.includes(product.material)) {
        return false;
      }
    }

    // Country filter
    if (filters.country && filters.country.length > 0) {
      if (!filters.country.includes(product.country)) {
        return false;
      }
    }

    // Price filter
    if (filters.priceRange && filters.priceRange.length > 0) {
      const price = Number(product.price5);
      let matchesPrice = false;
      
      for (const range of filters.priceRange) {
        if (range === "До 10 руб" && price < 10) matchesPrice = true;
        if (range === "10-25 руб" && price >= 10 && price <= 25) matchesPrice = true;
        if (range === "25-50 руб" && price >= 25 && price <= 50) matchesPrice = true;
        if (range === "50-100 руб" && price >= 50 && price <= 100) matchesPrice = true;
        if (range === "Свыше 100 руб" && price > 100) matchesPrice = true;
      }
      
      if (!matchesPrice) return false;
    }

    return true;
  });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Загрузка товаров...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-dark mb-4">Каталог игрушек</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Поиск игрушек..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <Button
            onClick={() => setIsFilterSidebarOpen(true)}
            className="bg-secondary hover:bg-secondary/90 md:hidden"
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
          </Button>
        </div>
      </div>

      <div className="flex gap-8">
        <FilterSidebar
          filters={filters}
          onFilterChange={handleFilterChange}
          isVisible={isFilterSidebarOpen}
          onClose={() => setIsFilterSidebarOpen(false)}
        />

        <div className="flex-1">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onBuyClick={handleProductClick}
              />
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Товары не найдены. Попробуйте изменить фильтры.
            </div>
          )}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onAddToCart={onShowNotification}
      />

      {/* Overlay for mobile filter */}
      {isFilterSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsFilterSidebarOpen(false)}
        />
      )}
    </div>
  );
}
