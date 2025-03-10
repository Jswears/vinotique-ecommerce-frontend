import AddToCartButton from "@/components/cart/AddToCartButton";
import { CartItem } from "@/types";
import { priceConversor } from "@/utils/priceConversor";
import RemoveFromCartButton from "./RemoveFromCartButton";

const CartItemCard = ({ cartItem }: { cartItem: CartItem }) => {
    return (
        <div className="flex items-center border-b dark:border-gray-700 py-4">
            <div className="flex-grow">
                <h2 className="text-xl font-semibold text-foreground">
                    {cartItem.productName}
                </h2>
                <p className="text-muted-foreground">
                    {priceConversor(cartItem.price * (cartItem.quantity ?? 0))}
                </p>
                <p className="text-muted-foreground">x{cartItem.quantity}</p>
            </div>
            <div className="flex items-center gap-2">
                <RemoveFromCartButton wine={cartItem} type="simple" />
                <span className="text-lg font-medium">{cartItem.quantity}</span>
                <AddToCartButton wine={cartItem} type={"simple"} />
            </div>
        </div>
    );
};

export default CartItemCard;
