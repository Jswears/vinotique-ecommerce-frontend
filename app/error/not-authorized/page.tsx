"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home } from "lucide-react"

export default function NotAuthorizedPage() {
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold flex items-center text-red-600">
                        <AlertCircle className="mr-2 h-6 w-6" />
                        Not Authorized
                    </CardTitle>
                    <CardDescription>You do not have permission to access this page.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        If you believe this is an error, please contact the site administrator or try logging in with an account
                        that has the necessary permissions.
                    </p>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => router.push("/")} className="w-full">
                        <Home className="mr-2 h-4 w-4" />
                        Return to Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

