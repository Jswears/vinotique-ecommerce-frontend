import { getGuestUserId } from "@/app/lib/auth";
import { AddToCartButtonProps } from "@/app/types/components";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

const AddToCartButton = ({ wine }: AddToCartButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAdded, setIsAdded] = useState(false);
    const { addToCart } = useCartStore();

    const reducedItem = {
        wineId: wine.wineId,
        quantity: 1
    }

    const handleAddToCart = async () => {
        setLoading(true)
        setError(null)
        try {
            await addToCart({ wineId: wine.wineId, quantity: 1, userId: getGuestUserId(), action: "add" })
            setIsAdded(true)
            setTimeout(() => setIsAdded(false), 1000)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false)
        }
    };


    return (
        <Button className="w-full" onClick={handleAddToCart} >
            {isAdded ? (
                <>
                    <Check className="mr-2 h-4 w-4" /> Added to Cart
                </>
            ) : (
                <>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </>
            )}
        </Button>
    )
}

export default AddToCartButton;