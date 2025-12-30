/**
 * Image URL Utility
 * 백엔드에서 받은 이미지 URL 처리
 *
 * 백엔드는 다음 중 하나를 반환해야 합니다:
 * 1. S3 Presigned URL (권장) - 일정 시간 동안 접근 가능한 임시 URL
 * 2. Public S3 URL - 버킷이 public read로 설정된 경우
 * 3. CloudFront URL - CDN을 통한 접근
 */

/**
 * 백엔드에서 받은 이미지 URL 검증 및 디버깅
 *
 * @param url - 백엔드에서 받은 이미지 URL
 * @param fileKey - S3 파일 키 (디버깅용)
 * @returns 원본 URL (백엔드가 올바른 URL을 반환해야 함)
 */
export function getAccessibleImageUrl(url: string, fileKey?: string): string {
  if (!url) {
    console.warn('[ImageURL] 이미지 URL이 제공되지 않음');
    return '';
  }

  // URL 타입 감지 및 로깅
  const urlLower = url.toLowerCase();

  if (urlLower.includes('x-amz-')) {
    // Presigned URL (권장)
    console.log('[ImageURL] ✅ Presigned URL 감지:', {
      url: url.substring(0, 100) + '...',
      fileKey,
      type: 'presigned'
    });
  } else if (urlLower.includes('.s3.') || urlLower.includes('s3.amazonaws.com')) {
    // Direct S3 URL (Access Denied 가능성 높음)
    console.warn('[ImageURL] ⚠️ Direct S3 URL 감지 - Access Denied 발생 가능:', {
      url,
      fileKey,
      type: 'direct-s3',
      solution: '백엔드에서 Presigned URL을 반환하도록 수정 필요'
    });
  } else if (urlLower.includes('cloudfront.net')) {
    // CloudFront URL
    console.log('[ImageURL] ✅ CloudFront URL 감지:', {
      url,
      fileKey,
      type: 'cloudfront'
    });
  } else {
    // 기타 URL
    console.log('[ImageURL] 기타 URL:', {
      url,
      fileKey,
      type: 'unknown'
    });
  }

  // 백엔드가 올바른 URL을 반환한다고 가정하고 그대로 반환
  return url;
}

/**
 * 여러 이미지 URL 처리
 */
export function getAccessibleImageUrls(
  urls: Array<{ url: string; fileKey?: string }>
): string[] {
  return urls.map(({ url, fileKey }) => getAccessibleImageUrl(url, fileKey));
}
