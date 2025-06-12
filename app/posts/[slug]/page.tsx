/**
 * 블로그 포스트 상세 페이지
 * 동적 라우팅을 통해 개별 포스트의 상세 내용을 표시
 */

import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getRelativeTime,
  mockPosts,
  type BlogPost,
} from "@/data/mockData";
import MarkdownContent from "@/components/blog/markdown-content";
import RelatedPosts from "@/components/blog/related-posts";
import LikeButton from "@/components/blog/like-button";
import type { Metadata } from "next";

// 페이지 props 타입 정의
type PageProps = {
  params: Promise<{ slug: string }>;
};

// 정적 경로 생성 함수
export async function generateStaticParams() {
  return mockPosts
    .filter((post) => post.status === "published")
    .map((post) => ({
      slug: post.slug,
    }));
}

// 동적 메타데이터 생성 함수
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "포스트를 찾을 수 없습니다 | My Blog",
    };
  }

  return {
    title: `${post.title} | My Blog`,
    description: post.excerpt,
    authors: [{ name: post.author.name }],
    keywords: post.tags,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: post.tags,
      images: post.coverImage
        ? [
            {
              url: post.coverImage,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

// 포스트 헤더 컴포넌트
function PostHeader({ post }: { post: BlogPost }) {
  return (
    <header className="mb-12">
      {/* 뒤로 가기 링크 */}
      <div className="mb-6">
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          ← 모든 글 보기
        </Link>
      </div>

      {/* 포스트 제목 */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
        {post.title}
      </h1>

      {/* 포스트 메타 정보 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        {/* 작성자 정보 */}
        <div className="flex items-center gap-3">
          {post.author.avatar ? (
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium">
              {post.author.name[0]}
            </div>
          )}
          <div>
            <p className="font-medium">{post.author.name}</p>
            {post.author.bio && (
              <p className="text-sm text-muted-foreground">{post.author.bio}</p>
            )}
          </div>
        </div>

        {/* 구분선 */}
        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* 날짜 및 읽기 시간 정보 */}
        <div className="flex flex-col text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>📅 {getRelativeTime(post.publishedAt)}</span>
            <span>📖 {post.readingTime}분 읽기</span>
            <span>👀 {post.viewCount.toLocaleString()}</span>
          </div>
          {post.updatedAt > post.publishedAt && (
            <p className="text-xs mt-1">
              마지막 수정:{" "}
              {new Date(post.updatedAt).toLocaleDateString("ko-KR")}
            </p>
          )}
        </div>

        {/* 구분선 */}
        <div className="hidden sm:block w-px h-8 bg-border" />

        {/* 좋아요 버튼 */}
        <div className="flex items-center">
          <LikeButton
            postId={post.slug}
            initialLikes={post.likeCount}
            size="lg"
            showCount={true}
          />
        </div>
      </div>

      {/* 카테고리 및 태그 */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* 카테고리 */}
        <Link
          href={`/categories/${post.category.slug}`}
          className="inline-flex items-center"
        >
          <span
            className="px-3 py-1 rounded-full text-sm font-medium hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: post.category.color + "15",
              color: post.category.color,
            }}
          >
            📁 {post.category.name}
          </span>
        </Link>

        {/* 태그들 */}
        {post.tags.length > 0 && (
          <>
            <span className="text-muted-foreground">|</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 추천 포스트 배지 */}
      {post.featured && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
          ⭐ 추천 포스트
        </div>
      )}
    </header>
  );
}

// 포스트 콘텐츠 컴포넌트
function PostContent({ post }: { post: BlogPost }) {
  return (
    <article className="mb-16">
      {/* 커버 이미지 */}
      {post.coverImage && (
        <div className="relative w-full h-64 md:h-80 lg:h-96 mb-8 rounded-xl overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>
      )}

      {/* 마크다운 콘텐츠 */}
      <MarkdownContent
        content={post.content}
        size="lg"
        enableTableOfContents={true}
        className="mb-12"
      />

      {/* 소셜 공유 및 좋아요 버튼 */}
      <div className="mt-12 pt-8 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* 좋아요 섹션 */}
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">
              이 글이 도움이 되셨나요?
            </span>
            <LikeButton
              postId={post.slug}
              initialLikes={post.likeCount}
              size="lg"
              showCount={true}
            />
          </div>

          {/* 소셜 공유 버튼 */}
          <div>
            <h3 className="text-lg font-semibold mb-3 sm:text-right">
              공유하기
            </h3>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                Twitter
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Facebook
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                링크 복사
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// 메인 페이지 컴포넌트
export default async function PostDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 포스트 데이터 가져오기
  const post = getPostBySlug(slug);

  // 포스트가 존재하지 않으면 404 반환
  if (!post) {
    notFound();
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* 포스트 헤더 */}
        <PostHeader post={post} />

        {/* 포스트 콘텐츠 */}
        <PostContent post={post} />

        {/* 관련 포스트 - 새로운 컴포넌트 사용 */}
        <RelatedPosts currentPost={post} />

        {/* 다음 구현할 섹션들 */}
        <div className="mt-16 pt-8 border-t">
          <div className="text-center text-muted-foreground">
            <p className="mb-4">
              💬 댓글 시스템은 곧 추가될 예정입니다. 👍 좋아요 기능은 이미
              활성화되어 있어요!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                다른 글 보기
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
