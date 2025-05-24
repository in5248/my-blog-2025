/**
 * 검색 기능 데모 페이지
 * 블로그 검색 시스템의 다양한 기능을 테스트하기 위한 페이지
 */

import { mockPosts } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Keyboard, Clock, FileText, Tag, Calendar } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Demo | My Blog',
  description: '블로그 검색 시스템의 다양한 기능을 테스트하는 데모 페이지입니다.',
};

export default function SearchDemoPage() {
  // 검색 가능한 모든 태그 수집
  const allTags = Array.from(new Set(mockPosts.flatMap(post => post.tags)));
  
  // 카테고리별 포스트 수 계산
  const categoryStats = mockPosts.reduce((acc, post) => {
    const categoryName = post.category.name;
    acc[categoryName] = (acc[categoryName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">🔍 검색 기능 데모</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            블로그의 강력한 검색 시스템을 체험해보세요. 실시간 검색, 키보드 단축키, 
            검색어 하이라이팅 등 다양한 기능을 제공합니다.
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
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* 헤더 검색 버튼 */}
                <div className="p-4 border rounded-lg">
                  <Search className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">헤더 검색 버튼</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    상단 네비게이션의 검색 아이콘을 클릭하세요.
                  </p>
                  <div className="flex items-center justify-center">
                    <div className="p-2 bg-muted rounded">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 키보드 단축키 */}
                <div className="p-4 border rounded-lg">
                  <Keyboard className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">키보드 단축키</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    언제든지 빠르게 검색창을 열 수 있습니다.
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-sm font-mono">K</kbd>
                  </div>
                </div>

                {/* 모바일 메뉴 */}
                <div className="p-4 border rounded-lg">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">모바일 메뉴</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    모바일에서는 햄버거 메뉴 안의 검색 버튼을 이용하세요.
                  </p>
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4 mr-2" />
                    검색
                  </Button>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-muted-foreground mb-4">
                  지금 바로 검색을 시도해보세요! <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Ctrl+K</kbd>
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 검색 기능 설명 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">🚀 주요 기능</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 실시간 검색 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  ⚡ 실시간 검색
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  입력과 동시에 검색 결과가 나타납니다. 빠르고 부드러운 검색 경험을 제공합니다.
                </p>
              </CardContent>
            </Card>

            {/* 하이라이팅 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🎯 하이라이팅
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  검색어가 포함된 부분을 시각적으로 강조하여 쉽게 찾을 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* 최근 검색어 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  최근 검색어
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  이전 검색 기록을 저장하여 빠르게 재검색할 수 있습니다.
                </p>
              </CardContent>
            </Card>

            {/* 스마트 검색 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  🧠 스마트 검색
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  제목, 내용, 태그, 카테고리에서 종합적으로 검색합니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 검색 가능한 콘텐츠 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">📚 검색 가능한 콘텐츠</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* 카테고리별 통계 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  카테고리별 포스트 ({mockPosts.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const categoryData = mockPosts.find(p => p.category.name === category)?.category;
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <Badge 
                          variant="secondary"
                          className="text-sm"
                          style={{ 
                            backgroundColor: categoryData?.color + '15',
                            color: categoryData?.color,
                            border: 'none'
                          }}
                        >
                          {category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{count}개</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 사용 가능한 태그 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  검색 가능한 태그 ({allTags.length}개)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 15).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {allTags.length > 15 && (
                    <Badge variant="secondary" className="text-xs">
                      +{allTags.length - 15}개 더
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  이 태그들로 검색하면 관련 포스트를 찾을 수 있습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 검색 팁 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">💡 검색 팁</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">🎯 효과적인 검색 방법</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div>• <strong>키워드:</strong> "React", "JavaScript", "TypeScript"</div>
                  <div>• <strong>기술명:</strong> "Next.js", "TailwindCSS"</div>
                  <div>• <strong>주제:</strong> "성능 최적화", "웹 개발"</div>
                  <div>• <strong>개념:</strong> "컴포넌트", "훅", "라우팅"</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">⌨️ 키보드 단축키</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>검색창 열기</span>
                    <div className="flex gap-1">
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl</kbd>
                      <span>+</span>
                      <kbd className="px-2 py-1 bg-muted rounded text-xs">K</kbd>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span>첫 번째 결과 선택</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span>검색창 닫기</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 샘플 검색어 제안 */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">🔍 지금 검색해보세요</h2>
          
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground mb-6">
                아래 검색어들을 클릭하거나 직접 입력해보세요!
              </p>
              
              <div className="flex flex-wrap justify-center gap-3">
                {[
                  'React',
                  'Next.js',
                  'TypeScript',
                  'JavaScript',
                  '웹 개발',
                  '성능 최적화',
                  'App Router',
                  '고급 타입',
                  'Concurrent',
                  'CSS'
                ].map((term) => (
                  <button
                    key={term}
                    className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                    onClick={() => {
                      // 키보드 단축키 이벤트 트리거
                      document.dispatchEvent(new KeyboardEvent('keydown', {
                        key: 'k',
                        ctrlKey: true,
                        bubbles: true
                      }));
                    }}
                  >
                    "{term}" 검색
                  </button>
                ))}
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