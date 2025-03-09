"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import type { Order, Wine } from "@/types";
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
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { useState } from "react";

interface SalesByCategoryDashboardProps {
    orders: Order[];
    wines: Wine[];
}

// Define a theme for each wine category with colors that work well in both light and dark modes.
// For "White", we use a light gray fill and background so text remains visible.
const categoryTheme: Record<
    string,
    { fill: string; bg: string; border: string; text: string }
> = {
    Red: { fill: "#E53E3E", bg: "bg-red-100", border: "border-red-500", text: "text-red-700" },
    White: { fill: "#CBD5E0", bg: "bg-gray-200", border: "border-gray-400", text: "text-gray-800" },
    Rose: { fill: "#ED64A6", bg: "bg-pink-100", border: "border-pink-500", text: "text-pink-700" },
    Sparkling: { fill: "#F6E05E", bg: "bg-yellow-100", border: "border-yellow-500", text: "text-yellow-700" },
    Dessert: { fill: "#9F7AEA", bg: "bg-purple-100", border: "border-purple-500", text: "text-purple-700" },
    Fortified: { fill: "#805AD5", bg: "bg-indigo-100", border: "border-indigo-500", text: "text-indigo-700" },
};

export default function SalesByCategoryDashboard({ orders, wines }: SalesByCategoryDashboardProps) {
    // Get unique categories from the wines.
    const categories = Array.from(new Set(wines.map((wine) => wine.category)));

    // State for the active category.
    const [activeCategory, setActiveCategory] = useState<string>(categories[0]);

    if (orders.length === 0 || wines.length === 0) {
        return <p className="text-red-500">No orders or wines available.</p>;
    }

    // Compute total sales per category (converting cents to dollars).
    const categoryTotals: Record<string, number> = categories.reduce((acc, category) => {
        let total = 0;
        orders.forEach((order) => {
            order.cartItems?.forEach((item) => {
                const wine = wines.find((w) => w.wineId === item.wineId);
                if (wine && wine.category === category) {
                    total += item.quantity * item.price;
                }
            });
        });
        acc[category] = total / 100;
        return acc;
    }, {} as Record<string, number>);

    // Compute overall monthly sales (aggregated across all categories).
    const overallMonthlySales: Record<string, number> = {};
    orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = orderDate.toISOString().slice(0, 7); // "YYYY-MM"
        order.cartItems?.forEach((item) => {
            overallMonthlySales[monthKey] = (overallMonthlySales[monthKey] || 0) + item.quantity * item.price;
        });
    });
    const overallMonthlyData = Object.entries(overallMonthlySales)
        .map(([month, sales]) => ({ month, sales: sales / 100 }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Compute monthly sales for the selected category.
    const monthlySalesRaw: Record<string, number> = {};
    orders.forEach((order) => {
        const orderDate = new Date(order.createdAt);
        const monthKey = orderDate.toISOString().slice(0, 7);
        order.cartItems?.forEach((item) => {
            const wine = wines.find((w) => w.wineId === item.wineId);
            if (wine && wine.category === activeCategory) {
                monthlySalesRaw[monthKey] = (monthlySalesRaw[monthKey] || 0) + item.quantity * item.price;
            }
        });
    });
    const monthlyData = Object.entries(monthlySalesRaw)
        .map(([month, sales]) => ({ month, sales: sales / 100 }))
        .sort((a, b) => a.month.localeCompare(b.month));

    // Chart configuration uses the active category’s fill color.
    const chartConfig = {
        sales: {
            label: "Sales",
            color: categoryTheme[activeCategory]?.fill || "blue",
        },
    } satisfies ChartConfig;

    return (
        <div className="space-y-8 p-4">
            {/* Dashboard Header */}
            <div className="text-center">
                <h1 className="text-2xl font-bold">Sales Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                    Overview and detailed trends by wine category
                </p>
            </div>

            {/* General Overview Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">General Overview</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Overall monthly sales across all categories
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart data={overallMonthlyData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value + "-01");
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="sales"
                                        labelFormatter={(value) => {
                                            const date = new Date(value + "-01");
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            });
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="sales" fill="steelblue" />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Category Summary Card */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Sales Summary by Category</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Select a category to see detailed trends
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition-all hover:shadow-md 
                ${activeCategory === category ? categoryTheme[category].bg : "bg-transparent"}
                ${categoryTheme[category].border} 
                ${activeCategory === category ? categoryTheme[category].text : "text-muted-foreground"}`}
                        >
                            <span className="font-semibold">{category}</span>
                            <span className="text-xl">{categoryTotals[category].toLocaleString()}</span>
                        </button>
                    ))}
                </CardContent>
            </Card>

            {/* Detailed Chart Card for Selected Category */}
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{activeCategory} Sales Over Time</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        Monthly breakdown for the selected category
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px] w-full">
                        <BarChart data={monthlyData} margin={{ left: 12, right: 12 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis
                                dataKey="month"
                                tickLine={false}
                                axisLine={false}
                                tickMargin={8}
                                minTickGap={32}
                                tickFormatter={(value) => {
                                    const date = new Date(value + "-01");
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        year: "numeric",
                                    });
                                }}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        className="w-[150px]"
                                        nameKey="sales"
                                        labelFormatter={(value) => {
                                            const date = new Date(value + "-01");
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                year: "numeric",
                                            });
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="sales" fill={categoryTheme[activeCategory]?.fill || "blue"} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}
