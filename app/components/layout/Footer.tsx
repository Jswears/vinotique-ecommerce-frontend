'use client';
import { isAuthenticatedAsAdmin } from "@/app/utils/isAuthenticated"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const Footer = () => {
    const pathname = usePathname()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        const checkAdmin = async () => {
            const result = await isAuthenticatedAsAdmin()
            setIsAdmin(result)
        }
        checkAdmin()
    }, [])

    if (isAdmin && pathname.startsWith("/admin")) {
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