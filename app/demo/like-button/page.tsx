import { LikeButton } from '@/components/blog';
import Link from 'next/link';

export default function LikeButtonDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">좋아요 버튼 데모</h1>
        <p className="text-gray-600 leading-relaxed">
          블로그 포스트의 좋아요 기능을 테스트해볼 수 있는 데모 페이지입니다. 
          다양한 크기와 설정으로 좋아요 버튼을 확인해보세요.
        </p>
      </div>

      {/* 기본 사용법 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">기본 사용법</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-4">
            <LikeButton postId="demo-post-1" initialLikes={42} />
            <span className="text-gray-600">기본 크기의 좋아요 버튼</span>
          </div>
          <p className="text-sm text-gray-500">
            클릭하면 좋아요 상태가 토글되고, 페이지를 새로고침해도 상태가 유지됩니다.
          </p>
        </div>
      </section>

      {/* 크기별 변형 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">크기별 변형</h2>
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-3">Small</h3>
              <LikeButton postId="demo-post-small" size="sm" initialLikes={15} />
              <p className="text-xs text-gray-500 mt-2">작은 크기 (size=&quot;sm&quot;)</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-3">Medium (기본)</h3>
              <LikeButton postId="demo-post-medium" size="md" initialLikes={25} />
              <p className="text-xs text-gray-500 mt-2">중간 크기 (size=&quot;md&quot;)</p>
            </div>
            <div className="text-center">
              <h3 className="text-lg font-medium mb-3">Large</h3>
              <LikeButton postId="demo-post-large" size="lg" initialLikes={35} />
              <p className="text-xs text-gray-500 mt-2">큰 크기 (size=&quot;lg&quot;)</p>
            </div>
          </div>
        </div>
      </section>

      {/* 옵션별 테스트 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">옵션별 테스트</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">카운트 숨김</h3>
            <LikeButton 
              postId="demo-post-no-count" 
              showCount={false} 
              initialLikes={10}
            />
            <p className="text-sm text-gray-500 mt-2">
              showCount=&#123;false&#125;로 설정하면 좋아요 수가 표시되지 않습니다.
            </p>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-medium mb-4">커스텀 스타일</h3>
            <LikeButton 
              postId="demo-post-custom" 
              initialLikes={7}
              className="rounded-full shadow-lg"
            />
            <p className="text-sm text-gray-500 mt-2">
              className prop으로 커스텀 스타일을 적용할 수 있습니다.
            </p>
          </div>
        </div>
      </section>

      {/* 실제 사용 시나리오 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">실제 사용 시나리오</h2>
        <div className="space-y-6">
          {/* 가상의 블로그 포스트들 */}
          {[
            {
              id: 'scenario-post-1',
              title: 'React 18의 새로운 기능들',
              excerpt: 'React 18에서 새롭게 추가된 기능들과 성능 개선사항을 살펴봅니다.',
              likes: 128
            },
            {
              id: 'scenario-post-2', 
              title: 'TypeScript 완벽 가이드',
              excerpt: 'TypeScript의 고급 기능들과 실무에서 활용하는 팁들을 정리했습니다.',
              likes: 87
            },
            {
              id: 'scenario-post-3',
              title: 'Next.js 15 마이그레이션 후기',
              excerpt: 'Next.js 14에서 15로 마이그레이션하면서 겪은 경험을 공유합니다.',
              likes: 65
            }
          ].map((post) => (
            <article key={post.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
                </div>
                <div className="ml-4 shrink-0">
                  <LikeButton postId={post.id} initialLikes={post.likes} />
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <span>2024년 1월 15일</span>
                <span className="mx-2">•</span>
                <span>5분 읽기</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 테스트 가이드 */}
      <section className="mb-12">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">테스트 가이드</h3>
          <div className="space-y-2 text-blue-800">
            <p>• <strong>좋아요 토글:</strong> 버튼을 클릭해서 좋아요 상태를 변경해보세요.</p>
            <p>• <strong>애니메이션:</strong> 클릭 시 하트 아이콘의 크기가 커지는 애니메이션을 확인하세요.</p>
            <p>• <strong>데이터 지속성:</strong> 좋아요를 누른 후 페이지를 새로고침해보세요.</p>
            <p>• <strong>독립성:</strong> 각 포스트의 좋아요는 서로 독립적으로 관리됩니다.</p>
            <p>• <strong>키보드 접근성:</strong> Tab 키로 버튼에 포커스한 후 Enter나 스페이스바로 클릭해보세요.</p>
          </div>
        </div>
      </section>

      {/* 기술적 세부사항 */}
      <section className="mb-12">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">기술적 특징</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <h4 className="font-medium mb-2">데이터 관리</h4>
              <ul className="space-y-1">
                <li>• 로컬 스토리지 기반 데이터 영속성</li>
                <li>• 브라우저별 고유 사용자 ID 생성</li>
                <li>• 포스트별 독립적인 좋아요 상태 관리</li>
                <li>• 낙관적 업데이트로 빠른 응답성</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">사용자 경험</h4>
              <ul className="space-y-1">
                <li>• 클릭 시 즉시 UI 변경 (낙관적 업데이트)</li>
                <li>• 부드러운 애니메이션 효과</li>
                <li>• 중복 클릭 방지</li>
                <li>• 키보드 네비게이션 지원</li>
                <li>• 스크린 리더 접근성 고려</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 개발자용 정보 */}
      <section>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-yellow-900">개발자 정보</h3>
          <div className="text-yellow-800 space-y-2">
            <p><strong>Props:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1 text-sm">
              <li><code>postId</code>: 포스트 고유 ID (필수)</li>
              <li><code>initialLikes</code>: 초기 좋아요 수 (선택, 기본값: 0)</li>
              <li><code>size</code>: 버튼 크기 (&apos;sm&apos; | &apos;md&apos; | &apos;lg&apos;, 기본값: &apos;md&apos;)</li>
              <li><code>showCount</code>: 좋아요 수 표시 여부 (기본값: true)</li>
              <li><code>className</code>: 추가 CSS 클래스</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 실제 사용 예시 링크 */}
      <section>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3 text-blue-900">실제 사용 예시</h3>
          <div className="text-blue-800 space-y-3">
            <p>좋아요 기능이 실제로 적용된 페이지들을 확인해보세요:</p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                📄 포스트 목록 페이지
              </Link>
              <Link
                href="/posts/react-18-concurrent-features-guide"
                className="inline-flex items-center justify-center rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition-colors"
              >
                📖 포스트 상세 페이지
              </Link>
              <Link
                href="/demo/post-cards"
                className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                🎨 포스트 카드 데모
              </Link>
            </div>
            <p className="text-sm">
              <strong>💡 팁:</strong> 각 페이지에서 좋아요를 누르고 다른 페이지로 이동해보세요. 
              같은 포스트의 좋아요 상태가 모든 페이지에서 동기화되는 것을 확인할 수 있습니다!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 