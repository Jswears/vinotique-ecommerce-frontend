import { RemoveFromCartButtonProps } from "@/app/types/components";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/cartStore";
import { Minus, } from "lucide-react";
import { useState } from "react";

const RemoveFromCartButton = ({ wine, type }: RemoveFromCartButtonProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { removeFromCart } = useCartStore();

    const handleRemoveFromCart = async () => {
        setLoading(true);
        try {
            await removeFromCart(wine.wineId, 1);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred");
            }

        } finally {
            setLoading(false);
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