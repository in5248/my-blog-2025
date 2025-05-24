/**
 * 카테고리 목록 페이지
 * 모든 카테고리를 카드 형태로 표시하고 각각의 포스트 개수를 보여줍니다.
 */

import Link from 'next/link';
import { getCategoriesWithCount } from '@/data/mockData';
import type { Metadata } from 'next';

// 페이지 메타데이터
export const metadata: Metadata = {
  title: '카테고리 | My Blog',
  description: '블로그의 모든 카테고리를 확인하고 관심 있는 주제의 글을 찾아보세요.',
  openGraph: {
    title: '카테고리 | My Blog',
    description: '블로그의 모든 카테고리를 확인하고 관심 있는 주제의 글을 찾아보세요.',
  },
};

export default function CategoriesPage() {
  // 카테고리별 포스트 개수와 함께 가져오기
  const categoriesWithCount = getCategoriesWithCount();

  return (
    <div className="py-16">
      {/* 페이지 헤더 */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          카테고리
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          관심 있는 주제별로 글을 찾아보세요. 각 카테고리마다 엄선된 고품질 콘텐츠를 제공합니다.
        </p>
      </section>

      {/* 카테고리 통계 */}
      <section className="mb-12">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-muted text-muted-foreground text-sm">
            <span>📚</span>
            <span>총 {categoriesWithCount.length}개의 카테고리</span>
          </div>
        </div>
      </section>

      {/* 카테고리 그리드 */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categoriesWithCount.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group block"
            >
              <article className="relative rounded-xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                {/* 카테고리 색상 인디케이터 */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                    {category.postCount}개의 글
                  </div>
                </div>
                
                {/* 카테고리 정보 */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {category.description}
                  </p>
                </div>

                {/* 호버 시 더 보기 표시 */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <span>더 보기</span>
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>

                {/* 호버 효과 보더 */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors" />
              </article>
            </Link>
          ))}
        </div>

        {/* 카테고리가 없는 경우 */}
        {categoriesWithCount.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-2xl font-bold mb-2">카테고리가 없습니다</h3>
            <p className="text-muted-foreground">
              아직 등록된 카테고리가 없습니다. 곧 다양한 주제의 글들이 업데이트될 예정입니다.
            </p>
          </div>
        )}
      </section>

      {/* 추가 안내 */}
      <section className="mt-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">원하는 카테고리를 찾지 못하셨나요?</h3>
          <p className="text-muted-foreground mb-6">
            더 많은 주제와 카테고리가 지속적으로 추가되고 있습니다. 
            특정 주제에 대한 글을 원하신다면 언제든 요청해주세요.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200"
          >
            문의하기
          </Link>
        </div>
      </section>
    </div>
  );
} 