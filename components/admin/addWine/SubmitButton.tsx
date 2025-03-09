import { Button } from "@/components/ui/button"
import { Loader2, Upload } from "lucide-react"

interface SubmitButtonProps {
    isLoading: boolean
}

export default function SubmitButton({ isLoading }: SubmitButtonProps) {
    return (
        <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                </>
            ) : (
                <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Wine
                </>
            )}
        </Button>
    )
}

