import { NextResponse } from "next/server";
import { signIn, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const { isSignedIn, nextStep } = await signIn({
      username: email,
      password,
    });

    if (isSignedIn) {
      const user = await getCurrentUser();
      console.log("User:", user);
      const session = await fetchAuthSession();
      console.log("Session:", session);

      const response = NextResponse.json({ success: true });
      response.cookies.set({
        name: "authToken",
        value:
          typeof session.tokens?.accessToken.payload === "string"
            ? session.tokens.accessToken.payload
            : "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
    }

    console.log("Received credentials");
    console.log("Email:", email);
    console.log("Password:", password);

    return NextResponse.json({
      email,
      password,
      message: "Test API received your credentials",
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Invalid credentials or server error" },
      { status: 500 }
    );
  }
}
