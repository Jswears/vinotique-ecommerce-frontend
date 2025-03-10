import WineList from "@/components/products/WineList";
import { Metadata } from "next";

// TODO: Ensure metadata consistency across pages
export const metadata: Metadata = {
    title: "Wines | Vinotique Wine Shop",
    description: "Browse our curated selection of fine wines from around the world.",
};

const WinesPage = () => {
    return (
        <div className="container mx-auto px-6 py-16 space-y-12">
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-foreground leading-tight">
                    Explore Our Collection
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover the perfect wine for any occasion.
                </p>
            </section>
            <WineList />
        </div>
    );
};

export default WinesPage;
