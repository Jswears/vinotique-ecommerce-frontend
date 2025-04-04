import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "../../components/layout/AdminSidebar"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Admin Panel | Vinotique Wine Shop",
    description: "Admin panel for Vinotique Wine Shop",
};


export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen">
            <SidebarProvider>
                <AdminSidebar />
                <main className="flex-1 overflow-y-auto p-6">
                    <SidebarTrigger />
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}