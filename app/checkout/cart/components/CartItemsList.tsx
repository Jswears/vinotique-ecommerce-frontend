'use client'
import { api } from "@/app/lib/api";
import { useEffect, useState } from "react";
import CartItemsSkeleton from "./CartItemsSkeleton";
import WineAlert from "@/app/components/ui/WineAlertComponent";
import { CartItem, CheckoutItem } from "@/app/types";
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
import useCartStore from "@/stores/cartStore";
import ClearCartButton from "./ClearCartButton";

const CartItemsList = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number | undefined>(undefined);

    const { cartItems, getTotalPrice } = useCartStore()
    const totalPrice = getTotalPrice();



    const handleCheckout = async () => {
        try {
            const checkoutItems: CheckoutItem[] = cartItems.map((item): CheckoutItem => ({
                name: item.productName,
                price: item.price,
                currency: "eur",
                quantity: item.quantity,
                wineId: item.wineId,
            }));

            const data = await api.post(`/payment`, {
                cartItems,
                successUrl: `${window.location.origin}/checkout/payment/success`,
                cancelUrl: `${window.location.origin}/checkout/payment/cancel`,
                metadata: {
                    userId: getGuestUserId(), // Consider fetching user ID dynamically
                },
            });
            const { sessionUrl } = data;
            window.location.href = sessionUrl;
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    };




    if (error) {
        return <WineAlert title="An error occurred" error={error} />
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
                        {cartItems?.map((cartItem, index) => (
                            <div key={cartItem.wineId}>
                                <CartItemCard cartItem={cartItem} />
                                {index < cartItems.length - 1 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">Total:</p>
                        <p className="text-2xl font-bold text-primary">
                            {totalPrice && priceConversor(totalPrice)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <ClearCartButton />
                        <Button variant="default" onClick={handleCheckout}>
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