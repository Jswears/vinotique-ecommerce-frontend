import AddToCartButton from "@/app/components/features/AddToCartButton";
import { getGuestUserId } from "@/app/lib/auth";
import { CartItem } from "@/app/types";
import { priceConversor } from "@/app/utils/priceConversor";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import Image from "next/image";

const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
    const { removeFromCart } = useCartStore();

    const handleRemoveFromCart = async () => {
        await removeFromCart({ wineId: cartItem.wineId, quantity: 1, userId: getGuestUserId(), action: "add" })
    }
    return (
        <div className="flex items-center border-b dark:border-gray-700 py-4">
            <Image
                src={cartItem.imageUrl}
                alt={cartItem.name}
                width={80}
                height={80}
                className="w-fit h-fit object-cover mr-4"
            />
            <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    {cartItem.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {priceConversor((cartItem.price * (cartItem.quantity ?? 0)))}
                </p>
                <p className="text-gray-600 dark:text-gray-400">x{cartItem.quantity}</p>
            </div>
            <div className="flex items-center">
                <Button
                    onClick={handleRemoveFromCart}
                    variant={"secondary"}
                    size={"icon"}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
                >
                    -
                </Button>
                <span className="mx-2 text-gray-900 dark:text-gray-100">
                    {cartItem.quantity}
                </span>
                <AddToCartButton wine={cartItem} type={"simple"} />
            </div>

        </div>
    );
}

export default CartItemCard;