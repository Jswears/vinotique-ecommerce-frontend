import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Trash2, CreditCard } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const CartItemsSkeleton = () => {
    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <Card className="shadow-md border border-border rounded-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold flex items-center">
                        <ShoppingCart className="mr-2 h-8 w-8 text-primary" />
                        Your Cart
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[50vh] pr-6">
                        {[...Array(3)].map((_, index) => (
                            <div key={index}>
                                <Skeleton className="h-24 w-full mb-4 rounded-lg" />
                                {index < 2 && <Separator className="my-4" />}
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <div>
                        <Skeleton className="h-6 w-24 mb-2" />
                        <Skeleton className="h-8 w-32 rounded-lg" />
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" disabled>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Clear Cart
                        </Button>
                        <Button variant="default" disabled>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Checkout
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default CartItemsSkeleton;
