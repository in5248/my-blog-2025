/**
 * 검색 결과 페이지 데모
 * 검색 페이지의 다양한 기능들을 테스트할 수 있는 데모 페이지
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc, ArrowLeft, ExternalLink, BookOpen } from 'lucide-react';
import { categories, getPopularTags } from '@/data/mockData';

export default function SearchPageDemo() {
  const popularTags = getPopularTags(10);
  const sampleSearchTerms = [
    'React',
    'Next.js',
    'TypeScript',
    '성능 최적화',
    'CSS Grid',
    'JavaScript ES2024',
    'API 설계',
    '데이터베이스'
  ];

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🔍 검색 결과 페이지 데모
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            URL 기반 검색과 고급 필터링 기능을 체험해보세요
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/search">
                <Search className="w-4 h-4 mr-2" />
                검색 페이지 열기
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo">
                <ArrowLeft className="w-4 h-4 mr-2" />
                데모 홈으로
              </Link>
            </Button>
          </div>
        </header>

        {/* 기능 소개 */}
        <div className="grid gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                핵심 기능
              </CardTitle>
              <CardDescription>
                검색 결과 페이지의 주요 기능들을 확인하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">🔍 URL 기반 검색</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 쿼리 파라미터(?q=검색어)를 통한 직접 검색</li>
                    <li>• 브라우저 뒤로가기/앞으로가기 지원</li>
                    <li>• 북마크 가능한 검색 결과 URL</li>
                    <li>• SEO 친화적인 메타데이터</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">⚡ 실시간 검색</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 입력과 동시에 결과 업데이트</li>
                    <li>• 디바운싱으로 성능 최적화</li>
                    <li>• 검색어 하이라이팅</li>
                    <li>• 검색 소요 시간 표시</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🎛️ 고급 필터링</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 카테고리별 필터</li>
                    <li>• 관련도순, 최신순, 인기순 정렬</li>
                    <li>• 활성 필터 표시 및 제거</li>
                    <li>• URL에 필터 상태 저장</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">🎯 사용자 경험</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• 검색 결과 없음 상태 처리</li>
                    <li>• 검색어 제안 기능</li>
                    <li>• 인기 태그 표시</li>
                    <li>• 로딩 상태 및 애니메이션</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 테스트 검색어 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              테스트 검색어
            </CardTitle>
            <CardDescription>
              아래 검색어들을 클릭해서 검색 결과를 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-3">샘플 검색어</h4>
                <div className="flex flex-wrap gap-2">
                  {sampleSearchTerms.map((term) => (
                    <Button
                      key={term}
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-sm"
                    >
                      <Link href={`/search?q=${encodeURIComponent(term)}`}>
                        {term}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">인기 태그</h4>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Button
                      key={tag}
                      variant="secondary"
                      size="sm"
                      asChild
                      className="text-sm"
                    >
                      <Link href={`/search?q=${encodeURIComponent(tag)}`}>
                        #{tag}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 카테고리별 검색 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              카테고리별 검색
            </CardTitle>
            <CardDescription>
              특정 카테고리에서 검색해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <Button
                  key={category.slug}
                  variant="outline"
                  className="justify-start h-auto p-4"
                  asChild
                >
                  <Link href={`/search?q=React&category=${category.slug}`}>
                    <div className="flex flex-col items-start w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        "React"를 {category.name}에서 검색
                      </span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 정렬 옵션 테스트 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SortAsc className="w-5 h-5" />
              정렬 옵션 테스트
            </CardTitle>
            <CardDescription>
              다양한 정렬 방식으로 검색 결과를 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { sort: 'relevance', label: '관련도순', description: '검색어와의 관련성' },
                { sort: 'newest', label: '최신순', description: '최근 게시된 순서' },
                { sort: 'oldest', label: '오래된순', description: '오래된 게시 순서' },
                { sort: 'popular', label: '인기순', description: '조회수 기준' }
              ].map((option) => (
                <Button
                  key={option.sort}
                  variant="outline"
                  className="h-auto p-4 flex-col items-start"
                  asChild
                >
                  <Link href={`/search?q=개발&sort=${option.sort}`}>
                    <span className="font-medium mb-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground">
                      {option.description}
                    </span>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 고급 검색 예제 */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>🚀 고급 검색 예제</CardTitle>
            <CardDescription>
              복합 조건을 활용한 검색 예제들을 확인해보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Frontend 기술 최신순',
                  description: 'Frontend 카테고리에서 "React" 검색, 최신순 정렬',
                  url: '/search?q=React&category=frontend&sort=newest'
                },
                {
                  title: 'Backend 인기 포스트',
                  description: 'Backend 카테고리에서 "API" 검색, 인기순 정렬',
                  url: '/search?q=API&category=backend&sort=popular'
                },
                {
                  title: '성능 최적화 가이드',
                  description: '성능 최적화 관련 포스트 검색',
                  url: '/search?q=성능 최적화'
                },
                {
                  title: 'TypeScript 기초부터',
                  description: 'TypeScript 관련 포스트, 오래된순으로 정렬',
                  url: '/search?q=TypeScript&sort=oldest'
                }
              ].map((example, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-grow">
                      <h4 className="font-medium mb-1">{example.title}</h4>
                      <p className="text-sm text-muted-foreground">{example.description}</p>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={example.url}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        테스트
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 통계 정보 */}
        <Card>
          <CardHeader>
            <CardTitle>📊 콘텐츠 통계</CardTitle>
            <CardDescription>
              현재 블로그의 콘텐츠 현황을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">20+</div>
                <div className="text-sm text-muted-foreground">총 포스트</div>
              </div>
              <div className="text-center p-4 bg-green-500/5 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">{categories.length}</div>
                <div className="text-sm text-muted-foreground">카테고리</div>
              </div>
              <div className="text-center p-4 bg-blue-500/5 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">{popularTags.length}+</div>
                <div className="text-sm text-muted-foreground">태그</div>
              </div>
              <div className="text-center p-4 bg-purple-500/5 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-1">100%</div>
                <div className="text-sm text-muted-foreground">검색 가능</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 네비게이션 */}
        <div className="mt-12 pt-8 border-t text-center">
          <div className="flex justify-center gap-4 mb-4">
            <Button asChild>
              <Link href="/search">
                <Search className="w-4 h-4 mr-2" />
                검색 페이지 사용하기
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/demo/search">
                <Search className="w-4 h-4 mr-2" />
                검색 다이얼로그 데모
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            검색 기능을 테스트하고 피드백을 남겨주세요 🚀
          </p>
        </div>
      </div>
    </div>
  );
} 