"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

// This is a placeholder. Replace with actual data fetching logic.
const mockOrders = [
    { id: 1, customer: "John Doe", date: "2023-05-15", total: 599.99, status: "Completed" },
    { id: 2, customer: "Jane Smith", date: "2023-05-16", total: 399.99, status: "Processing" },
    { id: 3, customer: "Bob Johnson", date: "2023-05-17", total: 249.99, status: "Shipped" },
]

export default function OrdersPage() {
    const [orders, setOrders] = useState(mockOrders)
    const [searchTerm, setSearchTerm] = useState("")

    // Implement actual search logic
    const filteredOrders = orders.filter(
        (order) =>
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) || order.id.toString().includes(searchTerm),
    )

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Manage Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Input
                            placeholder="Search orders..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.date}</TableCell>
                                    <TableCell>${order.total.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                order.status === "Completed"
                                                    ? "default"
                                                    : order.status === "Processing"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {order.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

