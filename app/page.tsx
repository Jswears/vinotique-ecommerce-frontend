import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import FeaturedWinesList from "../components/products/FeaturedWinesList";

const HomePage = () => {
  return (
    <div className="h-dvh flex flex-col justify-between container mx-auto px-6 py-24 space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 flex flex-col items-center justify-between">
        <h1 className="text-4xl font-bold text-foreground leading-tight">
          Welcome to Vinotique
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Discover our curated selection of fine wines from around the world.
        </p>
        <Link href="/wines" passHref>
          <Button size="lg" className="rounded-full hover:scale-105 transition-transform">
            Explore All Wines <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Featured Wines Section */}
      <section className="space-y-10">
        <h2 className="text-2xl font-semibold text-foreground text-center">
          Featured Wines
        </h2>
        <FeaturedWinesList />
      </section>

      {/* Call-to-Action */}
      <section className="text-center flex flex-col justify-between bg-accent/80 rounded-md p-10 space-y-6 shadow-md">
        <h2 className="text-2xl font-semibold dark:text-black text-muted-foreground">Ready to explore more?</h2>
        <p className="text-lg dark:text-black/50 text-muted-foreground   leading-relaxed">
          Visit our full collection to find your perfect wine.
        </p>
        <Link href="/wines" passHref>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full hover:scale-105 transition-transform"
          >
            View All Wines <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;
