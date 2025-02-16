// ---- Wine Types ----
export type Wine = {
  isInStock: boolean;
  producer: string;
  rating: number;
  reviewCount: number;
  sizeMl: number;
  createdAt: string;
  country: string;
  isFeatured: boolean;
  imageUrl: string;
  alcoholContent: number;
  vintage: number;
  updatedAt: string;
  wineId: string;
  category: string;
  region: string;
  price: number;
  grapeVarietal: string[];
  productName: string;
};

export type WinesResponse = {
  wines: Wine[];
  totalCount: number;
  nextToken: string | null;
};

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
