import type { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { priceConversor } from "@/utils/priceConversor";
import { ArrowRight } from "lucide-react";

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    if (orders.length === 0) {
        return <p className="text-red-500 text-center p-4">No orders available.</p>;
    }

    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="relative">
            <div className="overflow-x-auto w-full relative">
                <Table className="min-w-[600px] md:w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentOrders.map((order) => (
                            <TableRow key={order.orderId}>
                                <TableCell className="font-medium">{order.orderId.slice(0, 8)}...</TableCell>
                                <TableCell>{order.customer}</TableCell>
                                <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">{priceConversor(order.totalAmount)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="absolute -right-10 top-2/4 transform -translate-y-1/2 text-gray-400 flex items-center sm:hidden">
                <span className="text-xs mr-1">Swipe</span>
                <ArrowRight className="animate-bounce-x" />
            </div>
        </div>
    );
}
