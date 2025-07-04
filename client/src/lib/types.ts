export interface CartItem {
  id: number;
  name: string;
  price: {
    "5": number;
    "20": number;
    "50": number;
  };
  quantity: number;
  imageUrl: string;
}

export interface FilterOptions {
  category?: string[];
  ageGroup?: string[];
  priceRange?: string[];
  material?: string[];
  country?: string[];
  search?: string;
}

export interface AuthUser {
  id: number;
  email: string;
  companyName: string;
  unp: string;
  directorName: string;
  phone: string;
  address: string;
  logoUrl?: string;
  isAdmin: boolean;
}
