// Another refactor version
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

// const protectedRoutes = ['/'];
// const isProtectedRoute = (path: string) => {
//   if (path === '/sign-in') return false;
//   // if (path === '/sign-out') return false;
//   // if (path === '/sign-up') return false;
//   else return protectedRoutes.some((route) => path.startsWith(route));
// };

const jwtVerifyApiRoutes = [
  { path: "/api/v1/auth/sign-out", methods: ["POST"] },
  { path: "/api/v1/auth/refresh-token", methods: ["POST"] },
  { path: "/api/v1/auth", methods: ["GET"] },

  { path: "/api/v1/stocks", methods: ["GET", "POST", "DELETE", "PUT"] },
  { path: "/api/v1/stocks/stockId", methods: ["GET", "POST", "DELETE", "PUT"] },

  {
    path: "/api/v1/products/product-stocks/:productId",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
  {
    path: "/api/v1/products/:productId",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
  { path: "/api/v1/products", methods: ["GET", "POST", "DELETE", "PUT"] },
  {
    path: "/api/v1/products/bulk-create",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },

  {
    path: "/api/v1/products/product-stocks/:productId",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },

  { path: "/api/v1/orders/save-order", methods: ["GET", "DELETE", "PUT"] },
  {
    path: "/api/v1/orders/bulk-create",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
  { path: "/api/v1/orders", methods: ["GET", "POST", "DELETE", "PUT"] },
  {
    path: "/api/v1/orders/:orderId",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
];

const allowedOrigins = ["*"]; // Add bro mineral domain

const isOriginAllowed = (origin: string) =>
  allowedOrigins.includes(origin) || allowedOrigins.includes("*");
const setCorsHeaders = (response: NextResponse, origin: string) => {
  response.headers.set("Access-Control-Allow-Origin", origin);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true"); // Ensure credentials are allowed
  return response;
};
// To check if the route path matches the request path
const matchRoute = (routePath: string, requestPath: string): boolean => {
  const routeSegments = routePath.split("/");
  const requestSegments = requestPath.split("/");

  if (routeSegments.length !== requestSegments.length) {
    return false;
  }

  return routeSegments.every((segment, index) => {
    return segment.startsWith(":") || segment === requestSegments[index];
  });
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin: string = request.headers.get("Origin") as string;
  const response = NextResponse.next();

  // // Handle CORS preflight requests (OPTIONS)
  // if (request.method === "OPTIONS") {
  //   if (isOriginAllowed(origin)) {
  //     return setCorsHeaders(NextResponse.json({}), origin);
  //   }
  //   return NextResponse.json({});
  // }

  // // Apply CORS headers to all responses if origin is allowed
  // if (isOriginAllowed(origin)) {
  //   setCorsHeaders(response, origin);
  // }

  // // Get the AccessToken cookie
  // const accessTokenCookie = cookies().get("AccessToken");
  // // JWT Verification for API routes
  // const apiRoute = jwtVerifyApiRoutes.find(
  //   (route) =>
  //     matchRoute(route.path, pathname) && route.methods.includes(request.method)
  // );
  // if (apiRoute) {
  //   if (!accessTokenCookie) {
  //     return NextResponse.json(
  //       { message: "Access token is missing" },
  //       { status: 401 }
  //     );
  //   }

  //   const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);
  //   const jwt = accessTokenCookie.value;
  //   try {
  //     const { payload } = await jwtVerify(jwt, secret, {});
  //     const headers = new Headers(request.headers);
  //     headers.set("X-User-Payload", JSON.stringify(payload));
  //     return NextResponse.next({ request: { headers } });
  //   } catch (err) {
  //     return NextResponse.json(
  //       { status: "Unauthorized", message: "Invalid access token" },
  //       { status: 403 }
  //     );
  //   }
  // }

  // // Handle protected routes
  // if (pathname === "/") {
  //   if (!accessTokenCookie) {
  //     return NextResponse.redirect(new URL("/sign-in", request.url));
  //   }
  // }

  // // Redirect to admin if logged in and trying to access public pages
  // if (pathname === "/sign-in" || pathname === "/sign-up") {
  //   if (accessTokenCookie) {
  //     return NextResponse.redirect(new URL("/", request.url));
  //   }
  // }

  return response;
}
