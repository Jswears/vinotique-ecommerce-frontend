import { useState } from "react";
import { WineFormData } from "../types";
import { api } from "../lib/api";
import axios from "axios";
import { z } from "zod";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

const wineFormSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    region: z.string().min(1, { message: "Region is required" }),
    producer: z.string().min(1, { message: "Producer is required" }),
    vintage: z.string().min(1, { message: "Vintage is required" }),
    price: z.number({ invalid_type_error: 'Price must be a number' }).min(0, { message: "Price cannot be negative" }),
    stock: z.number({ invalid_type_error: 'Stock must be a number' }).min(0, { message: "Stock cannot be negative" }),
    description: z.string().min(1, { message: "Description is required" }),
    imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
    image: z.instanceof(File).nullable()
});

export const useWineForm = () => {
    const [formData, setFormData] = useState<WineFormData>({
        name: "",
        category: "red",
        region: "",
        producer: "",
        vintage: "",
        price: 0,
        stock: 0,
        description: "",
        image: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value, type } = e.target;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] || null;
            setFormData((prev) => ({ ...prev, [name]: file }));
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result as string);
                reader.readAsDataURL(file);
            } else {
                setPreviewUrl(null);
            }
        } else if (type === "number") {
            setFormData((prev) => ({ ...prev, [name]: Number.parseFloat(value) }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const getPresignedUrlForImage = async (fileKey: string) => {
        try {
            const response = await api.post("/presignedUrl", { fileKey });
            return response.signedUrl
        } catch (error) {
            throw error;
        }
    };

    const uploadImageToS3 = async (image: File, signedUrl: string) => {
        try {
            await axios.put(signedUrl, image, {
                headers: { "Content-Type": image.type }
            });
        } catch (error) {
            throw error;
        }
    };

    const submitWineData = async (publicUrl: string) => {
        try {
            const wineData = {
                ...formData,
                price: Number(formData.price * 100),
                stock: Number(formData.stock),
                imageUrl: publicUrl,
            };
            const response = await api.post("/wines", wineData)
            return response
        } catch (error) {
            throw error;
        }
    };

    const handleSubmit = async () => {
        if (!formData.image) {
            return;
        }
        setIsLoading(true);
        try {
            // Validate form data
            wineFormSchema.parse(formData);

            const { name } = formData.image;
            const fileKey = `${formData.category}/${name}`;

            const signedUrl = await getPresignedUrlForImage(fileKey);

            await uploadImageToS3(formData.image, signedUrl);

            const publicUrl = `${typeof CLOUDFRONT_URL !== "undefined" ? CLOUDFRONT_URL : "https://example"}${fileKey}`;

            await submitWineData(publicUrl);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                setError(error.errors.map(err => err.message).join(", "));
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        previewUrl,
        isLoading,
        handleChange,
        handleSubmit,
        error,
        setFormData,
    };
};
