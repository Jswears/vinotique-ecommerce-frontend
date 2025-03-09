'use client'
import CartItemsSkeleton from "./CartItemsSkeleton";
import WineAlert from "@/components/ui/WineAlertComponent";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import CartItemCard from "./CartItemCard";
import { priceConversor } from "@/utils/priceConversor";
import useCartStore from "@/stores/cartStore";
import ClearCartButton from "./ClearCartButton";
import CheckoutButton from "./CheckoutButton";

const CartItemsList = () => {
    const { cartItems, getTotalPrice, loading, error } = useCartStore()
    const totalPrice = getTotalPrice();



    if (error) {
        return <WineAlert title="An error occurred" error={error} />
    }

    if (loading && !cartItems) {
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
                        <CheckoutButton cartItems={cartItems} />
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

export default CartItemsList;