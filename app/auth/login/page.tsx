"use client"

import { useState } from "react"
import { signIn } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { Amplify } from "aws-amplify"

import outputs from "../../../amplify_outputs.json"
Amplify.configure(outputs)


export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { isSignedIn, nextStep } = await signIn({ username: email, password })
            console.log("Sign-in response:", { isSignedIn, nextStep })

            if (isSignedIn) {
                console.log("Sign-in complete")
                toast({
                    title: "Login successful",
                    description: "You have been successfully logged in.",
                })
                // Redirect to home page after successful login
                router.push("/")
            } else {
                console.log("Next step:", nextStep)
                if (nextStep.signInStep === "CONFIRM_SIGN_UP") {
                    toast({
                        title: "Confirmation required",
                        description: "Please check your email for a confirmation code or request a new one.",
                    })
                    router.push("/auth/confirm-email")
                }
            }
        } catch (error) {
            console.error("Error signing in:", error)
            toast({
                title: "Login failed",
                description: "There was an error logging in. Please check your credentials and try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                    <CardDescription>Welcome back to Vinotique.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Logging In...
                                </>
                            ) : (
                                "Log In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <a href="/auth/signup" className="text-primary hover:underline">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

