/**
 * 블로그 데모 허브 페이지
 * 모든 데모 페이지들을 한 곳에서 확인할 수 있는 중앙 허브
 */

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  FileText, 
  Bookmark, 
  ArrowLeft, 
  ExternalLink,
  Sparkles,
  Zap,
  Target,
  Grid3x3,
  MessageCircle,
  Heart
} from 'lucide-react';

export default function DemoHub() {
  const demos = [
    {
      id: 'search-dialog',
      title: '🔍 검색 다이얼로그',
      description: '실시간 검색, 키보드 단축키, 하이라이팅 기능을 갖춘 검색 모달',
      href: '/demo/search',
      icon: Search,
      status: 'ready',
      features: ['실시간 검색', '키보드 단축키', '검색어 하이라이팅', '최근 검색 기록']
    },
    {
      id: 'search-page',
      title: '📄 검색 결과 페이지',
      description: 'URL 기반 검색과 고급 필터링 기능을 제공하는 전용 검색 페이지',
      href: '/demo/search-page',
      icon: Grid3x3,
      status: 'new',
      features: ['URL 기반 검색', '고급 필터링', '정렬 옵션', '검색어 제안']
    },
    {
      id: 'post-cards',
      title: '📰 포스트 카드',
      description: '다양한 변형과 스타일을 가진 블로그 포스트 카드 컴포넌트 (좋아요 기능 포함)',
      href: '/demo/post-cards',
      icon: FileText,
      status: 'ready',
      features: ['다양한 변형', '반응형 디자인', '호버 효과', '좋아요 기능 통합']
    },
    {
      id: 'related-posts',
      title: '🔗 관련 포스트',
      description: '현재 포스트와 관련된 추천 포스트들을 보여주는 컴포넌트',
      href: '/demo/related-posts',
      icon: Bookmark,
      status: 'ready',
      features: ['스마트 추천', '카테고리 기반', '태그 유사도', '조회수 고려']
    },
    {
      id: 'markdown',
      title: '📝 마크다운 렌더링',
      description: '코드 하이라이팅과 커스텀 스타일링이 적용된 마크다운 렌더러',
      href: '/demo/markdown',
      icon: FileText,
      status: 'ready',
      features: ['코드 하이라이팅', 'TOC 자동 생성', '커스텀 컴포넌트', 'mermaid 다이어그램']
    },
    {
      id: 'comment-section',
      title: '💬 댓글 섹션',
      description: '댓글 작성, 목록 표시, 로컬 스토리지 저장 기능을 갖춘 댓글 시스템',
      href: '/demo/comment-section',
      icon: MessageCircle,
      status: 'new',
      features: ['댓글 작성', '폼 유효성 검사', '로컬 스토리지', '실시간 업데이트']
    },
    {
      id: 'like-button',
      title: '❤️ 좋아요 버튼',
      description: '포스트별 좋아요 기능과 로컬 스토리지 기반 사용자 상태 관리',
      href: '/demo/like-button',
      icon: Heart,
      status: 'new',
      features: ['상태 관리', '애니메이션 효과', '데이터 영속성', '접근성 지원']
    },
    {
      id: 'post-detail',
      title: '📖 포스트 상세 페이지',
      description: '좋아요 기능이 통합된 포스트 상세 페이지 (실제 포스트 예시)',
      href: '/posts/react-18-concurrent-features-guide',
      icon: FileText,
      status: 'new',
      features: ['좋아요 통합', '소셜 공유', '메타 정보', '관련 포스트']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">🆕 NEW</Badge>;
      case 'ready':
        return <Badge variant="secondary">✅ Ready</Badge>;
      case 'beta':
        return <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">🚧 Beta</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🚀 블로그 데모 허브
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            블로그의 다양한 컴포넌트와 기능들을 미리 체험해보세요
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                메인 페이지로
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/posts">
                <FileText className="w-4 h-4 mr-2" />
                블로그 보기
              </Link>
            </Button>
          </div>
        </header>

        {/* 최신 데모 하이라이트 */}
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">최신 데모</h2>
            <Badge className="bg-green-500/10 text-green-600">New</Badge>
          </div>
          
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">좋아요 버튼</CardTitle>
                    <CardDescription>포스트별 좋아요 기능과 상태 관리</CardDescription>
                  </div>
                </div>
                <Badge className="bg-green-500/10 text-green-600">🆕 NEW</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                블로그 포스트에 좋아요 기능을 추가하세요. 로컬 스토리지 기반 사용자별 상태 관리, 
                부드러운 애니메이션 효과, 접근성 지원까지 모든 기능이 포함되어 있습니다.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {['상태 관리', '애니메이션 효과', '데이터 영속성', '접근성 지원'].map((feature) => (
                  <Badge key={feature} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-3">
                <Button asChild>
                  <Link href="/demo/like-button">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    데모 보기
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/posts">
                    <Heart className="w-4 h-4 mr-2" />
                    실제 사용하기
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 모든 데모 목록 */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-2xl font-bold">모든 데모</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demos.map((demo) => (
              <Card key={demo.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <demo.icon className="w-4 h-4 text-primary" />
                    </div>
                    {getStatusBadge(demo.status)}
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {demo.title}
                  </CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {/* 주요 기능 */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">주요 기능</h4>
                      <div className="flex flex-wrap gap-1">
                        {demo.features.map((feature) => (
                          <Badge key={feature} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* 액션 버튼 */}
                    <Button asChild className="w-full">
                      <Link href={demo.href}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        데모 보기
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 사용 가이드 */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              사용 가이드
            </CardTitle>
            <CardDescription>
              데모를 효과적으로 활용하는 방법을 알아보세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">💡 데모 활용법</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 각 데모 페이지에서 다양한 옵션들을 테스트해보세요</li>
                  <li>• 반응형 디자인을 확인하기 위해 화면 크기를 조정해보세요</li>
                  <li>• 키보드 단축키와 접근성 기능들을 체험해보세요</li>
                  <li>• 실제 사용 시나리오를 상상하며 테스트해보세요</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">🔧 기술적 특징</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Next.js 15와 React 18 기반</li>
                  <li>• ShadCN UI 컴포넌트 활용</li>
                  <li>• TypeScript로 타입 안정성 확보</li>
                  <li>• Tailwind CSS로 스타일링</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 액션 */}
        <div className="mt-12 pt-8 border-t text-center">
          <h3 className="text-lg font-semibold mb-4">더 많은 기능을 확인하고 싶다면?</h3>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/posts">
                <FileText className="w-4 h-4 mr-2" />
                블로그 둘러보기
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">
                <Search className="w-4 h-4 mr-2" />
                검색해보기
              </Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            이 블로그는 지속적으로 개발되고 있습니다. 새로운 기능들을 기대해주세요! 🚀
          </p>
        </div>
      </div>
    </div>
  );
} 