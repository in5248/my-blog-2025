'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AuthErrorHandler, useAuthErrorToast, CommentAuthError } from '@/components/common/auth-error'
import { AuthError, AuthErrorType, parseAuthError } from '@/lib/auth-utils'

/**
 * 인증 오류 처리 데모 페이지
 */
export default function AuthErrorDemoPage() {
  const [currentError, setCurrentError] = useState<AuthError | null>(null)
  const [showAsAlert, setShowAsAlert] = useState(false)
  const authToast = useAuthErrorToast()

  /**
   * 테스트할 오류 시나리오들
   */
  const errorScenarios: Array<{
    title: string
    description: string
    error: AuthError
    badge: string
    badgeVariant: 'default' | 'secondary' | 'destructive' | 'outline'
  }> = [
    {
      title: '세션 만료',
      description: '로그인 세션이 만료된 상황',
      badge: '경고',
      badgeVariant: 'destructive',
      error: {
        type: AuthErrorType.SESSION_EXPIRED,
        title: '세션이 만료되었습니다',
        message: '보안을 위해 자동으로 로그아웃되었습니다. 다시 로그인해 주세요.',
        action: '다시 로그인',
        actionUrl: '/sign-in',
        canRetry: false,
        severity: 'warning'
      }
    },
    {
      title: '로그인 필요',
      description: '인증이 필요한 기능에 접근할 때',
      badge: '정보',
      badgeVariant: 'default',
      error: {
        type: AuthErrorType.UNAUTHORIZED,
        title: '로그인이 필요합니다',
        message: '이 기능을 사용하려면 먼저 로그인해 주세요.',
        action: '로그인하기',
        actionUrl: '/sign-in',
        canRetry: false,
        severity: 'info'
      }
    },
    {
      title: '잘못된 로그인 정보',
      description: '이메일 또는 비밀번호가 틀린 경우',
      badge: '오류',
      badgeVariant: 'destructive',
      error: {
        type: AuthErrorType.INVALID_CREDENTIALS,
        title: '로그인 정보가 올바르지 않습니다',
        message: '이메일 또는 비밀번호를 다시 확인해 주세요.',
        action: '다시 시도',
        canRetry: true,
        severity: 'error'
      }
    },
    {
      title: '네트워크 오류',
      description: '인터넷 연결 문제 또는 서버 오류',
      badge: '오류',
      badgeVariant: 'destructive',
      error: {
        type: AuthErrorType.NETWORK_ERROR,
        title: '네트워크 연결 오류',
        message: '인터넷 연결을 확인하고 다시 시도해 주세요.',
        action: '다시 시도',
        canRetry: true,
        severity: 'error'
      }
    },
    {
      title: '권한 없음',
      description: '관리자 권한이 필요한 기능에 접근',
      badge: '권한',
      badgeVariant: 'destructive',
      error: {
        type: AuthErrorType.PERMISSION_DENIED,
        title: '권한이 없습니다',
        message: '이 작업을 수행할 권한이 없습니다. 관리자에게 문의하세요.',
        action: '홈으로 이동',
        actionUrl: '/',
        canRetry: false,
        severity: 'error'
      }
    },
    {
      title: '이메일 미인증',
      description: '이메일 인증이 완료되지 않은 계정',
      badge: '인증',
      badgeVariant: 'outline',
      error: {
        type: AuthErrorType.EMAIL_NOT_VERIFIED,
        title: '이메일 인증이 필요합니다',
        message: '가입 시 사용한 이메일의 인증 링크를 클릭해 주세요.',
        action: '인증 메일 재발송',
        canRetry: true,
        severity: 'warning'
      }
    },
    {
      title: '너무 많은 시도',
      description: '짧은 시간 내 너무 많은 로그인 시도',
      badge: '제한',
      badgeVariant: 'secondary',
      error: {
        type: AuthErrorType.RATE_LIMITED,
        title: '너무 많은 시도입니다',
        message: '잠시 후 다시 시도해 주세요. (1-2분 대기)',
        action: '잠시 후 재시도',
        canRetry: true,
        severity: 'warning'
      }
    },
    {
      title: '계정 비활성화',
      description: '관리자에 의해 계정이 비활성화된 상태',
      badge: '차단',
      badgeVariant: 'destructive',
      error: {
        type: AuthErrorType.ACCOUNT_DISABLED,
        title: '계정이 비활성화되었습니다',
        message: '관리자에 의해 계정이 비활성화되었습니다. 고객센터에 문의하세요.',
        action: '고객센터 문의',
        actionUrl: '/contact',
        canRetry: false,
        severity: 'error'
      }
    }
  ]

  /**
   * 토스트 알림으로 오류 표시
   */
  const showToastError = (error: AuthError) => {
    authToast.showError(error)
  }

  /**
   * 알림 카드로 오류 표시
   */
  const showAlertError = (error: AuthError) => {
    setCurrentError(error)
    setShowAsAlert(true)
  }

  /**
   * 오류 해제
   */
  const clearError = () => {
    setCurrentError(null)
    setShowAsAlert(false)
  }

  /**
   * 재시도 함수 (데모용)
   */
  const handleRetry = async () => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // 50% 확률로 성공/실패
        if (Math.random() > 0.5) {
          resolve()
        } else {
          reject(new Error('재시도 실패'))
        }
      }, 1000)
    })
  }

  /**
   * 실제 오류 시뮬레이션
   */
  const simulateRealError = () => {
    try {
      // 의도적으로 오류 발생
      throw new Error('NetworkError: Failed to fetch')
    } catch (error) {
      const authError = parseAuthError(error)
      authToast.showError(authError)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          인증 오류 처리 시스템 데모
        </h1>
        <p className="text-gray-600">
          다양한 인증 오류 상황을 테스트하고 사용자 친화적인 오류 메시지를 확인해보세요.
        </p>
      </div>

      {/* 현재 오류 표시 영역 */}
      {showAsAlert && currentError && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">현재 표시된 오류:</h2>
          <AuthErrorHandler
            error={currentError}
            showAsToast={false}
            showAsAlert={true}
            onRetry={handleRetry}
            onDismiss={clearError}
            autoRetry={false}
            className="mb-4"
          />
        </div>
      )}

      {/* 오류 시나리오 테스트 */}
      <div className="grid gap-6 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">오류 시나리오 테스트</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {errorScenarios.map((scenario, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <Badge variant={scenario.badgeVariant}>{scenario.badge}</Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      onClick={() => showToastError(scenario.error)}
                      className="w-full"
                      size="sm"
                    >
                      토스트로 표시
                    </Button>
                    <Button
                      onClick={() => showAlertError(scenario.error)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      알림 카드로 표시
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 특수 컴포넌트 데모 */}
      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">댓글 인증 오류 컴포넌트</h2>
          <Card>
            <CardHeader>
              <CardTitle>댓글 작성 영역 (로그인 필요)</CardTitle>
              <CardDescription>
                댓글 작성 시 나타나는 인증 요구 메시지를 확인해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CommentAuthError />
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">추가 기능 테스트</h2>
          <Card>
            <CardHeader>
              <CardTitle>기타 테스트</CardTitle>
              <CardDescription>
                실제 오류 파싱 및 추가 기능들을 테스트해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={simulateRealError} variant="outline">
                실제 네트워크 오류 시뮬레이션
              </Button>
              <Button onClick={() => authToast.showSuccess('성공!', '작업이 완료되었습니다.')}>
                성공 메시지 표시
              </Button>
              <Button onClick={clearError} variant="destructive">
                모든 오류 해제
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 사용법 안내 */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">💡 사용법</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>토스트 알림:</strong> 화면 우측 하단에 나타나는 간단한 알림</p>
          <p><strong>알림 카드:</strong> 페이지 내에 표시되는 상세한 오류 정보</p>
          <p><strong>자동 재시도:</strong> 네트워크 오류 등에서 자동으로 재시도 수행</p>
          <p><strong>액션 버튼:</strong> 로그인 페이지 이동, 재시도 등 적절한 행동 안내</p>
        </div>
      </div>
    </div>
  )
} 