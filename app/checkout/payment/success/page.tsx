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
    const { clearCart, fetchCart } = useCartStore()
    const { toast } = useToast()

    useEffect(() => {
        // Clean the cart
        clearCart()
        fetchCart()
        // Show a success toast
        toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
            duration: 5000,
        })
    }, [clearCart, toast]) // Add clearItemsCount to dependencies

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
                    <Button onClick={() => router.push("/")} className="w-full">
                        Continue Shopping
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PaymentSuccessPage;