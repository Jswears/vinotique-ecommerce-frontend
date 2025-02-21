import type { Metadata, ResolvingMetadata } from "next"
import { api } from "@/app/lib/api"
import type { Wine } from "@/app/types"
import WineDetailsComponent from "./components/WineDetailsComponent"

type Props = {
    params: Promise<{ wineId: string }>
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { wineId } = await params

    try {
        const wine = (await api.get(`/wines/${wineId}`)) as Wine
        const previousImages = (await parent).openGraph?.images || []

        return {
            title: `${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Details about ${wine.productName}`,
            openGraph: {
                images: [wine.imageUrl, ...previousImages],
            },
        }
    } catch {
        return {
            title: "Wine Details",
            description: "Wine details",
        }
    }
}

const WineDetailsPage = async ({ params }: Props) => {
    const { wineId } = await params

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Wine</h1>
            <WineDetailsComponent wineId={wineId} />
        </div>
    )
}

export default WineDetailsPage