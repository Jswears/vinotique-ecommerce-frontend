import { api } from "@/app/lib/api";
import { Wine } from "@/app/types";
import { Metadata } from "next";
import WineDetailsComponent from "./components/WineDetailsComponent";
import { WineDetailsPageProps } from "@/app/types/components";


export async function generateMetadata(props: WineDetailsPageProps): Promise<Metadata> {
    const params = await props.params;
    try {
        const { wineId } = params;
        const wine = await api.get(`/wines/${wineId}`) as Wine;
        return {
            title: `${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Details about ${wine.productName}`
        }
    } catch (error) {
        return {
            title: "Wine Details",
            description: "Wine details"
        }
    }
}

const WineDetailsPage = async ({ params }: WineDetailsPageProps) => {
    const { wineId } = await params;
    return (
        <WineDetailsComponent wineId={wineId} />
    )
}

export default WineDetailsPage;