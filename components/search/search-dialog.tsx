/**
 * 블로그 검색 다이얼로그 컴포넌트
 * 실시간 검색, 키보드 단축키, 검색어 하이라이팅 기능 제공
 */

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Clock, FileText, Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { searchPosts, getRelativeTime, type BlogPost } from '@/data/mockData';

/**
 * SearchDialog 컴포넌트의 Props 인터페이스
 */
interface SearchDialogProps {
  /** 다이얼로그 열림/닫힘 상태 */
  open: boolean;
  /** 다이얼로그 상태 변경 함수 */
  onOpenChange: (open: boolean) => void;
}

/**
 * 검색 결과 아이템 Props 인터페이스
 */
interface SearchResultItemProps {
  post: BlogPost;
  searchQuery: string;
  onSelect: () => void;
}

/**
 * 최근 검색어 관리를 위한 로컬 스토리지 키
 */
const RECENT_SEARCHES_KEY = 'blog-recent-searches';
const MAX_RECENT_SEARCHES = 5;
const DEBOUNCE_DELAY = 300; // 디바운싱 지연 시간 (ms)

/**
 * 검색어 하이라이팅 함수
 */
function highlightSearchTerm(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => 
    regex.test(part) ? (
      <mark key={index} className="bg-primary/20 text-primary font-medium rounded px-1">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

/**
 * 검색 결과 아이템 컴포넌트
 */
function SearchResultItem({ post, searchQuery, onSelect }: SearchResultItemProps) {
  return (
    <CommandItem
      value={`${post.title} ${post.excerpt} ${post.tags.join(' ')}`}
      onSelect={onSelect}
      className="flex items-start gap-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors"
    >
      {/* 포스트 아이콘 */}
      <div className="flex-shrink-0 mt-1">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary" />
        </div>
      </div>
      
      {/* 포스트 정보 */}
      <div className="flex-grow min-w-0">
        {/* 제목 */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">
          {highlightSearchTerm(post.title, searchQuery)}
        </h3>
        
        {/* 요약 */}
        <p className="text-muted-foreground text-xs mb-2 line-clamp-2 leading-relaxed">
          {highlightSearchTerm(post.excerpt, searchQuery)}
        </p>
        
        {/* 메타 정보 */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {/* 카테고리 */}
          <Badge 
            variant="secondary" 
            className="text-xs px-2 py-0.5"
            style={{ 
              backgroundColor: post.category.color + '15',
              color: post.category.color,
              border: 'none'
            }}
          >
            {post.category.name}
          </Badge>
          
          {/* 날짜 */}
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {getRelativeTime(post.publishedAt)}
          </span>
          
          {/* 읽기 시간 */}
          <span>{post.readingTime}분 읽기</span>
        </div>
      </div>
    </CommandItem>
  );
}

/**
 * 최근 검색어 아이템 컴포넌트
 */
function RecentSearchItem({ 
  searchTerm, 
  onSelect, 
  onRemove 
}: { 
  searchTerm: string; 
  onSelect: () => void;
  onRemove: () => void;
}) {
  return (
    <CommandItem
      value={searchTerm}
      onSelect={onSelect}
      className="flex items-center justify-between group cursor-pointer hover:bg-accent/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{searchTerm}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 rounded transition-all"
        aria-label="검색어 삭제"
      >
        <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
      </button>
    </CommandItem>
  );
}

/**
 * 메인 검색 다이얼로그 컴포넌트
 */
export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 디바운싱을 통한 검색어 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, DEBOUNCE_DELAY);

    // 검색어가 있으면 로딩 상태 시작
    if (searchQuery.trim()) {
      setIsLoading(true);
    }

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 검색 결과 계산 (디바운싱된 쿼리 기반)
  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) {
      setIsLoading(false);
      return [];
    }
    
    try {
      const results = searchPosts(debouncedQuery).slice(0, 5); // 최대 5개 결과
      setIsLoading(false);
      return results;
    } catch (error) {
      console.error('Search error:', error);
      setIsLoading(false);
      return [];
    }
  }, [debouncedQuery]);

  // 최근 검색어 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse recent searches:', e);
        }
      }
    }
  }, []);

  // 최근 검색어 저장
  const saveRecentSearch = useCallback((query: string) => {
    if (!query.trim() || typeof window === 'undefined') return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item !== query);
      const updated = [query, ...filtered].slice(0, MAX_RECENT_SEARCHES);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 최근 검색어 제거
  const removeRecentSearch = useCallback((query: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(item => item !== query);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 포스트 선택 처리
  const handlePostSelect = useCallback((post: BlogPost) => {
    if (debouncedQuery.trim()) {
      saveRecentSearch(debouncedQuery);
    }
    onOpenChange(false);
    setSearchQuery('');
    setDebouncedQuery('');
    router.push(`/posts/${post.slug}`);
  }, [debouncedQuery, onOpenChange, router, saveRecentSearch]);

  // 최근 검색어 선택 처리
  const handleRecentSearchSelect = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 다이얼로그 닫기 처리
  const handleClose = useCallback(() => {
    onOpenChange(false);
    setSearchQuery('');
    setDebouncedQuery('');
    setIsLoading(false);
  }, [onOpenChange]);

  // 엔터 키 처리
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchResults.length > 0) {
      handlePostSelect(searchResults[0]);
    }
  }, [searchResults, handlePostSelect]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader className="sr-only">
        <DialogTitle>포스트 검색</DialogTitle>
      </DialogHeader>
      
      <Command className="rounded-lg border shadow-md">
        {/* 검색 입력 */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <CommandInput
            placeholder="포스트 검색... (Ctrl+K)"
            value={searchQuery}
            onValueChange={setSearchQuery}
            onKeyDown={handleKeyDown}
            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 border-0"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setDebouncedQuery('');
                setIsLoading(false);
              }}
              className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100 transition-opacity"
              aria-label="검색어 지우기"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <CommandList className="max-h-[400px] overflow-y-auto">
          {/* 로딩 상태 */}
          {isLoading && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                검색 중...
              </div>
            </div>
          )}

          {/* 검색 결과가 있는 경우 */}
          {!isLoading && debouncedQuery && searchResults.length > 0 && (
            <CommandGroup heading={`검색 결과 (${searchResults.length}개)`}>
              {searchResults.map((post) => (
                <SearchResultItem
                  key={post.id}
                  post={post}
                  searchQuery={debouncedQuery}
                  onSelect={() => handlePostSelect(post)}
                />
              ))}
              
              {/* 더 많은 결과 보기 */}
              <CommandItem
                onSelect={() => {
                  onOpenChange(false);
                  setSearchQuery('');
                  setDebouncedQuery('');
                  router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
                }}
                className="border-t mt-2 pt-2 justify-center text-primary hover:bg-primary/5"
              >
                <Search className="w-4 h-4 mr-2" />
                "{debouncedQuery}" 전체 검색 결과 보기
              </CommandItem>
            </CommandGroup>
          )}

          {/* 검색 결과가 없는 경우 */}
          {!isLoading && debouncedQuery && searchResults.length === 0 && (
            <CommandEmpty>
              <div className="py-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-sm mb-2">검색 결과가 없습니다</h3>
                <p className="text-muted-foreground text-xs max-w-sm mx-auto">
                  "<mark className="bg-primary/20 text-primary px-1 rounded">{debouncedQuery}</mark>"에 대한 검색 결과가 없습니다.<br />
                  다른 키워드로 검색해보시거나 전체 포스트 목록을 확인해보세요.
                </p>
                <button
                  onClick={() => {
                    onOpenChange(false);
                    router.push('/posts');
                  }}
                  className="mt-4 text-primary text-xs hover:underline"
                >
                  전체 포스트 보기 →
                </button>
              </div>
            </CommandEmpty>
          )}

          {/* 최근 검색어 (검색어가 없을 때만 표시) */}
          {!searchQuery && recentSearches.length > 0 && (
            <>
              <CommandGroup heading="최근 검색어">
                {recentSearches.map((term) => (
                  <RecentSearchItem
                    key={term}
                    searchTerm={term}
                    onSelect={() => handleRecentSearchSelect(term)}
                    onRemove={() => removeRecentSearch(term)}
                  />
                ))}
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          {/* 검색어가 없을 때 안내 메시지 */}
          {!searchQuery && recentSearches.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              <div className="w-12 h-12 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-2">포스트 검색</h3>
              <p className="text-xs max-w-sm mx-auto mb-4">
                제목, 내용, 태그에서 키워드를 검색할 수 있습니다.<br />
                <span className="text-primary">실시간 검색</span>으로 입력하는 즉시 결과를 확인하세요.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs">
                <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground font-mono">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-muted rounded text-muted-foreground font-mono">
                  K
                </kbd>
                <span className="text-muted-foreground">로 언제든 검색</span>
              </div>
            </div>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  );
}

/**
 * 검색 다이얼로그를 제어하는 커스텀 훅
 */
export function useSearchDialog() {
  const [open, setOpen] = useState(false);

  // 키보드 단축키 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return {
    open,
    onOpenChange: setOpen,
    openSearch: () => setOpen(true),
    closeSearch: () => setOpen(false),
  };
} 