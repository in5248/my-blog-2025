"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

interface LikeButtonProps {
  postId: string;
  initialLikes?: number;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  className?: string;
}

interface LikesStorage {
  [key: string]: boolean;
}

/**
 * 블로그 포스트 좋아요 버튼 컴포넌트
 * 로컬 스토리지를 이용한 사용자별 좋아요 상태 관리와 애니메이션 효과를 제공합니다.
 */
export default function LikeButton({
  postId,
  initialLikes = 0,
  size = "md",
  showCount = true,
  className = "",
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * 브라우저별 고유 사용자 ID 생성/조회
   * @returns 사용자 고유 ID
   */
  const getUserId = useCallback((): string => {
    const storageKey = "blog-user-id";
    let userId = localStorage.getItem(storageKey);

    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(storageKey, userId);
    }

    return userId;
  }, []);

  /**
   * 사용자의 좋아요 상태 조회
   * @param postId 포스트 ID
   * @returns 좋아요 상태
   */
  const getUserLikeStatus = useCallback(
    (postId: string): boolean => {
      try {
        const userId = getUserId();
        const storageKey = `blog-likes-${postId}`;
        const likesData = localStorage.getItem(storageKey);

        if (likesData) {
          const likes = JSON.parse(likesData);
          return likes[userId] || false;
        }

        return false;
      } catch (error) {
        console.error("좋아요 상태 조회 중 오류:", error);
        return false;
      }
    },
    [getUserId]
  );

  /**
   * 사용자의 좋아요 상태 저장
   * @param postId 포스트 ID
   * @param liked 좋아요 상태
   */
  const setUserLikeStatus = useCallback(
    (postId: string, liked: boolean): void => {
      try {
        const userId = getUserId();
        const storageKey = `blog-likes-${postId}`;
        const likesData = localStorage.getItem(storageKey);

        let likes = {};
        if (likesData) {
          likes = JSON.parse(likesData);
        }

        if (liked) {
          likes[userId] = true;
        } else {
          delete likes[userId];
        }

        localStorage.setItem(storageKey, JSON.stringify(likes));
      } catch (error) {
        console.error("좋아요 상태 저장 중 오류:", error);
      }
    },
    [getUserId]
  );

  /**
   * 전체 좋아요 수 조회
   * @param postId 포스트 ID
   * @returns 좋아요 수
   */
  const getTotalLikes = useCallback(
    (postId: string): number => {
      try {
        const storageKey = `blog-like-counts-${postId}`;
        const countData = localStorage.getItem(storageKey);

        if (countData) {
          return parseInt(countData, 10);
        }

        return initialLikes;
      } catch (error) {
        console.error("좋아요 수 조회 중 오류:", error);
        return initialLikes;
      }
    },
    [initialLikes]
  );

  /**
   * 전체 좋아요 수 저장
   * @param postId 포스트 ID
   * @param count 좋아요 수
   */
  const setTotalLikes = useCallback((postId: string, count: number): void => {
    try {
      const storageKey = `blog-like-counts-${postId}`;
      localStorage.setItem(storageKey, count.toString());
    } catch (error) {
      console.error("좋아요 수 저장 중 오류:", error);
    }
  }, []);

  /**
   * 좋아요 토글 처리
   */
  const handleLikeToggle = async (): Promise<void> => {
    if (isLoading) return; // 중복 클릭 방지

    setIsLoading(true);
    setIsAnimating(true);

    try {
      const newLikedState = !isLiked;
      const newLikeCount = newLikedState ? likeCount + 1 : likeCount - 1;

      // 낙관적 업데이트 (UI 즉시 변경)
      setIsLiked(newLikedState);
      setLikeCount(newLikeCount);

      // 로컬 스토리지에 저장
      setUserLikeStatus(postId, newLikedState);
      setTotalLikes(postId, newLikeCount);

      // 애니메이션 효과를 위한 지연
      setTimeout(() => {
        setIsAnimating(false);
      }, 200);
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);

      // 오류 발생 시 상태 롤백
      setIsLiked(!isLiked);
      setLikeCount(likeCount);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 키보드 이벤트 처리
   * @param event 키보드 이벤트
   */
  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleLikeToggle();
    }
  };

  /**
   * 컴포넌트 크기별 스타일 설정
   */
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          button: "h-8 px-2 text-xs",
          icon: "w-3 h-3",
          gap: "gap-1",
        };
      case "lg":
        return {
          button: "h-12 px-4 text-base",
          icon: "w-6 h-6",
          gap: "gap-2",
        };
      default: // md
        return {
          button: "h-10 px-3 text-sm",
          icon: "w-4 h-4",
          gap: "gap-1.5",
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    const userLiked = getUserLikeStatus(postId);
    const totalLikes = getTotalLikes(postId);

    setIsLiked(userLiked);
    setLikeCount(totalLikes);
  }, [postId, getUserLikeStatus, getTotalLikes]);

  return (
    <Button
      variant={isLiked ? "default" : "outline"}
      size="sm"
      className={`
        ${sizeStyles.button} 
        ${sizeStyles.gap}
        ${
          isLiked
            ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
            : "hover:bg-red-50 hover:text-red-600 hover:border-red-300"
        }
        transition-all duration-200 ease-in-out
        ${isAnimating ? "scale-105" : "scale-100"}
        ${isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onClick={handleLikeToggle}
      onKeyDown={handleKeyDown}
      disabled={isLoading}
      aria-label={`이 포스트에 ${isLiked ? "좋아요 취소" : "좋아요"}`}
      aria-pressed={isLiked}
      role="button"
      tabIndex={0}
    >
      <Heart
        className={`
          ${sizeStyles.icon}
          ${isLiked ? "fill-current" : "fill-none"}
          ${isAnimating ? "animate-pulse" : ""}
          transition-all duration-200
        `}
      />

      {showCount && (
        <span className="font-medium select-none">
          {likeCount > 0 ? likeCount : ""}
        </span>
      )}

      {/* 스크린 리더를 위한 추가 정보 */}
      <span className="sr-only">
        {isLiked
          ? `좋아요를 눌렀습니다. 현재 총 ${likeCount}개의 좋아요가 있습니다.`
          : `좋아요를 누르세요. 현재 총 ${likeCount}개의 좋아요가 있습니다.`}
      </span>
    </Button>
  );
}
