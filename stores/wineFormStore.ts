import { create } from "zustand";
import { WineCategoryEnum, WineFormData } from "../types";
import { api } from "../lib/api";
import axios from "axios";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_CLOUDFRONT_URL;

const wineFormSchema = z.object({
  productName: z.string().min(1, { message: "Product name is required" }),
  producer: z.string().min(1, { message: "Producer is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  category: z.string().min(1, { message: "Category is required" }),
  region: z.string().min(1, { message: "Region is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  grapeVarietal: z
    .array(z.string())
    .min(1, { message: "At least one grape varietal is required" }),
  vintage: z.number().min(0, { message: "Invalid vintage" }),
  alcoholContent: z.number().min(0, { message: "Invalid alcohol content" }),
  sizeMl: z.number().min(0, { message: "Invalid bottle size" }),
  price: z.number().min(0, { message: "Price cannot be negative" }),
  stockQuantity: z.number().min(0, { message: "Stock cannot be negative" }),
  imageUrl: z.string().url({ message: "Invalid image URL" }).optional(),
  isFeatured: z.boolean().optional(),
  image: z.instanceof(File).nullable(),
});

interface WineFormStore {
  formData: WineFormData;
  previewUrl: string | null;
  isLoading: boolean;
  setFormData: (updates: Partial<WineFormData>) => void;
  resetForm: () => void;
  setPreviewUrl: (url: string | null) => void;
  handleSubmit: () => Promise<boolean>;
}

export const useWineFormStore = create<WineFormStore>((set, get) => {
  const { toast } = useToast();

  return {
    formData: {
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
    },
    previewUrl: null,
    isLoading: false,

    setFormData: (updates) =>
      set((state) => ({
        formData: { ...state.formData, ...updates },
      })),

    setPreviewUrl: (url) => set({ previewUrl: url }),

    resetForm: () =>
      set({
        formData: {
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
        },
        previewUrl: null,
      }),

    handleSubmit: async () => {
      const { formData, resetForm } = get();

      if (!formData.image) {
        toast({
          title: "Error",
          description: "Please upload an image.",
          variant: "destructive",
        });
        return false;
      }

      set({ isLoading: true });

      try {
        // Validate form data
        wineFormSchema.parse(formData);

        const { name } = formData.image;
        const fileName = `${formData.category}/${name}`;
        const signedUrl = await api.post<{ presignedUrl: string }>(
          "/wines/presigned-url",
          {
            fileName,
            fileType: formData.image.type,
          }
        );

        await axios.put(signedUrl.presignedUrl, formData.image, {
          headers: { "Content-Type": formData.image.type },
        });

        const publicUrl = `${CLOUDFRONT_URL || "https://example"}/${fileName}`;

        await api.post("/wines", {
          ...formData,
          imageUrl: publicUrl,
        });

        toast({
          title: "Success",
          description: "Wine successfully uploaded!",
          variant: "default",
        });

        resetForm();
        return true; // ✅ Indicate success
      } catch (error: unknown) {
        if (error instanceof z.ZodError) {
          toast({
            title: "Validation Error",
            description: error.errors.map((err) => err.message).join(", "),
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred. Please try again.",
            variant: "destructive",
          });
        }
        return false;
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
