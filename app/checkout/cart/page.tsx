import { Metadata } from "next";
import CartItemsList from "@/components/cart/CartItemsList";

export const metadata: Metadata = {
    title: "Cart | Vinotique Wine Shop",
    description: "Your shopping cart",
};

const Cart = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-12">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                    Your Shopping Cart
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Review your selected wines before checkout.
                </p>
            </section>
            <CartItemsList />
        </div>
    );
};

export default Cart;
