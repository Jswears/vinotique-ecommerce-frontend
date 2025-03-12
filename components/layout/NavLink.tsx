import Link from "next/link";

export const NavLink = ({ href, children, active, onClick }: { href: string; children: React.ReactNode; active: boolean; onClick?: () => void; }) => (
    <Link
        href={href}
        className={`text-sm font-medium transition-colors hover:text-primary ${active ? "text-foreground" : "text-muted-foreground"
            }`}
        onClick={onClick}
    >
        {children}
    </Link>
)