'use client';
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation"

const Footer = () => {
    const pathname = usePathname()

    const { user } = useAuthStore()


    if (user?.isAdmin && pathname.startsWith("/admin")) {
        return null;
    }
    return (
        <footer className="border-t">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-muted-foreground text-sm">© 2023 WineShop. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;