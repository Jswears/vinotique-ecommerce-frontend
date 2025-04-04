"use client";
import WineAlert from "@/components/ui/WineAlertComponent";
import { useWinesStore } from "@/stores/winesStore";
import { useEffect } from "react";
import WineCardSkeleton from "./WinesCardSkeleton";
import WineCard from "./WineCard";

const FeaturedWinesList = () => {
    const { fetchWines, wines, loadingState, error } = useWinesStore();

    useEffect(() => {
        if (loadingState === "idle") {
            fetchWines();
        }
    }, [fetchWines, loadingState]);

    if (loadingState === "loading") return <WineCardSkeleton />;
    if (loadingState === "error") return <WineAlert title="An error occurred" error={error!} />;
    if (loadingState === "success" && wines.length === 0) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment." />;
    }

    const featuredWines = wines.filter(wine => wine.isFeatured);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredWines.map((featuredWine) => (
                <WineCard key={featuredWine.wineId} wine={featuredWine} isFeatured />
            ))}
        </div>
    );
};

export default FeaturedWinesList;
