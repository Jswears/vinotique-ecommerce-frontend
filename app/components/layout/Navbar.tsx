"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wine, User } from "lucide-react"
import { usePathname } from "next/navigation"

const Navbar = () => {
    const pathname = usePathname()

    return (
        <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <Wine className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold text-primary">Vinotique.</span>
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                            <NavLink href="/" active={pathname === "/"}>
                                Home
                            </NavLink>
                            <NavLink href="/wines" active={pathname.startsWith("/wines")}>
                                Wines
                            </NavLink>
                            <NavLink href="/account" active={pathname === "/account"}>
                                Account
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
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
    )
}

const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
    <Link
        href={href}
        className={`text-sm font-medium transition-colors hover:text-primary ${active ? "text-foreground" : "text-muted-foreground"
            }`}
    >
        {children}
    </Link>
)

export default Navbar

