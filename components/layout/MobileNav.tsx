"use client";
import Link from "next/link";
import { NavLink } from "./NavLink";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../providers/ThemeToggler";

interface MobileNavProps {
    closeMenu: () => void;
    user?: { isAdmin?: boolean };
}

export function MobileNav({ closeMenu, user }: MobileNavProps) {
    const pathname = usePathname();

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 w-full bg-background shadow-md border-b border-border"
        >
            <nav className="flex flex-col space-y-4 px-6 py-6">
                <NavLink href="/" active={pathname === "/"} onClick={closeMenu}>
                    Home
                </NavLink>
                <NavLink href="/wines" active={pathname.startsWith("/wines")} onClick={closeMenu}>
                    Wines
                </NavLink>
                {user?.isAdmin && (
                    <NavLink href="/admin" active={pathname.startsWith("/admin")} onClick={closeMenu}>
                        Admin
                    </NavLink>
                )}
                <div className="flex items-center justify-between">
                    <ThemeToggle />
                    <Link href="/account" onClick={closeMenu} className="flex items-center space-x-3 text-foreground">
                        <User className="h-5 w-5" />
                        <span>Account</span>
                    </Link>
                </div>

            </nav>
        </motion.div>
    );
}
