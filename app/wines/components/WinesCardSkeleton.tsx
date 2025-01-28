import { Skeleton } from "@/components/ui/skeleton";

const WineCardSkeleton = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Our Wines</h1>
            <div className=" justify-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <Skeleton key={index} className="h-[300px] w-full" />
                ))}
            </div>
        </div>
    );
}

export default WineCardSkeleton;