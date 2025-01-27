import { Metadata } from "next";
import WineList from "./components/WineList";

export const metadata: Metadata = {
    title: "Vinotique - Wines",
    description: "A list of all wines available in our store",
};

const WinesPage = () => {
    return (
        <div>
            <WineList />
        </div>
    );
}

export default WinesPage;