import { Metadata } from "next";
import CartItemsList from "@/components/cart/CartItemsList";

export const metadata: Metadata = {
    title: "Cart | Vinotique Wine Shop",
    description: "Your shopping cart",
};


const Cart = () => {
    return (
        <div>
            <CartItemsList />
        </div>
    );
}

export default Cart;