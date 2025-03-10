import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/stores/cartStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const ClearCartButton = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { clearCart } = useCartStore();
    const { toast } = useToast();

    const handleClearCart = async () => {
        setLoading(true);
        try {
            await clearCart();
            toast({
                title: "Cart Cleared",
                description: "Your cart has been cleared successfully.",
                variant: "default",
            });
        } catch (error) {
            setError(error instanceof Error ? error.message : "An unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            disabled={loading}
            variant="destructive"
            className="text-white hover:shadow-md"
            onClick={handleClearCart}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
        </Button>
    );
};

export default ClearCartButton;
