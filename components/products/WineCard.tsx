"use client";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { WineCardProps } from "@/types/components";
import { priceConversor } from "@/utils/priceConversor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const WineCard = ({ wine, isFeatured }: WineCardProps) => {
    return (
        <Card className="overflow-hidden flex flex-col justify-between transition-transform hover:scale-105 hover:shadow-lg">
            <CardHeader className="p-0 flex items-center justify-center">
                <Image
                    src={wine.imageUrl || "/placeholder.svg"}
                    alt={wine.productName}
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </CardHeader>
            <CardContent className="p-4 space-y-2 flex flex-col items-left">
                <CardTitle className="text-lg font-semibold truncate">{wine.productName}</CardTitle>
                <div className="flex flex-wrap justify-between items-center">
                    <span className="font-bold text-xl self-start">{priceConversor(wine.price)}</span>
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">{wine.category.toUpperCase()}</Badge>
                        {isFeatured && <Badge variant="default">FEATURED</Badge>}
                        {!wine.isInStock && <Badge variant="destructive">SOLD OUT</Badge>}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{wine.description}</p>
            </CardContent>
            {!isFeatured && (
                <CardFooter className="p-4 pt-0 flex gap-2">
                    <AddToCartButton type="default" wine={wine} />
                </CardFooter>
            )}
            <Link href={`/wines/${wine.wineId}`} passHref>
                <Button variant="secondary" className="p-6 rounded-none rounded-b-md w-full">
                    View Details
                </Button>
            </Link>
        </Card>
    );
};

export default WineCard;
