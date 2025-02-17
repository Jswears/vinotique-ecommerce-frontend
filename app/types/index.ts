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
  description: string;
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

// ---- Cart Types ----
export interface CartItem {
  addedAt: string;
  wineId: string;
  quantity: number;
  productName: string;
  price: number;
  imageUrl: string;
}
// Type for the cart item sent in POST /cart
export interface CartPostItem {
  wineId: string;
  quantity: number;
  action: "add" | "remove" | "clear";
}

// Type for the GET /cart response
export interface CartResponse {
  cartItems: CartItem[];
  totalPrice: number;
}

export interface CheckoutItem {
  name: string;
  price: number;
  currency: string;
  wineId: string;
  quantity: number | undefined;
}

// ---- Order Types ----

export interface OrderItem {
  userId: string;
  wineId: string;
  quantity: number;
  action: "add" | "remove";
}

export type Order = {
  shippingDetails: {
    name: string;
    address: {
      country: string;
      state: string | null;
      postal_code: string;
      city: string;
      line2: string | null;
      line1: string;
    };
  };
  cartItems?: {
    productName: string;
    price: number;
    quantity: number;
    wineId: string;
  }[];
  createdAt: string;
  customer: string;
  totalAmount: number;
  orderStatus: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  orderId: string;
};

export type OrdersResponse = {
  orders: Order[];
  totalCount: number;
  nextToken: string | null;
};
