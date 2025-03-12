"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useWinesStore } from "@/stores/winesStore"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { FormData, Wine, WineCategoryEnum } from "@/types"
import { EditWineComponentProps } from "@/types/components"


const EditWineComponent = ({ wineId }: EditWineComponentProps) => {
    const { wines, fetchWine, fetchWines } = useWinesStore()
    const [formData, setFormData] = useState<FormData>({
        productName: "",
        producer: "",
        description: "",
        category: WineCategoryEnum.Red,
        region: "",
        country: "",
        grapeVarietal: [],
        vintage: 0,
        alcoholContent: 0,
        sizeMl: 0,
        price: 0,
        stockQuantity: 0,
        imageUrl: "",
        isFeatured: false,
    })
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        const loadWine = async () => {
            await fetchWine(wineId)
            const wine = wines.find((wine: Wine) => wine.wineId === wineId)
            if (wine) {
                setFormData({
                    productName: wine.productName || "",
                    producer: wine.producer || "",
                    description: wine.description || "",
                    category: wine.category || WineCategoryEnum.Red,
                    region: wine.region || "",
                    country: wine.country || "",
                    grapeVarietal: wine.grapeVarietal || [],
                    vintage: wine.vintage || 0,
                    alcoholContent: wine.alcoholContent | 0,
                    sizeMl: wine.sizeMl || 0,
                    price: wine.price || 0,
                    stockQuantity: wine.stockQuantity || 0,
                    imageUrl: wine.imageUrl || "",
                    isFeatured: wine.isFeatured || false,
                    wineId: wine.wineId,
                })
            }
        }
        if (!formData.wineId) {
            loadWine()
        }
    }, [fetchWine, wineId, wines, formData.wineId])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string) => (value: string) => {
        setFormData((prev: FormData) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (name: string) => (checked: boolean) => {
        setFormData((prev: FormData) => ({ ...prev, [name]: checked }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await api.put(`/wines/${wineId}`, formData)
            await fetchWines()
            toast({
                title: "Success",
                description: "Wine updated successfully",
            })
            router.push("/admin/edit-wines")
        } catch (error) {
            console.error("Error updating wine:", error)
            toast({
                title: "Error",
                description: "Failed to update wine. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!formData.wineId) {
        return <div>Loading...</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Wine: {formData.productName}</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="productName">Product Name</Label>
                            <Input
                                id="productName"
                                name="productName"
                                value={formData.productName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="producer">Producer</Label>
                            <Input id="producer" name="producer" value={formData.producer} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select name="category" value={formData.category} onValueChange={handleSelectChange("category")}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Red">Red</SelectItem>
                                    <SelectItem value="White">White</SelectItem>
                                    <SelectItem value="Sparkling">Sparkling</SelectItem>
                                    <SelectItem value="Rosé">Rosé</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="region">Region</Label>
                            <Input id="region" name="region" value={formData.region} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" name="country" value={formData.country} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="grapeVarietal">Grape Varietal (comma-separated)</Label>
                            <Input
                                id="grapeVarietal"
                                name="grapeVarietal"
                                value={formData.grapeVarietal.join(", ")}
                                onChange={(e) => setFormData((prev: FormData) => ({ ...prev, grapeVarietal: e.target.value.split(", ") }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="vintage">Vintage</Label>
                            <Input
                                id="vintage"
                                name="vintage"
                                type="number"
                                value={formData.vintage}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="alcoholContent">Alcohol Content (%)</Label>
                            <Input
                                id="alcoholContent"
                                name="alcoholContent"
                                type="number"
                                step="0.1"
                                value={formData.alcoholContent}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sizeMl">Size (mL)</Label>
                            <Input
                                id="sizeMl"
                                name="sizeMl"
                                type="number"
                                value={formData.sizeMl}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (in cents)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData((prev: FormData) => ({ ...prev, price: Number(e.target.value) }))}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stockQuantity">Stock Quantity</Label>
                            <Input
                                id="stockQuantity"
                                name="stockQuantity"
                                type="number"
                                value={formData.stockQuantity}
                                onChange={(e) => setFormData((prev: FormData) => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                                required
                            />
                        </div>
                        {/* TODO: Implement image upload-update and preview */}
                        {/* <div className="space-y-2">
                            <Label htmlFor="imageUrl">Image URL</Label>
                            <Input
                                id="imageUrl"
                                name="imageUrl"
                                type="url"
                                value={formData.imageUrl}
                                onChange={handleInputChange}
                                required
                            />
                        </div> */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="isFeatured"
                                checked={formData.isFeatured}
                                onCheckedChange={handleCheckboxChange("isFeatured")}
                            />
                            <Label htmlFor="isFeatured">Featured</Label>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Updating..." : "Update Wine"}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    )
}

export default EditWineComponent

