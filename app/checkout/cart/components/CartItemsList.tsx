'use client'
import { api } from "@/app/lib/api";
import { useEffect, useState } from "react";
import CartItemsSkeleton from "./CartItemsSkeleton";
import WineAlert from "@/app/components/ui/WineAlertComponent";
import { CartItem } from "@/app/types";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CartItemCard from "./CartItemCard";
import { Button } from "@/components/ui/button";
import { priceConversor } from "@/app/utils/priceConversor";
import { getGuestUserId } from "@/app/lib/auth";
import { useCartStore } from "@/stores/cartStore";

const CartItemsList = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const { updateCartQuantity, cart } = useCartStore();

    useEffect(() => {
        const fetchCart = async () => {
            setLoading(true);
            try {
                const data = await api.get(`/cart/${getGuestUserId()}`)
                setCartItems(data)
                updateCartQuantity(data.reduce((total: number, item: CartItem) => total + (item.quantity ?? 0), 0))
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [updateCartQuantity, setCartItems, setLoading, setError]);


    useEffect(() => {
        const newTotal = cart?.reduce((sum, item) => sum + item.price * (item.quantity ?? 0), 0);
        setTotal(newTotal);
    }, [cart, setTotal, updateCartQuantity]);
    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        )
    }

    if (loading) {
        return (
            <CartItemsSkeleton />
        )
    }

    if (cartItems?.length === 0 && !loading) {
        return (
            <WineAlert title="Your cart is empty" error="Looks like you haven't added anything to your cart yet." />
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold flex items-center">
                        <ShoppingCart className="mr-2" />
                        Your Cart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[50vh] pr-6">
                        {cart?.map((cartItem, index) => (
                            <div key={cartItem.wineId}>
                                <CartItemCard cartItem={cartItem} />
                                {index < cart.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">Total:</p>
                        <p className="text-2xl font-bold text-primary">
                            {total && priceConversor(total)}
                        </p>
                    </div>
                    <div className="space-x-2">
                        <Button variant="outline">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Cart
                        </Button>
                        <Button variant="default">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Checkout
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CartItemsList;