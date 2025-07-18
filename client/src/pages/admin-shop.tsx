import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { apiRequest } from "@/lib/queryClient";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Product } from "@shared/schema";

export function AdminShopPage() {
  const queryClient = useQueryClient();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    setIsEditModalOpen(true);
  };

  const handleSubmit = (isEdit: boolean) => {
    const formData = new FormData();
    Object.entries(productForm).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    if (isEdit && editProduct) {
      updateMutation.mutate({ id: editProduct.id, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const ProductForm = ({ isEdit }: { isEdit: boolean }) => (
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
          <Input
            id="category"
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
          />
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
          <Input
            id="ageGroup"
            value={productForm.ageGroup}
            onChange={(e) => setProductForm({ ...productForm, ageGroup: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="material">Материал</Label>
          <Input
            id="material"
            value={productForm.material}
            onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="country">Страна</Label>
          <Input
            id="country"
            value={productForm.country}
            onChange={(e) => setProductForm({ ...productForm, country: e.target.value })}
          />
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
        <Label htmlFor="imageUrl">URL изображения</Label>
        <Input
          id="imageUrl"
          value={productForm.imageUrl}
          onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
        />
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
        <Button
          variant="outline"
          onClick={() => {
            if (isEdit) {
              setIsEditModalOpen(false);
              setEditProduct(null);
            } else {
              setIsCreateModalOpen(false);
            }
            resetForm();
          }}
        >
          Отмена
        </Button>
        <Button onClick={() => handleSubmit(isEdit)}>
          {isEdit ? "Сохранить" : "Добавить"}
        </Button>
      </div>
    </div>
  );

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
            <ProductForm isEdit={false} />
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
          <ProductForm isEdit={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}