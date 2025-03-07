import { Metadata } from "next";
import WineList from "./components/WineList";

// TODO: Change metada everywhere so they all fit the same pattern
export const metadata: Metadata = {
    title: "Wines | Vinotique Wine Shop",
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