"use client"
import { useState, useEffect } from 'react';
import WineCard from './WineCard';
import WineCardSkeleton from './WinesCardSkeleton';
import WineAlert from '@/app/components/ui/WineAlertComponent';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useWinesStore } from '@/stores/winesStore';

const WineList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageTokens, setPageTokens] = useState<(string | null)[]>([null]);
    const [totalItems, setTotalItems] = useState<number>(0);
    const pageSize = 20;
    const totalPages = Math.ceil(totalItems / pageSize);

    const { fetchWines, wines, loadingState, error } = useWinesStore();

    useEffect(() => {
        if (loadingState === 'idle') {
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
                        className={isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    >
                        {pageNumber}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    if (loadingState === 'loading') {
        return <WineCardSkeleton />;
    }

    if (loadingState === 'error') {
        return <WineAlert title="An error occurred" error={error!} />;
    }

    if (loadingState === 'success' && wines.length === 0) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Our Wines</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wines.map((wine) => (
                    <WineCard key={wine.wineId} wine={wine} isFeatured={false} />
                ))}
            </div>
            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                className={currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={
                                    currentPage === totalPages || !pageTokens[currentPage]
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'cursor-pointer'
                                }
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default WineList;