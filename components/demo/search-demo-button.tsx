"use client";

interface SearchDemoButtonProps {
  term: string;
}

export function SearchDemoButton({ term }: SearchDemoButtonProps) {
  return (
    <button
      className="text-primary hover:underline"
      onClick={() => {
        // 키보드 단축키 이벤트 트리거
        document.dispatchEvent(
          new KeyboardEvent("keydown", {
            key: "k",
            ctrlKey: true,
            bubbles: true,
          })
        );
      }}
    >
      "{term}" 검색
    </button>
  );
}
