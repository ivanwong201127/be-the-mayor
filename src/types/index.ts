// Replicate API Types
export interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: ReplicateInput;
  output?: string | string[];
  error?: string;
  logs?: string;
  metrics?: {
    image_count: number;
    predict_time: number;
    total_time: number;
  };
  urls: {
    stream: string;
    get: string;
    cancel: string;
  };
  version: string;
}

export interface ReplicateInput {
  prompt: string;
  input_image?: string;
  aspect_ratio: 'match_input_image' | '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  output_format: 'jpg' | 'png' | 'webp';
  safety_tolerance: number;
  prompt_upsampling?: boolean;
}

// Avatar Generation Types
export interface AvatarGenerationRequest {
  description: string;
}

export interface AvatarGenerationResponse {
  imageUrl?: string;
  error?: string;
}

// Campaign Poster Types
export interface CampaignPosterRequest {
  description: string;
  selectedCity: string;
  campaignStyle: string;
}

export interface CampaignPosterResponse {
  imageUrl?: string;
  error?: string;
}

// Seedance API Types
export interface SeedancePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: SeedanceInput;
  output?: string;
  error?: string;
  logs?: string;
  metrics?: {
    predict_time: number;
    total_time: number;
  };
  urls: {
    stream: string;
    get: string;
    cancel: string;
  };
  version: string;
}

export interface SeedanceInput {
  fps?: number;
  prompt: string;
  duration?: number;
  resolution?: '480p' | '720p';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  camera_fixed?: boolean;
  seed?: number;
  image?: string;
  last_frame_image?: string;
  reference_images?: string[];
}

// Campaign Video Types
export interface CampaignVideoRequest {
  description: string;
  selectedCity: string;
  campaignStyle: string;
  videoSettings?: {
    fps?: number;
    duration?: number;
    resolution?: '480p' | '720p';
    aspect_ratio?: '16:9' | '9:16' | '1:1';
    camera_fixed?: boolean;
    seed?: number;
    image?: string;
    last_frame_image?: string;
    reference_images?: string[];
  };
}

export interface CampaignVideoResponse {
  videoUrl?: string;
  error?: string;
}

// Qwen2-VL API Types
export interface Qwen2VLInput {
  media: string;
  prompt?: string;
  max_new_tokens?: number;
}

export interface Qwen2VLPrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: Qwen2VLInput;
  output?: string;
  error?: string;
  logs?: string;
  metrics?: {
    predict_time: number;
    total_time: number;
  };
  urls: {
    get: string;
    cancel: string;
  };
  version: string;
}

// Video Captioning Types
export interface VideoCaptioningRequest {
  videoFile: File;
  prompt?: string;
  maxNewTokens?: number;
}

export interface VideoCaptioningResponse {
  caption?: string;
  error?: string;
}

// Video Chunking Types
export interface VideoChunk {
  blob: Blob;
  url: string;
  startTime: number;
  endTime: number;
}

// Music Generation API Types (MiniMax)
export interface MusicGenInput {
  lyrics: string;
  duration?: number;
  bitrate?: number;
  song_file?: string;
  sample_rate?: number;
}

export interface MusicGenPrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: MusicGenInput;
  output?: string; // Audio URL
  error?: string;
  logs?: string;
  metrics?: {
    predict_time: number;
    total_time: number;
  };
  urls: {
    get: string;
    cancel: string;
  };
  version: string;
}

// Music Generation Request/Response
export interface MusicGenerationRequest {
  lyrics: string;
  duration?: number;
  bitrate?: number;
  song_file?: string;
  sample_rate?: number;
}

export interface MusicGenerationResponse {
  audioUrl?: string;
  cached?: boolean;
  error?: string;
}

// Text Generation API Types
export interface TextGenInput {
  prompt?: string;
  messages?: any[];
  verbosity?: 'low' | 'medium' | 'high';
  image_input?: any[];
  reasoning_effort?: 'minimal' | 'low' | 'medium' | 'high';
  max_completion_tokens?: number;
  system_prompt?: string;
}

export interface TextGenPrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: TextGenInput;
  output?: string[]; // Array of text tokens
  error?: string;
  logs?: string;
  metrics?: {
    input_token_count: number;
    tokens_per_second: number;
    output_token_count: number;
    predict_time: number;
    total_time: number;
    time_to_first_token: number;
  };
  urls: {
    get: string;
    cancel: string;
  };
  version: string;
}

// Text Generation Request/Response
export interface TextGenerationRequest {
  prompt: string;
  messages?: any[];
  verbosity?: 'low' | 'medium' | 'high';
  image_input?: any[];
  reasoning_effort?: 'minimal' | 'low' | 'medium' | 'high';
  max_completion_tokens?: number;
  system_prompt?: string;
}

export interface TextGenerationResponse {
  text?: string;
  error?: string;
}

// Google Image Search Types
export interface GoogleImageSearchRequest {
  query: string;
  numResults?: number;
  safeSearch?: 'off' | 'moderate' | 'strict';
}

export interface GoogleImageSearchResponse {
  images: Array<{
    url: string;
    title: string;
    source: string;
    thumbnail: string;
  }>;
  error?: string;
}

// Character Image Types
export interface CharacterImageRequest {
  characterName: string;
  characterDescription: string;
}

export interface CharacterImageResponse {
  imageUrl?: string;
  characterPrompt?: string;
  cached?: boolean;
  error?: string;
}

// Unified Image Generation Types (combines avatar and campaign poster)
export interface ImageGenerationRequest {
  type: 'avatar' | 'campaign-poster';
  description: string;
  // Campaign poster specific fields
  selectedCity?: string;
  campaignStyle?: string;
}

export interface ImageGenerationResponse {
  imageUrl?: string;
  cached?: boolean;
  error?: string;
}

// Unified Video Generation Types (combines compose-video and campaign-video)
export interface VideoGenerationRequest {
  type: 'compose' | 'campaign' | 'celebrity' | 'omni-human';
  // Compose video fields
  backgroundVideo?: File;
  characterImage?: string;
  musicUrl?: string;
  // Campaign video fields
  description?: string;
  selectedCity?: string;
  campaignStyle?: string;
  videoSettings?: {
    fps?: number;
    duration?: number;
    resolution?: '480p' | '720p';
    aspect_ratio?: '16:9' | '9:16' | '1:1';
    camera_fixed?: boolean;
  };
  // Celebrity video fields
  selectedCharacter?: string;
  rapLyrics?: string;
  // Omni-human fields
  audio?: string;
  image?: string;
}

export interface VideoGenerationResponse {
  videoUrl?: string;
  error?: string;
}

// City Types (for the map)
export interface City {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
  population: string;
  region: 'Northeast' | 'South' | 'Midwest' | 'West';
}

export interface MapData {
  cities: City[];
  usaOutline: string;
}

// Omni-Human API Types
export interface OmniHumanInput {
  audio: string;
  image: string;
}

export interface OmniHumanPrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  input: OmniHumanInput;
  output?: string; // Video URL
  error?: string;
  logs?: string;
  metrics?: {
    predict_time: number;
    total_time: number;
  };
  urls: {
    stream: string;
    get: string;
    cancel: string;
  };
  version: string;
}
