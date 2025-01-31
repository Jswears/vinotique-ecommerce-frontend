"use client"

import { useEffect, useState } from "react"
import { getCurrentUser, signOut } from "@aws-amplify/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Amplify } from "aws-amplify"

import outputs from "@/amplify_outputs.json"
Amplify.configure(outputs)


export default function AccountPage() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const { toast } = useToast()

    const handleSignOut = async () => {
        try {
            await signOut()
            toast({
                title: "Signed out",
                description: "You have been signed out successfully.",
            })
            router.push("/")
        } catch (error) {
            console.error("Error signing out:", error)
            toast({
                title: "Error signing out",
                description: "An error occurred while signing out. Please try again.",
                variant: "destructive",
            })
        }
    }

    useEffect(() => {
        async function fetchUser() {
            try {
                const currentUser = await getCurrentUser()
                console.log(currentUser)
                setUser(currentUser)
            } catch (error) {
                console.error("Error fetching user:", error)
                toast({
                    title: "Authentication Error",
                    description: "Please log in to view this page.",
                    variant: "destructive",
                })
                router.push("/login")
            }
        }

        fetchUser()
    }, [router, toast])

    if (!user) {
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
                        <strong>Username:</strong> {user.username}
                    </p>
                    <p>
                        <strong>Email:</strong> {user.signInDetails.loginId}
                    </p>
                    <div className="flex flex-col gap-2 mt-4 ">
                        <Button onClick={() => router.push("/")}>
                            Back to Home
                        </Button>
                        <Button variant="destructive" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

