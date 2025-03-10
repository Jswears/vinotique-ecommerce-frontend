"use client";
import useCartStore from "@/stores/cartStore";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CartIcon() {
    const { getTotalQuantity } = useCartStore();
    const pathname = usePathname();
    const totalQuantity = getTotalQuantity();

    return (
        <Link href="/checkout/cart" className="relative p-2">
            <ShoppingCart className={`h-6 w-6 text-muted-foreground transition-colors ${pathname === "/checkout/cart" ? "text-primary" : ""}`} />
            {totalQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {totalQuantity}
                </span>
            )}
        </Link>
    );
}
