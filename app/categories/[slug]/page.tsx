/**
 * 카테고리 상세 페이지
 * 특정 카테고리에 속한 포스트들을 표시합니다.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  getCategoryBySlug, 
  getPostsByCategory, 
  mockCategories 
} from '@/data/mockData';
import PostCard from '@/components/blog/post-card';
import type { Metadata } from 'next';

// 페이지 props 타입 정의
type PageProps = {
  params: Promise<{ slug: string }>;
};

// 정적 경로 생성 함수
export async function generateStaticParams() {
  return mockCategories.map((category) => ({
    slug: category.slug,
  }));
}

// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  
  if (!category) {
    return {
      title: '카테고리를 찾을 수 없습니다 | My Blog',
    };
  }

  const posts = getPostsByCategory(slug);

  return {
    title: `${category.name} | My Blog`,
    description: `${category.description} - ${posts.length}개의 글이 있습니다.`,
    openGraph: {
      title: `${category.name} | My Blog`,
      description: `${category.description} - ${posts.length}개의 글이 있습니다.`,
    },
  };
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  // 카테고리 정보 가져오기
  const category = getCategoryBySlug(slug);
  
  // 카테고리가 존재하지 않으면 404 반환
  if (!category) {
    notFound();
  }

  // 해당 카테고리의 포스트들 가져오기
  const posts = getPostsByCategory(slug);

  return (
    <div className="py-16">
      {/* 카테고리 헤더 */}
      <section className="mb-16">
        <div className="text-center">
          {/* 뒤로 가기 링크 */}
          <div className="mb-6">
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              ← 모든 카테고리
            </Link>
          </div>

          {/* 카테고리 정보 */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h1 className="text-4xl md:text-5xl font-bold">
              {category.name}
            </h1>
          </div>

          {/* 카테고리 설명 */}
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              {category.description}
            </p>
          )}

          {/* 포스트 개수 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <span>📝</span>
            <span>{posts.length}개의 글</span>
          </div>
        </div>
      </section>

      {/* 포스트 목록 */}
      <section>
        {posts.length > 0 ? (
          <>
            {/* 정렬 및 필터 정보 */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground">
                최신 글부터 {posts.length}개의 글을 보여드립니다.
              </p>
            </div>

            {/* 포스트 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  showCategory={false}
                  showTags={true}
                  maxTags={3}
                />
              ))}
            </div>

            {/* 더 많은 글 안내 */}
            <div className="text-center mt-12">
              <div className="max-w-md mx-auto">
                <p className="text-muted-foreground mb-4">
                  더 많은 {category.name} 관련 글들이 곧 업데이트됩니다.
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  다른 카테고리 둘러보기 →
                </Link>
              </div>
            </div>
          </>
        ) : (
          /* 포스트가 없는 경우 */
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-2xl font-bold mb-4">아직 글이 없습니다</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {category.name} 카테고리에는 아직 작성된 글이 없습니다. 
              곧 고품질의 콘텐츠들이 업데이트될 예정입니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                다른 카테고리 보기
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
    </div>
  );
} 