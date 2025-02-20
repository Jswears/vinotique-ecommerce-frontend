'use client';

import WineAlert from "@/app/components/ui/WineAlertComponent";
import { api } from "@/app/lib/api";
import { Wine } from "@/app/types";
import WineCard from "@/app/wines/components/WineCard";
import WineCardSkeleton from "@/app/wines/components/WinesCardSkeleton";
import { Button } from "@/components/ui/button";
import { useWinesStore } from "@/stores/winesStore";
import { useEffect, useState } from "react";

const FeaturedWinesList = () => {


    const { fetchWines, wines, loadingState, error } = useWinesStore();

    useEffect(() => {
        if (loadingState === 'idle') {
            fetchWines();
        }
    }, [fetchWines, loadingState]);

    if (loadingState === 'loading') {
        return <WineCardSkeleton />;
    }

    if (loadingState === 'error') {
        return <WineAlert title="An error occurred" error={error!} />;
    }

    if (loadingState === 'success' && wines.length === 0) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment" />;
    }

    const featuredWines = wines.filter(wine => wine.isFeatured);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-center gap-6">
            {featuredWines.map((featuredWine) => (
                <WineCard key={featuredWine.wineId} wine={featuredWine} isFeatured={true} />
            ))}
        </div>
    );
}

export default FeaturedWinesList;