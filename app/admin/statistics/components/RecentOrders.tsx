import type { Order } from "@/app/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { priceConversor } from "@/app/utils/priceConversor";

interface RecentOrdersProps {
    orders: Order[];
}

export default function RecentOrders({ orders }: RecentOrdersProps) {
    if (orders.length === 0) {
        return <p className="text-red-500">No orders available.</p>;
    }

    const recentOrders = orders
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    return (
        <div className="overflow-x-auto">
            <Table>
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
    );
}
