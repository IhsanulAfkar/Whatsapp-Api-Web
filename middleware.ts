// import { withAuth } from 'next-auth/middleware'
// import { NextResponse } from 'next/server'
// import route from './routes'
// export default withAuth(
//     async (req) => {
//         const token = req.nextauth.token
//         const isAuthenticated = !!token
//         if (isAuthenticated) {
//             return NextResponse.next()
//         }
//         return NextResponse.redirect(new URL(route('signin') + '?callbackUrl=' + encodeURIComponent(req.url), req.url))
//     },
//     {
//         callbacks: {
//             authorized: () => true
//         }
//     }
// )
// export const config = { matcher: ['/dashboard/:path*', '/dashboard'] }
export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard", "/dashboard/:path*"] }