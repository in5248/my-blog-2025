import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 모든 요청 허용
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|trpc|_next|.*\\..*).*)"],
};
