"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import useCartStore from "@/stores/cartStore"

const PaymentSuccessPage = () => {
    const router = useRouter()
    const { cartItems, clearCart, clearCartLocally } = useCartStore()
    const { toast } = useToast()

    useEffect(() => {
        // Clean the cart
        if (cartItems.length > 0) {
            clearCart().then(() => {
                clearCartLocally();
                // Show a success toast
                toast({
                    title: "Payment Successful",
                    description: "Thank you for your purchase!",
                    duration: 5000,
                });
            });
        }

        // Remove the checkoutPerformed cookie and redirect to home page after a timeout
        const timeout = setTimeout(() => {
            document.cookie = "checkoutPerformed=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            router.push("/");
        }, 5000); // Redirect after 5 seconds

        return () => clearTimeout(timeout);
    }, [clearCart, clearCartLocally, toast, cartItems, router]);

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Payment Successful!</CardTitle>
                    <CardDescription className="text-center">
                        Thank you for your purchase. Your order has been processed successfully.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        You will receive an email confirmation shortly with your order details.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button className="w-full">
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PaymentSuccessPage;