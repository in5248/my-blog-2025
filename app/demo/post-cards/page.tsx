/**
 * PostCard 컴포넌트 데모 페이지
 * 다양한 변형과 옵션을 테스트할 수 있는 페이지
 */

import { getLatestPosts } from '@/data/mockData';
import PostCard, { FeaturedPostCard, CompactPostCard, RelatedPostCard } from '@/components/blog/post-card';
import Link from 'next/link';

export default function PostCardDemoPage() {
  const posts = getLatestPosts(5);
  const samplePost = posts[0];

  return (
    <div className="py-16 space-y-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">PostCard 컴포넌트 데모</h1>
        <p className="text-muted-foreground">다양한 PostCard 변형들을 확인해보세요</p>
      </div>

      {/* 기본 PostCard */}
      <section>
        <h2 className="text-2xl font-bold mb-6">1. 기본 PostCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* 태그 표시 PostCard */}
      <section>
        <h2 className="text-2xl font-bold mb-6">2. 태그 표시 PostCard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              showTags={true}
              maxTags={4}
            />
          ))}
        </div>
      </section>

      {/* Featured PostCard */}
      <section>
        <h2 className="text-2xl font-bold mb-6">3. Featured PostCard (큰 크기)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.slice(0, 2).map((post) => (
            <FeaturedPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Compact PostCard */}
      <section>
        <h2 className="text-2xl font-bold mb-6">4. Compact PostCard (작은 크기)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {posts.map((post) => (
            <CompactPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* Related PostCard */}
      <section>
        <h2 className="text-2xl font-bold mb-6">5. Related PostCard (관련 글용)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {posts.slice(0, 3).map((post) => (
            <RelatedPostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* 옵션별 테스트 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">6. 옵션별 테스트</h2>
        
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">좋아요 기능 테스트</h3>
            <p className="text-sm text-muted-foreground mb-4">
              각 카드의 좋아요 버튼을 클릭해보세요. 상태가 로컬 스토리지에 저장되어 페이지를 새로고침해도 유지됩니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostCard post={samplePost} />
              <PostCard post={samplePost} showLikeButton={true} showStats={true} />
              <PostCard post={samplePost} showLikeButton={false} showStats={true} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              마지막 카드는 좋아요 버튼이 비활성화되어 있습니다 (showLikeButton=false)
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">카테고리 숨김</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostCard post={samplePost} showCategory={false} />
              <PostCard post={samplePost} showCategory={false} showTags={true} />
              <PostCard post={samplePost} showCategory={false} showTags={true} maxTags={2} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">작성자 정보 숨김</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostCard post={samplePost} showAuthor={false} />
              <PostCard post={samplePost} showAuthor={false} showTags={true} />
              <PostCard post={samplePost} showAuthor={false} showStats={false} />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">통계 정보 숨김</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <PostCard post={samplePost} showStats={false} />
              <PostCard post={samplePost} showStats={false} showTags={true} />
              <PostCard post={samplePost} showStats={false} showAuthor={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 추가 정보 */}
      <section className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">사용법</h2>
        <div className="space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">기본 사용법:</h3>
            <code className="bg-muted p-2 rounded block">
              {`<PostCard post={post} />`}
            </code>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">옵션 포함:</h3>
            <code className="bg-muted p-2 rounded block">
              {`<PostCard post={post} showTags={true} maxTags={3} showLikeButton={true} />`}
            </code>
          </div>

          <div>
            <h3 className="font-semibold mb-2">변형 컴포넌트:</h3>
            <div className="space-y-1">
              <code className="bg-muted p-2 rounded block">{`<FeaturedPostCard post={post} />`}</code>
              <code className="bg-muted p-2 rounded block">{`<CompactPostCard post={post} />`}</code>
              <code className="bg-muted p-2 rounded block">{`<RelatedPostCard post={post} />`}</code>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">좋아요 기능:</h3>
            <div className="space-y-2">
              <p>• <code>showLikeButton={true}</code>: 좋아요 버튼 표시 (기본값: true)</p>
              <p>• 로컬 스토리지를 이용한 사용자별 좋아요 상태 관리</p>
              <p>• 카드 클릭과 좋아요 버튼 클릭의 이벤트 분리</p>
              <p>• RelatedPostCard에서는 좋아요 버튼이 기본적으로 비활성화됨</p>
              <p>• <strong>상세 페이지에서도 동일한 좋아요 상태가 동기화됩니다</strong></p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">상세 페이지 테스트:</h3>
            <div className="space-y-2">
              <p>포스트 카드를 클릭하면 상세 페이지로 이동하며, 상세 페이지에서도 좋아요 기능을 사용할 수 있습니다.</p>
              <div className="mt-3">
                <Link
                  href="/posts/react-18-concurrent-features-guide"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  📖 상세 페이지 예시 보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 