"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Toaster } from "@/components/ui/toaster"
import FormSelect from "./components/FormSelect"
import FormInput from "./components/FormInput"
import ImagePreview from "./components/ImagePreview"
import SubmitButton from "./components/SubmitButton"
import { useWineForm } from "@/app/hooks/useWineForm"

export default function AdminPanel() {
    const { formData, previewUrl, isLoading, handleChange, handleSubmit, error } = useWineForm()

    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Panel - Upload Wine</CardTitle>
                    <CardDescription>Add a new wine to the catalog</CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSubmit()
                        }}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Name" type="text" name="name" value={formData.name} required onChange={handleChange} />
                            <FormInput
                                label="Region"
                                type="text"
                                name="region"
                                value={formData.region}
                                required
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Producer"
                                type="text"
                                name="producer"
                                value={formData.producer}
                                required
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Vintage"
                                type="text"
                                name="vintage"
                                value={formData.vintage}
                                required
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Price"
                                type="number"
                                name="price"
                                value={formData.price}
                                required
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Stock"
                                type="number"
                                name="stock"
                                value={formData.stock}
                                required
                                onChange={handleChange}
                            />
                            <FormInput
                                label="Description"
                                type="text"
                                name="description"
                                value={formData.description}
                                required
                                onChange={handleChange}
                            />
                            <FormInput label="Image" type="file" name="image" required onChange={handleChange} />
                        </div>

                        <div className="space-y-2">
                            <FormSelect
                                label="Select a category"
                                name="category"
                                value={formData.category}
                                onChange={(value) => handleChange({ target: { name: "category", value } } as any)}
                                options={[
                                    { value: "red", label: "Red" },
                                    { value: "white", label: "White" },
                                    { value: "sparkling", label: "Sparkling" },
                                    { value: "rose", label: "Rosé" },
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <ImagePreview previewUrl={previewUrl} />
                        </div>

                        {error && <p className="text-red-600 text-sm">{error}</p>}

                        <SubmitButton isLoading={isLoading} />
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

