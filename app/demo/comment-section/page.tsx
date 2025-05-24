import { CommentSection } from '@/components/blog';

export default function CommentSectionDemo() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">댓글 섹션 데모</h1>
        <p className="text-gray-600 leading-relaxed">
          블로그 포스트의 댓글 시스템을 테스트해볼 수 있는 데모 페이지입니다. 
          댓글 작성, 로컬 스토리지 저장, 실시간 업데이트 기능을 확인해보세요.
        </p>
      </div>

      {/* 가상의 블로그 포스트 내용 */}
      <article className="mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">샘플 블로그 포스트</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              이것은 댓글 시스템을 테스트하기 위한 샘플 블로그 포스트입니다. 
              아래 댓글 섹션에서 다음 기능들을 테스트해보실 수 있습니다:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
              <li>새 댓글 작성하기</li>
              <li>작성자 이름과 이메일 입력</li>
              <li>댓글 내용 입력 (최소 5글자, 최대 1000글자)</li>
              <li>폼 유효성 검사</li>
              <li>로컬 스토리지에 댓글 저장</li>
              <li>페이지 새로고침 후에도 댓글 유지</li>
              <li>댓글 개수 실시간 업데이트</li>
              <li>상대적 시간 표시 (방금 전, 1분 전 등)</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              댓글은 브라우저의 로컬 스토리지에 저장되므로, 같은 브라우저에서는 
              페이지를 새로고침하거나 다시 방문해도 작성한 댓글을 볼 수 있습니다.
            </p>
          </div>
        </div>
      </article>

      {/* 댓글 섹션 */}
      <CommentSection postId="demo-post-1" postTitle="샘플 블로그 포스트" />

      {/* 추가 테스트 안내 */}
      <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-900">테스트 가이드</h3>
        <div className="space-y-2 text-blue-800">
          <p>• <strong>댓글 작성:</strong> 이름과 댓글 내용을 입력하고 "댓글 작성" 버튼을 클릭해보세요.</p>
          <p>• <strong>유효성 검사:</strong> 빈 값이나 너무 짧은 내용을 입력해보세요.</p>
          <p>• <strong>데이터 지속성:</strong> 댓글을 작성한 후 페이지를 새로고침해보세요.</p>
          <p>• <strong>다중 댓글:</strong> 여러 개의 댓글을 작성해서 목록이 어떻게 표시되는지 확인해보세요.</p>
          <p>• <strong>아바타:</strong> 한글 이름과 영문 이름으로 댓글을 작성해서 아바타가 어떻게 생성되는지 확인해보세요.</p>
        </div>
      </div>

      {/* 기술적 세부사항 */}
      <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">기술적 특징</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">프론트엔드</h4>
            <ul className="space-y-1">
              <li>• React 18 + TypeScript</li>
              <li>• ShadCN UI 컴포넌트</li>
              <li>• Tailwind CSS 스타일링</li>
              <li>• Lucide React 아이콘</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">기능</h4>
            <ul className="space-y-1">
              <li>• 로컬 스토리지 데이터 지속성</li>
              <li>• 실시간 폼 유효성 검사</li>
              <li>• 반응형 디자인</li>
              <li>• 접근성 지원</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 