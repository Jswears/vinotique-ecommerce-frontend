import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface ImagePreviewProps {
    previewUrl: string | null
}

export default function ImagePreview({ previewUrl }: ImagePreviewProps) {
    if (!previewUrl) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800">
                    <p className="text-gray-500 dark:text-gray-400">No image selected</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardContent className="p-0 overflow-hidden">
                <div className="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800">
                    <Image src={previewUrl || "/placeholder.svg"} alt="Wine preview" width={100} height={100} className="rounded-md h-52 w-fit" />
                </div>
                <div className="mt-2">
                    <Image src={previewUrl} alt="Preview" width={100} height={100} className="rounded-md h-52 w-fit" />
                </div>
            </CardContent>
        </Card>
    )
}

