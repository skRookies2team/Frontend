import { s as store_get, u as unsubscribe_stores } from "../../../../chunks/index2.js";
import "clsx";
import { a as appConfig, b as isMockMode } from "../../../../chunks/auth.js";
import { a as aiApi } from "../../../../chunks/ai-api.js";
import "../../../../chunks/button.js";
import { p as page } from "../../../../chunks/stores.js";
class GameStateManager {
  currentState = {
    currentNovel: "",
    act: 1,
    scene: 1,
    relationships: {},
    trust: {},
    themeGauges: {},
    flags: {},
    choiceHistory: [],
    startTime: Date.now(),
    lastUpdate: Date.now()
  };
  novelConfig = null;
  // Initialize game with novel config
  initializeGame(novelConfig) {
    console.log("[v0] Initializing game with novel:", novelConfig.title);
    this.novelConfig = novelConfig;
    this.currentState = {
      currentNovel: novelConfig.id,
      act: 1,
      scene: 1,
      relationships: {},
      trust: {},
      themeGauges: {},
      flags: {},
      choiceHistory: [],
      startTime: Date.now(),
      lastUpdate: Date.now(),
      ...novelConfig.initialState
    };
    novelConfig.characters.forEach((character) => {
      this.currentState.relationships[character.id] = 0;
      this.currentState.trust[character.id] = 50;
    });
    novelConfig.themeGauges.forEach((gauge) => {
      this.currentState.themeGauges[gauge.id] = gauge.initialValue;
    });
  }
  // Update scene
  setScene(sceneData) {
    console.log("[v0] Setting new scene:", sceneData.id);
    this.currentState.currentScene = sceneData;
    this.currentState.lastUpdate = Date.now();
  }
  // Process player choice
  processChoice(choice) {
    console.log("[v0] Processing choice:", choice.text);
    const choiceWithTimestamp = { ...choice, timestamp: Date.now() };
    this.currentState.choiceHistory = [...this.currentState.choiceHistory, choiceWithTimestamp];
    if (choice.impact) {
      if (choice.impact.relationships) {
        Object.entries(choice.impact.relationships).forEach(([charId, value]) => {
          const current = this.currentState.relationships[charId] || 0;
          this.currentState.relationships[charId] = Math.max(-100, Math.min(100, current + value));
        });
      }
      if (choice.impact.trust) {
        Object.entries(choice.impact.trust).forEach(([charId, value]) => {
          const current = this.currentState.trust[charId] || 50;
          this.currentState.trust[charId] = Math.max(0, Math.min(100, current + value));
        });
      }
      if (choice.impact.themeGauges) {
        Object.entries(choice.impact.themeGauges).forEach(([gaugeId, value]) => {
          const current = this.currentState.themeGauges[gaugeId] || 0;
          this.currentState.themeGauges[gaugeId] = Math.max(-100, Math.min(100, current + value));
        });
      }
      if (choice.impact.flags) {
        Object.entries(choice.impact.flags).forEach(([flag, value]) => {
          this.currentState.flags[flag] = value;
        });
      }
    }
    this.currentState.scene = this.currentState.scene + 1;
    this.currentState.lastUpdate = Date.now();
  }
  // Update specific state values
  updateState(updates) {
    console.log("[v0] Updating state:", updates);
    this.currentState = { ...this.currentState, ...updates, lastUpdate: Date.now() };
  }
  // Get relationship value
  getRelationship(characterId) {
    return this.currentState.relationships[characterId] || 0;
  }
  // Get trust value
  getTrust(characterId) {
    return this.currentState.trust[characterId] || 50;
  }
  // Get theme gauge value
  getThemeGauge(gaugeId) {
    return this.currentState.themeGauges[gaugeId] || 0;
  }
  // Export state for LLM context
  exportForLLM() {
    return JSON.stringify(
      {
        act: this.currentState.act,
        scene: this.currentState.scene,
        relationships: this.currentState.relationships,
        trust: this.currentState.trust,
        themeGauges: this.currentState.themeGauges,
        flags: this.currentState.flags,
        recentChoices: this.currentState.choiceHistory.slice(-5)
      },
      null,
      2
    );
  }
}
const gsm = new GameStateManager();
function getLordOfTheFliesMockScenes() {
  return [
    {
      id: "scene_1",
      story: `비행기가 추락한 지 몇 시간이 지났다. 당신은 해변에서 깨어났고, 주변에는 다른 소년들이 보인다. 멀리서 소라를 든 소년이 다가온다. "난 랄프야. 우리 여기 살아남은 사람들을 모아야 해." 그가 말한다.

해변 곳곳에 비행기 잔해가 흩어져 있고, 정글 너머로 연기가 피어오른다. 어른들은 보이지 않는다. 이 섬에는 너희들만 있는 것 같다.

어떻게 하시겠습니까?`,
      choices: [
        {
          id: "choice_1_1",
          text: "랄프를 도와 다른 생존자들을 찾는다",
          impact: {
            relationships: { ralph: 15 },
            trust: { ralph: 10 },
            themeGauges: { civilization: 10, reason: 5 }
          }
        },
        {
          id: "choice_1_2",
          text: "혼자 섬을 탐험하며 먹을 것을 찾는다",
          impact: {
            themeGauges: { civilization: -5, reason: -5 }
          }
        },
        {
          id: "choice_1_3",
          text: "해변에 머물며 구조를 기다린다",
          impact: {
            themeGauges: { civilization: 5, reason: 10 }
          }
        }
      ],
      imagePrompt: "Deserted tropical island beach at sunset, plane wreckage scattered on white sand, palm trees in background, dramatic clouds, cinematic lighting",
      characterEvents: [
        {
          characterId: "ralph",
          eventType: "dialogue",
          content: "우리가 힘을 합치면 구조될 때까지 버틸 수 있어!"
        }
      ]
    },
    {
      id: "scene_2",
      story: `랄프의 소라 소리에 모인 소년들은 스무 명 정도다. 나이는 6살부터 12살까지 다양하다. 랄프가 말한다. "우리에게 리더가 필요해. 투표로 정하자."

한쪽에서 붉은 머리의 소년이 나선다. "난 잭이야. 성가대를 이끌고 있었어. 내가 리더가 되어야 해." 그의 눈빛은 강렬하다. 옆에서 안경을 낀 뚱뚱한 소년이 속삭인다. "랄프가 소라를 찾았어. 그가 리더가 되어야 해."

투표가 시작된다. 당신의 선택은?`,
      choices: [
        {
          id: "choice_2_1",
          text: "랄프에게 투표한다",
          impact: {
            relationships: { ralph: 20, jack: -10 },
            trust: { ralph: 15 },
            themeGauges: { civilization: 15, reason: 10 }
          }
        },
        {
          id: "choice_2_2",
          text: "잭에게 투표한다",
          impact: {
            relationships: { ralph: -10, jack: 20 },
            trust: { jack: 15 },
            themeGauges: { civilization: -10, reason: -15 }
          }
        },
        {
          id: "choice_2_3",
          text: "투표를 거부하고 중립을 지킨다",
          impact: {
            relationships: { ralph: -5, jack: -5 }
          }
        }
      ],
      imagePrompt: "Group of boys gathered on beach around a conch shell, tropical island setting, some in choir robes, intense atmosphere, golden hour lighting",
      characterEvents: [
        {
          characterId: "piggy",
          eventType: "dialogue",
          content: "랄프가 공정하게 할 거야. 그를 믿어봐."
        },
        {
          characterId: "jack",
          eventType: "dialogue",
          content: "내가 사냥을 할 수 있어. 우리에게 필요한 건 고기야!"
        }
      ]
    },
    {
      id: "scene_3",
      story: `랄프가 리더로 선출되었다. 잭의 얼굴이 굳지만, 랄프는 그를 사냥대의 리더로 임명한다. "우리의 최우선 과제는 신호불이야. 구조될 수 있게 말이야."

피기가 안경을 닦으며 말한다. "내 안경으로 불을 피울 수 있어!" 그러나 잭이 끼어든다. "불보다 고기가 먼저야. 배가 고파 죽겠어."

소년들이 웅성거린다. 무엇을 먼저 해야 할까?`,
      choices: [
        {
          id: "choice_3_1",
          text: "신호불을 피우는 것이 우선이다",
          impact: {
            relationships: { ralph: 15, piggy: 20 },
            trust: { ralph: 15, piggy: 10 },
            themeGauges: { civilization: 20, reason: 15 },
            flags: { signalFireStarted: true }
          }
        },
        {
          id: "choice_3_2",
          text: "잭과 함께 사냥을 나간다",
          impact: {
            relationships: { jack: 25, ralph: -15 },
            trust: { jack: 20 },
            themeGauges: { civilization: -15, reason: -10 },
            flags: { joinedHunt: true }
          }
        },
        {
          id: "choice_3_3",
          text: "두 팀으로 나누어 동시에 진행한다",
          impact: {
            relationships: { ralph: 5, jack: 5 },
            themeGauges: { civilization: 5 }
          }
        }
      ],
      imagePrompt: "Boys on tropical island mountain peak, one holding glasses reflecting sunlight, smoke rising, dense jungle below, dramatic clouds",
      characterEvents: [
        {
          characterId: "ralph",
          eventType: "dialogue",
          content: "지나가는 배가 우리를 볼 수 있어야 해!"
        },
        {
          characterId: "jack",
          eventType: "dialogue",
          content: "사냥은 우리의 본능이야. 강해져야 살아남아."
        }
      ]
    }
  ];
}
function getMockScenesByNovel(novelId, sceneIndex) {
  let scenes = [];
  switch (novelId) {
    case "lord-of-the-flies":
      scenes = getLordOfTheFliesMockScenes();
      break;
    default:
      scenes = getLordOfTheFliesMockScenes();
  }
  const index = Math.min(sceneIndex, scenes.length - 1);
  return scenes[index];
}
class MockImageGenerator {
  async generateImage(prompt) {
    console.log("[Mock] Generating placeholder image for prompt:", prompt);
    const encodedPrompt = encodeURIComponent(prompt);
    return `/placeholder.svg?height=800&width=1200&query=${encodedPrompt}`;
  }
  async generateCharacterPortrait(characterName, description) {
    console.log("[Mock] Generating placeholder portrait for:", characterName);
    const prompt = `Portrait of ${characterName}, ${description}, book illustration style`;
    const encodedPrompt = encodeURIComponent(prompt);
    return `/placeholder.svg?height=400&width=400&query=${encodedPrompt}`;
  }
}
class MockStoryGenerator {
  imageGenerator = new MockImageGenerator();
  async generateScene(gameState, novelContext, previousChoice) {
    console.log("[Mock] Generating scene from mock data...");
    const sceneData = getMockScenesByNovel(
      gameState.currentNovel,
      gameState.scene - 1
    );
    if (sceneData.imagePrompt) {
      sceneData.imageUrl = await this.imageGenerator.generateImage(sceneData.imagePrompt);
    }
    return sceneData;
  }
}
const characterKnowledgeBase = {
  // Lord of the Flies Characters
  ralph: [
    "나는 리더십과 질서를 믿어요.",
    "우리는 신호불을 유지해야 구조될 수 있어요.",
    "민주적으로 결정하는 것이 중요해요.",
    "우리는 여전히 문명인이에요. 야만인이 아니에요.",
    "어른들이 우리를 구하러 올 거예요."
  ],
  jack: [
    "사냥이 가장 중요해요. 우리는 고기가 필요해요.",
    "강한 자가 살아남아요.",
    "규칙보다 힘이 중요해요.",
    "이 섬에서 우리는 자유로워요.",
    "사냥은 짜릿해요. 우리의 본능이죠."
  ],
  piggy: [
    "과학적으로 생각해야 해요.",
    "제 안경으로 불을 피울 수 있어요.",
    "어른들의 방식을 따라야 해요.",
    "이름 목록을 만들어야 해요. 체계적으로 해야죠.",
    "소라를 든 사람만 말할 수 있어요. 그게 규칙이에요."
  ],
  simon: [
    "때로는 혼자 생각할 시간이 필요해요.",
    "괴물은 우리 안에 있는지도 몰라요.",
    "모든 생명은 소중해요.",
    "진실을 직시해야 해요.",
    "서로를 도와야 해요."
  ],
  // Crime and Punishment Characters
  raskolnikov: [
    "나는 특별한 사람이다. 평범한 도덕률에 얽매이지 않는다.",
    "목적이 수단을 정당화할 수 있을까?",
    "죄책감이 나를 짓누르고 있다.",
    "나는 초인이 될 수 있을까, 아니면 그저 범죄자일 뿐일까?"
  ],
  sonya: [
    "신은 모든 것을 용서하신다.",
    "고통을 통해 구원을 얻을 수 있어요.",
    "당신은 혼자가 아니에요. 제가 함께할게요.",
    "진실을 말하는 것만이 자유를 얻는 길이에요."
  ],
  porfiry: [
    "범죄자는 항상 흔적을 남긴다.",
    "심리적 압박이 가장 효과적인 수사 방법이다.",
    "진실은 결국 드러나게 되어 있다."
  ],
  // The Great Gatsby Characters
  gatsby: [
    "과거를 되돌릴 수 있다고 믿어요.",
    "데이지를 위해서라면 무엇이든 할 수 있어요.",
    "꿈을 포기하지 마세요.",
    "부는 모든 것을 가능하게 만들어요."
  ],
  nick: [
    "나는 관찰자로 남고 싶어요.",
    "정직함이 가장 중요해요.",
    "동부의 화려함 뒤에 공허함이 있어요."
  ],
  daisy: [
    "돈이 모든 문제를 해결해줘요.",
    "나는 안락함과 안정을 원해요.",
    "과거는 과거일 뿐이에요."
  ]
};
function getCharacterKnowledge(characterId) {
  return characterKnowledgeBase[characterId] || [];
}
class MockCharacterChat {
  async getCharacterResponse(character, gameState, userQuery) {
    console.log("[Mock] Getting character response from mock data:", character.name);
    const knowledge = getCharacterKnowledge(character.id);
    const relationship = gameState.relationships[character.id] || 0;
    const trust = gameState.trust[character.id] || 50;
    if (userQuery) {
      return this.generateQueryResponse(character, knowledge, relationship, trust, userQuery);
    } else {
      return this.generateContextualAdvice(character, knowledge, gameState, relationship, trust);
    }
  }
  generateQueryResponse(character, knowledge, relationship, trust, query) {
    const relevantKnowledge = knowledge[Math.floor(Math.random() * knowledge.length)];
    if (relationship > 30 && trust > 60) {
      return `${character.name}: ${relevantKnowledge} 당신을 믿어요.`;
    } else if (relationship < -30 || trust < 40) {
      return `${character.name}: ${relevantKnowledge} 하지만 당신이 올바른 선택을 할지 모르겠어요.`;
    } else {
      return `${character.name}: ${relevantKnowledge}`;
    }
  }
  generateContextualAdvice(character, knowledge, gameState, relationship, trust) {
    const advice = knowledge[Math.floor(Math.random() * knowledge.length)];
    const civilization = gameState.themeGauges["civilization"] || 0;
    const reason = gameState.themeGauges["reason"] || 0;
    if (character.id === "ralph" && civilization < -30) {
      return `${character.name}: 우리가 너무 야만적으로 변하고 있어요... ${advice}`;
    } else if (character.id === "jack" && civilization > 30) {
      return `${character.name}: 규칙에 너무 얽매이지 마세요. ${advice}`;
    } else if (character.id === "piggy" && reason < -30) {
      return `${character.name}: 더 이성적으로 생각해야 해요! ${advice}`;
    }
    return `${character.name}: ${advice}`;
  }
}
class OpenAIClient {
  apiKey;
  baseURL;
  constructor(apiKey) {
    this.apiKey = apiKey || appConfig.llm.apiKey;
    this.baseURL = "https://api.openai.com/v1";
  }
  async chat(request) {
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: request.model || appConfig.llm.model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens,
        response_format: request.response_format
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
    }
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  }
}
class AnthropicClient {
  apiKey;
  baseURL;
  constructor(apiKey) {
    this.apiKey = apiKey || appConfig.llm.apiKey;
    this.baseURL = "https://api.anthropic.com/v1";
  }
  async chat(request) {
    const systemMessage = request.messages.find((m) => m.role === "system")?.content || "";
    const messages = request.messages.filter((m) => m.role !== "system").map((m) => ({
      role: m.role,
      content: m.content
    }));
    const response = await fetch(`${this.baseURL}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: request.model || appConfig.llm.model,
        messages,
        system: systemMessage,
        max_tokens: request.max_tokens || 4096,
        temperature: request.temperature || 0.7
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Anthropic API Error: ${error.error?.message || response.statusText}`);
    }
    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: {
        prompt_tokens: data.usage?.input_tokens || 0,
        completion_tokens: data.usage?.output_tokens || 0,
        total_tokens: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      }
    };
  }
}
function createLLMClient() {
  switch (appConfig.llm.provider) {
    case "openai":
      return new OpenAIClient();
    case "anthropic":
      return new AnthropicClient();
    default:
      return new OpenAIClient();
  }
}
class OpenAIImageClient {
  apiKey;
  baseURL;
  constructor(apiKey) {
    this.apiKey = apiKey || appConfig.image.apiKey;
    this.baseURL = "https://api.openai.com/v1";
  }
  async generate(request) {
    const response = await fetch(`${this.baseURL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: request.model || appConfig.image.model,
        prompt: request.prompt,
        size: request.size || "1024x1024",
        quality: request.quality || "standard",
        n: request.n || 1
      })
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI Image API Error: ${error.error?.message || response.statusText}`);
    }
    const data = await response.json();
    return {
      url: data.data[0].url,
      revisedPrompt: data.data[0].revised_prompt
    };
  }
}
class StabilityAIClient {
  apiKey;
  baseURL;
  constructor(apiKey) {
    this.apiKey = apiKey || appConfig.image.apiKey;
    this.baseURL = "https://api.stability.ai/v1";
  }
  async generate(request) {
    throw new Error("Stability AI client not yet implemented");
  }
}
class ReplicateClient {
  apiKey;
  baseURL;
  constructor(apiKey) {
    this.apiKey = apiKey || appConfig.image.apiKey;
    this.baseURL = "https://api.replicate.com/v1";
  }
  async generate(request) {
    throw new Error("Replicate client not yet implemented");
  }
}
function createImageClient() {
  switch (appConfig.image.provider) {
    case "openai":
      return new OpenAIImageClient();
    case "stability":
      return new StabilityAIClient();
    case "replicate":
      return new ReplicateClient();
    default:
      return new OpenAIImageClient();
  }
}
class APIImageGenerator {
  imageClient = createImageClient();
  useBackend = appConfig.image.provider === "backend";
  async generateImage(prompt) {
    console.log("[API] Generating image using", this.useBackend ? "Backend-Relay" : "Direct API", "for prompt:", prompt);
    try {
      if (this.useBackend) {
        const response = await aiApi.generateImage({
          nodeText: prompt,
          episodeTitle: "",
          mood: "atmospheric",
          style: "cinematic"
        });
        return response.imageUrl;
      } else {
        const response = await this.imageClient.generate({
          prompt: this.enhancePrompt(prompt),
          size: "1792x1024",
          quality: "standard"
        });
        return response.url;
      }
    } catch (error) {
      console.error("[API] Error generating image:", error);
      const encodedPrompt = encodeURIComponent(prompt);
      return `/placeholder.svg?height=800&width=1200&query=${encodedPrompt}`;
    }
  }
  async generateCharacterPortrait(characterName, description) {
    console.log("[API] Generating character portrait using", this.useBackend ? "Backend-Relay" : "Direct API", "for:", characterName);
    const prompt = `Portrait of ${characterName}, ${description}, book illustration style, detailed, professional`;
    try {
      if (this.useBackend) {
        const response = await aiApi.generateImage({
          nodeText: prompt,
          episodeTitle: "",
          characters: [characterName],
          mood: "portrait",
          style: "book illustration"
        });
        return response.imageUrl;
      } else {
        const response = await this.imageClient.generate({
          prompt,
          size: "1024x1024",
          quality: "standard"
        });
        return response.url;
      }
    } catch (error) {
      console.error("[API] Error generating portrait:", error);
      const encodedPrompt = encodeURIComponent(prompt);
      return `/placeholder.svg?height=400&width=400&query=${encodedPrompt}`;
    }
  }
  /**
   * Enhance prompt with quality and style keywords
   */
  enhancePrompt(prompt) {
    return `${prompt}, cinematic, highly detailed, professional photography, atmospheric lighting, 8k quality`;
  }
}
class APIStoryGenerator {
  llmClient = createLLMClient();
  imageGenerator = new APIImageGenerator();
  async generateScene(gameState, novelContext, previousChoice) {
    console.log("[API] Generating scene using LLM...");
    const prompt = this.buildPrompt(gameState, novelContext, previousChoice);
    try {
      const response = await this.llmClient.chat({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: "You are a storyteller AI for an interactive novel simulator. Generate scenes in valid JSON format."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2e3,
        response_format: { type: "json_object" }
      });
      const sceneData = JSON.parse(response.content);
      if (sceneData.imagePrompt) {
        sceneData.imageUrl = await this.imageGenerator.generateImage(sceneData.imagePrompt);
      }
      return sceneData;
    } catch (error) {
      console.error("[API] Error generating scene:", error);
      throw new Error(`Failed to generate scene: ${error}`);
    }
  }
  buildPrompt(gameState, novelContext, previousChoice) {
    return `
You are a storyteller AI for an interactive novel simulator.

Novel Context: ${novelContext}

Current Game State:
- Act: ${gameState.act}, Scene: ${gameState.scene}
- Theme Gauges: ${JSON.stringify(gameState.themeGauges)}
- Relationships: ${JSON.stringify(gameState.relationships)}
- Trust Levels: ${JSON.stringify(gameState.trust)}
- Active Flags: ${JSON.stringify(gameState.flags)}

${previousChoice ? `Previous Choice: ${previousChoice.text}` : "This is the beginning of the story."}

Generate the next scene in JSON format with:
{
  "id": "unique_scene_id",
  "story": "narrative text (2-3 paragraphs)",
  "choices": [
    {
      "id": "choice_1",
      "text": "choice description",
      "impact": {
        "relationships": { "character_id": number },
        "trust": { "character_id": number },
        "themeGauges": { "gauge_id": number },
        "flags": { "flag_name": boolean }
      }
    }
  ],
  "imagePrompt": "description for AI image generation",
  "characterEvents": [
    {
      "characterId": "character_id",
      "eventType": "dialogue",
      "content": "what the character says"
    }
  ]
}

Make choices meaningful and reflect their impacts on the game state.
The story should be engaging, immersive, and consistent with the novel's themes.
Provide 3-4 choices that offer different paths and consequences.
`.trim();
  }
}
class APICharacterChat {
  llmClient = createLLMClient();
  useBackend = appConfig.apiMode === "production";
  async getCharacterResponse(character, gameState, userQuery) {
    console.log("[API] Getting character response using", this.useBackend ? "Backend-Relay" : "Direct LLM", ":", character.name);
    try {
      if (this.useBackend) {
        const response = await aiApi.sendChatMessage({
          characterId: character.id,
          userMessage: userQuery || "현재 상황에 대해 조언해주세요.",
          gameContext: {
            currentEpisode: `Act ${gameState.act}`,
            currentNode: `Scene ${gameState.scene}`,
            gaugeStates: gameState.themeGauges,
            relationships: gameState.relationships
          }
        });
        return `${character.name}: ${response.aiMessage}`;
      } else {
        const relationship = gameState.relationships[character.id] || 0;
        const trust = gameState.trust[character.id] || 50;
        const knowledge = getCharacterKnowledge(character.id);
        const prompt = this.buildPrompt(character, gameState, relationship, trust, knowledge, userQuery);
        const response = await this.llmClient.chat({
          model: "gpt-4-turbo-preview",
          messages: [
            {
              role: "system",
              content: this.getSystemPrompt(character)
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        return `${character.name}: ${response.content}`;
      }
    } catch (error) {
      console.error("[API] Error getting character response:", error);
      throw new Error(`Failed to get character response: ${error}`);
    }
  }
  /**
   * 캐릭터를 RAG 시스템에 인덱싱 (Backend-Relay 사용 시)
   */
  async indexCharacter(character, novelContext) {
    if (!this.useBackend) {
      console.log("[API] Skipping character indexing - not using backend mode");
      return true;
    }
    try {
      console.log("[API] Indexing character for RAG:", character.name);
      return await aiApi.indexCharacter({
        characterId: character.id,
        name: character.name,
        aliases: [],
        description: character.description,
        relationships: [],
        novelContext
      });
    } catch (error) {
      console.error("[API] Error indexing character:", error);
      return false;
    }
  }
  getSystemPrompt(character) {
    return `You are ${character.name} from the novel. You must respond in character.

Character Description: ${character.description}
Personality: ${character.personality}

Your responses should:
1. Stay true to the character's personality and beliefs
2. Reference your knowledge and experiences from the story
3. Be influenced by the player's relationship with you
4. Be concise (1-3 sentences)
5. Be in Korean language
6. DO NOT include your name in the response (it will be added automatically)
`.trim();
  }
  buildPrompt(character, gameState, relationship, trust, knowledge, userQuery) {
    const relationshipStatus = relationship > 30 ? "매우 좋음" : relationship > 0 ? "좋음" : relationship > -30 ? "중립" : "나쁨";
    const trustStatus = trust > 70 ? "높음" : trust > 40 ? "보통" : "낮음";
    return `
Current Game State:
- Act: ${gameState.act}, Scene: ${gameState.scene}
- Your relationship with the player: ${relationshipStatus} (${relationship})
- Your trust in the player: ${trustStatus} (${trust})
- Theme Gauges: ${JSON.stringify(gameState.themeGauges)}

Your Knowledge Base:
${knowledge.map((k, i) => `${i + 1}. ${k}`).join("\n")}

${userQuery ? `Player's Question: ${userQuery}` : "The player is seeking your advice on the current situation."}

Respond as ${character.name} would, considering the relationship and trust levels.
Keep your response natural, in-character, and helpful.
`.trim();
  }
}
class ServiceFactory {
  storyGeneratorInstance = null;
  characterChatInstance = null;
  imageGeneratorInstance = null;
  /**
   * Get Story Generator instance (singleton)
   */
  getStoryGenerator() {
    if (!this.storyGeneratorInstance) {
      this.storyGeneratorInstance = isMockMode() ? new MockStoryGenerator() : new APIStoryGenerator();
      console.log(`[ServiceFactory] Created ${isMockMode() ? "Mock" : "API"} Story Generator`);
    }
    return this.storyGeneratorInstance;
  }
  /**
   * Get Character Chat instance (singleton)
   */
  getCharacterChat() {
    if (!this.characterChatInstance) {
      this.characterChatInstance = isMockMode() ? new MockCharacterChat() : new APICharacterChat();
      console.log(`[ServiceFactory] Created ${isMockMode() ? "Mock" : "API"} Character Chat`);
    }
    return this.characterChatInstance;
  }
  /**
   * Get Image Generator instance (singleton)
   */
  getImageGenerator() {
    if (!this.imageGeneratorInstance) {
      this.imageGeneratorInstance = isMockMode() ? new MockImageGenerator() : new APIImageGenerator();
      console.log(`[ServiceFactory] Created ${isMockMode() ? "Mock" : "API"} Image Generator`);
    }
    return this.imageGeneratorInstance;
  }
  /**
   * Reset all service instances (useful for testing or switching modes)
   */
  reset() {
    this.storyGeneratorInstance = null;
    this.characterChatInstance = null;
    this.imageGeneratorInstance = null;
    console.log("[ServiceFactory] All services reset");
  }
}
const serviceFactory = new ServiceFactory();
function getStoryGenerator() {
  return serviceFactory.getStoryGenerator();
}
function getCharacterChat() {
  return serviceFactory.getCharacterChat();
}
getStoryGenerator();
getCharacterChat();
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    store_get($$store_subs ??= {}, "$page", page).params.novel_id;
    gsm.currentState;
    {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-screen svelte-dnevmq"><div class="spinner svelte-dnevmq"></div> <p class="loading-text svelte-dnevmq">소설을 찾을 수 없습니다...</p></div>`);
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
