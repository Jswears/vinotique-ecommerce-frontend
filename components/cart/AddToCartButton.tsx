import useCartStore from "@/stores/cartStore";
import { Loader2, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { AddToCartButtonProps } from "@/types/components";

const AddToCartButton = ({ wine, type }: AddToCartButtonProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToCart, cartItems } = useCartStore();

  const wineWithQuantity = cartItems.find((item) => item.wineId === wine.wineId);

  const handleAddToCart = async () => {
    setIsAdding(true);
    setError(null);

    const cartItem = {
      wineId: wine.wineId,
      productName: wine.productName,
      price: wine.price,
      imageUrl: wine.imageUrl,
      quantity: 1,
      isInStock: wine.isInStock,
      stockQuantity: wine.stockQuantity,
      addedAt: new Date(),
    }
    try {
      await addToCart(cartItem, 1);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  const isDisabled = !wine.isInStock || (wineWithQuantity?.quantity ?? 0) >= wine.stockQuantity || isAdding;

  return (
    <div className="flex flex-col items-center w-full">
      <Button
        disabled={isDisabled}
        variant={type === "simple" ? "ghost" : "default"}
        size={type === "simple" ? "icon" : "sm"}
        className={`w-full ${type === "simple" ? "rounded-sm hover:bg-accent/70" : "rounded-none"} font-medium flex items-center justify-center gap-2 transition-transform hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={handleAddToCart}
      >
        {isAdding ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : type === "simple" ? (
          <Plus size={16} />
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </>
        )}
      </Button>

      {error && (
        <p className="text-sm text-red-500 mt-2 animate-fade-in" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;
