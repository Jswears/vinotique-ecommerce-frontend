import { getGuestUserId } from "@/app/lib/auth";
import { AddToCartButtonProps } from "@/app/types/components";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";

const AddToCartButton = ({ wine, type }: AddToCartButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCartStore();

    const handleAddToCart = async () => {
        setLoading(true)
        setError(null)
        try {
            await addToCart({ wineId: wine.wineId, quantity: 1, userId: getGuestUserId(), action: "add" })
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


    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        )
    }


    return (
        <Button variant={type === "simple" ? "secondary" : "default"} size={type === "simple" ? "icon" : undefined} className="w-full" onClick={handleAddToCart} >
            {loading ? (
                <>
                    <Check className="mr-2 h-4 w-4" />

                    {type !== "simple" ? "Added to Cart" : ""}
                </>
            ) : (
                type === "simple" ? "+" : (
                    <>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                )
            )}
        </Button>
    )
}

export default AddToCartButton;