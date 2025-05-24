# My Blog 🚀

Next.js 15와 TypeScript로 구축된 모던 기술 블로그

## 📖 프로젝트 소개

웹 개발, JavaScript, React, Next.js에 관한 기술 블로그입니다. 최신 개발 트렌드와 실무 경험을 공유합니다.

## ✨ 주요 기능

### 📱 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 대응
- Tailwind CSS를 활용한 현대적 UI/UX

### 🔍 검색 기능
- 실시간 검색 다이얼로그 (`Ctrl+K`)
- 제목, 내용, 태그 전체 검색
- 검색어 하이라이팅
- 고급 필터링 및 정렬

### ❤️ 좋아요 시스템
- 포스트별 좋아요 기능
- 로컬 스토리지 기반 사용자 상태 관리
- 부드러운 애니메이션 효과
- 접근성 지원

### 💬 댓글 시스템
- 댓글 작성 및 답글 기능
- 실시간 업데이트
- 폼 유효성 검사

### 📝 포스트 관리
- 마크다운 기반 콘텐츠
- 코드 하이라이팅
- 카테고리 및 태그 분류
- 관련 포스트 추천

### 🎨 컴포넌트 시스템
- 재사용 가능한 PostCard 컴포넌트
- 다양한 변형 (Featured, Compact, Related)
- shadcn/ui 기반 디자인 시스템

## 🛠️ 기술 스택

### Frontend
- **Next.js 15** - App Router 사용
- **React 18** - Concurrent Features 활용
- **TypeScript** - 타입 안정성 확보
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **shadcn/ui** - 재사용 가능한 컴포넌트

### 개발 도구
- **ESLint** - 코드 품질 관리
- **Prettier** - 코드 포맷팅
- **Lucide React** - 아이콘 시스템

## 🚀 시작하기

### 요구사항
- Node.js 18.0.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 저장소 클론
git clone https://github.com/LeeSeogMin/my-blog.git
cd my-blog

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 모드 실행
npm start

# 타입 체크
npm run type-check

# 린트 체크
npm run lint
```

## 📁 프로젝트 구조

```
my-blog/
├── app/                    # Next.js App Router
│   ├── (routes)/          # 라우트 그룹
│   ├── demo/              # 데모 페이지들
│   ├── posts/             # 블로그 포스트
│   ├── search/            # 검색 페이지
│   └── layout.tsx         # 루트 레이아웃
├── components/            # 재사용 컴포넌트
│   ├── blog/             # 블로그 전용 컴포넌트
│   ├── common/           # 공통 컴포넌트
│   ├── search/           # 검색 관련 컴포넌트
│   └── ui/               # shadcn/ui 컴포넌트
├── data/                 # 목업 데이터
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── public/               # 정적 파일
```

## 🎯 주요 컴포넌트

### PostCard
포스트를 카드 형태로 표시하는 핵심 컴포넌트
- `PostCard` - 기본 포스트 카드
- `FeaturedPostCard` - 추천 포스트용 (큰 크기)
- `CompactPostCard` - 간소화된 포스트 카드
- `RelatedPostCard` - 관련 포스트용

### LikeButton
좋아요 기능을 제공하는 컴포넌트
- 로컬 스토리지 기반 상태 관리
- 세 가지 크기 (`sm`, `md`, `lg`)
- 애니메이션 효과 및 접근성 지원

### SearchDialog
키보드 단축키로 실행되는 검색 모달
- `Ctrl+K` 또는 `Cmd+K`로 실행
- 실시간 검색 결과 표시
- 최근 검색 기록 관리

## 🎨 데모 페이지

`/demo` 경로에서 다양한 컴포넌트들을 미리 체험할 수 있습니다:
- 포스트 카드 변형들
- 좋아요 버튼 옵션들
- 검색 기능 테스트
- 댓글 시스템 데모

## 🔧 커스터마이징

### 테마 색상 변경
`tailwind.config.ts`에서 색상 팔레트를 수정할 수 있습니다.

### 폰트 변경
`app/layout.tsx`에서 Google Fonts 설정을 수정할 수 있습니다.

### 컴포넌트 스타일링
shadcn/ui 컴포넌트는 `components/ui/` 폴더에서 커스터마이징 가능합니다.

## 📝 라이선스

MIT License

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

프로젝트 링크: [https://github.com/LeeSeogMin/my-blog](https://github.com/LeeSeogMin/my-blog)

---

⭐ 이 프로젝트가 도움이 되셨다면 스타를 눌러주세요!
