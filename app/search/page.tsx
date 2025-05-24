/**
 * 검색 결과 페이지
 * URL 쿼리 파라미터를 통한 검색 결과 표시
 */

import { Suspense } from 'react';
import { Metadata } from 'next';
import SearchResults from '@/components/search/search-results';
import { searchPosts } from '@/data/mockData';

// 페이지 props 타입 정의
interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// 동적 메타데이터 생성
export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  
  if (query) {
    return {
      title: `"${query}" 검색 결과 | My Blog`,
      description: `"${query}"에 대한 블로그 포스트 검색 결과를 확인하세요.`,
      robots: 'noindex,follow', // 검색 결과 페이지는 인덱스하지 않음
    };
  }
  
  return {
    title: '포스트 검색 | My Blog',
    description: '블로그의 모든 포스트를 검색하고 원하는 정보를 빠르게 찾아보세요.',
  };
}

// 검색 결과 로딩 스켈레톤
function SearchResultsSkeleton() {
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 스켈레톤 */}
        <div className="mb-8">
          <div className="h-8 bg-muted rounded w-64 mb-4 animate-pulse" />
          <div className="h-4 bg-muted rounded w-48 animate-pulse" />
        </div>
        
        {/* 검색 폼 스켈레톤 */}
        <div className="mb-8">
          <div className="h-12 bg-muted rounded animate-pulse" />
        </div>
        
        {/* 필터 스켈레톤 */}
        <div className="flex gap-4 mb-8">
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        
        {/* 결과 카드 스켈레톤 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-card border rounded-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-muted" />
              <div className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                <div className="h-3 bg-muted rounded mb-4 w-1/2" />
                <div className="flex justify-between">
                  <div className="h-3 bg-muted rounded w-20" />
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 메인 검색 페이지 컴포넌트
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = typeof params.q === 'string' ? params.q : '';
  const category = typeof params.category === 'string' ? params.category : '';
  const sortBy = typeof params.sort === 'string' ? params.sort : 'relevance';
  
  // 초기 검색 결과 로드 (서버사이드)
  const initialResults = query ? searchPosts(query) : [];
  
  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        {/* 페이지 헤더 */}
        <header className="mb-8">
          {query ? (
            <>
              <h1 className="text-3xl font-bold mb-2">
                "<span className="text-primary">{query}</span>" 검색 결과
              </h1>
              <p className="text-muted-foreground">
                {initialResults.length}개의 포스트를 찾았습니다
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-2">포스트 검색</h1>
              <p className="text-muted-foreground">
                원하는 포스트를 검색해보세요
              </p>
            </>
          )}
        </header>

        {/* 검색 결과 컴포넌트 */}
        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults
            initialQuery={query}
            initialResults={initialResults}
            initialCategory={category}
            initialSortBy={sortBy}
          />
        </Suspense>
      </div>
    </div>
  );
} 