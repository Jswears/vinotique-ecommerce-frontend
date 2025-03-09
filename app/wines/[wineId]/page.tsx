import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/lib/api";
import type { Wine } from "@/types";
import WineDetailsComponent from "../../../components/products/WineDetailsComponent";

type Props = {
    params: { wineId: string };
};

// Generate SEO Metadata
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    try {
        const { wineId } = await params;
        const wine = (await api.get(`/wines/${wineId}`)) as Wine;
        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: `${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Details about ${wine.productName} from ${wine.region}.`,
            openGraph: {
                images: [wine.imageUrl, ...previousImages],
            },
        };
    } catch {
        return {
            title: "Wine Details",
            description: "Explore details about this wine.",
        };
    }
}

// Wine Details Page
const WineDetailsPage = async ({ params }: Props) => {
    return (
        <div className="container mx-auto px-8 py-16">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-8 text-center">
                Wine Details
            </h1>
            <WineDetailsComponent wineId={params.wineId} />
        </div>
    );
};

export default WineDetailsPage;
