"use client"
import { useState, useEffect } from 'react';
import WineCard from './WineCard';
import { api } from '@/app/lib/api';
import { Wine } from '@/app/types';
import WineCardSkeleton from './WinesCardSkeleton';
import WineAlert from '@/app/components/ui/WineAlertComponent';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const WineList = () => {
    const [wines, setWines] = useState<Wine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [pageTokens, setPageTokens] = useState<(string | null)[]>([null]); // Array to store tokens for each page
    const pageSize = 3;

    useEffect(() => {
        const fetchWines = async () => {
            setLoading(true);
            try {
                const data = await api.get('/wines', { params: { pageSize, nextToken: pageTokens[currentPage - 1] } });
                setWines(data.items);
                setTotalPages(data.totalCount ? Math.ceil(data.totalCount / pageSize) : 1);

                // Update the tokens array with the nextToken
                const updatedTokens = [...pageTokens];
                if (!updatedTokens[currentPage]) updatedTokens[currentPage] = data.nextToken || null;
                setPageTokens(updatedTokens);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWines();
    }, [currentPage]); // Re-fetch wines whenever currentPage changes

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || (totalPages && newPage > totalPages)) return; // Prevent invalid page navigation
        setCurrentPage(newPage);
    };

    const renderPaginationItems = () => {
        const visiblePages = 5; // Number of visible page links
        const startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
        const endPage = Math.min(totalPages || 1, startPage + visiblePages - 1);

        const pages = [];
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <PaginationItem key={i} className={`${i === currentPage ? 'font-bold underline' : ''} cursor-pointer`}>
                    <PaginationLink onClick={() => handlePageChange(i)}>{i}</PaginationLink>
                </PaginationItem>
            );
        }

        return (
            <>
                {startPage > 1 && (
                    <>
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                        </PaginationItem>
                        {startPage > 2 && <PaginationEllipsis />}
                    </>
                )}
                {pages}
                {endPage < (totalPages || 1) && (
                    <>
                        {endPage < (totalPages || 1) - 1 && <PaginationEllipsis />}
                        <PaginationItem>
                            <PaginationLink onClick={() => handlePageChange(totalPages || 1)}>
                                {totalPages}
                            </PaginationLink>
                        </PaginationItem>
                    </>
                )}
            </>
        );
    };

    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        );
    }

    if (loading) return <WineCardSkeleton />;

    if (wines.length === 0 && !loading) {
        return <WineAlert title="No wines available" error="There are no wines available at the moment" />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Wines</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wines?.map((wine) => (
                    <WineCard key={wine.wineId} wine={wine} />
                ))}
            </div>
            {totalPages && (
                <Pagination className="mt-6 flex justify-center items-center">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={currentPage === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Previous
                            </PaginationPrevious>
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                className={currentPage === totalPages ? 'cursor-not-allowed' : 'cursor-pointer'}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Next
                            </PaginationNext>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default WineList;
