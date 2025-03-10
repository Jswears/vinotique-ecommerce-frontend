"use client";
import { useState, useEffect } from "react";
import WineCard from "./WineCard";
import WineCardSkeleton from "./WinesCardSkeleton";
import WineAlert from "@/components/ui/WineAlertComponent";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";
import { useWinesStore } from "@/stores/winesStore";
import useCartStore from "@/stores/cartStore";

const WineList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTokens] = useState<(string | null)[]>([null]);
    const [totalItems] = useState<number>(0);
    const pageSize = 20;
    const totalPages = Math.ceil(totalItems / pageSize);

    const { fetchWines, wines, loadingState, error } = useWinesStore();
    const { cartItems } = useCartStore();

    useEffect(() => {
        if (loadingState === "idle") {
            fetchWines();
        }
    }, [fetchWines, loadingState]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;
        if (newPage > 1 && !pageTokens[newPage - 1]) return;
        setCurrentPage(newPage);
    };

    const renderPaginationItems = () => {
        const visiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        const endPage = Math.min(totalPages, startPage + visiblePages - 1);

        return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
            const pageNumber = startPage + i;
            const isDisabled = pageNumber > 1 && !pageTokens[pageNumber - 1];

            return (
                <PaginationItem key={pageNumber}>
                    <PaginationLink
                        onClick={() => !isDisabled && handlePageChange(pageNumber)}
                        isActive={pageNumber === currentPage}
                        className={isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                    >
                        {pageNumber}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    if (loadingState === "loading") return <WineCardSkeleton />;
    if (loadingState === "error") return <WineAlert title="An error occurred" error={error!} />;
    if (loadingState === "success" && wines.length === 0) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment." />;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
            <h2 className="text-3xl font-semibold text-center">Our Wines</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {wines.map((wine) => (
                    <WineCard key={wine.wineId} wine={wine} isFeatured={false} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-8 flex justify-center">
                    <PaginationContent className="flex gap-2">
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={`transition-colors ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:text-primary cursor-pointer"
                                    }`}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`transition-colors ${currentPage === totalPages || !pageTokens[currentPage]
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:text-primary cursor-pointer"
                                    }`}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default WineList;
