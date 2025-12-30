# S3 이미지 접근 문제 해결 가이드

## 문제 상황

프론트엔드에서 백엔드가 반환하는 S3 이미지 URL로 접근 시 **Access Denied** 에러가 발생합니다.

### 원인

백엔드가 **Direct S3 URL**을 반환하고 있으며, S3 버킷이 private으로 설정되어 있기 때문입니다.

```
❌ Direct S3 URL (Access Denied 발생)
https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/node123.png
```

## 해결 방법

백엔드에서 **S3 Presigned URL**을 생성하여 반환해야 합니다.

### 1. Presigned URL이란?

- 일정 시간 동안만 유효한 임시 접근 URL
- Private S3 객체에 안전하게 접근 가능
- URL에 서명 정보가 포함되어 있어 권한 확인

```
✅ Presigned URL (접근 가능)
https://bucket-name.s3.ap-northeast-2.amazonaws.com/images/node123.png?
X-Amz-Algorithm=AWS4-HMAC-SHA256&
X-Amz-Credential=...&
X-Amz-Date=20250101T000000Z&
X-Amz-Expires=3600&
X-Amz-Signature=...
```

### 2. 백엔드 구현 예시 (Java/Spring Boot)

#### 의존성 추가 (build.gradle 또는 pom.xml)

```gradle
implementation 'software.amazon.awssdk:s3:2.20.0'
```

#### S3 Presigned URL 생성 코드

```java
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.PresignedGetObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import java.time.Duration;

@Service
public class S3Service {

    private final S3Presigner s3Presigner;
    private final String bucketName = "your-bucket-name";

    public S3Service(S3Presigner s3Presigner) {
        this.s3Presigner = s3Presigner;
    }

    /**
     * S3 객체에 대한 Presigned URL 생성
     *
     * @param fileKey S3 파일 키 (예: "images/node123.png")
     * @param expirationMinutes URL 만료 시간 (분)
     * @return Presigned URL
     */
    public String generatePresignedUrl(String fileKey, int expirationMinutes) {
        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
            .bucket(bucketName)
            .key(fileKey)
            .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
            .signatureDuration(Duration.ofMinutes(expirationMinutes))
            .getObjectRequest(getObjectRequest)
            .build();

        PresignedGetObjectRequest presignedRequest = s3Presigner.presignGetObject(presignRequest);

        return presignedRequest.url().toString();
    }
}
```

#### S3Presigner Bean 설정

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;

@Configuration
public class S3Config {

    @Bean
    public S3Presigner s3Presigner() {
        return S3Presigner.builder()
            .region(Region.AP_NORTHEAST_2)  // 서울 리전
            .build();
    }
}
```

#### API 응답에 Presigned URL 포함

```java
@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final S3Service s3Service;

    @PostMapping("/{storyId}/images/nodes/{nodeId}/regenerate")
    public ImageRegenerateResponseDto regenerateNodeImage(
        @PathVariable String storyId,
        @PathVariable String nodeId,
        @RequestBody ImageRegenerateRequestDto request
    ) {
        // 1. AI로 이미지 생성
        String fileKey = generateImage(request.getCustomPrompt());

        // 2. S3에 업로드
        uploadToS3(fileKey, imageData);

        // 3. Presigned URL 생성 (1시간 유효)
        String presignedUrl = s3Service.generatePresignedUrl(fileKey, 60);

        // 4. 응답 반환
        return ImageRegenerateResponseDto.builder()
            .imageUrl(presignedUrl)  // ✅ Presigned URL 반환
            .fileKey(fileKey)
            .storyId(storyId)
            .nodeId(nodeId)
            .enhancedPrompt(enhancedPrompt)
            .generatedAt(LocalDateTime.now().toString())
            .build();
    }
}
```

### 3. 수정이 필요한 API 엔드포인트

다음 API들이 `imageUrl`을 반환할 때 모두 Presigned URL을 사용해야 합니다:

1. **`POST /api/stories/{storyId}/images/nodes/{nodeId}/regenerate`**
   - 이미지 재생성 후 반환
   - Response: `ImageRegenerateResponseDto`

2. **`GET /api/game/{sessionId}`**
   - 게임 상태 조회
   - Response: `GameStateResponseDto.nodeImage.imageUrl`

3. **`POST /api/game/{sessionId}/choice`**
   - 선택지 선택 후 다음 노드
   - Response: `GameStateResponseDto.nodeImage.imageUrl`

4. **`GET /api/game/stories`**
   - 스토리 목록 조회
   - Response: `StoryData[].thumbnailUrl`

5. **`GET /api/stories/{storyId}/images/nodes/{nodeId}`**
   - 노드 이미지 정보 조회
   - Response: `NodeImageResponseDto.imageUrl`

### 4. Presigned URL 만료 시간 권장사항

| 용도 | 권장 만료 시간 | 이유 |
|------|---------------|------|
| 게임 플레이 이미지 | 1-2시간 | 게임 세션 동안 유효 |
| 썸네일 이미지 | 24시간 | 목록 페이지에서 장시간 사용 |
| 편집 중 이미지 | 30분 | Step5 트리 편집 중 사용 |

### 5. 대안 솔루션 (참고용)

#### Option A: CloudFront 사용
- S3 앞에 CloudFront 배포 생성
- CloudFront URL 반환
- 장점: 캐싱으로 성능 향상, 만료 시간 없음
- 단점: 설정 복잡, 비용 추가

#### Option B: S3 Public Read 설정 (비권장)
- 버킷 정책으로 public read 허용
- 장점: Presigned URL 불필요
- 단점: 보안 위험, 누구나 접근 가능

## 프론트엔드 디버깅

프론트엔드는 백엔드가 반환하는 URL 타입을 자동으로 감지하고 콘솔에 로그를 출력합니다:

```javascript
// 브라우저 개발자 도구 콘솔 확인

✅ [ImageURL] Presigned URL 감지
   - 올바른 설정입니다

⚠️ [ImageURL] Direct S3 URL 감지 - Access Denied 발생 가능
   - 백엔드에서 Presigned URL을 반환하도록 수정 필요
```

## 테스트 방법

### 1. 브라우저에서 URL 직접 접근

**Direct S3 URL (실패):**
```
https://bucket.s3.ap-northeast-2.amazonaws.com/images/test.png
→ Access Denied 에러
```

**Presigned URL (성공):**
```
https://bucket.s3.ap-northeast-2.amazonaws.com/images/test.png?X-Amz-...
→ 이미지 정상 표시
```

### 2. API 응답 확인

```bash
curl http://localhost:8080/api/stories/story123/images/nodes/node456

# 응답 확인
{
  "imageUrl": "https://bucket.s3.ap-northeast-2.amazonaws.com/images/node456.png?X-Amz-...",
  "imageFileKey": "images/node456.png"
}
```

URL에 `X-Amz-` 파라미터가 포함되어 있으면 Presigned URL입니다.

## 참고 문서

- [AWS S3 Presigned URLs 공식 문서](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html)
- [AWS SDK for Java - S3 Presigner](https://sdk.amazonaws.com/java/api/latest/software/amazon/awssdk/services/s3/presigner/S3Presigner.html)

## 문의

이미지 접근 문제 관련 질문은 프론트엔드 팀에 문의해주세요.
