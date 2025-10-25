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
    id: "nami",
    name: "Nami (One Piece)",
    description: "Nami from One Piece, navigator and thief",
    imagePrompt: "Nami from One Piece, beautiful orange-haired anime girl with blue eyes, wearing stylish outfit, giving a kiss at the end of the video. Anime character appearance, confident smile, graceful movements.",
    rapPrompt: "Create a personalized rap song for Nami, an anime character from One Piece. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "hinata",
    name: "Hinata (Naruto)",
    description: "Hinata from Naruto, shy but determined ninja",
    imagePrompt: "Hinata from Naruto, cute anime girl with long dark hair and lavender eyes, wearing ninja outfit, giving a kiss at the end of the video. Anime character appearance, gentle smile, shy but confident movements.",
    rapPrompt: "Create a personalized rap song for Hinata, an anime character from Naruto. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "asuka",
    name: "Asuka (Evangelion)",
    description: "Asuka from Neon Genesis Evangelion, fiery pilot",
    imagePrompt: "Asuka from Evangelion, beautiful anime girl with red hair and blue eyes, wearing pilot suit, giving a kiss at the end of the video. Anime character appearance, confident smile, bold movements.",
    rapPrompt: "Create a personalized rap song for Asuka, an anime character from Evangelion. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "mikasa",
    name: "Mikasa (Attack on Titan)",
    description: "Mikasa from Attack on Titan, skilled warrior",
    imagePrompt: "Mikasa from Attack on Titan, beautiful anime girl with black hair and gray eyes, wearing military uniform, giving a kiss at the end of the video. Anime character appearance, serious smile, strong movements.",
    rapPrompt: "Create a personalized rap song for Mikasa, an anime character from Attack on Titan. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "zero-two",
    name: "Zero Two (Darling in the Franxx)",
    description: "Zero Two from Darling in the Franxx, mysterious pilot",
    imagePrompt: "Zero Two from Darling in the Franxx, stunning anime girl with pink hair and red eyes, wearing pilot outfit, giving a kiss at the end of the video. Anime character appearance, seductive smile, elegant movements.",
    rapPrompt: "Create a personalized rap song for Zero Two, an anime character from Darling in the Franxx. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
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
