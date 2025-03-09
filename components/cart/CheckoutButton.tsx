import { api } from "@/lib/api";
import { CartItem } from "@/types";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { CreditCard, LogIn } from "lucide-react";
import Link from "next/link";

const CheckoutButton = ({ cartItems }: { cartItems: CartItem[] }) => {
    const userId = useAuthStore.getState().user?.userId;
    const isAuthenticated = !!userId;

    const handleCheckout = async () => {

        try {
            // const checkoutItems: CheckoutItem[] = cartItems.map((item): CheckoutItem => ({
            //     name: item.productName,
            //     price: item.price,
            //     currency: "eur",
            //     quantity: item.quantity,
            //     wineId: item.wineId,
            // }));

            const data: { sessionUrl: string } = await api.post("/payment", {
                cartItems,
                successUrl: `${window.location.origin}/checkout/payment/success`,
                cancelUrl: `${window.location.origin}/checkout/payment/cancel`,
                metadata: {
                    userId
                },
            });
            const { sessionUrl } = data;

            // Set a cookie to indicate that the user has performed a checkout action
            const expirationDate = new Date();
            expirationDate.setMinutes(expirationDate.getMinutes() + 30); // Set cookie to expire in 30 minutes
            document.cookie = `checkoutPerformed=true; path=/; expires=${expirationDate.toUTCString()}`;

            window.location.href = sessionUrl;
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error(error);
            }
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="flex justify-end">
                    <Button variant={"link"}>
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Button>
                </Link>
            </div>
        )
    }
    return (
        <Button variant="default" onClick={handleCheckout}>
            <CreditCard className="mr-2 h-4 w-4 self-end" />
            Checkout
        </Button>
    );
}

export default CheckoutButton;