import axios from 'axios';
import { AIResponse } from '../types';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'meta-llama/Llama-2-7b-chat-hf';

export class AIService {
  private useAnthropic: boolean;

  constructor() {
    this.useAnthropic = !!ANTHROPIC_API_KEY;
  }

  async generateNPCResponse(
    context: {
      npcName: string;
      npcDescription: string;
      npcPersonality: string;
      playerAction: string;
      playerName: string;
      storyContext: string;
      previousMessages: string[];
    }
  ): Promise<AIResponse> {
    const prompt = this.buildNPCPrompt(context);

    try {
      if (this.useAnthropic) {
        return await this.callAnthropic(prompt, 'dialogue');
      } else if (HUGGINGFACE_API_KEY) {
        return await this.callHuggingFace(prompt, 'dialogue');
      } else {
        return this.getFallbackResponse(context.npcName);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackResponse(context.npcName);
    }
  }

  async generateNarration(
    context: {
      storyContext: string;
      playerActions: string[];
      currentScene: string;
    }
  ): Promise<AIResponse> {
    const prompt = this.buildNarrationPrompt(context);

    try {
      if (this.useAnthropic) {
        return await this.callAnthropic(prompt, 'narration');
      } else if (HUGGINGFACE_API_KEY) {
        return await this.callHuggingFace(prompt, 'narration');
      } else {
        return this.getFallbackNarration();
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackNarration();
    }
  }

  async generateCharacter(
    theme?: string
  ): Promise<{
    name: string;
    description: string;
    backstory: string;
    personality: string;
  }> {
    const prompt = this.buildCharacterPrompt(theme);

    try {
      let response: string;

      if (this.useAnthropic) {
        const result = await this.callAnthropic(prompt, 'narration');
        response = result.content;
      } else if (HUGGINGFACE_API_KEY) {
        const result = await this.callHuggingFace(prompt, 'narration');
        response = result.content;
      } else {
        return this.getFallbackCharacter();
      }

      return this.parseCharacterResponse(response);
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getFallbackCharacter();
    }
  }

  private async callAnthropic(prompt: string, type: 'narration' | 'dialogue'): Promise<AIResponse> {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-sonnet-20240229',
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
      }
    );

    return {
      content: response.data.content[0].text,
      type,
    };
  }

  private async callHuggingFace(prompt: string, type: 'narration' | 'dialogue'): Promise<AIResponse> {
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        },
      }
    );

    const generatedText = Array.isArray(response.data)
      ? response.data[0].generated_text
      : response.data.generated_text;

    return {
      content: generatedText.trim(),
      type,
    };
  }

  private buildNPCPrompt(context: {
    npcName: string;
    npcDescription: string;
    npcPersonality: string;
    playerAction: string;
    playerName: string;
    storyContext: string;
    previousMessages: string[];
  }): string {
    return `Jesteś postacią NPC w grze RPG o imieniu "${context.npcName}".

Opis postaci: ${context.npcDescription}
Osobowość: ${context.npcPersonality}

Kontekst fabularny: ${context.storyContext}

Poprzednie interakcje:
${context.previousMessages.join('\n')}

Gracz ${context.playerName} właśnie: ${context.playerAction}

Odpowiedz jako ${context.npcName}, w pełni wchodząc w rolę tej postaci. Twoja odpowiedź powinna być:
1. Zgodna z twoją osobowością
2. Naturalna i immersyjna
3. Odpowiedniej długości (1-3 zdania dla dialogu, lub dłużej jeśli to monolog)

Twoja odpowiedź:`;
  }

  private buildNarrationPrompt(context: {
    storyContext: string;
    playerActions: string[];
    currentScene: string;
  }): string {
    return `Jesteś mistrzem gry (GM) w grze RPG tekstowej. Opisz scenę fabularną.

Kontekst: ${context.storyContext}
Obecna scena: ${context.currentScene}

Akcje graczy:
${context.playerActions.join('\n')}

Opisz co się dzieje w sposób immersyjny i angażujący. Uwzględnij:
1. Reakcję świata na akcje graczy
2. Ewentualne konsekwencje
3. Nowe elementy sceny, jeśli to uzasadnione

Twoja narracja:`;
  }

  private buildCharacterPrompt(theme?: string): string {
    const themeContext = theme ? `w świecie: ${theme}` : 'w fantastycznym świecie RPG';

    return `Stwórz postać do gry RPG ${themeContext}.

Zwróć odpowiedź w formacie JSON z następującymi polami:
{
  "name": "imię postaci",
  "description": "krótki opis wyglądu i cech (2-3 zdania)",
  "backstory": "krótka historia postaci (3-4 zdania)",
  "personality": "opis osobowości (2-3 zdania)"
}

Postać powinna być ciekawa, mieć unikalną historię i pasować do klimatu gry.

Twoja odpowiedź (tylko JSON):`;
  }

  private parseCharacterResponse(response: string): {
    name: string;
    description: string;
    backstory: string;
    personality: string;
  } {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name || 'Nieznana postać',
          description: parsed.description || 'Brak opisu',
          backstory: parsed.backstory || 'Brak historii',
          personality: parsed.personality || 'Brak danych o osobowości',
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    return this.getFallbackCharacter();
  }

  private getFallbackResponse(npcName: string): AIResponse {
    const responses = [
      `${npcName} patrzy na ciebie z zainteresowaniem.`,
      `${npcName} kiwa głową w odpowiedzi.`,
      `"Interesujące..." - mówi ${npcName}.`,
      `${npcName} rozważa twoje słowa przez chwilę.`,
    ];

    return {
      content: responses[Math.floor(Math.random() * responses.length)],
      type: 'dialogue',
    };
  }

  private getFallbackNarration(): AIResponse {
    return {
      content: 'Scena rozwija się dalej, a wasze działania zostawiają ślad na otaczającym was świecie.',
      type: 'narration',
    };
  }

  private getFallbackCharacter() {
    return {
      name: 'Aryen Wędrowiec',
      description: 'Wysoki mężczyzna o niebieskich oczach i nieogolonej twarzy. Noszy skórzaną kurtkę i buty podróżnika.',
      backstory: 'Wyruszył w świat w poszukiwaniu przygód po tym, jak jego wioska została zaatakowana przez bandytów.',
      personality: 'Ostrożny i powściągliwy, ale pomocny dla tych w potrzebie.',
    };
  }
}

export const aiService = new AIService();
export default aiService;
