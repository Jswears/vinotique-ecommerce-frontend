// app/wines/[wineId]/components/WineDetailsComponent.tsx
'use client'
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import Image from 'next/image';
import { Wine } from '@/app/types';
import WineDetailsSkeleton from './WineDetailsSkeleton';
import WineAlert from '@/app/components/ui/WineAlertComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Grape, MapPin } from 'lucide-react';
import { priceConversor } from '@/app/utils/priceConversor';
import { WineDetailsComponentProps } from '@/app/types/components';
import AddToCartButton from '@/app/components/features/AddToCartButton';


const WineDetailsComponent = ({ wineId }: WineDetailsComponentProps) => {
    const [wine, setWine] = useState<Wine | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWine = async () => {
            setLoading(true)
            try {
                const data = await api.get(`/wines/${wineId}`) as Wine;
                setWine(data)
            } catch (error: any) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchWine()
    }, [wineId])

    if (loading) return <WineDetailsSkeleton />
    if (error) return <WineAlert title={`Error`} error={error} />
    if (!wine) return <WineAlert title={`Not Found`} error={`Wine not found`} />

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2 relative h-[500px] flex items-center justify-center">
                        <Image src={wine.imageUrl || "/placeholder.svg"} alt={wine.name} width={800} height={800} className="h-96 w-fit" />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">{wine.name}</CardTitle>
                            <CardDescription className="text-lg">{wine.producer}</CardDescription>
                            <div className="flex items-center mt-2 space-x-2">
                                <Badge variant="secondary">{wine.vintage}</Badge>
                                <Badge variant="outline">{wine.category.toUpperCase()}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-semibold mt-4 text-primary">{priceConversor(wine.price)}</p>
                            <p className="mt-4 text-muted-foreground">{wine.description}</p>
                            <div className="mt-6 space-y-2">
                                <div className="flex items-center">
                                    <Grape className="h-5 w-5 mr-2 text-primary" />
                                    <p>
                                        <strong>Producer:</strong> {wine.producer}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-primary" />
                                    <p>
                                        <strong>Region:</strong> {wine.region}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8">
                                <AddToCartButton wine={{ wineId: wine.wineId, name: wine.name, price: wine.price, imageUrl: wine.imageUrl }} type='detailed' />
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WineDetailsComponent;