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
    imagePrompt: "A charming blue character, friendly and approachable, wearing blue outfit. Cartoon-style character, warm smile, animated movements.",
    rapPrompt: "Create a personalized rap song for Blue Character, a futuristic celebrity character. The rap should be romantic and flirty. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "snoop-dogg",
    name: "Snoop Dogg",
    description: "Snoop Dogg, legendary rapper and entertainer",
    imagePrompt: "Snoop Dogg, iconic American rapper with braided hair, wearing stylish outfit, giving a kiss at the end of the video. Professional rapper appearance, cool smile, smooth movements.",
    rapPrompt: "Create a personalized rap song for Snoop Dogg, a legendary American rapper. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "drake",
    name: "Drake",
    description: "Drake, Canadian-American rapper and singer",
    imagePrompt: "Drake, famous Canadian-American rapper with short hair, wearing fashionable outfit, giving a kiss at the end of the video. Professional rapper appearance, charming smile, smooth dance moves.",
    rapPrompt: "Create a personalized rap song for Drake, a famous Canadian-American rapper. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "kendrick-lamar",
    name: "Kendrick Lamar",
    description: "Kendrick Lamar, Pulitzer Prize-winning rapper",
    imagePrompt: "Kendrick Lamar, acclaimed American rapper with short hair, wearing stylish outfit, giving a kiss at the end of the video. Professional rapper appearance, confident smile, artistic movements.",
    rapPrompt: "Create a personalized rap song for Kendrick Lamar, an acclaimed American rapper. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "nicki-minaj",
    name: "Nicki Minaj",
    description: "Nicki Minaj, Trinidadian-American rapper and singer",
    imagePrompt: "Nicki Minaj, famous Trinidadian-American rapper with colorful hair, wearing trendy outfit, giving a kiss at the end of the video. Professional rapper appearance, bold smile, powerful movements.",
    rapPrompt: "Create a personalized rap song for Nicki Minaj, a famous Trinidadian-American rapper. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
  },
  {
    id: "cardi-b",
    name: "Cardi B",
    description: "Cardi B, American rapper and songwriter",
    imagePrompt: "Cardi B, popular American rapper with long hair, wearing fashionable outfit, giving a kiss at the end of the video. Professional rapper appearance, confident smile, energetic movements.",
    rapPrompt: "Create a personalized rap song for Cardi B, a popular American rapper. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming."
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
