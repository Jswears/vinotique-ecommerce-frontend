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
