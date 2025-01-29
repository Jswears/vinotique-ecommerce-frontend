'use client'
import { useCartStore } from '@/stores/cartStore'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { NavLink } from './NavLink'
import { usePathname } from 'next/navigation'


export function CartIcon() {
    const { cartQuantity } = useCartStore()
    const pathname = usePathname()

    return (

        <NavLink href="/checkout/cart" active={pathname === "/checkout/cart"}>
            <ShoppingCart className={`h-6 w-6 text-gray-500 dark:text-gray-300 ${pathname === "/checkout/cart" ? "text-black" : ""}`} />
            {cartQuantity > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                    {cartQuantity}
                </span>
            )}
        </NavLink>
    )
}
