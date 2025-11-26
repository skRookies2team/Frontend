/**
 * Story Management API
 * 소설 업로드부터 스토리 생성까지의 전 과정을 관리합니다
 */

import { httpClient } from './http-client';
import type {
  StoryUploadRequestDto,
  StoryUploadResponseDto,
  S3UploadRequestDto,
  StoryCharactersResponseDto,
  StorySummaryResponseDto,
  StoryGaugesResponseDto,
  GaugeSelectionRequestDto,
  GaugeSelectionResponseDto,
  StoryConfigRequestDto,
  StoryConfigResponseDto,
  StoryGenerationStartResponseDto,
  StoryProgressResponseDto,
  StoryResultResponseDto,
} from './backend-types';

export class StoryApi {
  /**
   * 1단계: 소설 업로드 및 분석 시작 (텍스트 직접 전송)
   * @deprecated S3 업로드 방식(uploadNovelFromS3) 사용을 권장합니다
   */
  async uploadNovel(data: StoryUploadRequestDto): Promise<StoryUploadResponseDto> {
    return httpClient.post<StoryUploadResponseDto>('/api/stories/upload', data);
  }

  /**
   * 1단계: S3에서 소설 업로드 및 분석 시작 (권장)
   * 사용 방법:
   * 1. uploadApi.uploadStoryFile()로 파일을 S3에 업로드하여 fileKey를 받음
   * 2. 이 메서드에 fileKey를 전달하여 분석 시작
   */
  async uploadNovelFromS3(data: S3UploadRequestDto): Promise<StoryUploadResponseDto> {
    return httpClient.post<StoryUploadResponseDto>('/api/stories/upload-from-s3', data);
  }

  /**
   * 2단계: 요약 조회
   */
  async getSummary(storyId: string): Promise<StorySummaryResponseDto> {
    return httpClient.get<StorySummaryResponseDto>(`/api/stories/${storyId}/summary`);
  }

  /**
   * 2단계: 캐릭터 조회
   */
  async getCharacters(storyId: string): Promise<StoryCharactersResponseDto> {
    return httpClient.get<StoryCharactersResponseDto>(`/api/stories/${storyId}/characters`);
  }

  /**
   * 3단계: 게이지 제안 조회 (5개)
   */
  async getGauges(storyId: string): Promise<StoryGaugesResponseDto> {
    return httpClient.get<StoryGaugesResponseDto>(`/api/stories/${storyId}/gauges`);
  }

  /**
   * 3단계: 게이지 선택 (2개)
   */
  async selectGauges(
    storyId: string,
    data: GaugeSelectionRequestDto
  ): Promise<GaugeSelectionResponseDto> {
    return httpClient.post<GaugeSelectionResponseDto>(
      `/api/stories/${storyId}/gauges/select`,
      data
    );
  }

  /**
   * 4단계: 생성 설정
   */
  async configureStory(
    storyId: string,
    data: StoryConfigRequestDto
  ): Promise<StoryConfigResponseDto> {
    return httpClient.post<StoryConfigResponseDto>(`/api/stories/${storyId}/config`, data);
  }

  /**
   * 5단계: 스토리 생성 시작
   */
  async startGeneration(storyId: string): Promise<StoryGenerationStartResponseDto> {
    return httpClient.post<StoryGenerationStartResponseDto>(
      `/api/stories/${storyId}/generate`,
      {}
    );
  }

  /**
   * 5-6단계: 생성 진행률 조회 (폴링용)
   */
  async getProgress(storyId: string): Promise<StoryProgressResponseDto> {
    return httpClient.get<StoryProgressResponseDto>(`/api/stories/${storyId}/progress`);
  }

  /**
   * 7단계: 생성 완료 결과 조회
   */
  async getResult(storyId: string): Promise<StoryResultResponseDto> {
    return httpClient.get<StoryResultResponseDto>(`/api/stories/${storyId}/result`);
  }
}

export const storyApi = new StoryApi();




