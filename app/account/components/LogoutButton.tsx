import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { useAuthStore } from "@/stores/authStore"
import { useRouter } from "next/navigation"

const LogoutButton = () => {
    const router = useRouter()
    const { logout } = useAuthStore()
    const handleSignOut = async () => {
        try {
            await logout();
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
    return (
        <Button variant="destructive" onClick={handleSignOut}>
            Sign Out
        </Button>
    );
}

export default LogoutButton;