import { getGuestUserId } from "@/app/lib/auth";
import { Wine } from "@/app/types";
import { AddToCartButtonProps } from "@/app/types/components";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/stores/cartStore";
import { Minus, Trash2, } from "lucide-react";
import { useState } from "react";

const ClearCartButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { clearCart } = useCartStore();
    const { toast } = useToast()

    const handleClearCart = async () => {
        setLoading(true);
        const userId = getGuestUserId();
        try {
            await clearCart(userId);
            toast({
                title: "Cart Cleared",
                description: "Your cart has been cleared successfully.",
                variant: "default",
            })
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
        <Button disabled={loading} variant="outline" className="w-full" onClick={handleClearCart}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
        </Button>
    )
}

export default ClearCartButton;