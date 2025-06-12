/**
 * 인증 관련 유틸리티 함수들
 * 다양한 인증 오류를 처리하고 사용자 친화적인 메시지를 제공합니다.
 */

/**
 * 인증 오류 타입 정의
 */
export enum AuthErrorType {
  SESSION_EXPIRED = "SESSION_EXPIRED",
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  NETWORK_ERROR = "NETWORK_ERROR",
  PERMISSION_DENIED = "PERMISSION_DENIED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  EMAIL_NOT_VERIFIED = "EMAIL_NOT_VERIFIED",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",
  RATE_LIMITED = "RATE_LIMITED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 인증 오류 정보 인터페이스
 */
export interface AuthError {
  type: AuthErrorType;
  title: string;
  message: string;
  action?: string;
  actionUrl?: string;
  canRetry: boolean;
  severity: "info" | "warning" | "error";
}

/**
 * Clerk 오류 코드를 AuthErrorType으로 매핑
 */
const clerkErrorMapping: Record<string, AuthErrorType> = {
  session_expired: AuthErrorType.SESSION_EXPIRED,
  unauthenticated: AuthErrorType.UNAUTHORIZED,
  unauthorized: AuthErrorType.UNAUTHORIZED,
  invalid_credentials: AuthErrorType.INVALID_CREDENTIALS,
  user_not_found: AuthErrorType.USER_NOT_FOUND,
  email_not_verified: AuthErrorType.EMAIL_NOT_VERIFIED,
  account_disabled: AuthErrorType.ACCOUNT_DISABLED,
  rate_limited: AuthErrorType.RATE_LIMITED,
  network_error: AuthErrorType.NETWORK_ERROR,
  permission_denied: AuthErrorType.PERMISSION_DENIED,
};

/**
 * 오류 타입별 사용자 친화적 메시지 매핑
 */
const errorMessages: Record<AuthErrorType, Omit<AuthError, "type">> = {
  [AuthErrorType.SESSION_EXPIRED]: {
    title: "세션이 만료되었습니다",
    message: "보안을 위해 자동으로 로그아웃되었습니다. 다시 로그인해 주세요.",
    action: "다시 로그인",
    actionUrl: "/sign-in",
    canRetry: false,
    severity: "warning",
  },
  [AuthErrorType.UNAUTHORIZED]: {
    title: "로그인이 필요합니다",
    message: "이 기능을 사용하려면 먼저 로그인해 주세요.",
    action: "로그인하기",
    actionUrl: "/sign-in",
    canRetry: false,
    severity: "info",
  },
  [AuthErrorType.INVALID_CREDENTIALS]: {
    title: "로그인 정보가 올바르지 않습니다",
    message: "이메일 또는 비밀번호를 다시 확인해 주세요.",
    action: "다시 시도",
    canRetry: true,
    severity: "error",
  },
  [AuthErrorType.NETWORK_ERROR]: {
    title: "네트워크 연결 오류",
    message: "인터넷 연결을 확인하고 다시 시도해 주세요.",
    action: "다시 시도",
    canRetry: true,
    severity: "error",
  },
  [AuthErrorType.PERMISSION_DENIED]: {
    title: "권한이 없습니다",
    message: "이 작업을 수행할 권한이 없습니다. 관리자에게 문의하세요.",
    action: "홈으로 이동",
    actionUrl: "/",
    canRetry: false,
    severity: "error",
  },
  [AuthErrorType.USER_NOT_FOUND]: {
    title: "사용자를 찾을 수 없습니다",
    message: "등록되지 않은 이메일입니다. 회원가입을 진행해 주세요.",
    action: "회원가입",
    actionUrl: "/sign-up",
    canRetry: false,
    severity: "info",
  },
  [AuthErrorType.EMAIL_NOT_VERIFIED]: {
    title: "이메일 인증이 필요합니다",
    message: "가입 시 사용한 이메일의 인증 링크를 클릭해 주세요.",
    action: "인증 메일 재발송",
    canRetry: true,
    severity: "warning",
  },
  [AuthErrorType.ACCOUNT_DISABLED]: {
    title: "계정이 비활성화되었습니다",
    message: "관리자에 의해 계정이 비활성화되었습니다. 고객센터에 문의하세요.",
    action: "고객센터 문의",
    actionUrl: "/contact",
    canRetry: false,
    severity: "error",
  },
  [AuthErrorType.RATE_LIMITED]: {
    title: "너무 많은 시도입니다",
    message: "잠시 후 다시 시도해 주세요. (1-2분 대기)",
    action: "잠시 후 재시도",
    canRetry: true,
    severity: "warning",
  },
  [AuthErrorType.UNKNOWN_ERROR]: {
    title: "알 수 없는 오류가 발생했습니다",
    message: "문제가 지속되면 고객센터에 문의해 주세요.",
    action: "다시 시도",
    canRetry: true,
    severity: "error",
  },
};

/**
 * Clerk 오류 객체 타입
 */
interface ClerkError {
  code?: string;
  errors?: Array<{
    code: string;
    message: string;
  }>;
}

/**
 * HTTP 오류 응답 타입
 */
interface HttpError {
  status: number;
  message?: string;
  code?: string;
}

/**
 * Clerk 오류를 AuthError로 변환
 */
export function parseClerkError(error: ClerkError | unknown): AuthError {
  // Clerk 오류 객체에서 정보 추출
  const clerkError = error as ClerkError;
  const errorCode =
    clerkError?.errors?.[0]?.code || clerkError?.code || "unknown_error";
  const errorType = clerkErrorMapping[errorCode] || AuthErrorType.UNKNOWN_ERROR;

  return {
    type: errorType,
    ...errorMessages[errorType],
  };
}

/**
 * 네트워크 오류를 AuthError로 변환
 */
export function parseNetworkError(error: Error): AuthError {
  // 네트워크 관련 오류 감지
  if (
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("NetworkError")
  ) {
    return {
      type: AuthErrorType.NETWORK_ERROR,
      ...errorMessages[AuthErrorType.NETWORK_ERROR],
    };
  }

  return {
    type: AuthErrorType.UNKNOWN_ERROR,
    ...errorMessages[AuthErrorType.UNKNOWN_ERROR],
  };
}

/**
 * HTTP 응답을 AuthError로 변환
 */
export function parseHttpError(
  status: number
): AuthError {
  // HTTP 상태 코드에 따른 오류 타입 결정
  const errorType = httpStatusToErrorType(status);
  return {
    type: errorType,
    ...errorMessages[errorType],
  };
}

/**
 * 일반적인 오류를 AuthError로 변환하는 통합 함수
 */
export function parseAuthError(error: unknown): AuthError {
  // Clerk 오류인 경우
  if (error && typeof error === "object" && "errors" in error) {
    return parseClerkError(error);
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    return parseNetworkError(error);
  }

  // HTTP 응답 오류인 경우
  if (error && typeof error === "object" && "status" in error) {
    return parseHttpError((error as HttpError).status);
  }

  // 기본 알 수 없는 오류
  return {
    type: AuthErrorType.UNKNOWN_ERROR,
    ...errorMessages[AuthErrorType.UNKNOWN_ERROR],
  };
}

/**
 * 오류 타입별 자동 재시도 지연 시간 (밀리초)
 */
export const getRetryDelay = (
  errorType: AuthErrorType,
  attemptCount: number
): number => {
  const baseDelays: Record<AuthErrorType, number> = {
    [AuthErrorType.NETWORK_ERROR]: 1000, // 1초
    [AuthErrorType.RATE_LIMITED]: 60000, // 1분
    [AuthErrorType.INVALID_CREDENTIALS]: 2000, // 2초
    [AuthErrorType.EMAIL_NOT_VERIFIED]: 5000, // 5초
    [AuthErrorType.UNKNOWN_ERROR]: 3000, // 3초
    // 재시도하지 않는 오류들은 0
    [AuthErrorType.SESSION_EXPIRED]: 0,
    [AuthErrorType.UNAUTHORIZED]: 0,
    [AuthErrorType.PERMISSION_DENIED]: 0,
    [AuthErrorType.USER_NOT_FOUND]: 0,
    [AuthErrorType.ACCOUNT_DISABLED]: 0,
  };

  const baseDelay = baseDelays[errorType] || 0;
  if (baseDelay === 0) return 0;

  // 지수 백오프: 시도 횟수에 따라 지연 시간 증가
  return baseDelay * Math.pow(2, Math.min(attemptCount - 1, 4));
};

/**
 * 디버깅을 위한 오류 로깅
 */
export const logAuthError = (error: AuthError, context?: string): void => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🔐 Auth Error ${context ? `[${context}]` : ""}`);
    console.error("Type:", error.type);
    console.error("Title:", error.title);
    console.error("Message:", error.message);
    console.error("Can Retry:", error.canRetry);
    console.error("Severity:", error.severity);
    console.groupEnd();
  }
};

/**
 * HTTP 상태 코드에 따른 오류 타입 결정
 */
function httpStatusToErrorType(status: number): AuthErrorType {
  switch (status) {
    case 401:
      return AuthErrorType.UNAUTHORIZED;
    case 403:
      return AuthErrorType.PERMISSION_DENIED;
    case 404:
      return AuthErrorType.USER_NOT_FOUND;
    case 429:
      return AuthErrorType.RATE_LIMITED;
    case 500:
    case 502:
    case 503:
    case 504:
      return AuthErrorType.NETWORK_ERROR;
    default:
      return AuthErrorType.UNKNOWN_ERROR;
  }
}
