import { useState } from "react";
import { WineCategoryEnum, WineFormData } from "../types";
import { api } from "../lib/api";
import axios from "axios";
import { z } from "zod";
import { useToast } from "./use-toast";

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
    const { toast } = useToast();
    const [formData, setFormData] = useState<WineFormData>({
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

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<z.ZodIssue[]>([]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        if (type === "file") {
            const fileInput = e.target as HTMLInputElement;
            const file = fileInput.files?.[0] || null;
            if (file && typeof window !== "undefined") {
                const reader = new FileReader();
                reader.onloadend = () => setPreviewUrl(reader.result as string);
                reader.readAsDataURL(file);
            }
            setFormData((prev) => ({ ...prev, [name]: file }));
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

    const handleSubmit = async () => {
        if (!formData.image) {
            toast({
                title: "Image Required",
                description: "Please upload an image for the wine.",
                variant: "destructive",
            })
            return false;
        }

        setIsLoading(true);
        try {
            // Validate form data
            wineFormSchema.parse(formData);

            const { name } = formData.image;
            const fileName = `${formData.category}/${name}`;
            const signedUrl = await api.post<{ presignedUrl: string }>("/wines/presigned-url", {
                fileName,
                fileType: formData.image.type
            });

            await axios.put(signedUrl.presignedUrl, formData.image, {
                headers: { "Content-Type": formData.image.type }
            });

            const publicUrl = `${CLOUDFRONT_URL || "https://example"}/${fileName}`;

            await api.post("/wines", {
                ...formData,
                imageUrl: publicUrl
            });

            toast({
                title: "Wine Added",
                description: "The wine has been added successfully.",
                variant: "default",
            })

            // Reset form after success
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
            setValidationErrors([]); // Clear validation errors on success

            return true; // ✅ Indicate success
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                setValidationErrors(error.errors); // Set validation errors
                const descriptionError = error.errors.find(err => err.path.includes("description"));
                if (descriptionError) {
                    toast({
                        title: "Invalid Form",
                        description: descriptionError.message,
                        variant: "destructive"
                    });
                } else {
                    toast({
                        title: "Invalid Form",
                        description: error.errors[0].message,
                        variant: "destructive"
                    });
                }
            } else {
                toast({
                    title: "Error",
                    description: "An unexpected error occurred. Please try again.",
                    variant: "destructive"
                });
            }
            return false; // ❌ Indicate failure
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData,
        previewUrl,
        isLoading,
        validationErrors,
        handleChange,
        handleKeyDown,
        handleSubmit,
        removeGrapeVarietal,
        setFormData,
    };
};
