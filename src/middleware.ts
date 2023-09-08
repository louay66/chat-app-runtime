import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
export default withAuth(async function middleware(req) {

   const pathname = req.nextUrl.pathname
   const isAuth = await getToken({ req })
   const isLogginPage = pathname.startsWith('/login')

   const sensetiveRoute = ['/dashboard']
   const isAccesingSenstiveRoute = sensetiveRoute.some((route) => pathname.startsWith(route))

   if (isLogginPage) {
      if (isAuth) {
         return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      return NextResponse.next()
   }
   if (!isAuth && isAccesingSenstiveRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
   }

   if (pathname === '/') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
   }

},
   {
      callbacks: {
         async authorized() {
            return true
         }
      }
   }
)

export const config = {
   matchter: ['/', '/login', '/dashboard/:path*'],
}