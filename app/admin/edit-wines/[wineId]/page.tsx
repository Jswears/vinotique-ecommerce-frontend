import type { Metadata } from "next"
import type { WineDetailsPageProps } from "@/app/types/components"
import EditWineComponent from "./components/EditWineComponent"
import { api } from "@/app/lib/api"
import type { Wine } from "@/app/types"

export async function generateMetadata(props: WineDetailsPageProps): Promise<Metadata> {
    const params = await props.params
    try {
        const { wineId } = params
        const wine = (await api.get(`/wines/${wineId}`)) as Wine
        return {
            title: `Edit ${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Edit details for ${wine.productName}`,
        }
    } catch (error) {
        return {
            title: "Edit Wine",
            description: "Edit wine details",
        }
    }
}

const EditWinePage = async ({ params }: WineDetailsPageProps) => {
    const { wineId } = await params

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Wine</h1>
            <EditWineComponent wineId={wineId} />
        </div>
    )
}

export default EditWinePage

