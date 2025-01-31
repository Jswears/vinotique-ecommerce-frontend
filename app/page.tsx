"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import FeaturedWinesList from "./(featured-wines)/components/FeaturedWinesList"
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth"
import { Amplify } from "aws-amplify"

import outputs from "@/amplify_outputs.json"
import { useAuthStore } from "@/stores/authStore";
Amplify.configure(outputs)

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  const getUser = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();

    console.log("username", username);
    console.log("user id", userId);
    console.log("sign-in details", signInDetails);
  }

  const signOutUser = async () => {
    await signOut()
    console.log("Sign-out successful")
  }

  const fetchSession = async () => {

    const session = await fetchAuthSession();
    console.log("session:", session.identityId)
    console.log("id token:", session.tokens?.idToken)
    console.log("access token:", session.tokens?.accessToken)
  }


  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      <section className="text-center space-y-6 flex flex-col gap-2">
        <div className="flex gap-4 justify-center">
          <Button onClick={() => console.log("Auth?:", isAuthenticated)}>Autheticated?</Button>
          <Button onClick={getUser}>Get User</Button>
          <Button onClick={fetchSession}>Get Session</Button>
          <Button onClick={signOutUser}>Logout</Button>
        </div>
        <h1 className="text-5xl font-bold text-foreground">Welcome to Vinotique</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our curated selection of fine wines from around the world.
        </p>
        <Link href="/wines" passHref>
          <Button size="lg" className="rounded-full">
            Explore All Wines
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
      <section className="space-y-8">
        <h2 className="text-3xl font-semibold text-foreground text-center">Featured Wines</h2>
        <FeaturedWinesList />
      </section>
      <section className="text-center bg-accent rounded-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-foreground">Ready to explore more?</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Visit our full collection to find your perfect wine.
        </p>
        <Link href="/wines" passHref>
          <Button size="lg" variant="secondary" className="rounded-full">
            View All Wines
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  )
}

export default HomePage

