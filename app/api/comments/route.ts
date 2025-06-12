import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { type Comment } from "@/types/comment";

/**
 * 로컬 스토리지에서 댓글 데이터를 관리하는 유틸리티 함수들
 */
const commentUtils = {
  // 댓글 목록 조회
  getComments: (postId: string): Comment[] => {
    if (typeof window === "undefined") return [];
    const comments = localStorage.getItem(`comments_${postId}`);
    return comments ? JSON.parse(comments) : [];
  },

  // 댓글 저장
  saveComments: (postId: string, comments: Comment[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
  },

  // 새 댓글 추가
  addComment: (postId: string, comment: Comment) => {
    const comments = commentUtils.getComments(postId);
    comments.push(comment);
    commentUtils.saveComments(postId, comments);
    return comment;
  },

  // 댓글 수정
  updateComment: (postId: string, commentId: string, content: string) => {
    const comments = commentUtils.getComments(postId);
    const index = comments.findIndex((c) => c.id === commentId);
    if (index === -1) return null;

    comments[index] = {
      ...comments[index],
      content,
      updatedAt: new Date(),
    };

    commentUtils.saveComments(postId, comments);
    return comments[index];
  },

  // 댓글 삭제
  deleteComment: (postId: string, commentId: string) => {
    const comments = commentUtils.getComments(postId);
    const newComments = comments.filter((c) => c.id !== commentId);
    commentUtils.saveComments(postId, newComments);
  },
};

/**
 * 댓글 목록 조회 (GET)
 * 모든 사용자 접근 가능
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json(
        { error: "게시글 ID가 필요합니다" },
        { status: 400 }
      );
    }

    const comments = commentUtils.getComments(postId);
    return NextResponse.json({ comments });
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    return NextResponse.json(
      { error: "댓글을 불러오는 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * 새 댓글 작성 (POST)
 * 인증된 사용자만 접근 가능
 */
export async function POST(request: Request) {
  try {
    // 인증 확인
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "댓글을 작성하려면 로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, content } = body;

    if (!postId || !content) {
      return NextResponse.json(
        { error: "게시글 ID와 내용은 필수입니다" },
        { status: 400 }
      );
    }

    // 새 댓글 데이터 생성
    const newComment: Comment = {
      id: crypto.randomUUID(),
      postId,
      userId,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      authorImageUrl: body.authorImageUrl,
      content,
      createdAt: new Date(),
      status: "approved",
      likeCount: 0,
      dislikeCount: 0,
      reportCount: 0,
      isEdited: false,
      isPinned: false,
      isAuthor: false,
    };

    // 댓글 저장
    const savedComment = commentUtils.addComment(postId, newComment);

    return NextResponse.json({
      success: true,
      comment: savedComment,
    });
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    return NextResponse.json(
      { error: "댓글 작성 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * 댓글 수정 (PUT)
 * 작성자와 관리자만 접근 가능
 */
export async function PUT(request: Request) {
  try {
    // 인증 확인
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "댓글을 수정하려면 로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, commentId, content } = body;

    if (!postId || !commentId || !content) {
      return NextResponse.json(
        { error: "게시글 ID, 댓글 ID, 내용은 필수입니다" },
        { status: 400 }
      );
    }

    // 기존 댓글 조회
    const comments = commentUtils.getComments(postId);
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 권한 확인
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "자신의 댓글만 수정할 수 있습니다" },
        { status: 403 }
      );
    }

    // 댓글 수정
    const updatedComment = commentUtils.updateComment(
      postId,
      commentId,
      content
    );

    return NextResponse.json({
      success: true,
      comment: updatedComment,
    });
  } catch (error) {
    console.error("댓글 수정 오류:", error);
    return NextResponse.json(
      { error: "댓글 수정 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}

/**
 * 댓글 삭제 (DELETE)
 * 작성자와 관리자만 접근 가능
 */
export async function DELETE(request: Request) {
  try {
    // 인증 확인
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "댓글을 삭제하려면 로그인이 필요합니다" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const commentId = searchParams.get("commentId");

    if (!postId || !commentId) {
      return NextResponse.json(
        { error: "게시글 ID와 댓글 ID는 필수입니다" },
        { status: 400 }
      );
    }

    // 기존 댓글 조회
    const comments = commentUtils.getComments(postId);
    const comment = comments.find((c) => c.id === commentId);

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    // 권한 확인
    if (comment.userId !== userId) {
      return NextResponse.json(
        { error: "자신의 댓글만 삭제할 수 있습니다" },
        { status: 403 }
      );
    }

    // 댓글 삭제
    commentUtils.deleteComment(postId, commentId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    return NextResponse.json(
      { error: "댓글 삭제 중 오류가 발생했습니다" },
      { status: 500 }
    );
  }
}
