// Character Prompts and Rap Lyrics Templates
export interface CharacterPrompt {
  id: string;
  name: string;
  description: string;
  imagePrompt: string;
  rapPrompt: string;
}

export const CHARACTER_PROMPTS: CharacterPrompt[] = [
  {
    id: "blue",
    name: "Blue Character",
    description: "A blue humanoid character, futuristic and sleek",
    imagePrompt: "A charming blue character, friendly and approachable, wearing blue outfit, giving a kiss at the end of the video. Cartoon-style character, warm smile, animated movements.",
    rapPrompt: "Create a personalized rap song for Blue Character, a futuristic celebrity character. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "bts-jungkook",
    name: "Jungkook (BTS)",
    description: "Jungkook from BTS, Korean pop star",
    imagePrompt: "Jungkook from BTS, handsome Korean male idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charismatic smile, dancing gracefully.",
    rapPrompt: "Create a personalized rap song for Jungkook, a K-pop star. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "bts-jimin",
    name: "Jimin (BTS)",
    description: "Jimin from BTS, Korean pop star",
    imagePrompt: "Jimin from BTS, beautiful Korean male idol with blonde hair, wearing elegant outfit, giving a kiss at the end of the video. Professional K-pop star appearance, charming smile, smooth dance moves.",
    rapPrompt: "Create a personalized rap song for Jimin, a K-pop star. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "bts-v",
    name: "V (BTS)",
    description: "V from BTS, Korean pop star",
    imagePrompt: "V (Taehyung) from BTS, handsome Korean male idol with dark hair, wearing fashionable outfit, giving a kiss at the end of the video. Professional K-pop star appearance, deep voice, artistic expression.",
    rapPrompt: "Create a personalized rap song for V, a K-pop star. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "blackpink-jennie",
    name: "Jennie (BLACKPINK)",
    description: "Jennie from BLACKPINK, Korean pop star",
    imagePrompt: "Jennie from BLACKPINK, beautiful Korean female idol with dark hair, wearing stylish outfit, giving a kiss at the end of the video. Professional K-pop star appearance, confident smile, elegant dance moves.",
    rapPrompt: "Create a personalized rap song for Jennie, a K-pop star. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "blackpink-lisa",
    name: "Lisa (BLACKPINK)",
    description: "Lisa from BLACKPINK, Korean pop star",
    imagePrompt: "Lisa from BLACKPINK, beautiful Thai-Korean female idol with blonde hair, wearing trendy outfit, giving a kiss at the end of the video. Professional K-pop star appearance, bright smile, powerful dance moves.",
    rapPrompt: "Create a personalized rap song for Lisa, a K-pop star. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  }
];

// Helper function to get character prompt by ID
export function getCharacterPrompt(characterId: string): CharacterPrompt | undefined {
  return CHARACTER_PROMPTS.find(char => char.id === characterId);
}

// Helper function to get character prompt by name
export function getCharacterPromptByName(characterName: string): CharacterPrompt | undefined {
  return CHARACTER_PROMPTS.find(char => 
    char.name.toLowerCase().includes(characterName.toLowerCase()) ||
    characterName.toLowerCase().includes(char.name.toLowerCase())
  );
}
