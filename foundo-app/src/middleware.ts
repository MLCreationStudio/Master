import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // ── Protection Logic ───────────────────────────────────────

  const isAppRoute = request.nextUrl.pathname.startsWith("/deck") ||
                     request.nextUrl.pathname.startsWith("/chat") ||
                     request.nextUrl.pathname.startsWith("/matches") ||
                     request.nextUrl.pathname.startsWith("/perfil");

  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isAdmissionRoute = request.nextUrl.pathname.startsWith("/admissao");
  const isLoginRoute = request.nextUrl.pathname.startsWith("/login");

  if (!user && (isAppRoute || isAdminRoute || isAdmissionRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Status Redirection ─────────────────────────────────────
  if (user) {
    // Fetch user status from public.users table
    const { data: profile } = await supabase
      .from("users")
      .select("status, role")
      .eq("id", user.id)
      .single();

    // If it's a login route and user is already active, send to deck
    if (isLoginRoute && profile?.status === "active") {
        return NextResponse.redirect(new URL("/deck", request.url));
    }

    // If user is pending and trying to access app routes, send to admission
    if (profile?.status === "pending" && isAppRoute && !isAdmissionRoute) {
      return NextResponse.redirect(new URL("/admissao", request.url));
    }

    // If user is active and trying to access admission, send to deck
    if (profile?.status === "active" && isAdmissionRoute) {
        return NextResponse.redirect(new URL("/deck", request.url));
    }

    // Admin Protection
    if (isAdminRoute && user.email !== "matheus@mlcreationstudio.com") {
      return NextResponse.redirect(new URL("/deck", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
