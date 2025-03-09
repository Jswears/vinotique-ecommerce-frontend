import type { Order } from "@/types";
import { Pie, PieChart, Tooltip } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";

interface OrderStatusChartProps {
    orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
    PENDING: "#FFBB28",
    SHIPPED: "#0088FE",
    DELIVERED: "#00C49F",
    CANCELLED: "#FF8042",
};

export default function OrderStatusChart({ orders }: OrderStatusChartProps) {
    if (orders.length === 0) {
        return <p className="text-red-500">No orders available.</p>;
    }

    const statusCounts = orders.reduce((acc, order) => {
        acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const data = Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
        fill: STATUS_COLORS[status] || "#8884d8",
    }));

    const chartConfig = Object.keys(statusCounts).reduce((acc, status) => {
        acc[status] = {
            label: status,
            color: STATUS_COLORS[status] || "#8884d8",
        };
        return acc;
    }, {} as ChartConfig);

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Order Status Chart</CardTitle>
                <CardDescription>Current Order Distribution</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <Pie data={data} dataKey="value" outerRadius={80} label />
                        <Tooltip />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="name" />}
                            className="mt-2 flex flex-wrap gap-2 justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
