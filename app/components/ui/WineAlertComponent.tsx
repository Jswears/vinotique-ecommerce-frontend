import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const WineAlert = ({ error, title }: { error: string, title: string }) => {
    return (
        <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    )
}

export default WineAlert;