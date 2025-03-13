import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import useCartStore from "@/stores/cartStore";
import { Trash2 } from "lucide-react";
import { useState } from "react";

const ClearCartButton = () => {
    const [loading, setLoading] = useState(false);
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
            toast({
                title: "An error occurred",
                description: "An error occurred while clearing your cart. Please try again.",
                variant: "destructive",
            });
            console.log("Error clearing cart:", error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            disabled={loading}
            variant="destructive"
            size={"sm"}
            className="text-white hover:shadow-md"
            onClick={handleClearCart}
        >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
        </Button>
    );
};

export default ClearCartButton;
