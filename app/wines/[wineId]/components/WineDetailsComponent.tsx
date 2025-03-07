"use client";
import { useEffect, useState } from "react";
import { api } from "../../../lib/api";
import Image from "next/image";
import { Wine } from "@/app/types";
import WineDetailsSkeleton from "./WineDetailsSkeleton";
import WineAlert from "@/app/components/ui/WineAlertComponent";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Grape, MapPin } from "lucide-react";
import { priceConversor } from "@/app/utils/priceConversor";
import { WineDetailsComponentProps } from "@/app/types/components";
import AddToCartButton from "@/app/components/features/AddToCartButton";

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
        <div className="container mx-auto px-8 py-16">
            <Card className="overflow-hidden shadow-lg rounded-lg ">
                <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2 relative h-[500px] flex items-center justify-center bg-gray-100">
                        <Image
                            src={wine.imageUrl || "/placeholder.svg"}
                            alt={wine.productName}
                            width={800}
                            height={800}
                            className="h-full w-full object-cover rounded-l-lg"
                        />
                    </div>

                    {/* Details Section */}
                    <div className="md:w-1/2 p-8">
                        <CardHeader>
                            <CardTitle className="text-4xl font-extrabold text-gray-500">{wine.productName}</CardTitle>
                            <CardDescription className="text-lg text-gray-600">{wine.producer}</CardDescription>
                            <div className="flex items-center mt-4 space-x-2">
                                <Badge variant="secondary" className="px-3 py-1 text-sm">{wine.vintage}</Badge>
                                <Badge variant="outline" className="px-3 py-1 text-sm">{wine.category.toUpperCase()}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold mt-6 text-primary">{priceConversor(wine.price)}</p>
                            <p className="mt-4 text-lg text-gray-600 leading-relaxed">{wine.description}</p>

                            {/* Wine Details */}
                            <div className="mt-6 space-y-3">
                                <div className="flex items-center">
                                    <Grape className="h-6 w-6 mr-3 text-primary" />
                                    <p className="text-lg">
                                        <strong className="text-gray-600">Producer:</strong> {wine.producer}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-6 w-6 mr-3 text-primary" />
                                    <p className="text-lg">
                                        <strong className="text-gray-600">Region:</strong> {wine.region}
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="mt-10">
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
