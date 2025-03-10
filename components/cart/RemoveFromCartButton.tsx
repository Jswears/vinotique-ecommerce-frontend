import { RemoveFromCartButtonProps } from "@/types/components";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/cartStore";
import { Minus } from "lucide-react";
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
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
            <Button
                disabled={loading}
                variant={type === "simple" ? "secondary" : "default"}
                size={type === "simple" ? "sm" : "lg"}
                className="hover:shadow-md transition-all"
                onClick={handleRemoveFromCart}
            >
                <Minus />
            </Button>
        </>
    );
};

export default RemoveFromCartButton;
