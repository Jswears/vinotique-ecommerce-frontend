import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"


const WineDetailsSkeleton = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-1/2">
                        <Skeleton className="w-full h-[500px]" />
                    </div>
                    <div className="md:w-1/2 p-6">
                        <CardHeader>
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-6 w-1/2 mt-2" />
                            <div className="flex items-center mt-2 space-x-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-24 mt-4" />
                            <Skeleton className="h-20 w-full mt-4" />
                            <div className="mt-6 space-y-2">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-6 w-1/2" />
                            </div>
                            <Skeleton className="h-10 w-32 mt-8" />
                        </CardContent>
                    </div>
                </div>
            </Card>
        </div>
    )
}


export default WineDetailsSkeleton;
