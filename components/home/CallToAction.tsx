import Link from "next/link";

const CallToAction = () => {
    return (
        <div className="w-full flex flex-col items-center justify-center bg-orange-600 p-8 rounded-lg mb-16">
            <h2 className="text-2xl font-bold text-white text-center">
                Ready to explore more?
            </h2>
            <p className="text-white text-center mt-2">
                Visit our full collection to find your perfect wine.
            </p>
            <Link
                href="/wines"
                className="mt-6 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition"
            >
                View All Wines →
            </Link>
        </div>
    );
};

export default CallToAction;
