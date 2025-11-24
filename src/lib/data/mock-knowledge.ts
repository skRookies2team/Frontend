/**
 * Mock Character Knowledge Base
 * Hardcoded character knowledge for development and testing
 */

/**
 * Character knowledge database
 */
export const characterKnowledgeBase: Record<string, string[]> = {
  // Lord of the Flies Characters
  ralph: [
    "나는 리더십과 질서를 믿어요.",
    "우리는 신호불을 유지해야 구조될 수 있어요.",
    "민주적으로 결정하는 것이 중요해요.",
    "우리는 여전히 문명인이에요. 야만인이 아니에요.",
    "어른들이 우리를 구하러 올 거예요.",
  ],

  jack: [
    "사냥이 가장 중요해요. 우리는 고기가 필요해요.",
    "강한 자가 살아남아요.",
    "규칙보다 힘이 중요해요.",
    "이 섬에서 우리는 자유로워요.",
    "사냥은 짜릿해요. 우리의 본능이죠.",
  ],

  piggy: [
    "과학적으로 생각해야 해요.",
    "제 안경으로 불을 피울 수 있어요.",
    "어른들의 방식을 따라야 해요.",
    "이름 목록을 만들어야 해요. 체계적으로 해야죠.",
    "소라를 든 사람만 말할 수 있어요. 그게 규칙이에요.",
  ],

  simon: [
    "때로는 혼자 생각할 시간이 필요해요.",
    "괴물은 우리 안에 있는지도 몰라요.",
    "모든 생명은 소중해요.",
    "진실을 직시해야 해요.",
    "서로를 도와야 해요.",
  ],

  // Crime and Punishment Characters
  raskolnikov: [
    "나는 특별한 사람이다. 평범한 도덕률에 얽매이지 않는다.",
    "목적이 수단을 정당화할 수 있을까?",
    "죄책감이 나를 짓누르고 있다.",
    "나는 초인이 될 수 있을까, 아니면 그저 범죄자일 뿐일까?",
  ],

  sonya: [
    "신은 모든 것을 용서하신다.",
    "고통을 통해 구원을 얻을 수 있어요.",
    "당신은 혼자가 아니에요. 제가 함께할게요.",
    "진실을 말하는 것만이 자유를 얻는 길이에요.",
  ],

  porfiry: [
    "범죄자는 항상 흔적을 남긴다.",
    "심리적 압박이 가장 효과적인 수사 방법이다.",
    "진실은 결국 드러나게 되어 있다.",
  ],

  // The Great Gatsby Characters
  gatsby: [
    "과거를 되돌릴 수 있다고 믿어요.",
    "데이지를 위해서라면 무엇이든 할 수 있어요.",
    "꿈을 포기하지 마세요.",
    "부는 모든 것을 가능하게 만들어요.",
  ],

  nick: [
    "나는 관찰자로 남고 싶어요.",
    "정직함이 가장 중요해요.",
    "동부의 화려함 뒤에 공허함이 있어요.",
  ],

  daisy: [
    "돈이 모든 문제를 해결해줘요.",
    "나는 안락함과 안정을 원해요.",
    "과거는 과거일 뿐이에요.",
  ],
}

/**
 * Get character knowledge by ID
 */
export function getCharacterKnowledge(characterId: string): string[] {
  return characterKnowledgeBase[characterId] || []
}

