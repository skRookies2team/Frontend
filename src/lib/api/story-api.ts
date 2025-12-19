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
  CharacterSelectionRequestDto,
  SelectedCharactersResponseDto,
  GaugeSelectionRequestDto,
  GaugeSelectionResponseDto,
  StoryConfigRequestDto,
  StoryConfigResponseDto,
  StoryGenerationStartResponseDto,
  StoryProgressResponseDto,
  StoryResultResponseDto,
  EpisodeDto,
  UpdateNodeRequestDto,
  RegenerateSubtreeResponseDto,
} from './types/backend-types';

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
   * 2단계: NPC 챗봇용 캐릭터 선택 (1-2명)
   */
  async selectCharacters(
    storyId: string,
    data: CharacterSelectionRequestDto
  ): Promise<void> {
    return httpClient.post<void>(`/api/stories/${storyId}/select-characters`, data);
  }

  /**
   * 선택된 캐릭터 조회 (게임 플레이 중 대화 가능한 NPC 목록)
   */
  async getSelectedCharacters(storyId: string): Promise<SelectedCharactersResponseDto> {
    return httpClient.get<SelectedCharactersResponseDto>(`/api/stories/${storyId}/selected-characters`);
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
   * 5단계: 첫 번째 에피소드(EP1) 생성 시작 - 동기 방식
   * AI 서버에서 에피소드 생성이 완료될 때까지 대기 후 EpisodeDto 반환
   */
  async startEpisodeGeneration(storyId: string): Promise<EpisodeDto> {
    return httpClient.post<EpisodeDto>(
      `/api/stories/${storyId}/generate`,
      {}
    );
  }

  /**
   * 다음 에피소드 생성 - 동기 방식
   * 이전 에피소드 완료 후 호출, 생성 완료 시 EpisodeDto 반환
   */
  async generateNextEpisode(storyId: string): Promise<EpisodeDto> {
    return httpClient.post<EpisodeDto>(
      `/api/stories/${storyId}/generate-next-episode`,
      {}
    );
  }

  /**
   * 노드 수정 및 서브트리 재생성 - 동기 방식
   * 특정 노드를 수정하고 하위 노드들을 AI가 재생성합니다
   */
  async regenerateSubtree(
    storyId: string,
    episodeOrder: number,
    nodeId: string,
    data: UpdateNodeRequestDto
  ): Promise<RegenerateSubtreeResponseDto> {
    return httpClient.put<RegenerateSubtreeResponseDto>(
      `/api/stories/${storyId}/episodes/${episodeOrder}/nodes/${nodeId}/regenerate`,
      data
    );
  }

  /**
   * 분석 진행률 조회 (storyId 기반)
   * 소설 업로드 후 분석 단계에서 사용
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

  /**
   * 전체 스토리 데이터 조회
   * 게임 플레이용 전체 JSON 데이터
   */
  async getFullStoryData(storyId: string): Promise<any> {
    return httpClient.get<any>(`/api/stories/${storyId}/data`);
  }
}

export const storyApi = new StoryApi();




