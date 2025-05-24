/**
 * 블로그 홈페이지 컴포넌트
 * Hero 섹션, 최신 포스트, 카테고리 섹션으로 구성
 */

import Link from 'next/link';
import { getLatestPosts, getCategoriesWithCount } from '@/data/mockData';
import PostCard from '@/components/blog/post-card';

export default function Home() {
  // 최신 포스트 3개 가져오기
  const latestPosts = getLatestPosts(3);
  
  // 카테고리별 포스트 개수 가져오기
  const categoriesWithCount = getCategoriesWithCount();

  return (
    <div id="main-content" className="py-16">
      {/* Hero 섹션 */}
      <section className="text-center mb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Welcome to My Blog
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            웹 개발, JavaScript, React, Next.js에 관한 최신 기술과 실무 경험을 공유합니다. 
            함께 성장하는 개발자가 되어보세요.
          </p>
          
          {/* CTA 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/posts"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              📚 블로그 글 읽기
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-lg border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
            >
              👋 소개 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 최신 포스트 섹션 */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">최신 글</h2>
            <p className="text-muted-foreground">가장 최근에 작성된 글들을 확인해보세요</p>
          </div>
          <Link
            href="/posts"
            className="group text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
          >
            모든 글 보기 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              showTags={true}
              maxTags={2}
            />
          ))}
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section>
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">카테고리</h2>
          <p className="text-muted-foreground">관심 있는 주제별로 글을 찾아보세요</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categoriesWithCount.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group relative rounded-xl border bg-card p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* 카테고리 색상 인디케이터 */}
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-3"
                style={{ backgroundColor: category.color }}
              />
              
              {/* 카테고리 정보 */}
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                {category.name}
              </h3>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {category.description}
              </p>
              
              {/* 포스트 개수 */}
              <div className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground inline-block">
                {category.postCount}개의 글
              </div>

              {/* 호버 효과 */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors" />
            </Link>
          ))}
        </div>

        {/* 전체 카테고리 보기 링크 */}
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            모든 카테고리 보기
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
