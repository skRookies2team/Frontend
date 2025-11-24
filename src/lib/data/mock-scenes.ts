/**
 * Mock Scene Data
 * Hardcoded scenes for development and testing
 */

import type { SceneData } from "$lib/types/game-state"

/**
 * Get mock scenes for Lord of the Flies
 */
export function getLordOfTheFliesMockScenes(): SceneData[] {
  return [
    {
      id: "scene_1",
      story: `비행기가 추락한 지 몇 시간이 지났다. 당신은 해변에서 깨어났고, 주변에는 다른 소년들이 보인다. 멀리서 소라를 든 소년이 다가온다. "난 랄프야. 우리 여기 살아남은 사람들을 모아야 해." 그가 말한다.\n\n해변 곳곳에 비행기 잔해가 흩어져 있고, 정글 너머로 연기가 피어오른다. 어른들은 보이지 않는다. 이 섬에는 너희들만 있는 것 같다.\n\n어떻게 하시겠습니까?`,
      choices: [
        {
          id: "choice_1_1",
          text: "랄프를 도와 다른 생존자들을 찾는다",
          impact: {
            relationships: { ralph: 15 },
            trust: { ralph: 10 },
            themeGauges: { civilization: 10, reason: 5 },
          },
        },
        {
          id: "choice_1_2",
          text: "혼자 섬을 탐험하며 먹을 것을 찾는다",
          impact: {
            themeGauges: { civilization: -5, reason: -5 },
          },
        },
        {
          id: "choice_1_3",
          text: "해변에 머물며 구조를 기다린다",
          impact: {
            themeGauges: { civilization: 5, reason: 10 },
          },
        },
      ],
      imagePrompt:
        "Deserted tropical island beach at sunset, plane wreckage scattered on white sand, palm trees in background, dramatic clouds, cinematic lighting",
      characterEvents: [
        {
          characterId: "ralph",
          eventType: "dialogue",
          content: "우리가 힘을 합치면 구조될 때까지 버틸 수 있어!",
        },
      ],
    },
    {
      id: "scene_2",
      story: `랄프의 소라 소리에 모인 소년들은 스무 명 정도다. 나이는 6살부터 12살까지 다양하다. 랄프가 말한다. "우리에게 리더가 필요해. 투표로 정하자."\n\n한쪽에서 붉은 머리의 소년이 나선다. "난 잭이야. 성가대를 이끌고 있었어. 내가 리더가 되어야 해." 그의 눈빛은 강렬하다. 옆에서 안경을 낀 뚱뚱한 소년이 속삭인다. "랄프가 소라를 찾았어. 그가 리더가 되어야 해."\n\n투표가 시작된다. 당신의 선택은?`,
      choices: [
        {
          id: "choice_2_1",
          text: "랄프에게 투표한다",
          impact: {
            relationships: { ralph: 20, jack: -10 },
            trust: { ralph: 15 },
            themeGauges: { civilization: 15, reason: 10 },
          },
        },
        {
          id: "choice_2_2",
          text: "잭에게 투표한다",
          impact: {
            relationships: { ralph: -10, jack: 20 },
            trust: { jack: 15 },
            themeGauges: { civilization: -10, reason: -15 },
          },
        },
        {
          id: "choice_2_3",
          text: "투표를 거부하고 중립을 지킨다",
          impact: {
            relationships: { ralph: -5, jack: -5 },
          },
        },
      ],
      imagePrompt:
        "Group of boys gathered on beach around a conch shell, tropical island setting, some in choir robes, intense atmosphere, golden hour lighting",
      characterEvents: [
        {
          characterId: "piggy",
          eventType: "dialogue",
          content: "랄프가 공정하게 할 거야. 그를 믿어봐.",
        },
        {
          characterId: "jack",
          eventType: "dialogue",
          content: "내가 사냥을 할 수 있어. 우리에게 필요한 건 고기야!",
        },
      ],
    },
    {
      id: "scene_3",
      story: `랄프가 리더로 선출되었다. 잭의 얼굴이 굳지만, 랄프는 그를 사냥대의 리더로 임명한다. "우리의 최우선 과제는 신호불이야. 구조될 수 있게 말이야."\n\n피기가 안경을 닦으며 말한다. "내 안경으로 불을 피울 수 있어!" 그러나 잭이 끼어든다. "불보다 고기가 먼저야. 배가 고파 죽겠어."\n\n소년들이 웅성거린다. 무엇을 먼저 해야 할까?`,
      choices: [
        {
          id: "choice_3_1",
          text: "신호불을 피우는 것이 우선이다",
          impact: {
            relationships: { ralph: 15, piggy: 20 },
            trust: { ralph: 15, piggy: 10 },
            themeGauges: { civilization: 20, reason: 15 },
            flags: { signalFireStarted: true },
          },
        },
        {
          id: "choice_3_2",
          text: "잭과 함께 사냥을 나간다",
          impact: {
            relationships: { jack: 25, ralph: -15 },
            trust: { jack: 20 },
            themeGauges: { civilization: -15, reason: -10 },
            flags: { joinedHunt: true },
          },
        },
        {
          id: "choice_3_3",
          text: "두 팀으로 나누어 동시에 진행한다",
          impact: {
            relationships: { ralph: 5, jack: 5 },
            themeGauges: { civilization: 5 },
          },
        },
      ],
      imagePrompt:
        "Boys on tropical island mountain peak, one holding glasses reflecting sunlight, smoke rising, dense jungle below, dramatic clouds",
      characterEvents: [
        {
          characterId: "ralph",
          eventType: "dialogue",
          content: "지나가는 배가 우리를 볼 수 있어야 해!",
        },
        {
          characterId: "jack",
          eventType: "dialogue",
          content: "사냥은 우리의 본능이야. 강해져야 살아남아.",
        },
      ],
    },
  ]
}

/**
 * Get mock scenes based on novel ID
 */
export function getMockScenesByNovel(novelId: string, sceneIndex: number): SceneData {
  let scenes: SceneData[] = []

  switch (novelId) {
    case "lord-of-the-flies":
      scenes = getLordOfTheFliesMockScenes()
      break
    default:
      scenes = getLordOfTheFliesMockScenes()
  }

  // Return the scene at the index, or the last scene if index is out of bounds
  const index = Math.min(sceneIndex, scenes.length - 1)
  return scenes[index]
}

