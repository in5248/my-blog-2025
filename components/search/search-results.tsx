/**
 * 검색 결과 컴포넌트
 * 클라이언트 사이드 검색, 필터링, 정렬 기능 제공
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, SortAsc, Calendar, TrendingUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PostCard } from "@/components/blog/post-card";
import {
  searchPosts,
  categories,
  getPopularTags,
  type BlogPost,
} from "@/data/mockData";

/**
 * SearchResults 컴포넌트의 Props 인터페이스
 */
interface SearchResultsProps {
  /** 초기 검색어 */
  initialQuery: string;
  /** 초기 검색 결과 */
  initialResults: BlogPost[];
  /** 초기 카테고리 필터 */
  initialCategory: string;
  /** 초기 정렬 방식 */
  initialSortBy: string;
}

/**
 * 정렬 옵션 타입
 */
type SortOption = "relevance" | "newest" | "oldest" | "popular";

/**
 * 검색어 하이라이팅 함수
 */
function highlightSearchTerm(
  text: string,
  searchTerm: string
): React.ReactNode {
  if (!searchTerm.trim()) return text;

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-primary/20 text-primary font-medium rounded px-1"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * 포스트 정렬 함수
 */
function sortPosts(posts: BlogPost[], sortBy: SortOption): BlogPost[] {
  switch (sortBy) {
    case "newest":
      return [...posts].sort(
        (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
      );
    case "oldest":
      return [...posts].sort(
        (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime()
      );
    case "popular":
      return [...posts].sort((a, b) => b.viewCount - a.viewCount);
    case "relevance":
    default:
      return posts; // 검색 함수에서 이미 관련도순으로 정렬됨
  }
}

/**
 * 빈 검색 상태 컴포넌트
 */
function EmptySearchState() {
  const router = useRouter();
  const popularTags = getPopularTags(8);

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>

      <h3 className="text-xl font-semibold mb-2">검색어를 입력해주세요</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        제목, 내용, 태그에서 키워드를 검색할 수 있습니다.
        <br />
        아래 인기 태그를 클릭해서 검색해보세요.
      </p>

      {/* 인기 태그 */}
      <div className="mb-8">
        <h4 className="text-sm font-medium mb-4 flex items-center justify-center gap-2">
          <TrendingUp className="w-4 h-4" />
          인기 태그
        </h4>
        <div className="flex flex-wrap justify-center gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag}
              onClick={() =>
                router.push(`/search?q=${encodeURIComponent(tag)}`)
              }
              className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded-full text-sm transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* 최근 포스트 */}
      <div>
        <Button
          onClick={() => router.push("/posts")}
          className="inline-flex items-center gap-2"
        >
          <Calendar className="w-4 h-4" />
          최신 포스트 보러 가기
        </Button>
      </div>
    </div>
  );
}

/**
 * 검색 결과 없음 상태 컴포넌트
 */
interface NoResultsProps {
  query: string;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const NoResults = ({
  query,
  suggestions,
  onSuggestionClick,
}: NoResultsProps) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
      <Search className="w-8 h-8 text-muted-foreground" />
    </div>

    <h3 className="text-xl font-semibold mb-2">검색 결과가 없습니다</h3>
    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
      &ldquo;
      <mark className="bg-primary/20 text-primary px-1 rounded">{query}</mark>
      &rdquo;에 대한 검색 결과를 찾을 수 없습니다.
    </p>

    {suggestions?.length > 0 && (
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3">이런 검색어는 어떠세요?</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {suggestions.map((suggestion: string) => (
            <Button
              key={suggestion}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    )}
  </div>
);

/**
 * 메인 SearchResults 컴포넌트
 */
export default function SearchResults({
  initialQuery,
  initialResults,
  initialCategory,
  initialSortBy,
}: SearchResultsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 상태 관리
  const [query, setQuery] = useState(initialQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const [results, setResults] = useState<BlogPost[]>(initialResults);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>(
    (initialSortBy as SortOption) || "relevance"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  // URL 업데이트 함수
  const updateURL = useCallback(
    (newQuery: string, newCategory?: string, newSort?: string) => {
      const params = new URLSearchParams();
      if (newQuery) params.set("q", newQuery);
      if (newCategory) params.set("category", newCategory);
      if (newSort && newSort !== "relevance") params.set("sort", newSort);

      const url = params.toString()
        ? `/search?${params.toString()}`
        : "/search";
      router.push(url);
    },
    [router]
  );

  // 검색 실행
  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setSearchTime(null);
        return;
      }

      setIsLoading(true);
      const startTime = performance.now();

      try {
        // 실제 환경에서는 API 호출
        await new Promise((resolve) => setTimeout(resolve, 100)); // 로딩 시뮬레이션

        let searchResults = searchPosts(searchQuery);

        // 카테고리 필터 적용
        if (selectedCategory) {
          searchResults = searchResults.filter(
            (post) => post.category.slug === selectedCategory
          );
        }

        // 정렬 적용
        searchResults = sortPosts(searchResults, sortBy);

        const endTime = performance.now();
        setResults(searchResults);
        setSearchTime(endTime - startTime);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
        setSearchTime(null);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedCategory, sortBy]
  );

  // 검색 폼 제출
  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = inputValue.trim();
      setQuery(trimmedQuery);
      updateURL(trimmedQuery, selectedCategory, sortBy);
      performSearch(trimmedQuery);
    },
    [inputValue, selectedCategory, sortBy, updateURL, performSearch]
  );

  // 제안된 검색어로 검색
  const handleSuggestedSearch = useCallback(
    (suggestion: string) => {
      setInputValue(suggestion);
      setQuery(suggestion);
      updateURL(suggestion, selectedCategory, sortBy);
      performSearch(suggestion);
    },
    [selectedCategory, sortBy, updateURL, performSearch]
  );

  // 필터/정렬 변경시 재검색
  useEffect(() => {
    if (query) {
      performSearch(query);
      updateURL(query, selectedCategory, sortBy);
    }
  }, [selectedCategory, sortBy, query, performSearch, updateURL]);

  // URL 파라미터 변경 감지
  useEffect(() => {
    const urlQuery = searchParams.get("q") || "";
    const urlCategory = searchParams.get("category") || "";
    const urlSort = searchParams.get("sort") || "relevance";

    setInputValue(urlQuery);
    setQuery(urlQuery);
    setSelectedCategory(urlCategory);
    setSortBy(urlSort as SortOption);

    if (urlQuery) {
      performSearch(urlQuery);
    }
  }, [searchParams, performSearch]);

  return (
    <div className="space-y-8">
      {/* 검색 폼 */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-grow relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="검색어를 입력하세요..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "검색 중..." : "검색"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 필터 및 정렬 */}
      {query && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-4">
            {/* 카테고리 필터 */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="카테고리" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">모든 카테고리</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 정렬 옵션 */}
            <div className="flex items-center gap-2">
              <SortAsc className="w-4 h-4 text-muted-foreground" />
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as SortOption)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">관련도순</SelectItem>
                  <SelectItem value="newest">최신순</SelectItem>
                  <SelectItem value="oldest">오래된순</SelectItem>
                  <SelectItem value="popular">인기순</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 검색 정보 */}
          {searchTime !== null && (
            <div className="text-sm text-muted-foreground">
              약 {searchTime.toFixed(0)}ms에 {results.length}개 결과
            </div>
          )}
        </div>
      )}

      {/* 활성 필터 표시 */}
      {(selectedCategory || sortBy !== "relevance") && (
        <div className="flex flex-wrap gap-2">
          {selectedCategory && (
            <Badge variant="secondary" className="gap-1">
              카테고리:{" "}
              {categories.find((c) => c.slug === selectedCategory)?.name}
              <button
                onClick={() => setSelectedCategory("")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {sortBy !== "relevance" && (
            <Badge variant="secondary" className="gap-1">
              정렬:{" "}
              {sortBy === "newest"
                ? "최신순"
                : sortBy === "oldest"
                ? "오래된순"
                : sortBy === "popular"
                ? "인기순"
                : "관련도순"}
              <button
                onClick={() => setSortBy("relevance")}
                className="ml-1 hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* 검색 결과 */}
      {!query ? (
        <EmptySearchState />
      ) : isLoading ? (
        <div className="text-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">검색 중...</p>
        </div>
      ) : results.length === 0 ? (
        <NoResults
          query={query}
          suggestions={["Next.js", "React", "TypeScript"]} // Add default suggestions or generate based on query
          onSuggestionClick={handleSuggestedSearch}
        />
      ) : (
        <div>
          {/* 검색 결과 헤더 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">
              검색 결과 ({results.length}개)
            </h2>
            <p className="text-sm text-muted-foreground">
              &ldquo;{highlightSearchTerm(query, query)}&rdquo;에 대한 검색 결과입니다
            </p>
          </div>

          {/* 포스트 그리드 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                searchQuery={query} // 하이라이팅을 위한 검색어 전달
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
