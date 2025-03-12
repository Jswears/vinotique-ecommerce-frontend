"use client"

import { useEffect, useState } from "react"
import { fetchUserAttributes } from "@aws-amplify/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import useCartStore from "@/stores/cartStore"
import LogoutButton from "@/components/auth/LogoutButton"
type UserAttributesType = {
    preferred_username: string
    email: string
}

export default function AccountPage() {
    const [userAttributes, setUserAttributes] = useState<UserAttributesType | null>(null);
    const router = useRouter()
    const { toast } = useToast()
    const { fetchCart } = useCartStore();


    useEffect(() => {
        async function fetchUser() {
            try {
                const userAttributes = await fetchUserAttributes()
                setUserAttributes({
                    preferred_username: userAttributes.preferred_username || "None",
                    email: userAttributes.email || ""
                })
                console.log("User attributes:", userAttributes)

                await fetchCart()
            } catch (error) {
                console.error("Error fetching user:", error)
                toast({
                    title: "Authentication Error",
                    description: "Please log in to view this page.",
                    variant: "destructive",
                })
            }
        }

        fetchUser()
    }, [fetchCart, router, toast])

    if (!userAttributes) {
        return <div>Loading...</div>
    }


    return (
        <div className="container mx-auto px-4 py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Username:</strong> {userAttributes.preferred_username}
                    </p>
                    <p>
                        <strong>Email:</strong> {userAttributes.email}
                    </p>
                    <div className="flex flex-col gap-2 mt-4 ">
                        <Button onClick={() => router.push("/")}>
                            Back to Home
                        </Button>
                        <LogoutButton />

                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

