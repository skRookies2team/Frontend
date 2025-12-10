# CloudFront + S3 배포 가이드

## ✅ 현재 상태

프론트엔드를 CloudFront + S3로 배포하기 위해 필요한 설정을 완료했습니다.

### 변경 사항

1. ✅ `adapter-static`으로 변경 (정적 빌드 지원)
2. ✅ 서버 사이드 로직 수정 (정적 빌드 시 건너뛰고 클라이언트 사이드 인증 사용)
3. ✅ `+layout.svelte`에서 쿠키 기반 인증 초기화 추가

## 📋 배포 전 체크리스트

### 1. package.json 업데이트

`adapter-static` 패키지를 설치해야 합니다:

```bash
cd Front
npm install -D @sveltejs/adapter-static
```

### 2. ✅ 서버 사이드 로직 수정 완료

다음 파일들이 정적 빌드를 지원하도록 수정되었습니다:

- ✅ `src/hooks.server.ts`: 정적 빌드 시 서버 사이드 로직 건너뛰기
- ✅ `src/routes/+layout.server.ts`: 정적 빌드 시 null 반환
- ✅ `src/routes/+layout.svelte`: 서버 데이터가 없을 때 쿠키에서 인증 정보 읽기

이제 정적 빌드와 개발 모드 모두에서 정상 작동합니다.

### 3. 환경변수 설정

빌드 시 환경변수가 주입되도록 설정:

```bash
# 빌드 전 환경변수 설정
export PUBLIC_API_BASE_URL=https://api.yourdomain.com
export PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
export PUBLIC_API_MODE=production

# 빌드 실행
npm run build
```

또는 `.env.production` 파일 생성:

```env
PUBLIC_API_BASE_URL=https://api.yourdomain.com
PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
PUBLIC_API_MODE=production
```

## 🚀 배포 단계

### 1. S3 버킷 생성

```bash
aws s3 mb s3://your-frontend-bucket-name --region ap-northeast-2
```

### 2. 빌드 및 업로드

```bash
cd Front

# 환경변수 설정
export PUBLIC_API_BASE_URL=https://api.yourdomain.com
export PUBLIC_RELAY_API_URL=https://relay.yourdomain.com
export PUBLIC_API_MODE=production

# 빌드
npm run build

# S3에 업로드
aws s3 sync build/ s3://your-frontend-bucket-name --delete
```

### 3. S3 버킷 정적 웹사이트 호스팅 설정

```bash
# 버킷 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-frontend-bucket-name \
  --index-document index.html \
  --error-document index.html
```

또는 AWS 콘솔에서:
1. S3 버킷 선택
2. Properties → Static website hosting → Enable
3. Index document: `index.html`
4. Error document: `index.html` (SPA 라우팅을 위해)

### 4. 버킷 정책 설정 (읽기 권한)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-frontend-bucket-name/*"
    }
  ]
}
```

### 5. CloudFront 배포 생성

#### AWS CLI로 생성:

```bash
# OAI (Origin Access Identity) 생성
aws cloudfront create-cloud-front-origin-access-identity \
  --cloud-front-origin-access-identity-config \
    CallerReference="unique-string",Comment="Frontend OAI"

# OAI ID 저장 (위 명령의 출력에서)
OAI_ID="E1234567890ABC"

# CloudFront 배포 생성
aws cloudfront create-distribution \
  --distribution-config '{
    "CallerReference": "unique-string",
    "Comment": "Frontend Distribution",
    "DefaultCacheBehavior": {
      "TargetOriginId": "S3-your-frontend-bucket-name",
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"],
        "CachedMethods": {
          "Quantity": 2,
          "Items": ["GET", "HEAD"]
        }
      },
      "ForwardedValues": {
        "QueryString": false,
        "Cookies": {"Forward": "none"}
      },
      "MinTTL": 0,
      "DefaultTTL": 86400,
      "MaxTTL": 31536000,
      "Compress": true
    },
    "Origins": {
      "Quantity": 1,
      "Items": [{
        "Id": "S3-your-frontend-bucket-name",
        "DomainName": "your-frontend-bucket-name.s3.ap-northeast-2.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": "origin-access-identity/cloudfront/'$OAI_ID'"
        }
      }]
    },
    "Enabled": true,
    "PriceClass": "PriceClass_100"
  }'
```

#### AWS 콘솔로 생성:

1. CloudFront → Create Distribution
2. Origin Domain: S3 버킷 선택
3. Origin Access: "Restrict bucket access" 선택
4. Viewer Protocol Policy: "Redirect HTTP to HTTPS"
5. Default Root Object: `index.html`
6. Error Pages: 404 → `/index.html` (200) 추가 (SPA 라우팅)
7. Create Distribution

### 6. CloudFront Error Pages 설정 (SPA 라우팅)

SPA의 클라이언트 사이드 라우팅을 위해 404 에러를 index.html로 리다이렉트:

1. CloudFront Distribution → Error Pages
2. Create Custom Error Response:
   - HTTP Error Code: `404: Not Found`
   - Customize Error Response: Yes
   - Response Page Path: `/index.html`
   - HTTP Response Code: `200: OK`
   - Error Caching Minimum TTL: `10`

### 7. GitHub Actions 자동 배포 (선택사항)

`.github/workflows/deploy-frontend.yml`:

```yaml
name: Deploy Frontend to S3 + CloudFront

on:
  push:
    branches: [ main ]
    paths:
      - 'Front/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: Front/package-lock.json
      
      - name: Install dependencies
        working-directory: ./Front
        run: npm ci
      
      - name: Build
        working-directory: ./Front
        env:
          PUBLIC_API_BASE_URL: ${{ secrets.PUBLIC_API_BASE_URL }}
          PUBLIC_RELAY_API_URL: ${{ secrets.PUBLIC_RELAY_API_URL }}
          PUBLIC_API_MODE: production
        run: npm run build
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ap-northeast-2
      
      - name: Deploy to S3
        working-directory: ./Front
        run: |
          aws s3 sync build/ s3://${{ secrets.S3_BUCKET_NAME }} --delete
      
      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

## ⚠️ 주의사항

### 1. 인증 처리

정적 사이트이므로 서버 사이드 인증이 불가능합니다. 모든 인증은 클라이언트 사이드에서 처리해야 합니다:

- JWT 토큰은 `localStorage` 또는 `sessionStorage`에 저장
- API 호출 시 헤더에 토큰 포함
- 토큰 만료 시 자동 갱신 로직 필요

### 2. 환경변수

`PUBLIC_*` 접두사가 있는 환경변수만 클라이언트에 노출됩니다. 빌드 시점에 값이 주입되므로, 배포 후 변경하려면 재빌드가 필요합니다.

### 3. API CORS 설정

백엔드와 릴레이 서버의 CORS 설정에 CloudFront 도메인을 추가해야 합니다:

```yaml
# Backend application.yml
cors:
  allowed-origins: ${CORS_ALLOWED_ORIGINS:https://your-cloudfront-domain.cloudfront.net,https://yourdomain.com}
```

### 4. 캐싱 전략

- HTML 파일: 짧은 TTL (1시간) 또는 캐시 무효화
- 정적 자산 (JS, CSS, 이미지): 긴 TTL (1년)
- CloudFront 캐시 무효화로 즉시 반영 가능

## 🔍 배포 확인

1. CloudFront 도메인 접속: `https://xxxxx.cloudfront.net`
2. 브라우저 개발자 도구 → Network 탭에서 API 호출 확인
3. 콘솔에서 환경변수 확인:
   ```javascript
   console.log('API Base URL:', import.meta.env.PUBLIC_API_BASE_URL);
   ```

## 📝 요약

✅ **가능합니다!** 다음 작업만 완료하면 됩니다:

1. `npm install -D @sveltejs/adapter-static` 실행
2. 서버 사이드 인증 로직을 클라이언트 사이드로 이동 (또는 제거)
3. 환경변수 설정 후 빌드
4. S3 + CloudFront 배포

현재 코드는 이미 클라이언트 사이드 API 호출로 인증을 처리하고 있으므로, 서버 사이드 로직만 제거하면 정적 빌드가 가능합니다.

