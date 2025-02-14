"use client"

import { useState } from "react"
import { signUp } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import outputs from "../../../amplify_outputs.json"
import { Amplify } from "aws-amplify"
import { useAuthStore } from "@/stores/authStore"

Amplify.configure(outputs)

const SignUpPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        console.log("Sign-up form submitted")

        try {
            console.log("Attempting to sign up with email:", email)
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        email,
                    },
                },
            })
            console.log("Sign-up response:", { isSignUpComplete, userId, nextStep })


            if (isSignUpComplete) {
                console.log("Sign-up complete")
                toast({
                    title: "Sign up successful",
                    description: "Your account has been created successfully.",
                })
                router.push("/auth/login") // Redirect to login page
            } else if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
                console.log("Confirmation required")
                toast({
                    title: "Confirmation required",
                    description: "Please check your email for a confirmation code.",
                })
                router.push("/auth/confirm-email")
            } else {
                console.log("Next step:", nextStep)
                toast({
                    title: "Additional steps required",
                    description: "Please follow the instructions for the next step.",
                })
            }
        } catch (error) {
            console.error("Error signing up:", error)
            let errorMessage = "There was an error creating your account. Please try again."
            if (error instanceof Error && error.message) {
                errorMessage = error.message
            }
            toast({
                title: "Sign up failed",
                description: errorMessage,
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
            console.log("Sign-up process completed")
        }
    }

    return (
        <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                    <CardDescription>Create a new account to join Vinotique.</CardDescription>
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
                                    Signing Up...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <a href="/auth/login" className="text-primary hover:underline">
                            Log in
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default SignUpPage;





