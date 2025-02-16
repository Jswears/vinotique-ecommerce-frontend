"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { useWinesStore } from "@/stores/winesStore"
import { priceConversor } from "@/app/utils/priceConversor"


export default function EditWinesPage() {
    const [searchTerm, setSearchTerm] = useState("")

    const { fetchWines, wines } = useWinesStore()

    // Fetch wines on page load
    useEffect(() => {
        if (wines.length === 0) {
            fetchWines()
        }
    }, [fetchWines, wines.length])

    // Implement actual search logic
    const filteredWines = wines.filter((wine) => wine.productName.toLowerCase().includes(searchTerm.toLowerCase()))

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
                        <Button>Add New Wine</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Year</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredWines.map((wine) => (
                                <TableRow key={wine.wineId}>
                                    <TableCell>{wine.productName}</TableCell>
                                    <TableCell>{wine.vintage}</TableCell>
                                    <TableCell>{priceConversor(wine.price)}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="mr-2">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash2 className="h-4 w-4" />
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

