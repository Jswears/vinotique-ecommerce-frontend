'use client';
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation";

const Footer = () => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    // Hide footer for admin pages
    if (user?.isAdmin && pathname.startsWith("/admin")) {
        return null;
    }

    return (
        <footer className="border-t mt-auto bg-background text-foreground">
            <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-400 text-sm">
                    © 2023 WineShop. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
