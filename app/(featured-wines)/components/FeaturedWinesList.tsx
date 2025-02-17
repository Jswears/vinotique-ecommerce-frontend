'use client';

import WineAlert from "@/app/components/ui/WineAlertComponent";
import { api } from "@/app/lib/api";
import { Wine } from "@/app/types";
import WineCard from "@/app/wines/components/WineCard";
import WineCardSkeleton from "@/app/wines/components/WinesCardSkeleton";
import { useEffect, useState } from "react";

const FeaturedWinesList = () => {
    const [loading, setloading] = useState<boolean>(false);
    const [error, seterror] = useState<string | null>(null);
    const [wines, setwines] = useState<Wine[]>([]);

    useEffect(() => {
        const fetchWines = async () => {
            setloading(true);
            try {
                // Fetch wines
                const response = await api.get('/wines');
                setwines(response.wines);
            } catch (error: any) {
                seterror(error.message);
            } finally {
                setloading(false);
            }
        }
        fetchWines();
    }, []);

    const featuredWines = wines.filter(wine => wine.isFeatured);

    if (error) {
        return <WineAlert title="No featured Wines available" error={error} />;
    }

    if (loading) {
        return <WineCardSkeleton />;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
            {featuredWines.map((featuredWine) => (
                <WineCard key={featuredWine.wineId} wine={featuredWine} isFeatured={featuredWine.isFeatured} />
            ))}
        </div>
    );
}

export default FeaturedWinesList;