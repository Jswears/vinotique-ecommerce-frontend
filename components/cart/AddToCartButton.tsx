import useCartStore from "@/stores/cartStore";
import { CheckCheckIcon, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface WineProps {
    wine: {
        wineId: string;
        productName: string;
        price: number;
        imageUrl: string;
        isInStock: boolean;
    }
    type?: "simple" | "default";
}



const AddToCartButton = ({ wine, type }: WineProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToCart } = useCartStore();

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await addToCart(wine.wineId, 1);
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


    return (
        <Button disabled={!wine.isInStock} variant={type === "simple" ? "secondary" : "default"} size={type === "simple" ? "sm" : undefined} className="w-full" onClick={handleAddToCart} >
            {loading ? (
                <>
                    {type !== "simple" ? <><CheckCheckIcon /> Added to Cart</> : <Plus />}
                </>
            ) : (
                type === "simple" ? <Plus /> : (
                    <>
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                    </>
                )
            )}
        </Button>
    )
}

export default AddToCartButton;


