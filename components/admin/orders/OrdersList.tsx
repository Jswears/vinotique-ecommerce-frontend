"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Loader } from "lucide-react";
import { priceConversor } from "@/utils/priceConversor";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/utils/formatDate";
import { useOrdersStore } from "@/stores/ordersStore";
import { Order } from "@/types";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";


export default function OrdersList() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const { orders, fetchOrders, loadingOrdersState, error } = useOrdersStore();

    useEffect(() => {
        if (loadingOrdersState === "idle") {
            fetchOrders();
        }
    }, [fetchOrders, loadingOrdersState]);

    const getStatusVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "complete":
                return "default";
            case "pending":
                return "secondary";
            case "shipped":
                return "outline";
            default:
                return "destructive";
        }
    };

    const filteredOrders = orders.filter(
        (order) =>
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderId.toString().includes(searchTerm)
    );

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

                    {loadingOrdersState === "loading" ? (
                        <div className="flex justify-center items-center">
                            <Loader className="animate-spin h-8 w-8" />
                        </div>
                    ) : error ? (
                        <p>Error: {error}</p>
                    ) : (
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
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map((order) => (
                                        <TableRow key={order.orderId}>
                                            <TableCell>{order.orderId}</TableCell>
                                            <TableCell>{order.customer}</TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>{priceConversor(order.totalAmount)}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(order.orderStatus)}>
                                                    {order.orderStatus}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setSelectedOrder(order)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No orders found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Order Details Modal */}
            {selectedOrder && (
                <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <VisuallyHidden>
                                <DialogTitle>Order Details</DialogTitle>
                            </VisuallyHidden>
                        </DialogHeader>
                        <div className="space-y-2">
                            <p><strong>Customer:</strong> {selectedOrder.customer}</p>
                            <p><strong>Order ID:</strong> {selectedOrder.orderId}</p>
                            <p><strong>Total:</strong> €{selectedOrder.totalAmount}</p>
                            <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                            <p><strong>Date:</strong> {formatDate(selectedOrder.createdAt)}</p>

                            {selectedOrder.shippingDetails && (
                                <div>
                                    <h3 className="font-semibold">Shipping Address:</h3>
                                    <p>{selectedOrder.shippingDetails.address.line1}, {selectedOrder.shippingDetails.address.city}, {selectedOrder.shippingDetails.address.country}, {selectedOrder.shippingDetails.address.postal_code}</p>
                                </div>
                            )}

                            {selectedOrder.cartItems && selectedOrder.cartItems.length > 0 && (
                                <div>
                                    <h3 className="font-semibold">Items:</h3>
                                    <ul className="list-disc pl-5">
                                        {selectedOrder.cartItems.map((cartItem) => (
                                            <li key={cartItem.wineId}>
                                                {cartItem.productName} - {cartItem.quantity} x {priceConversor(cartItem.price)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}
