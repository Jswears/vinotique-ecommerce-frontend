'use client'
import { WineCardProps } from '@/app/types/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';


const WineCard = ({ wine }: WineCardProps) => {
    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="p-0 flex items-center justify-center">
                <Image src={wine.imageUrl || "/placeholder.svg"} alt={wine.name} width={800} height={800} className="w-fit h-80 object-fit" />
            </CardHeader>
            <CardContent className="p-4 space-y-2">
                <CardTitle className="text-lg font-semibold line-clamp-1">{wine.name}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">{wine.description}</p>
                <div className="flex items-center justify-start space-x-2">
                    <Badge variant="secondary">{wine.category.toUpperCase()}</Badge>
                    {!wine.isAvailable && (
                        <Badge variant="destructive">SOLD OUT</Badge>
                    )}
                    <span className="font-bold">€{wine.price.toFixed(2)}</span>
                </div>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Link href={`/wines/${wine.wineId}`} passHref className="w-full">
                    <Button variant="default" className="w-full">
                        View Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    )
}

export default WineCard;