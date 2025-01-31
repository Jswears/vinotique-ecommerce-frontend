'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Wine, PlusCircle, Edit, Users, ShoppingBag, Home, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/app/components/layout/ThemeToggler"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"

export function AdminSidebar() {
    const pathname = usePathname()

    return (
        <Sidebar>
            <SidebarHeader>
                <Link href="/" className="flex items-center space-x-2 px-4 py-2">
                    <Wine className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold text-primary">Vinotique Admin</span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin'}>
                            <Link href="/admin">
                                <Home className="mr-2 h-4 w-4" />
                                Dashboard
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/add-wine'}>
                            <Link href="/admin/add-wine">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Wine
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/edit-wines'}>
                            <Link href="/admin/edit-wines">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Wines
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/users'}>
                            <Link href="/admin/users">
                                <Users className="mr-2 h-4 w-4" />
                                Users
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild isActive={pathname === '/admin/orders'}>
                            <Link href="/admin/orders">
                                <ShoppingBag className="mr-2 h-4 w-4" />
                                Orders
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <div className="flex items-center justify-between px-4 py-2">
                    <ThemeToggle />
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/logout">
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Log Out</span>
                        </Link>
                    </Button>
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
