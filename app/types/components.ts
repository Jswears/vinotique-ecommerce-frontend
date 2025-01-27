import { Wine } from ".";

export interface WineCardProps {
  wine: Wine;
}

export interface WineDetailsComponentProps {
  wineId: string;
}

export interface WineDetailsPageProps {
  params: {
    wineId: string;
  };
}

export interface AddToCartButtonProps {
  wine: Wine;
}
