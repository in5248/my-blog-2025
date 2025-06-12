/**
 * MarkdownContent 컴포넌트 데모 페이지
 * 다양한 마크다운 요소들을 테스트하기 위한 페이지
 */

import MarkdownContent from "@/components/blog/markdown-content";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Content Demo | My Blog",
  description:
    "MarkdownContent 컴포넌트의 다양한 기능을 테스트하는 데모 페이지입니다.",
};

// 테스트용 마크다운 콘텐츠
const demoMarkdown = `# MarkdownContent 컴포넌트 데모

이 페이지는 **MarkdownContent** 컴포넌트의 다양한 기능을 테스트하기 위한 데모 페이지입니다.

## 📝 텍스트 스타일링

### 기본 텍스트 포맷팅

일반 텍스트, **굵은 글씨**, *기울임*, ~~취소선~~, \`인라인 코드\` 등을 지원합니다.

### 인용문

> 이것은 인용문입니다. 
> 여러 줄에 걸쳐 작성할 수 있습니다.
> 
> — 마크다운 문법

## 📋 목록

### 순서 없는 목록

- 첫 번째 항목
- 두 번째 항목
  - 중첩된 항목 1
  - 중첩된 항목 2
- 세 번째 항목

### 순서 있는 목록

1. 첫 번째 단계
2. 두 번째 단계
   1. 세부 단계 A
   2. 세부 단계 B
3. 세 번째 단계

### 체크박스 목록

- [x] 완료된 작업
- [ ] 진행 중인 작업
- [ ] 미완료 작업

## 🔗 링크

### 내부 링크
[홈페이지로 이동](/)
[포스트 목록 보기](/posts)

### 외부 링크
[Next.js 공식 사이트](https://nextjs.org)
[React 공식 문서](https://react.dev)

## 💻 코드 블록

### JavaScript 코드

\`\`\`javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
\`\`\`

### TypeScript 코드

\`\`\`typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const users: User[] = [
  { id: 1, name: 'John', email: 'john@example.com' },
  { id: 2, name: 'Jane', email: 'jane@example.com' },
];
\`\`\`

### CSS 코드

\`\`\`css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}
\`\`\`

### JSON 데이터

\`\`\`json
{
  "name": "my-blog",
  "version": "1.0.0",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0"
  }
}
\`\`\`

## 📊 테이블

| 기능 | 지원 여부 | 설명 |
|------|-----------|------|
| 텍스트 포맷팅 | ✅ | 굵은 글씨, 기울임 등 |
| 코드 하이라이팅 | ✅ | Syntax highlighting |
| 이미지 최적화 | ✅ | Next.js Image 컴포넌트 |
| 링크 처리 | ✅ | 내부/외부 링크 구분 |
| 테이블 | ✅ | 반응형 테이블 |

## 🖼️ 이미지

### 마크다운 이미지 문법
![Next.js Logo](https://nextjs.org/static/favicon/favicon-32x32.png "Next.js")

## ✂️ 구분선

---

## 🔤 제목 레벨들

# H1 제목
## H2 제목  
### H3 제목
#### H4 제목
##### H5 제목
###### H6 제목

---

## 📝 마크다운 문법 정리

이 컴포넌트는 다음과 같은 기능들을 제공합니다:

1. **GitHub Flavored Markdown** 완전 지원
2. **코드 구문 강조** (highlight.js)
3. **이미지 최적화** (Next.js Image)
4. **링크 보안 처리** (외부 링크 rel 속성)
5. **반응형 테이블**
6. **다크 모드 지원**
7. **목차 생성** (옵션)

### 사용법

\`\`\`tsx
import MarkdownContent from '@/components/blog/markdown-content';

<MarkdownContent
  content={markdownString}
  size="lg"
  enableTableOfContents={true}
  optimizeImages={true}
/>
\`\`\`
`;

export default function MarkdownDemoPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto">
        {/* 페이지 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">MarkdownContent 데모</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            MarkdownContent 컴포넌트의 다양한 기능을 확인할 수 있는 데모
            페이지입니다. 마크다운 문법, 코드 하이라이팅, 테이블 등 모든 기능을
            테스트해보세요.
          </p>
        </header>

        {/* 컴포넌트 옵션 테스트 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">컴포넌트 크기 변형</h2>

          <div className="grid gap-8">
            {/* 기본 크기 */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">기본 크기 (base)</h3>
              <MarkdownContent
                content="**굵은 글씨**, *기울임*, `인라인 코드` 테스트"
                size="base"
              />
            </div>

            {/* 큰 크기 */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">큰 크기 (lg)</h3>
              <MarkdownContent
                content="**굵은 글씨**, *기울임*, `인라인 코드` 테스트"
                size="lg"
              />
            </div>
          </div>
        </section>

        {/* 메인 데모 콘텐츠 */}
        <main>
          <MarkdownContent
            content={demoMarkdown}
            size="lg"
            enableTableOfContents={true}
            className="border rounded-lg p-8 bg-card"
          />
        </main>

        {/* 네비게이션 */}
        <footer className="mt-16 pt-8 border-t text-center">
          <div className="flex justify-center gap-4">
            <Link
              href="/posts"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              📚 포스트 목록 보기
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              🏠 홈으로 돌아가기
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}
