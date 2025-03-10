import { CartItem, Wine } from ".";

// Wine
export interface WineCardProps {
  wine: Wine;
  isFeatured: boolean;
}

export interface WineDetailsComponentProps {
  wineId: string;
}

export interface WineDetailsPageProps {
  params: {
    wineId: string;
  };
}

export interface EditWineComponentProps {
  wineId: string;
}

export enum WineCategoryEnum {
  Red = "Red",
  White = "White",
  Rose = "Rose",
  Sparkling = "Sparkling",
  Dessert = "Dessert",
  Fortified = "Fortified",
}

// Cart
export interface RemoveFromCartButtonProps {
  wine: CartItem;
  type: "simple" | "detailed";
}

export interface AddToCartButtonProps {
  wine: {
    wineId: string;
    productName: string;
    price: number;
    imageUrl: string;
    quantity?: number;
    isInStock: boolean;
    stockQuantity: number;
  };
  type?: "simple" | "default";
}
