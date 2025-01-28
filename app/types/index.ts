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
  createdAt: string;
}

export interface WineDetails {
  wineId: string;
  name: string;
  category: string;
  region: string;
  producer: string;
  vintage: string;
  price: number;
  stock: number;
  description: string;
  imageUrl: string;
}

export interface CartItem {
  wineId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity?: number;
  userId?: string;
}

export interface OrderItem {
  userId: string;
  wineId: string;
  quantity: number;
  action: "add" | "remove";
}
