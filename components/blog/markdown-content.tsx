/**
 * 마크다운 콘텐츠 렌더링 컴포넌트
 * GitHub Flavored Markdown과 코드 하이라이팅을 지원하는 렌더러
 */

"use client";

import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import type { Components } from "react-markdown";

// 코드 하이라이팅 CSS 스타일 임포트
import "highlight.js/styles/github-dark.css";

// 상수
const OPTIMIZE_IMAGES = true;

// 커스텀 링크 컴포넌트
const CustomLink = ({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
}) => {
  if (!href) return <>{children}</>;

  // 외부 링크인 경우
  if (href.startsWith("http")) {
    return (
      <a
        {...props}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        {children}
      </a>
    );
  }

  // 내부 링크
  return (
    <Link href={href} className="text-primary hover:underline">
      {children}
    </Link>
  );
};

// 컴포넌트 정의
interface MarkdownContentProps {
  content: string;
}

export const MarkdownContent = memo(({ content }: MarkdownContentProps) => {
  // 마크다운 컴포넌트 설정
  const components: Components = {
    // 헤딩
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-8 mb-4 text-foreground">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-6 mb-3 text-foreground">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-5 mb-2 text-foreground">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-semibold mt-4 mb-2 text-foreground">
        {children}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-semibold mt-4 mb-2 text-muted-foreground">
        {children}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-sm font-semibold mt-4 mb-2 text-muted-foreground">
        {children}
      </h6>
    ),

    // 단락 및 텍스트
    p: ({ children }) => (
      <p className="mb-4 leading-relaxed text-foreground">{children}</p>
    ),

    // 링크
    a: ({ children, ...linkProps }) => <CustomLink {...linkProps}>{children}</CustomLink>,

    // 이미지
    img: (imageProps: React.ImgHTMLAttributes<HTMLImageElement>) => {
      if (!imageProps.src) return null;
      return OPTIMIZE_IMAGES ? (
        <Image
          src={imageProps.src.toString()}
          width={800}
          height={400}
          className="rounded-lg shadow-md max-w-full h-auto"
          alt={imageProps.alt || ""}
        />
      ) : (
        <div className="relative w-full h-[400px]">
          <Image
            src={imageProps.src.toString()}
            fill
            className="rounded-lg shadow-md object-cover"
            alt={imageProps.alt || ""}
          />
        </div>
      );
    },

    // 목록
    ul: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    ol: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
    li: ({ children }) => <li className="text-foreground">{children}</li>,

    // 코드 블록
    code: ({ inline, className, children, ...props }: React.HTMLAttributes<HTMLElement> & { inline?: boolean }) => {
      const match = /language-(\w+)/.exec(className || "");
      const language = match ? match[1] : "";

      return !inline && match ? (
        <div className="relative group">
          <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  String(children).replace(/\n$/, "")
                );
              }}
              className="text-xs bg-primary/10 hover:bg-primary/20 text-primary px-2 py-1 rounded"
            >
              복사
            </button>
          </div>
          <pre className="mb-4 rounded-lg bg-[#0d1117] p-4 overflow-x-auto">
            <code className={`language-${language}`} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code
          className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground text-sm"
          {...props}
        >
          {children}
        </code>
      );
    },

    // 인용구
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary pl-4 italic my-4">
        {children}
      </blockquote>
    ),

    // 구분선
    hr: () => <hr className="my-8 border-border" />, // eslint-disable-line react/jsx-key

    // 표
    table: ({ children }) => (
      <div className="overflow-x-auto mb-4">
        <table className="w-full border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-muted text-muted-foreground">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-border hover:bg-muted/50">{children}</tr>
    ),
    td: ({ children }) => (
      <td className="px-4 py-2 text-foreground">{children}</td>
    ),
    th: ({ children }) => (
      <th className="px-4 py-2 text-left font-semibold">{children}</th>
    ),
  };

  const remarkPlugins = [remarkGfm, remarkBreaks];
  const rehypePlugins = [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
        properties: {
          className: ["anchor"],
        },
      },
    ],
    [rehypeHighlight, { ignoreMissing: true }],
  ];

  return (
    <article className="prose prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown
        components={components}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
});

MarkdownContent.displayName = "MarkdownContent";

export default MarkdownContent;
