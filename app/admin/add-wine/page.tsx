"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import FormSelect from "@/components/admin/addWine/FormSelect"
import FormInput from "@/components/admin/addWine/FormInput"
import ImagePreview from "@/components/admin/addWine/ImagePreview"
import { useWineForm } from "@/hooks/useWineForm"
import SubmitButton from "@/components/admin/addWine/SubmitButton"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Addwine() {
    const { formData, previewUrl, isLoading, handleChange, handleKeyDown, handleSubmit, removeGrapeVarietal, validationErrors } = useWineForm();
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await handleSubmit();

        if (success) {
            router.push("/admin/edit-wines");
        }
    };

    const handleCheckboxChange = (checked: boolean) => {
        handleChange({ target: { name: "isFeatured", value: checked } } as unknown as React.ChangeEvent<HTMLInputElement>)
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel - Upload Wine</CardTitle>
                    <CardDescription>Add a new wine to the catalog</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Product Name" type="text" name="productName" value={formData.productName || ""} required onChange={handleChange} />
                            <FormInput label="Region" type="text" name="region" value={formData.region || ""} required onChange={handleChange} />
                            <FormInput label="Country" type="text" name="country" value={formData.country || ""} required onChange={handleChange} />
                            <FormInput label="Producer" type="text" name="producer" value={formData.producer || ""} required onChange={handleChange} />
                            <FormInput label="Vintage" type="number" name="vintage" value={formData.vintage || 0} required onChange={handleChange} />
                            <FormInput label="Alcohol Content (%)" type="number" step="0.1" name="alcoholContent" value={formData.alcoholContent || 0} required onChange={handleChange} />
                            <FormInput label="Size (ml)" type="number" name="sizeMl" value={formData.sizeMl || 750} required onChange={handleChange} />
                            <FormInput label="Price (cents)" type="number" name="price" value={formData.price || 0} required onChange={handleChange} />
                            <FormInput label="Stock Quantity" type="number" name="stockQuantity" value={formData.stockQuantity || 0} required onChange={handleChange} />
                            <FormInput label="Description" type="text" name="description" value={formData.description || ""} required onChange={handleChange} />
                            <FormInput label="Image" type="file" name="image" required onChange={handleChange} />
                        </div>

                        <FormSelect
                            label="Select a category"
                            name="category"
                            value={formData.category || ""}
                            onChange={(value) => handleChange({ target: { name: "category", value } } as unknown as React.ChangeEvent<HTMLSelectElement>)}
                            options={[
                                { value: "Red", label: "Red" },
                                { value: "White", label: "White" },
                                { value: "Sparkling", label: "Sparkling" },
                                { value: "Rosé", label: "Rosé" },
                                { value: "Dessert", label: "Dessert" },
                                { value: "Fortified", label: "Fortified" },
                            ]}
                        />

                        <FormInput
                            label="Grape Varietal (Press space or enter to add)"
                            type="text"
                            name="grapeVarietalInput"
                            value={formData.grapeVarietalInput || ""}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        />
                        <div className="flex flex-wrap mt-2">
                            {formData.grapeVarietal.map((varietal, index) => (
                                <span key={index} className="bg-gray-200 text-gray-700 rounded-full px-3 py-1 text-sm font-medium mr-2 mb-2 flex items-center">
                                    {varietal.charAt(0).toUpperCase() + varietal.slice(1)}
                                    <button
                                        type="button"
                                        className="ml-2 text-red-500 hover:text-red-700"
                                        onClick={() => removeGrapeVarietal(varietal)}
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={handleCheckboxChange}
                            />
                            <Label htmlFor="isFeatured">Featured</Label>
                        </div>

                        <ImagePreview previewUrl={previewUrl} />
                        {validationErrors.length > 0 && (
                            <div>
                                {validationErrors.map((error, index) => (
                                    <p key={index}>{error.message}</p>
                                ))}
                            </div>
                        )}
                        <SubmitButton isLoading={isLoading} />
                    </form>
                </CardContent>
            </Card>

            <Toaster />
        </div>
    )
}
