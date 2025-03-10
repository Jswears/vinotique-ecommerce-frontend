import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const WineAlert = ({ error, title }: { error: string; title: string }) => {
    return (
        <div className="max-w-lg mx-auto">
            <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
};

export default WineAlert;
