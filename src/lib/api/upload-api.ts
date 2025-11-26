/**
 * File Upload API
 * S3를 이용한 파일 업로드 관리
 */

import { httpClient } from './http-client';
import type { PresignedUrlResponseDto } from './backend-types';

export class UploadApi {
  /**
   * 스토리 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .txt, .pdf, .doc, .docx
   * 최대 크기: 10MB
   */
  async getStoryPresignedUrl(
    fileName: string,
    fileSize?: number
  ): Promise<PresignedUrlResponseDto> {
    return httpClient.get<PresignedUrlResponseDto>('/api/upload/story/presigned-url', {
      params: { fileName, fileSize },
    });
  }

  /**
   * 이미지 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .jpg, .jpeg, .png, .gif, .webp
   * 최대 크기: 5MB
   */
  async getImagePresignedUrl(
    fileName: string,
    fileSize?: number
  ): Promise<PresignedUrlResponseDto> {
    return httpClient.get<PresignedUrlResponseDto>('/api/upload/image/presigned-url', {
      params: { fileName, fileSize },
    });
  }

  /**
   * 동영상 파일 업로드용 Pre-signed URL 생성
   * 지원 형식: .mp4, .avi, .mov, .wmv, .flv, .mkv
   * 최대 크기: 100MB
   */
  async getVideoPresignedUrl(
    fileName: string,
    fileSize?: number
  ): Promise<PresignedUrlResponseDto> {
    return httpClient.get<PresignedUrlResponseDto>('/api/upload/video/presigned-url', {
      params: { fileName, fileSize },
    });
  }

  /**
   * 파일 업로드 완료 확인
   * S3에 파일이 정상적으로 업로드되었는지 확인
   */
  async verifyUpload(fileKey: string): Promise<Record<string, any>> {
    return httpClient.post<Record<string, any>>('/api/upload/verify', null, {
      params: { fileKey },
    });
  }

  /**
   * 다운로드용 Pre-signed URL 생성
   * URL은 1시간 동안 유효
   */
  async getDownloadUrl(fileKey: string): Promise<string> {
    return httpClient.get<string>('/api/upload/download-url', {
      params: { fileKey },
    });
  }

  /**
   * 파일 삭제
   * 업로드 실패 시 정리용으로 사용
   */
  async deleteFile(fileKey: string): Promise<Record<string, any>> {
    return httpClient.delete<Record<string, any>>('/api/upload/file', {
      params: { fileKey },
    });
  }

  /**
   * S3에 파일 직접 업로드 (헬퍼 메서드)
   * @param file 업로드할 파일
   * @param onProgress 진행률 콜백 (0-100)
   * @returns fileKey
   */
  async uploadStoryFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    // 1. Presigned URL 받기
    const { uploadUrl, fileKey } = await this.getStoryPresignedUrl(
      file.name,
      file.size
    );

    // 2. S3에 직접 업로드
    await httpClient.uploadToS3(uploadUrl, file, onProgress);

    // 3. 업로드 확인 (선택사항)
    await this.verifyUpload(fileKey);

    return fileKey;
  }

  /**
   * 이미지 파일 S3 업로드 헬퍼
   */
  async uploadImageFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const { uploadUrl, fileKey } = await this.getImagePresignedUrl(
      file.name,
      file.size
    );

    await httpClient.uploadToS3(uploadUrl, file, onProgress);
    await this.verifyUpload(fileKey);

    return fileKey;
  }

  /**
   * 동영상 파일 S3 업로드 헬퍼
   */
  async uploadVideoFile(
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const { uploadUrl, fileKey } = await this.getVideoPresignedUrl(
      file.name,
      file.size
    );

    await httpClient.uploadToS3(uploadUrl, file, onProgress);
    await this.verifyUpload(fileKey);

    return fileKey;
  }
}

export const uploadApi = new UploadApi();


