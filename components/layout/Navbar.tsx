"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wine, User, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { CartIcon } from "@/components/cart/CartIcon";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "../providers/ThemeToggler";
import { useAuthStore } from "@/stores/authStore";
import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { MobileNav } from "./MobileNav";

const Navbar = () => {
    const pathname = usePathname();
    const { user, initAuth } = useAuthStore();
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    // Initialize auth and set client flag
    useEffect(() => {
        initAuth();
        setIsClient(true);
    }, [initAuth]);

    // Hide Navbar if user is admin and on the admin panel
    if (!isClient || (user?.isAdmin && pathname.startsWith("/admin"))) {
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

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:space-x-6">
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
                    <div className="flex flex-end items-center gap-2">
                        <div className="items-center hidden md:flex">
                            <ThemeToggle />
                        </div>
                        <CartIcon />
                        <Button variant="ghost" size="icon" asChild className="hidden md:flex">
                            <Link href="/account">
                                <User className="h-5 w-5" />
                                <span className="sr-only">Account</span>
                            </Link>
                        </Button>

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && <MobileNav closeMenu={() => setMobileMenuOpen(false)} user={user} />}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
