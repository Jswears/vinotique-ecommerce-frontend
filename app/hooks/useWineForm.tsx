import { useState } from "react";
import { WineCategoryEnum, WineFormData } from "../types";
import { api } from "../lib/api";
import axios from "axios";
import { z } from "zod";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

const wineFormSchema = z.object({
    productName: z.string().min(1, { message: "Product name is required" }),
    producer: z.string().min(1, { message: "Producer is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    category: z.string().min(1, { message: "Category is required" }),
    region: z.string().min(1, { message: "Region is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    grapeVarietal: z.array(z.string()).min(1, { message: "At least one grape varietal is required" }),
    vintage: z.number().min(0, { message: "Invalid vintage" }),
    alcoholContent: z.number().min(0, { message: "Invalid alcohol content" }),
    sizeMl: z.number().min(0, { message: "Invalid bottle size" }),
    price: z.number().min(0, { message: "Price cannot be negative" }),
    stockQuantity: z.number().min(0, { message: "Stock cannot be negative" }),
    imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
    isFeatured: z.boolean().optional(),
    image: z.instanceof(File).nullable()
});

export const useWineForm = () => {
    const [formData, setFormData] = useState<WineFormData>({
        productName: "",
        producer: "",
        description: "",
        category: WineCategoryEnum.Red,
        region: "",
        country: "",
        grapeVarietal: [],
        grapeVarietalInput: "", // Initialize grapeVarietalInput
        vintage: 0,
        alcoholContent: 0,
        sizeMl: 750,
        price: 0,
        stockQuantity: 0,
        isFeatured: false,
        image: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

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
        } else if (type === "checkbox") {
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else if (name === "grapeVarietalInput") {
            setFormData((prev) => ({ ...prev, grapeVarietalInput: value }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (value && !formData.grapeVarietal.includes(value)) {
                setFormData((prev) => ({
                    ...prev,
                    grapeVarietal: [...prev.grapeVarietal, value],
                    grapeVarietalInput: "",
                }));
            }
        }
    };

    const removeGrapeVarietal = (varietal: string) => {
        setFormData((prev) => ({
            ...prev,
            grapeVarietal: prev.grapeVarietal.filter((item) => item !== varietal),
        }));
    };

    const getPresignedUrlForImage = async (fileName: string, fileType: string) => {
        try {
            const response = await api.post<{ presignedUrl: string }>("/wines/presignedUrl", { fileName, fileType });
            return response.presignedUrl;
        } catch (error) {
            throw error;
        }
    };

    const uploadImageToS3 = async (image: File, presignedUrl: string) => {
        try {
            await axios.put(presignedUrl, image, { headers: { "Content-Type": image.type } });
        } catch (error) {
            throw error;
        }
    };

    const submitWineData = async (publicUrl: string) => {
        try {
            const wineData = {
                productName: formData.productName,
                producer: formData.producer,
                description: formData.description,
                category: formData.category,
                region: formData.region,
                country: formData.country,
                grapeVarietal: formData.grapeVarietal,
                vintage: formData.vintage,
                alcoholContent: formData.alcoholContent,
                sizeMl: formData.sizeMl,
                price: formData.price,
                stockQuantity: formData.stockQuantity,
                imageUrl: publicUrl,
                isFeatured: formData.isFeatured,
            };
            const response = await api.post("/wines", wineData);
            return response;
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
            console.log("dataform", formData)
            const { name } = formData.image;
            const fileName = `${formData.category}/${name}`;

            const signedUrl = await getPresignedUrlForImage(fileName, formData.image.type);

            await uploadImageToS3(formData.image, signedUrl);

            const publicUrl = `${CLOUDFRONT_URL || "https://example"}/${fileName}`;

            await submitWineData(publicUrl);
        } catch (error: unknown) { // Specify the type as unknown
            if (error instanceof z.ZodError) {
                setError(error.errors.map(err => err.message).join(", "));
            } else {
                setError("An unexpected error occurred.");
            }
        } finally {
            setIsLoading(false);
            setFormData({
                productName: "",
                producer: "",
                description: "",
                category: WineCategoryEnum.Red,
                region: "",
                country: "",
                grapeVarietal: [],
                grapeVarietalInput: "",
                vintage: 0,
                alcoholContent: 0,
                sizeMl: 750,
                price: 0,
                stockQuantity: 0,
                isFeatured: false,
                image: null,
            });
            setPreviewUrl(null);
        }
    };

    return {
        formData,
        previewUrl,
        isLoading,
        handleChange,
        handleKeyDown,
        handleSubmit,
        removeGrapeVarietal,
        error,
        setFormData,
    };
};
