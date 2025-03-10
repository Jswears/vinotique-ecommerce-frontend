import type { Metadata, ResolvingMetadata } from "next";
import { api } from "@/lib/api";
import type { Wine } from "@/types";
import WineDetailsComponent from "../../../components/products/WineDetailsComponent";

type Props = {
    params: Promise<{ wineId: string }>;
};

// Generate SEO Metadata
export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    try {
        const { wineId } = await params;
        const wine = (await api.get(`/wines/${wineId}`)) as Wine;
        const previousImages = (await parent).openGraph?.images || [];

        return {
            title: `${wine.vintage} ${wine.productName} - ${wine.producer}`,
            description: `Discover details about ${wine.productName} from ${wine.region}.`,
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
    const { wineId } = await params;
    return (
        <div className="container mx-auto px-6 py-16 space-y-12">
            <section className="text-center space-y-4">
                <h1 className="text-5xl font-bold text-foreground leading-tight">
                    Wine Details
                </h1>
            </section>
            <WineDetailsComponent wineId={wineId} />
        </div>
    );
};

export default WineDetailsPage;
