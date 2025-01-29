export interface Wine {
  wineId: string;
  name: string;
  price: number;
  description: string;
  producer: string;
  region: string;
  imageUrl: string;
  vintage: string;
  category: string;
  stock: number;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  wineId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity?: number;
  userId?: string;
  isAvailable?: boolean;
  stock: number;
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
