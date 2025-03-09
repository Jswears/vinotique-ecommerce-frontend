import Link from "next/link";

export const NavLink = ({ href, children, active }: { href: string; children: React.ReactNode; active: boolean }) => (
    <Link
        href={href}
        className={`text-sm font-medium transition-colors hover:text-primary ${active ? "text-foreground" : "text-muted-foreground"
            }`}
    >
        {children}
    </Link>
)