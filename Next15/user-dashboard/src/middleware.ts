import { NextResponse, NextRequest } from "next/server";

// Define public paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/forgot-password"];

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  console.log("request", request);
  // Get the pathname from the URL
  const path = request.nextUrl.pathname;

  // Check if current path is public
  const isPublicPath =
    PUBLIC_PATHS.includes(path) || path.startsWith("/reset-password");

  // Get the authentication cookie name from environment variable
  const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || "";

  // Check if user is authenticated
  const isAuthenticated = request.cookies.has(cookieName);

  // Handle root path based on authentication status
  if (path === "/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/users", request.url));
    } else {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For public paths: if user is authenticated and on login page, redirect to /users
  if (isPublicPath && isAuthenticated && path === "/login") {
    return NextResponse.redirect(new URL("/users", request.url));
  }

  // For protected paths or any non-public path: if not authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow the request to proceed normally if none of the redirect conditions are met
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
