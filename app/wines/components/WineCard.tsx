'use client'
import AddToCartButton from '@/app/components/features/AddToCartButton';
import { WineCardProps } from '@/app/types/components';
import { priceConversor } from '@/app/utils/priceConversor';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';


const WineCard = ({ wine }: WineCardProps) => {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="p-0 flex items-center justify-center">
                <Image src={wine.imageUrl || "/placeholder.svg"} alt={wine.productName} width={800} height={800} className="w-fit h-80 object-fit" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg font-semibold line-clamp-1">{wine.productName}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{wine.description}</p>
                <div className="flex items-center justify-start space-x-2">
                    <Badge variant="secondary">{wine.category.toUpperCase()}</Badge>
                    {wine.isFeatured && (
                        <Badge variant="default">FEATURED</Badge>
                    )}
                    {!wine.isInStock && (
                        <Badge variant="destructive">SOLD OUT</Badge>
                    )}
                    <span className="font-bold">{priceConversor(wine.price)}</span>
                </div>
            </CardContent>
            {wine.isFeatured ? (
                ""
            ) : (
                <CardFooter className="p-4 pt-0 flex gap-2">
                    <AddToCartButton type='default' wine={wine} />
                </CardFooter>
            )}

            <Link href={`/wines/${wine.wineId}`} passHref className="w-full">
                <Button variant="secondary" className={`w-full ${wine.isFeatured ? "rounded-b-lg p-6" : ""}`}>
                    View Details
                </Button>
            </Link>
        </Card>
    )
}

export default WineCard;