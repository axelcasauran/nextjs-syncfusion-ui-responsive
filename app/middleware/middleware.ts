// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import authOptions from '@/app/api/auth/[...nextauth]/auth-options';

// export async function middleware(request: { nextUrl: { pathname: string; }; }) {
//   const session = await getServerSession(authOptions);

//   // List of public API routes
//   const publicRoutes = ['/api/kids', '/api/auth/login', '/api/auth/register'];

//   // Skip session check for public routes
//   if (publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
//     return NextResponse.next(); // Allow request to proceed
//   }

//   // For all other routes, enforce session check
//   if (!session) {
//     return NextResponse.json(
//       { message: 'Unauthorized request' },
//       { status: 401 }
//     );
//   }

//   return NextResponse.next(); // Allow request to continue if session is valid
// }

// // Apply the middleware to all API routes
// export const config = {
//   matcher: ['/api/:path*'], // Protect all /api/* routes by default
// };
