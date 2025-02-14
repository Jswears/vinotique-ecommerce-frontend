import AddToCartButton from "@/app/components/features/AddToCartButton";
import { CartItem } from "@/app/types";
import { priceConversor } from "@/app/utils/priceConversor";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import RemoveFromCartButton from "./RemoveFromCartButton";
import useCartStore from "@/stores/cartStore";

const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
    return (
        <div className="flex items-center border-b dark:border-gray-700 py-4">
            <Image
                src={cartItem.imageUrl}
                alt={cartItem.productName}
                width={80}
                height={80}
                className="w-fit h-fit object-cover mr-4"
            />
            <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {cartItem.productName}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {priceConversor((cartItem.price * (cartItem.quantity ?? 0)))}
                </p>
                <p className="text-gray-600 dark:text-gray-400">x{cartItem.quantity}</p>
            </div>
            <div className="flex items-center">
                <RemoveFromCartButton wine={cartItem} type="simple" />
                <span className="mx-2 text-gray-900 dark:text-gray-100">
                    {cartItem.quantity}
                </span>
                <AddToCartButton wine={cartItem} type={"simple"} />
            </div>

        </div>
    );
}

export default CartItemCard;