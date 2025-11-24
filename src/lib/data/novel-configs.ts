import type { NovelConfig } from "$lib/types/game-state"

export const lordOfTheFlies: NovelConfig = {
  id: "lord-of-the-flies",
  title: "파리대왕",
  description: "무인도에 고립된 소년들의 문명과 야만 사이의 갈등",
  author: "윌리엄 골딩",
  category: "추천",
  difficulty: "중급",
  thumbnail: "/boys-stranded-on-tropical-island-survival.jpg",

  characters: [
    {
      id: "ralph",
      name: "랄프",
      description: "리더십과 이성을 대표하는 소년",
      personality: "책임감 있고 민주적이며, 질서를 중요시한다.",
    },
    {
      id: "jack",
      name: "잭",
      description: "본능과 권력욕을 대표하는 소년",
      personality: "공격적이고 카리스마 있으며, 사냥과 힘을 숭배한다.",
    },
    {
      id: "piggy",
      name: "피기",
      description: "지성과 문명을 대표하는 소년",
      personality: "논리적이고 신중하며, 어른들의 세계를 그리워한다.",
    },
    {
      id: "simon",
      name: "사이먼",
      description: "순수함과 통찰력을 가진 소년",
      personality: "조용하고 사려 깊으며, 진실을 추구한다.",
    },
  ],

  themeGauges: [
    {
      id: "civilization",
      name: "문명 vs 야만",
      label: "문명",
      leftLabel: "야만",
      rightLabel: "문명",
      initialValue: 40,
      description: "소년들의 사회가 문명적 질서를 유지하는지, 야만으로 퇴보하는지",
    },
    {
      id: "reason",
      name: "이성 vs 본능",
      label: "이성",
      leftLabel: "본능",
      rightLabel: "이성",
      initialValue: 30,
      description: "이성적 판단과 원초적 본능 사이의 균형",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: {
      ralph: 0,
      jack: 0,
      piggy: 0,
      simon: 0,
    },
    trust: {
      ralph: 70,
      jack: 50,
      piggy: 60,
      simon: 65,
    },
    themeGauges: {
      civilization: 40,
      reason: 30,
    },
    flags: {},
  },
}

export const crimeAndPunishment: NovelConfig = {
  id: "crime-and-punishment",
  title: "죄와 벌",
  description: "가난한 대학생 라스콜리니코프의 살인과 그 후의 심리적 갈등",
  author: "표도르 도스토옙스키",
  category: "랭킹",
  difficulty: "고급",
  thumbnail: "/dark-19th-century-russian-street-atmospheric.jpg",

  characters: [
    {
      id: "raskolnikov",
      name: "라스콜리니코프",
      description: "주인공, 가난한 대학생",
      personality: "지적이고 자존심이 강하며, 극단적인 사상을 가지고 있다.",
    },
    {
      id: "sonya",
      name: "소냐",
      description: "창녀이지만 순수한 마음을 가진 여성",
      personality: "희생적이고 종교적이며, 진정한 사랑을 가지고 있다.",
    },
    {
      id: "porfiry",
      name: "포르피리",
      description: "수사관",
      personality: "날카롭고 통찰력 있으며, 심리전에 능하다.",
    },
  ],

  themeGauges: [
    {
      id: "guilt",
      name: "죄의식 vs 정당화",
      label: "죄의식",
      leftLabel: "정당화",
      rightLabel: "죄의식",
      initialValue: 50,
      description: "범죄를 정당화하려는 욕구와 죄의식 사이의 갈등",
    },
    {
      id: "redemption",
      name: "타락 vs 구원",
      label: "구원",
      leftLabel: "타락",
      rightLabel: "구원",
      initialValue: 30,
      description: "영적 타락과 구원의 가능성",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: { raskolnikov: 0, sonya: 0, porfiry: 0 },
    trust: { raskolnikov: 50, sonya: 70, porfiry: 40 },
    themeGauges: { guilt: 50, redemption: 30 },
    flags: {},
  },
}

export const theGreatGatsby: NovelConfig = {
  id: "the-great-gatsby",
  title: "위대한 개츠비",
  description: "1920년대 미국, 부와 사랑을 쫓는 신비한 남자 개츠비의 이야기",
  author: "F. 스콧 피츠제럴드",
  category: "오늘 신작",
  difficulty: "초급",
  thumbnail: "/1920s-art-deco-mansion-gatsby-party-luxury.jpg",

  characters: [
    {
      id: "gatsby",
      name: "제이 개츠비",
      description: "신비한 백만장자",
      personality: "낭만적이고 집착적이며, 꿈을 좇는다.",
    },
    {
      id: "nick",
      name: "닉 캐러웨이",
      description: "화자이자 관찰자",
      personality: "정직하고 관찰력이 뛰어나며, 중립적이다.",
    },
    {
      id: "daisy",
      name: "데이지 뷰캐넌",
      description: "개츠비가 사랑하는 여인",
      personality: "매력적이지만 피상적이며, 안락함을 추구한다.",
    },
  ],

  themeGauges: [
    {
      id: "dream",
      name: "꿈 vs 현실",
      label: "꿈",
      leftLabel: "현실",
      rightLabel: "꿈",
      initialValue: 60,
      description: "아메리칸 드림과 냉혹한 현실 사이",
    },
    {
      id: "morality",
      name: "도덕 vs 욕망",
      label: "도덕",
      leftLabel: "욕망",
      rightLabel: "도덕",
      initialValue: 40,
      description: "도덕적 가치와 개인적 욕망의 충돌",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: { gatsby: 0, nick: 0, daisy: 0 },
    trust: { gatsby: 60, nick: 80, daisy: 50 },
    themeGauges: { dream: 60, morality: 40 },
    flags: {},
  },
}

export const metamorphosis: NovelConfig = {
  id: "metamorphosis",
  title: "변신",
  description: "어느 날 아침 벌레로 변해버린 그레고르 잠자의 비극",
  author: "프란츠 카프카",
  category: "일상",
  difficulty: "중급",
  thumbnail: "/dark-room-kafka-metamorphosis-surreal.jpg",

  characters: [
    {
      id: "gregor",
      name: "그레고르",
      description: "벌레로 변한 주인공",
      personality: "책임감 있고 가족을 사랑하지만, 소외되고 고립된다.",
    },
    {
      id: "grete",
      name: "그레테",
      description: "그레고르의 여동생",
      personality: "처음엔 동정적이나 점차 냉담해진다.",
    },
    {
      id: "father",
      name: "아버지",
      description: "가부장적인 아버지",
      personality: "권위적이고 엄격하며, 그레고르를 두려워한다.",
    },
  ],

  themeGauges: [
    {
      id: "humanity",
      name: "인간성 vs 비인간성",
      label: "인간성",
      leftLabel: "비인간",
      rightLabel: "인간성",
      initialValue: 50,
      description: "인간으로서의 정체성 유지",
    },
    {
      id: "isolation",
      name: "소통 vs 고립",
      label: "소통",
      leftLabel: "고립",
      rightLabel: "소통",
      initialValue: 20,
      description: "가족 및 사회와의 관계",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: { gregor: 0, grete: 0, father: 0 },
    trust: { gregor: 50, grete: 60, father: 30 },
    themeGauges: { humanity: 50, isolation: 20 },
    flags: {},
  },
}

export const prideAndPrejudice: NovelConfig = {
  id: "pride-and-prejudice",
  title: "오만과 편견",
  description: "엘리자베스 베넷과 피츠윌리엄 다아시의 사랑과 성장",
  author: "제인 오스틴",
  category: "일상",
  difficulty: "초급",
  thumbnail: "/regency-era-ballroom-england-elegant.jpg",

  characters: [
    {
      id: "elizabeth",
      name: "엘리자베스",
      description: "지적이고 독립적인 여성",
      personality: "영리하고 재치 있으며, 편견을 극복한다.",
    },
    {
      id: "darcy",
      name: "다아시",
      description: "부유하고 오만한 신사",
      personality: "고상하지만 거만하며, 진정한 사랑을 배운다.",
    },
    {
      id: "jane",
      name: "제인",
      description: "엘리자베스의 언니",
      personality: "온화하고 아름다우며, 긍정적이다.",
    },
  ],

  themeGauges: [
    {
      id: "pride",
      name: "오만 vs 겸손",
      label: "겸손",
      leftLabel: "오만",
      rightLabel: "겸손",
      initialValue: 50,
      description: "자존심과 겸손함의 균형",
    },
    {
      id: "prejudice",
      name: "편견 vs 이해",
      label: "이해",
      leftLabel: "편견",
      rightLabel: "이해",
      initialValue: 50,
      description: "선입견을 극복하고 진실을 보는 능력",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: { elizabeth: 0, darcy: 0, jane: 0 },
    trust: { elizabeth: 70, darcy: 40, jane: 90 },
    themeGauges: { pride: 50, prejudice: 50 },
    flags: {},
  },
}

export const nineteenEightyFour: NovelConfig = {
  id: "1984",
  title: "1984",
  description: "전체주의 사회에서 진실과 자유를 위해 싸우는 윈스턴의 이야기",
  author: "조지 오웰",
  category: "추리",
  difficulty: "고급",
  thumbnail: "/dystopian-city-surveillance-big-brother-1984.jpg",

  characters: [
    {
      id: "winston",
      name: "윈스턴",
      description: "당에 의문을 품는 공무원",
      personality: "회의적이고 반항적이며, 자유를 갈망한다.",
    },
    {
      id: "julia",
      name: "줄리아",
      description: "윈스턴의 연인",
      personality: "실용적이고 쾌락적이며, 체제에 순응하는 척한다.",
    },
    {
      id: "obrien",
      name: "오브라이언",
      description: "당의 내부 조직원",
      personality: "지적이고 카리스마 있으며, 냉혹하다.",
    },
  ],

  themeGauges: [
    {
      id: "freedom",
      name: "억압 vs 자유",
      label: "자유",
      leftLabel: "억압",
      rightLabel: "자유",
      initialValue: 30,
      description: "전체주의 통제와 개인의 자유",
    },
    {
      id: "truth",
      name: "거짓 vs 진실",
      label: "진실",
      leftLabel: "거짓",
      rightLabel: "진실",
      initialValue: 40,
      description: "당의 거짓과 객관적 진실",
    },
  ],

  initialState: {
    act: 1,
    scene: 1,
    relationships: { winston: 0, julia: 0, obrien: 0 },
    trust: { winston: 50, julia: 60, obrien: 30 },
    themeGauges: { freedom: 30, truth: 40 },
    flags: {},
  },
}

export const novels: NovelConfig[] = [
  lordOfTheFlies,
  crimeAndPunishment,
  theGreatGatsby,
  metamorphosis,
  prideAndPrejudice,
  nineteenEightyFour,
]

export const categories = ["전체", "추천", "랭킹", "오늘 신작", "교육", "판타지", "추리", "액션", "일상"]
