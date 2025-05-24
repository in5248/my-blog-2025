'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs';
import type { Comment, CommentFormData } from '@/types/comment';
import CommentItem from './comment-item';

interface CommentSectionProps {
  postId: string;
  postTitle?: string;
}

interface CommentFormProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

interface CommentListProps {
  comments: Comment[];
}

/**
 * 댓글 작성 폼 컴포넌트
 */
function CommentForm({ postId, onCommentAdded }: CommentFormProps) {
  const { user } = useUser();
  const [formData, setFormData] = useState<CommentFormData>({
    content: '',
    agreeToTerms: true,
    authorName: user?.fullName || '',
    authorEmail: user?.primaryEmailAddress?.emailAddress || '',
    authorImageUrl: user?.imageUrl
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.content.trim()) {
      newErrors.content = '댓글 내용을 입력해주세요.';
    } else if (formData.content.trim().length < 5) {
      newErrors.content = '댓글은 5글자 이상 입력해주세요.';
    } else if (formData.content.trim().length > 1000) {
      newErrors.content = '댓글은 1000글자 이하로 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 새 댓글 생성
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        postId,
        authorName: user?.fullName || '익명',
        authorEmail: user?.primaryEmailAddress?.emailAddress || '',
        authorImageUrl: user?.imageUrl,
        content: formData.content.trim(),
        createdAt: new Date(),
        status: 'approved',
        likeCount: 0,
        dislikeCount: 0,
        reportCount: 0,
        isEdited: false,
        isPinned: false,
        isAuthor: false,
        userId: user?.id
      };

      // 부모 컴포넌트에 새 댓글 전달
      onCommentAdded(newComment);

      // 폼 초기화
      setFormData({
        content: '',
        agreeToTerms: true,
        authorName: user?.fullName || '',
        authorEmail: user?.primaryEmailAddress?.emailAddress || '',
        authorImageUrl: user?.imageUrl
      });

      setErrors({});
    } catch (error) {
      console.error('댓글 작성 중 오류:', error);
      setErrors({ submit: '댓글 작성 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 입력값 변경 처리
  const handleInputChange = (field: keyof CommentFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 메시지 클리어
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          댓글 작성
        </h3>
      </CardHeader>
      <CardContent>
        {user && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 현재 로그인한 사용자 정보 표시 */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <img
              src={user?.imageUrl}
              alt={user?.fullName || '사용자'}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">{user?.fullName || '익명'}</p>
              <p className="text-sm text-gray-500">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>

          {/* 댓글 내용 */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium mb-1">
              댓글 내용 <span className="text-red-500">*</span>
            </label>
            <Textarea
              id="content"
              placeholder="댓글을 입력해주세요..."
              rows={4}
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className={errors.content ? 'border-red-500' : ''}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.content ? (
                <p className="text-red-500 text-sm">{errors.content}</p>
              ) : (
                <p className="text-gray-500 text-sm">
                  {formData.content.length}/1000자
                </p>
              )}
            </div>
          </div>

          {/* 에러 메시지 */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* 제출 버튼 */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6"
            >
              {isSubmitting ? '작성 중...' : '댓글 작성'}
            </Button>
          </div>
        </form>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 댓글 목록 컴포넌트
 */
function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">아직 댓글이 없습니다</h3>
        <p className="text-gray-500">
          첫 번째 댓글을 작성해보세요!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {comments.map(comment => (
        <CommentItem 
          key={comment.id} 
          comment={comment}
          onReply={(commentId) => {
            console.log('답글 작성:', commentId);
            // TODO: 답글 기능 구현
          }}
          onLike={(commentId) => {
            console.log('좋아요:', commentId);
            // TODO: 좋아요 기능 구현
          }}
          onReport={(commentId) => {
            console.log('신고:', commentId);
            // TODO: 신고 기능 구현
          }}
        />
      ))}
    </div>
  );
}

/**
 * 메인 댓글 섹션 컴포넌트
 */
export default function CommentSection({ postId, postTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 로컬 스토리지 키 생성
  const getStorageKey = (postId: string) => `blog-comments-${postId}`;

  // 댓글 로드
  const loadComments = () => {
    try {
      const storageKey = getStorageKey(postId);
      const savedComments = localStorage.getItem(storageKey);
      
      if (savedComments) {
        const parsedComments = JSON.parse(savedComments);
        // Date 객체 복원
        const commentsWithDates = parsedComments.map((comment: any) => ({
          ...comment,
          createdAt: new Date(comment.createdAt),
          updatedAt: comment.updatedAt ? new Date(comment.updatedAt) : undefined
        }));
        
        // 최신순 정렬
        commentsWithDates.sort((a: Comment, b: Comment) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        
        setComments(commentsWithDates);
      }
    } catch (error) {
      console.error('댓글 로드 중 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 저장
  const saveComments = (commentsToSave: Comment[]) => {
    try {
      const storageKey = getStorageKey(postId);
      localStorage.setItem(storageKey, JSON.stringify(commentsToSave));
    } catch (error) {
      console.error('댓글 저장 중 오류:', error);
    }
  };

  // 새 댓글 추가 처리
  const handleCommentAdded = (newComment: Comment) => {
    const updatedComments = [newComment, ...comments];
    setComments(updatedComments);
    saveComments(updatedComments);
  };

  // 컴포넌트 마운트 시 댓글 로드
  useEffect(() => {
    loadComments();
  }, [postId]);

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      {/* 섹션 헤더 */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">댓글</h2>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
          {comments.length}개
        </span>
      </div>

      {/* 댓글 작성 폼 */}
      <SignedIn>
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
      </SignedIn>

      <SignedOut>
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center py-6">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                댓글을 작성하려면 로그인이 필요합니다
              </h3>
              <p className="text-gray-500 mb-4">
                로그인하고 다른 사용자들과 의견을 나눠보세요.
              </p>
              <SignInButton mode="modal">
                <Button variant="outline" size="lg">
                  로그인하기
                </Button>
              </SignInButton>
            </div>
          </CardContent>
        </Card>
      </SignedOut>

      {/* 댓글 목록 */}
      <div>
        <CommentList comments={comments} />
      </div>
    </section>
  );
}