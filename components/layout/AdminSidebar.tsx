"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Wine, PlusCircle, Edit, ShoppingBag, Home, LogOut, BarChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/providers/ThemeToggler";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { toast } = useToast();

    const { logout } = useAuthStore();

    const handleSignOut = useCallback(async () => {
        try {
            await logout();
            toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
            })
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
            toast({
                title: "Error signing out",
                description: "An error occurred while signing out. Please try again.",
                variant: "destructive",
            })
        }
    }, [router, toast]);



    return (
        <Sidebar>
            {/* Header */}
            <SidebarHeader>
                <Link href="/" className="flex items-center space-x-3 px-6 py-4 hover:text-primary">
                    <Wine className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary">Vinotique Admin</span>
                </Link>
            </SidebarHeader>

            {/* Sidebar Content */}
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/admin"}>
                            <Link href="/admin">
                                <Home className="mr-3 h-5 w-5" />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/admin/statistics"}>
                            <Link href="/admin/statistics">
                                <BarChart className="mr-3 h-5 w-5" />
                                Statistics
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/admin/add-wine"}>
                            <Link href="/admin/add-wine">
                                <PlusCircle className="mr-3 h-5 w-5" />
                                Add Wine
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/admin/edit-wines"}>
                            <Link href="/admin/edit-wines">
                                <Edit className="mr-3 h-5 w-5" />
                                Edit Wines
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === "/admin/orders"}>
                            <Link href="/admin/orders">
                                <ShoppingBag className="mr-3 h-5 w-5" />
                                Orders
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            {/* Sidebar Footer */}
            <SidebarFooter>
                <div className="flex items-center justify-between px-6 py-4">
                    <ThemeToggle />
                    <Button onClick={handleSignOut} variant="ghost" size="icon">
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">Log Out</span>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}
