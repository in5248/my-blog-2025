import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * 보호된 API 라우트를 정의하는 매처
 * 댓글 작성 API와 향후 관리자 기능은 인증이 필요합니다.
 */
const isProtectedApiRoute = createRouteMatcher([
  '/api/comments/(.*)',      // 댓글 작성/수정/삭제 API
  '/api/admin/(.*)',         // 관리자 전용 API (향후 확장)
])

/**
 * 관리자 전용 페이지를 정의하는 매처 (향후 확장용)
 */
const isAdminRoute = createRouteMatcher([
  '/admin/(.*)',             // 관리자 대시보드 페이지
])

/**
 * 공개적으로 접근 가능한 라우트를 정의하는 매처
 * 모든 블로그 콘텐츠는 인증 없이 접근 가능합니다.
 */
const isPublicRoute = createRouteMatcher([
  '/',                       // 홈페이지
  '/posts/(.*)',             // 모든 블로그 포스트
  '/categories/(.*)',        // 카테고리 페이지
  '/search',                 // 검색 페이지
  '/demo/(.*)',              // 데모 페이지
  '/api/search',             // 검색 API
  '/api/posts/(.*)',         // 포스트 조회 API
])

/**
 * Clerk 미들웨어 설정
 * 
 * 접근 제어 정책:
 * 1. 모든 블로그 페이지는 공개 접근 허용
 * 2. 댓글 관련 API는 인증된 사용자만 접근 가능
 * 3. 관리자 페이지는 향후 역할 기반 접근 제어 적용 예정
 */
export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()
  const { pathname } = request.nextUrl

  // 개발 환경에서 디버깅 정보 출력 (프로덕션에서는 제거)
  if (process.env.NODE_ENV === 'development') {
    console.log(`🛡️ Middleware: ${pathname} - User: ${userId ? 'Authenticated' : 'Anonymous'}`)
  }

  // 보호된 API 라우트에 대한 인증 확인
  if (isProtectedApiRoute(request)) {
    if (!userId) {
      // 인증되지 않은 사용자는 401 에러 반환
      return NextResponse.json(
        { 
          error: '인증이 필요합니다. 댓글을 작성하려면 로그인해 주세요.',
          code: 'AUTHENTICATION_REQUIRED'
        },
        { status: 401 }
      )
    }
    
    // 인증된 사용자는 계속 진행
    return NextResponse.next()
  }

  // 관리자 페이지 접근 제어 (향후 확장)
  if (isAdminRoute(request)) {
    if (!userId) {
      // 로그인 페이지로 리디렉션
      const signInUrl = new URL('/sign-in', request.url)
      signInUrl.searchParams.set('redirect_url', pathname)
      return NextResponse.redirect(signInUrl)
    }
    
    // 추후 역할 기반 접근 제어 로직 추가 예정
    // const { sessionClaims } = await auth()
    // const userRole = sessionClaims?.metadata?.role
    // if (userRole !== 'admin') {
    //   return NextResponse.redirect(new URL('/unauthorized', request.url))
    // }
  }

  // 공개 라우트와 기타 모든 페이지는 자유 접근 허용
  return NextResponse.next()
})

/**
 * 미들웨어가 실행될 경로를 설정
 * 
 * 매처 설정:
 * - 모든 API 라우트 (/api/.*)
 * - 모든 페이지 라우트 (/, /posts/*, /admin/* 등)
 * - 정적 파일과 내부 Next.js 라우트는 제외
 */
export const config = {
  matcher: [
    // API 라우트 포함
    '/api/(.*)',
    
    // 페이지 라우트 포함 (정적 파일 제외)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    // 루트 경로 포함
    '/',
    
    // trpc 관련 경로 (사용하는 경우)
    '/(trpc)(.*)',
  ],
} 