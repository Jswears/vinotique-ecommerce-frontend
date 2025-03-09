import type { Metadata, ResolvingMetadata } from "next"
import EditWineComponent from "@/components/admin/editWines/EditWineComponent"
import { api } from "@/lib/api"
import type { Wine } from "@/types"

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
            title: `Edit ${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Edit details for ${wine.productName}`,
            openGraph: {
                images: [wine.imageUrl, ...previousImages],
            },
        }
    } catch {
        return {
            title: "Edit Wine",
            description: "Edit wine details",
        }
    }
}

const EditWinePage = async ({ params }: Props) => {
    const { wineId } = await params

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Wine</h1>
            <EditWineComponent wineId={wineId} />
        </div>
    )
}

export default EditWinePage
