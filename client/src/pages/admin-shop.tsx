import { useState, useRef } from "react"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { Pencil, Trash2, Plus, Upload, Image } from "lucide-react";
import { Product } from "@shared/schema";

const CATEGORY_OPTIONS = [
  "Конструкторы",
  "Куклы",
  "Машинки",
  "Пазлы",
  "Мягкие игрушки",
  "Настольные игры",
  "Развивающие игрушки",
  "Творчество",
  "Спорт и активный отдых",
];

const AGE_OPTIONS = [
  "0-12 месяцев",
  "0-2 года",
  "0-3 года",
  "0-5 лет",
  "3-5 лет",
  "6-8 лет",
  "9-12 лет",
  "12+ лет",
];

const MATERIAL_OPTIONS = [
  "Пластик",
  "Дерево",
  "Текстиль",
  "Металл",
  "Резина",
  "Силикон",
  "Алюминий",
  "Полипропилен",
  "Массив березы",
];

const COUNTRY_OPTIONS = [
  "Беларусь",
  "Россия",
  "Китай",
  "Германия",
  "Польша",
];

interface ProductFormState {
  name: string;
  description: string;
  category: string;
  ageGroup: string;
  material: string;
  country: string;
  price5: string;
  price20: string;
  price50: string;
  imageUrl: string;
  inStock: boolean;
}

interface ProductFormProps {
  isEdit: boolean;
  productForm: ProductFormState;
  setProductForm: React.Dispatch<React.SetStateAction<ProductFormState>>;
  imagePreview: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

function ProductForm({
  isEdit,
  productForm,
  setProductForm,
  imagePreview,
  fileInputRef,
  handleImageChange,
  onCancel,
  onSubmit,
  isSubmitting,
}: ProductFormProps) {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Название</Label>
          <Input
            id="name"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="category">Категория</Label>
          <Select
            value={productForm.category}
            onValueChange={(value) => setProductForm({ ...productForm, category: value })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">Описание</Label>
        <Textarea
          id="description"
          value={productForm.description}
          onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="ageGroup">Возрастная группа</Label>
          <Select
            value={productForm.ageGroup}
            onValueChange={(value) => setProductForm({ ...productForm, ageGroup: value })}
          >
            <SelectTrigger id="ageGroup">
              <SelectValue placeholder="Выберите возраст" />
            </SelectTrigger>
            <SelectContent>
              {AGE_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="material">Материал</Label>
          <Select
            value={productForm.material}
            onValueChange={(value) => setProductForm({ ...productForm, material: value })}
          >
            <SelectTrigger id="material">
              <SelectValue placeholder="Выберите материал" />
            </SelectTrigger>
            <SelectContent>
              {MATERIAL_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="country">Страна</Label>
          <Select
            value={productForm.country}
            onValueChange={(value) => setProductForm({ ...productForm, country: value })}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder="Выберите страну" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRY_OPTIONS.map((opt) => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price5">Цена (5+ шт)</Label>
          <Input
            id="price5"
            type="number"
            step="0.01"
            value={productForm.price5}
            onChange={(e) => setProductForm({ ...productForm, price5: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="price20">Цена (20+ шт)</Label>
          <Input
            id="price20"
            type="number"
            step="0.01"
            value={productForm.price20}
            onChange={(e) => setProductForm({ ...productForm, price20: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="price50">Цена (50+ шт)</Label>
          <Input
            id="price50"
            type="number"
            step="0.01"
            value={productForm.price50}
            onChange={(e) => setProductForm({ ...productForm, price50: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Изображение товара</Label>
        <div className="mt-1 space-y-3">
          {imagePreview && (
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
              <img src={imagePreview} alt="Превью" className="w-full h-full object-cover" />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            {imagePreview ? "Заменить фото" : "Загрузить фото"}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="inStock"
          checked={productForm.inStock}
          onChange={(e) => setProductForm({ ...productForm, inStock: e.target.checked })}
        />
        <Label htmlFor="inStock">В наличии</Label>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </div>
  );
}

export function AdminShopPage() {
  const queryClient = useQueryClient();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category: '',
    ageGroup: '',
    material: '',
    country: '',
    price5: '',
    price20: '',
    price50: '',
    imageUrl: '',
    inStock: true
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await fetch("/api/products", {
        method: "POST",
        body: formData,
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreateModalOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: number, formData: FormData }) => {
      return await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsEditModalOpen(false);
      setEditProduct(null);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return await fetch(`/api/products/${id}`, {
        method: "DELETE",
      }).then(res => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
  });

  const resetForm = () => {
    setProductForm({
      name: '',
      description: '',
      category: '',
      ageGroup: '',
      material: '',
      country: '',
      price5: '',
      price20: '',
      price50: '',
      imageUrl: '',
      inStock: true
    });
    setImageFile(null);
    setImagePreview("");
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      category: product.category,
      ageGroup: product.ageGroup,
      material: product.material,
      country: product.country,
      price5: product.price5,
      price20: product.price20,
      price50: product.price50,
      imageUrl: product.imageUrl,
      inStock: product.inStock
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || "");
    setIsEditModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (isEdit: boolean) => {
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      if (key !== 'imageUrl') {
        formData.append(key, value.toString());
      }
    });

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (productForm.imageUrl) {
      formData.append("imageUrl", productForm.imageUrl);
    }

    if (isEdit && editProduct) {
      updateMutation.mutate({ id: editProduct.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-display font-bold text-dark">Управление товарами</h2>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Добавить новый товар</DialogTitle>
            </DialogHeader>
            <ProductForm
              isEdit={false}
              productForm={productForm}
              setProductForm={setProductForm}
              imagePreview={imagePreview}
              fileInputRef={fileInputRef}
              handleImageChange={handleImageChange}
              onCancel={() => {
                setIsCreateModalOpen(false);
                resetForm();
              }}
              onSubmit={() => handleSubmit(false)}
              isSubmitting={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все товары</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Возраст</TableHead>
                <TableHead>Цена (5+)</TableHead>
                <TableHead>Цена (20+)</TableHead>
                <TableHead>Цена (50+)</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.ageGroup}</TableCell>
                  <TableCell>{product.price5} BYN</TableCell>
                  <TableCell>{product.price20} BYN</TableCell>
                  <TableCell>{product.price50} BYN</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteMutation.mutate(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Редактировать товар</DialogTitle>
          </DialogHeader>
          <ProductForm
            isEdit={true}
            productForm={productForm}
            setProductForm={setProductForm}
            imagePreview={imagePreview}
            fileInputRef={fileInputRef}
            handleImageChange={handleImageChange}
            onCancel={() => {
              setIsEditModalOpen(false);
              setEditProduct(null);
              resetForm();
            }}
            onSubmit={() => handleSubmit(true)}
            isSubmitting={updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}