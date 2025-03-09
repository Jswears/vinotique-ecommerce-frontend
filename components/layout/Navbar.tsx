"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wine, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { CartIcon } from "@/components/layout/CartIcon";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "../providers/ThemeToggler";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useMemo } from "react";

const Navbar = () => {
    const pathname = usePathname();
    const { user, initAuth } = useAuthStore();

    // Memoize auth initialization to prevent unnecessary re-renders
    useMemo(() => {
        initAuth();
    }, [initAuth]);

    if (user?.isAdmin && pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <Link href="/" className="flex items-center hover:text-primary">
                            <Wine className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-primary">Vinotique.</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden sm:flex sm:space-x-6">
                        <NavLink href="/" active={pathname === "/"}>
                            Home
                        </NavLink>
                        <NavLink href="/wines" active={pathname.startsWith("/wines")}>
                            Wines
                        </NavLink>
                        {user?.isAdmin && (
                            <NavLink href="/admin" active={pathname.startsWith("/admin")}>
                                Admin
                            </NavLink>
                        )}
                    </div>

                    {/* Right-side Controls */}
                    <div className="flex items-center space-x-4">
                        <ThemeToggle />
                        <CartIcon />
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/account">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Account</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
