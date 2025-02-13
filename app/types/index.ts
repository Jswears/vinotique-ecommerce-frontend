export interface Wine {
  wineId: string;
  productName: string;
  producer: string;
  description: string;
  category: WineCategoryEnum;
  region: string;
  country: string;
  grapeVarietal?: string[];
  vintage: number;
  alcoholContent?: number;
  sizeMl?: number;
  price: number;
  stockQuantity?: number;
  isInStock?: boolean;
  isFeatured?: boolean;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
}

export enum WineCategoryEnum {
  Red = "Red",
  White = "White",
  Rose = "Rose",
  Sparkling = "Sparkling",
  Dessert = "Dessert",
  Fortified = "Fortified",
}

export interface CartItem {
  addedAt: string;
  wineId: string;
  quantity: number;
  productName: string;
  price: number;
  imageUrl: string;
}

export interface OrderItem {
  userId: string;
  wineId: string;
  quantity: number;
  action: "add" | "remove";
}

export interface CheckoutItem {
  name: string;
  price: number;
  currency: string;
  wineId: string;
  quantity: number | undefined;
}

export type WineFormData = {
  name: string;
  category: string;
  region: string;
  producer: string;
  vintage: string;
  price: number;
  stock: number;
  description: string;
  image: File | null;
  imageUrl?: string;
};
