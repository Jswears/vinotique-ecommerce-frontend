"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import TotalStats from "@/components/admin/statistics/TotalStats";
import TopSellingWines from "@/components/admin/statistics/TopSellingWines";
import OrderStatusChart from "@/components/admin/statistics/OrderStatusChart";
import RecentOrders from "@/components/admin/statistics/RecentOrders";
import { useWinesStore } from "@/stores/winesStore";
import { useOrdersStore } from "@/stores/ordersStore";
import SalesByCategoryDashboard from "@/components/admin/statistics/SalesByCategoryChart";

export default function AdminStatisticsPage() {
    const { wines, fetchWines } = useWinesStore();
    const { orders, fetchOrders } = useOrdersStore();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setError(null);
            try {
                setIsLoading(true);
                if (wines.length === 0) await fetchWines();
                if (orders.length === 0) await fetchOrders();
                if (wines.length === 0 || orders.length === 0) {
                    setError("No orders or wines available.");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch data.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchWines, fetchOrders, wines.length, orders.length]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-10 w-10 animate-spin" />
            </div>
        );
    }

    if (error && isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-600 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Dashboard Header */}
            <header className="text-center">
                <h1 className="text-4xl font-bold">Admin Statistics Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Real-time insights into sales, orders, and performance
                </p>
            </header>

            {/* Stats Overview */}
            <section>
                <TotalStats wines={wines} orders={orders} />
            </section>

            {/* Charts Row */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="shadow-lg">
                    <OrderStatusChart orders={orders} />
                </div>
                <div className="shadow-lg">
                    <TopSellingWines orders={orders} />
                </div>
            </section>

            {/* Detailed Charts */}
            <section className="grid gap-6 md:grid-cols-2">
                <div className="shadow-lg">
                    <SalesByCategoryDashboard orders={orders} wines={wines} />
                </div>
                <div className="shadow-lg">
                    <RecentOrders orders={orders} />
                </div>
            </section>
        </div>
    );
}
