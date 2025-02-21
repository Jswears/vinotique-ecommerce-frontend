"use client"

import { useState } from "react"
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
    const [email, setEmail] = useState("")
    const [confirmationCode, setConfirmationCode] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: email,
                confirmationCode,
            })
            if (isSignUpComplete) {
                console.log("Sign-up complete", isSignUpComplete)
                toast({
                    title: "Email confirmed",
                    description: "Your email has been successfully confirmed. You can now log in.",
                })
                router.push("/auth/login")
            } else {
                console.log("Next step:", nextStep)
                toast({
                    title: "Additional steps required",
                    description: "Please follow the instructions for the next step.",
                })
            }
        } catch (error) {
            console.error("Error confirming sign up:", error)
            if (error instanceof Error && (error as { name: string }).name === "ExpiredCodeException") {
                toast({
                    title: "Code Expired",
                    description: "The confirmation code has expired. Please request a new one.",
                    variant: "destructive",
                })
                return

            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleResendCode = async () => {
        if (!email) {
            toast({
                title: "Email Required",
                description: "Please enter your email before resending the confirmation code.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            await resendSignUpCode({ username: email })
            toast({
                title: "Code Resent",
                description: "A new confirmation code has been sent to your email.",
            })
        } catch (error) {
            console.error("Error resending code:", error)
            toast({
                title: "Resend Failed",
                description: "There was an error resending the confirmation code. Please try again.",
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
                    <CardTitle>Confirm Your Email</CardTitle>
                    <CardDescription>Enter the confirmation code sent to your email.</CardDescription>
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
                            <Label htmlFor="confirmationCode">Confirmation Code</Label>
                            <Input
                                id="confirmationCode"
                                type="text"
                                placeholder="123456"
                                value={confirmationCode}
                                onChange={(e) => setConfirmationCode(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Confirming...
                                </>
                            ) : (
                                "Confirm Email"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive the code?{" "}
                        <Link href="#" onClick={handleResendCode} className="text-primary hover:underline">
                            Resend code
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}

