"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Image from "next/image";
import { Wine } from "@/types";
import WineDetailsSkeleton from "./WineDetailsSkeleton";
import WineAlert from "@/components/ui/WineAlertComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grape, MapPin } from "lucide-react";
import { priceConversor } from "@/utils/priceConversor";
import { WineDetailsComponentProps } from "@/types/components";
import AddToCartButton from "@/components/cart/AddToCartButton";

const WineDetailsComponent = ({ wineId }: WineDetailsComponentProps) => {
    const [wine, setWine] = useState<Wine | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWine = async () => {
            try {
                const data = (await api.get(`/wines/${wineId}`)) as Wine;
                setWine(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unknown error occurred");
            }
        };
        fetchWine();
    }, [wineId]);

    if (!wine && !error) return <WineDetailsSkeleton />;
    if (error) return <WineAlert title="Error" error={error} />;
    if (!wine) return <WineAlert title="Not Found" error="Wine not found" />;

    return (
        <div className="container mx-auto sm:px-6 py-16">
            <Card className="overflow-hidden shadow-xl rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image Section */}
                    <div className="relative h-[500px] flex items-center justify-center bg-gray-100">
                        <Image
                            src={wine.imageUrl || "/placeholder.svg"}
                            alt={wine.productName}
                            width={800}
                            height={800}
                            className="h-full w-fit object-cover rounded-l-lg md:rounded-none"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="sm:p-8 space-y-6">
                        <CardHeader>
                            <CardTitle className="text-4xl font-extrabold">{wine.productName}</CardTitle>
                            <CardDescription className="text-lg text-muted-foreground">{wine.producer}</CardDescription>
                            <div className="flex items-center mt-4 space-x-3">
                                <Badge variant="secondary" className="px-3 py-1 text-sm">{wine.vintage}</Badge>
                                <Badge variant="outline" className="px-3 py-1 text-sm">{wine.category.toUpperCase()}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-3xl font-bold text-primary">{priceConversor(wine.price)}</p>
                            <p className="text-lg text-muted-foreground leading-relaxed">{wine.description}</p>

                            {/* Wine Details */}
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <Grape className="h-5 w-5 mr-3 text-primary" />
                                    <p className="text-lg">
                                        <span className="font-medium text-muted-foreground">Producer:</span> {wine.producer}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-3 text-primary" />
                                    <p className="text-lg">
                                        <span className="font-medium text-muted-foreground">Region:</span> {wine.region}
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="mt-6">
                                <AddToCartButton wine={wine} type="default" />
                            </div>
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default WineDetailsComponent;
