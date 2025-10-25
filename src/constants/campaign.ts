// Campaign Poster Styles and Prompts
export interface CampaignStyle {
  id: string;
  name: string;
  description: string;
  promptTemplate: string;
  videoPromptTemplate: string;
  colorScheme: string;
}

export const CAMPAIGN_STYLES: CampaignStyle[] = [
  {
    id: 'communist',
    name: 'Communist',
    description: 'Red and gold theme with socialist imagery',
    promptTemplate: 'Create a communist-style campaign poster featuring {description} as a political leader. Include red and gold colors, hammer and sickle symbols, revolutionary slogans, and heroic poses. Style: Soviet propaganda poster, bold typography, dramatic lighting.',
    videoPromptTemplate: '{description} giving a passionate speech at a communist rally in {city}. Red flags waving, crowds cheering, revolutionary atmosphere. Soviet-style propaganda video with dramatic lighting and heroic poses.',
    colorScheme: 'red-600'
  },
  {
    id: 'republican',
    name: 'Republican',
    description: 'Conservative blue theme with patriotic imagery',
    promptTemplate: 'Create a Republican-style campaign poster featuring {description} as a political candidate. Include red, white, and blue colors, American flag elements, conservative messaging, and professional appearance. Style: Traditional American political poster, clean design, patriotic symbols.',
    videoPromptTemplate: '{description} speaking at a Republican rally in {city} with American flags in the background. Patriotic music, conservative supporters cheering, professional campaign event atmosphere.',
    colorScheme: 'blue-600'
  },
  {
    id: 'liberal',
    name: 'Liberal',
    description: 'Progressive theme with inclusive messaging',
    promptTemplate: 'Create a liberal/progressive campaign poster featuring {description} as a political leader. Include diverse colors, inclusive imagery, progressive slogans, and modern design. Style: Contemporary political poster, inclusive messaging, forward-thinking design.',
    videoPromptTemplate: '{description} addressing a diverse crowd at a progressive rally in {city}. Inclusive atmosphere, diverse supporters, modern campaign event with forward-thinking messaging.',
    colorScheme: 'purple-600'
  },
  {
    id: 'anime',
    name: 'Anime',
    description: 'Japanese anime style with vibrant colors',
    promptTemplate: 'Create an anime-style campaign poster featuring {description} as a character. Include vibrant colors, anime art style, dramatic poses, and Japanese aesthetic elements. Style: Manga/anime illustration, bold colors, dynamic composition.',
    videoPromptTemplate: '{description} as an anime character giving a speech in {city}. Vibrant anime-style animation, dramatic poses, Japanese aesthetic, colorful and dynamic video.',
    colorScheme: 'pink-500'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Retro 1950s American campaign style',
    promptTemplate: 'Create a vintage 1950s American campaign poster featuring {description} as a political candidate. Include retro colors, classic typography, nostalgic imagery, and mid-century design elements. Style: 1950s American political poster, vintage aesthetic, classic design.',
    videoPromptTemplate: '{description} campaigning in {city} with 1950s style. Retro campaign event, vintage cars, classic American atmosphere, nostalgic video style.',
    colorScheme: 'amber-600'
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic neon theme with tech elements',
    promptTemplate: 'Create a cyberpunk-style campaign poster featuring {description} as a futuristic leader. Include neon colors, digital elements, futuristic technology, and sci-fi aesthetics. Style: Cyberpunk art, neon lighting, digital effects, futuristic design.',
    videoPromptTemplate: '{description} speaking at a futuristic cyberpunk rally in {city}. Neon lights, digital effects, futuristic technology, sci-fi atmosphere with cyberpunk aesthetics.',
    colorScheme: 'cyan-500'
  }
];

// City-specific campaign elements
export interface CityCampaign {
  cityName: string;
  state: string;
  slogan: string;
  localIssues: string[];
  culturalElements: string[];
}

export const CITY_CAMPAIGNS: Record<string, CityCampaign> = {
  'New York': {
    cityName: 'New York',
    state: 'NY',
    slogan: 'The City That Never Sleeps',
    localIssues: ['housing affordability', 'public transportation', 'economic inequality'],
    culturalElements: ['skyline', 'subway', 'diversity', 'innovation']
  },
  'Los Angeles': {
    cityName: 'Los Angeles',
    state: 'CA',
    slogan: 'City of Angels',
    localIssues: ['homelessness', 'traffic congestion', 'environmental protection'],
    culturalElements: ['Hollywood', 'beaches', 'entertainment industry', 'diversity']
  },
  'Chicago': {
    cityName: 'Chicago',
    state: 'IL',
    slogan: 'The Windy City',
    localIssues: ['public safety', 'education reform', 'economic development'],
    culturalElements: ['architecture', 'deep dish pizza', 'blues music', 'lakefront']
  },
  'Houston': {
    cityName: 'Houston',
    state: 'TX',
    slogan: 'Space City',
    localIssues: ['flooding', 'energy transition', 'urban sprawl'],
    culturalElements: ['NASA', 'oil industry', 'diversity', 'space exploration']
  },
  'Phoenix': {
    cityName: 'Phoenix',
    state: 'AZ',
    slogan: 'Valley of the Sun',
    localIssues: ['water scarcity', 'urban heat island', 'growth management'],
    culturalElements: ['desert', 'cactus', 'Southwestern culture', 'solar energy']
  }
};

// Default campaign elements for cities not in the list
export const DEFAULT_CITY_CAMPAIGN: CityCampaign = {
  cityName: 'Your City',
  state: 'State',
  slogan: 'Building Tomorrow Together',
  localIssues: ['community development', 'local economy', 'quality of life'],
  culturalElements: ['community spirit', 'local heritage', 'progress']
};
