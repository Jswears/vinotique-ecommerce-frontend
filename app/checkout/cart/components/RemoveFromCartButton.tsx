import { getGuestUserId } from "@/app/lib/auth";
import { Wine } from "@/app/types";
import { AddToCartButtonProps } from "@/app/types/components";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { Minus, } from "lucide-react";
import { useState } from "react";

const RemoveFromCartButton = ({ wine, type }: AddToCartButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { removeFromCart } = useCartStore();

    const handleRemoveFromCart = async () => {
        setLoading(true)
        try {
            await removeFromCart({ wineId: wine.wineId, quantity: 1, userId: getGuestUserId(), action: "remove" })
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false)
        }
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        )
    }

    return (
        <Button disabled={loading} variant={type === "simple" ? "secondary" : "default"} size={type === "simple" ? "sm" : undefined} className="w-full" onClick={handleRemoveFromCart} >
            <Minus />
        </Button>
    )
}

export default RemoveFromCartButton;