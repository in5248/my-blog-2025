/**
 * 검색 기능 데모 페이지
 * 블로그 검색 시스템의 다양한 기능을 테스트하기 위한 페이지
 */

import { mockPosts } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Keyboard, Clock, FileText, Tag } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { SearchDemoButton } from "@/components/demo/search-demo-button";

export const metadata: Metadata = {
  title: "Search Demo | My Blog",
  description:
    "블로그 검색 시스템의 다양한 기능을 테스트하는 데모 페이지입니다.",
};

export default function SearchDemoPage() {
  // 검색 가능한 모든 태그 수집
  const allTags = Array.from(new Set(mockPosts.flatMap((post) => post.tags)));

  // 카테고리별 포스트 수 계산
  const categoryStats = mockPosts.reduce((acc, post) => {
    const categoryName = post.category.name;
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 인기 검색어 목록 (예시)
  const popularSearchTerms = [
    "Next.js",
    "React",
    "TypeScript",
    "JavaScript",
    "CSS",
  ];

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">🔍 검색 기능 데모</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            블로그의 강력한 검색 시스템을 체험해보세요. 실시간 검색, 키보드
            단축키, 검색어 하이라이팅 등 다양한 기능을 제공합니다.
          </p>
        </header>

        {/* 검색 시작하기 섹션 */}
        <section className="mb-16">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Search className="w-6 h-6" />
                검색 시작하기
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-muted-foreground">
                아래 방법들 중 원하는 방식으로 검색을 시작할 수 있습니다.
              </p>

              {/* 인기 검색어 */}
              <div className="space-y-2">
                <h3 className="font-medium">인기 검색어로 검색</h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {popularSearchTerms.map((term) => (
                    <SearchDemoButton key={term} term={term} />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 네비게이션 */}
        <footer className="mt-16 pt-8 border-t text-center">
          <div className="flex justify-center gap-4">
            <Link
              href="/demo/markdown"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              📝 마크다운 데모 보기
            </Link>
            <Link
              href="/demo/related-posts"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              🔗 관련 포스트 데모 보기
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              📚 포스트 목록 보기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              🏠 홈으로 돌아가기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
