/**
 * 블로그 포스트 목록 페이지
 * 모든 블로그 포스트를 필터링, 정렬, 페이지네이션과 함께 표시
 */

import Link from "next/link";
import { Suspense } from "react";
import {
  getPaginatedPosts,
  getCategoriesWithCount,
  getPageNumbers,
} from "@/data/mockData";
import PostCard from "@/components/blog/post-card";
import type { Metadata } from "next";

// 페이지 메타데이터
export const metadata: Metadata = {
  title: "Blog Posts | My Blog",
  description:
    "웹 개발, JavaScript, React, Next.js에 관한 모든 블로그 글을 확인해보세요.",
  openGraph: {
    title: "Blog Posts | My Blog",
    description:
      "웹 개발, JavaScript, React, Next.js에 관한 모든 블로그 글을 확인해보세요.",
  },
};

// 페이지 props 타입 정의
type PageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    sort?: "latest" | "popular" | "views";
    search?: string;
  }>;
};

// 카테고리 필터 컴포넌트
function CategoryFilter({
  categories,
  currentCategory,
  totalPosts,
}: {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    postCount: number;
    color?: string;
  }>;
  currentCategory: string;
  totalPosts: number;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href="/posts?category=all"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          currentCategory === "all" || !currentCategory
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        전체 ({totalPosts})
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/posts?category=${category.slug}`}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentCategory === category.slug
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {category.name} ({category.postCount})
        </Link>
      ))}
    </div>
  );
}

// 정렬 선택 컴포넌트
function SortSelect({ currentSort }: { currentSort: string }) {
  const sortOptions = [
    { value: "latest", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "views", label: "조회수순" },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">정렬:</span>
      <div className="flex gap-1">
        {sortOptions.map((option) => (
          <Link
            key={option.value}
            href={`/posts?sort=${option.value}`}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              currentSort === option.value ||
              (!currentSort && option.value === "latest")
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

// 페이지네이션 컴포넌트
function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2">
      {/* 이전 페이지 */}
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}&page=${currentPage - 1}`}
          className="px-3 py-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          이전
        </Link>
      )}

      {/* 페이지 번호들 */}
      {pageNumbers.map((pageNum) => (
        <Link
          key={pageNum}
          href={`${baseUrl}&page=${pageNum}`}
          className={`px-3 py-2 rounded transition-colors ${
            pageNum === currentPage
              ? "bg-primary text-primary-foreground"
              : "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          {pageNum}
        </Link>
      ))}

      {/* 다음 페이지 */}
      {currentPage < totalPages && (
        <Link
          href={`${baseUrl}&page=${currentPage + 1}`}
          className="px-3 py-2 rounded border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          다음
        </Link>
      )}
    </div>
  );
}

// 메인 포스트 목록 컴포넌트
interface SearchParams {
  category?: string;
  page?: string;
  search?: string;
  sort?: string;
}

async function PostsList({ searchParams }: { searchParams: SearchParams }) {
  const page = parseInt(searchParams.page || "1");
  const category = searchParams.category || "all";
  const sort = (searchParams.sort || "latest") as
    | "latest"
    | "popular"
    | "views";
  const search = searchParams.search || "";

  // 페이지네이션된 포스트 데이터 가져오기
  const { data: posts, pagination } = getPaginatedPosts(
    page,
    9, // 페이지당 9개
    category === "all" ? undefined : category,
    sort,
    search
  );

  // 카테고리 목록 가져오기
  const categoriesWithCount = getCategoriesWithCount();

  // URL 파라미터 구성
  const buildUrl = (params: Record<string, string>) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "all" && value !== "latest") {
        searchParams.set(key, value);
      }
    });
    const queryString = searchParams.toString();
    return `/posts${queryString ? `?${queryString}` : ""}`;
  };

  const baseUrl = buildUrl({ category, sort, search }).replace(/&page=\d+/, "");

  return (
    <div className="space-y-8">
      {/* 필터링 및 정렬 섹션 */}
      <section className="space-y-6">
        {/* 카테고리 필터 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">카테고리별 필터</h3>
          <CategoryFilter
            categories={categoriesWithCount}
            currentCategory={category}
            totalPosts={categoriesWithCount.reduce(
              (sum, cat) => sum + cat.postCount,
              0
            )}
          />
        </div>

        {/* 정렬 옵션 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t">
          <div className="flex items-center gap-4">
            <SortSelect currentSort={sort} />
          </div>

          {/* 검색 박스 (기본 구조) */}
          <div className="relative">
            <input
              type="text"
              placeholder="포스트 검색..."
              defaultValue={search}
              className="px-4 py-2 border border-input rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled // 추후 구현 예정
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              🔍
            </div>
          </div>
        </div>
      </section>

      {/* 결과 정보 */}
      <section>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {category !== "all" && (
              <>
                <span className="font-medium">
                  {
                    categoriesWithCount.find((cat) => cat.slug === category)
                      ?.name
                  }
                </span>{" "}
                카테고리의{" "}
              </>
            )}
            총 {pagination.totalItems}개의 글
            {pagination.totalPages > 1 && (
              <>
                {" "}
                (페이지 {pagination.currentPage} / {pagination.totalPages})
              </>
            )}
          </p>
        </div>
      </section>

      {/* 포스트 그리드 */}
      <section>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                showTags={true}
                maxTags={3}
                showCategory={category === "all"}
              />
            ))}
          </div>
        ) : (
          /* 포스트가 없는 경우 */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold mb-4">
              포스트를 찾을 수 없습니다
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {search ? (
                <>검색어 &quot;{search}&quot;에 해당하는 글이 없습니다.</>
              ) : category !== "all" ? (
                <>이 카테고리에는 아직 작성된 글이 없습니다.</>
              ) : (
                <>아직 작성된 글이 없습니다.</>
              )}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                모든 글 보기
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* 페이지네이션 */}
      {posts.length > 0 && (
        <section className="pt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            baseUrl={baseUrl}
          />
        </section>
      )}
    </div>
  );
}

// 메인 페이지 컴포넌트
export default async function PostsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="py-16">
      {/* 페이지 헤더 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog Posts</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          웹 개발, JavaScript, React, Next.js에 관한 모든 블로그 글을
          확인해보세요. 카테고리별로 필터링하거나 관심 있는 주제를 검색해보세요.
        </p>
      </section>

      {/* 포스트 목록 (Suspense로 래핑) */}
      <Suspense
        fallback={
          <div className="text-center py-16">
            <div className="text-4xl mb-4">⏳</div>
            <p className="text-muted-foreground">포스트를 불러오는 중...</p>
          </div>
        }
      >
        <PostsList searchParams={resolvedSearchParams} />
      </Suspense>
    </div>
  );
}
