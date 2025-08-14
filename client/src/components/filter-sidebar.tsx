import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FilterOptions } from "@/lib/types";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface FilterSidebarProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  isVisible: boolean;
  onClose: () => void;
}

export function FilterSidebar({ filters, onFilterChange, isVisible, onClose }: FilterSidebarProps) {
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const handleFilterChange = (key: keyof FilterOptions, value: string, checked: boolean) => {
    const currentValues = filters[key] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange({
      ...filters,
      [key]: newValues,
    });
  };

  // Объединяем старые категории с новыми из базы данных
  const allCategories = [
    "Конструкторы", 
    "Куклы", 
    "Машинки", 
    "Пазлы", 
    "Мягкие игрушки",
    ...categories.map((cat: any) => cat.name)
  ];

  // Удаляем дубликаты
  const uniqueCategories = [...new Set(allCategories)];

  return (
    <div className={`fixed md:relative left-0 top-0 w-80 md:w-64 bg-white h-full md:h-auto z-40 p-6 shadow-lg md:shadow-none overflow-y-auto transition-transform duration-300 ${
      isVisible ? "translate-x-0" : "-translate-x-full md:translate-x-0"
    }`}>
      <div className="flex justify-between items-center mb-6 md:hidden">
        <h3 className="text-xl font-semibold">Фильтры</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-semibold text-dark mb-3 block">Категория</Label>
          <div className="space-y-2">
            {uniqueCategories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.category?.includes(category) || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange("category", category, checked as boolean)
                  }
                />
                <Label htmlFor={`category-${category}`} className="text-sm">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-semibold text-dark mb-3 block">Возраст</Label>
          <div className="space-y-2">
            {["0-2 года", "0-3 года", "0-5 лет", "0-12 месяцев", "3-5 лет", "6-8 лет", "9-12 лет", "12+ лет"].map((age) => (
              <div key={age} className="flex items-center space-x-2">
                <Checkbox
                  id={`age-${age}`}
                  checked={filters.ageGroup?.includes(age) || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange("ageGroup", age, checked as boolean)
                  }
                />
                <Label htmlFor={`age-${age}`} className="text-sm">
                  {age}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-semibold text-dark mb-3 block">Цена (за штуку)</Label>
          <div className="space-y-2">
            {["До 10 руб", "10-25 руб", "25-50 руб", "50-100 руб", "Свыше 100 руб"].map((price) => (
              <div key={price} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${price}`}
                  checked={filters.priceRange?.includes(price) || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange("priceRange", price, checked as boolean)
                  }
                />
                <Label htmlFor={`price-${price}`} className="text-sm">
                  {price}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-semibold text-dark mb-3 block">Материал</Label>
          <div className="space-y-2">
            {["Пластик", "Дерево", "Текстиль", "Металл", "Резина", "Силикон", "Алюминий", "Полипропилен", "Массив березы"].map((material) => (
              <div key={material} className="flex items-center space-x-2">
                <Checkbox
                  id={`material-${material}`}
                  checked={filters.material?.includes(material) || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange("material", material, checked as boolean)
                  }
                />
                <Label htmlFor={`material-${material}`} className="text-sm">
                  {material}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-semibold text-dark mb-3 block">Страна</Label>
          <div className="space-y-2">
            {["Беларусь", "Россия", "Китай", "Германия", "Польша"].map((country) => (
              <div key={country} className="flex items-center space-x-2">
                <Checkbox
                  id={`country-${country}`}
                  checked={filters.country?.includes(country) || false}
                  onCheckedChange={(checked) => 
                    handleFilterChange("country", country, checked as boolean)
                  }
                />
                <Label htmlFor={`country-${country}`} className="text-sm">
                  {country}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
