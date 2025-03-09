import type { Order } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TopSellingWinesProps {
    orders: Order[];
}

export default function TopSellingWines({ orders }: TopSellingWinesProps) {
    if (orders.length === 0) {
        return <p className="text-red-500">No orders available.</p>;
    }

    const winesSold = orders.flatMap((order) => order.cartItems).reduce((acc, item) => {
        if (!item) return acc;
        const existingItem = acc.find((i) => i.wineId === item.wineId);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, [] as { wineId: string; productName: string; quantity: number }[]);

    const topWines = winesSold.sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Wine</TableHead>
                        <TableHead className="text-right">Quantity Sold</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {topWines.map((wine) => (
                        <TableRow key={wine.wineId}>
                            <TableCell>{wine.productName}</TableCell>
                            <TableCell className="text-right">{wine.quantity}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
