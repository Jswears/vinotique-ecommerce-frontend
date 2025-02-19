"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { useWinesStore } from "@/stores/winesStore"
import { priceConversor } from "@/app/utils/priceConversor"
import Spinner from "@/components/ui/spinner"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function EditWinesPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const { fetchWines, wines, deleteWine } = useWinesStore()
    const [loadingWineId, setLoadingWineId] = useState<string | null>(null)

    useEffect(() => {
        if (wines.length === 0) {
            fetchWines()
        }
    }, [fetchWines, wines.length])

    const filteredWines = wines.filter(
        (wine) =>
            wine.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            wine.producer.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Wines</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex justify-between mb-4">
                        <Input
                            placeholder="Search wines..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                        <Link href="/admin/add-wine">
                            <Button>Add New Wine</Button>
                        </Link>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Producer</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Vintage</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWines.map((wine) => (
                                <TableRow key={wine.wineId}>
                                    <TableCell>{wine.productName}</TableCell>
                                    <TableCell>{wine.producer}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{wine.category}</Badge>
                                    </TableCell>
                                    <TableCell>{wine.vintage}</TableCell>
                                    <TableCell>{priceConversor(wine.price)}</TableCell>
                                    <TableCell>{wine.stockQuantity}</TableCell>
                                    <TableCell>
                                        <Link href={`/admin/edit-wines/${wine.wineId}`}>
                                            <Button variant="ghost" size="icon" className="mr-2">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={async (e) => {
                                                e.preventDefault()
                                                setLoadingWineId(wine.wineId)
                                                await deleteWine(wine.wineId)
                                                setLoadingWineId(null)
                                            }}
                                            variant="ghost"
                                            size="icon"
                                        >
                                            {loadingWineId === wine.wineId ? <Spinner /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

