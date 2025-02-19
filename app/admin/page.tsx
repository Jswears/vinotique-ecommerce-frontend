'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWinesStore } from "@/stores/winesStore";
import { Wine, Users, ShoppingBag } from "lucide-react"
import { useEffect } from "react";
import WineAlert from "../components/ui/WineAlertComponent";
import AdminDashboardSkeleton from "./components/AdminDashboardSkeleton";
import { useOrdersStore } from "@/stores/ordersStore";

export default function AdminDashboard() {
    const { totalWinesCount, fetchWines, wines, error, loadingState } = useWinesStore();
    const { totalOrdersCount, fetchOrders } = useOrdersStore();

    useEffect(() => {
        if (wines.length === 0) {
            fetchWines();
        }
    }, [fetchWines, wines.length]);

    useEffect(() => {
        if (loadingState === 'idle') {
            fetchWines();
        }
    }, [fetchWines, loadingState]);


    useEffect(() => {
        if (totalOrdersCount === 0) {
            fetchOrders();
        }
    }, [fetchOrders, totalOrdersCount]);
    if (loadingState === "loading") {
        <AdminDashboardSkeleton />;
    }

    if (loadingState === "error") {
        return <WineAlert title="An error occurred" error={error!} />;
    }

    if (loadingState === "success" && wines.length === 0) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment" />;
    }
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Wines</CardTitle>
                        <Wine className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalWinesCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrdersCount}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

