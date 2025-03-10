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
            const data: { sessionUrl: string } = await api.post("/payment", {
                cartItems,
                successUrl: `${window.location.origin}/checkout/payment/success`,
                cancelUrl: `${window.location.origin}/checkout/payment/cancel`,
                metadata: { userId },
            });

            const expirationDate = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes expiration
            document.cookie = `checkoutPerformed=true; path=/; expires=${expirationDate.toUTCString()}`;

            window.location.href = data.sessionUrl;
        } catch (error) {
            console.error(error instanceof Error ? error.message : error);
        }
    };

    if (!isAuthenticated) {
        return (
            <Link href="/auth/login">
                <Button variant="link">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </Button>
            </Link>
        );
    }

    return (
        <Button
            variant="default"
            className="hover:shadow-md transition-transform hover:scale-105"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
        >
            <CreditCard className="mr-2 h-4 w-4" />
            Checkout
        </Button>
    );
};

export default CheckoutButton;
