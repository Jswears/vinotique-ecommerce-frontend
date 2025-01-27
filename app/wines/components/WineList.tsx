// app/wines/components/WineList.tsx
"use client"
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { api } from '@/app/lib/api';
import { Wine } from '@/app/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';



const WineList = () => {
    const [wines, setWines] = useState<Wine[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState<number | null>(null);
    const [nextToken, setNextToken] = useState<string | null>(null);
    const pageSize = 9;

    useEffect(() => {
        const fetchWines = async () => {
            setLoading(true);
            try {
                const data = await api.get('/wines', { params: { pageSize, nextToken } })
                setWines(data.items)
                setNextToken(data.nextToken)
                setTotalPages(data.nextToken ? currentPage + 1 : currentPage)
            } catch (error: any) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchWines();
    }, [nextToken, currentPage]);

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
        if (newPage === currentPage + 1) {
            //do nothing, since the nextToken will trigger the `useEffect`
        } else {
            setNextToken(null)
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
                    {currentPage > 1 && (<button onClick={() => handlePageChange(currentPage - 1)}>Previous</button>)}
                    <span>Page {currentPage} of {totalPages}</span>
                    {nextToken && (<button onClick={() => handlePageChange(currentPage + 1)}>Next</button>)}
                </div>
            )}
        </div>
    );
};

export default WineList;