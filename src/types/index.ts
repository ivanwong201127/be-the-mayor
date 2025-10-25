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
  input_image: string;
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

// Music Generation API Types (MusicGen)
export interface MusicGenInput {
  model_version?: string;
  prompt?: string;
  input_audio?: string;
  duration?: number;
  continuation?: boolean;
  continuation_start?: number;
  continuation_end?: number;
  multi_band_diffusion?: boolean;
  normalization_strategy?: string;
  top_k?: number;
  top_p?: number;
  temperature?: number;
  classifier_free_guidance?: number;
  output_format?: string;
  seed?: number;
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
  prompt: string;
  duration?: number;
  inputAudio?: string | null;
  modelVersion?: string;
  outputFormat?: 'wav' | 'mp3';
}

export interface MusicGenerationResponse {
  audioUrl?: string;
  error?: string;
}

// Video Composition Types
export interface VideoCompositionRequest {
  backgroundVideo: File;
  characterImage: string; // URL to character image
  musicUrl?: string; // Optional background music
}

export interface VideoCompositionResponse {
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
