"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"

// This is a placeholder. Replace with actual data fetching logic.
const mockWines = [
    { id: 1, name: "Chateau Margaux", year: 2015, price: 599.99 },
    { id: 2, name: "Opus One", year: 2018, price: 399.99 },
    { id: 3, name: "Sassicaia", year: 2017, price: 249.99 },
]

export default function EditWinesPage() {
    const [wines, setWines] = useState(mockWines)
    const [searchTerm, setSearchTerm] = useState("")

    // Implement actual search logic
    const filteredWines = wines.filter((wine) => wine.name.toLowerCase().includes(searchTerm.toLowerCase()))

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
                                <TableRow key={wine.id}>
                                    <TableCell>{wine.name}</TableCell>
                                    <TableCell>{wine.year}</TableCell>
                                    <TableCell>${wine.price.toFixed(2)}</TableCell>
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

