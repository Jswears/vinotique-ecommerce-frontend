// app/wines/components/WineList.tsx
"use client"
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { api } from '@/app/lib/api';
import { Wine } from '@/app/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';



const WineList = () => {
    const [wines, setWines] = useState<Wine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const pageSize = 3;

    useEffect(() => {
        const fetchWines = async () => {
            setLoading(true);
            try {
                const data = await api.get('/wines', { params: { pageSize, nextToken } })
                setWines(data.items)
                setNextToken(data.nextToken)
                setTotalPages(data.totalCount ? Math.ceil(data.totalCount / pageSize) : 1) // Calculate total pages based on totalCount
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWines();
    }, [currentPage]); // Removed nextToken dependency

    const handlePageChange = async (newPage: number) => {
        if (newPage > currentPage && nextToken) {
            setCurrentPage(newPage);
        } else if (newPage < currentPage) {
            setCurrentPage(newPage);
            setNextToken(null);
        } else {
            setLoading(true);
            try {
                const data = await api.get('/wines', { params: { pageSize, nextToken: null } })
                setWines(data.items)
                setNextToken(data.nextToken)
                setTotalPages(data.totalCount ? Math.ceil(data.totalCount / pageSize) : 1) // Calculate total pages based on totalCount
                setCurrentPage(newPage);
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }
    }

    if (error) {
        return (
            <div className="text-center mt-20">
                <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Wines</h1>
                <div className=" justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, index) => (
                        <Skeleton key={index} className="h-[300px] w-full" />
                    ))}
                </div>
            </div>
        )
    }

    if (wines.length === 0 && !loading) {
        return (
            <div className='flex justify-center items-center h-[calc(100dvh-64px)]'>
                <Alert className='h-36 flex flex-col justify-center items-center'>
                    <AlertTitle>No wines available</AlertTitle>
                    <AlertDescription>There are no wines available at the moment.</AlertDescription>
                </Alert>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Wines</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wines?.map((wine) => (
                    <ProductCard key={wine.wineId} wine={wine} />
                ))}
            </div>
            {totalPages && (
                <div className="mt-6 flex justify-between items-center">
                    {currentPage > 1 && (
                        <Button
                            variant={'secondary'}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            Previous
                        </Button>
                    )}
                    <span className="text-gray-700 dark:text-gray-300 font-medium">
                        Page {currentPage} of {totalPages}
                    </span>
                    {currentPage < totalPages && (
                        <Button
                            variant={'secondary'}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            Next
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default WineList;