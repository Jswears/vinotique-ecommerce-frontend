"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ArrowLeft, ShoppingCart } from "lucide-react"

const PaymentCancelPage = () => {
    const router = useRouter()
    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center justify-center mb-4">
                        <XCircle className="h-16 w-16 text-red-500" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-center">Payment Cancelled</CardTitle>
                    <CardDescription className="text-center">
                        Your payment was not processed. Don't worry, your cart items are still saved.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">
                        If you encountered any issues during the payment process, please try again or contact our support team.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => router.push("/")} className="w-1/2 mr-2">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Home
                    </Button>
                    <Button onClick={() => router.push("/checkout/cart")} className="w-1/2 ml-2">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Return to Cart
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default PaymentCancelPage;

