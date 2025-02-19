import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Wine, Order } from "@/app/types";
import { priceConversor } from "@/app/utils/priceConversor";

interface TotalStatsProps {
    wines: Wine[];
    orders: Order[];
}

export default function TotalStats({ wines, orders }: TotalStatsProps) {
    if (wines.length === 0 || orders.length === 0) {
        return <p className="text-red-500">No orders or wines available.</p>;
    }

    const totalWines = wines.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const averageOrderValue = totalRevenue / totalOrders;

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Wines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalWines}</div>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{priceConversor(totalRevenue)}</div>
                </CardContent>
            </Card>
            <Card className="shadow-md">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{priceConversor(averageOrderValue)}</div>
                </CardContent>
            </Card>
        </div>
    );
}
