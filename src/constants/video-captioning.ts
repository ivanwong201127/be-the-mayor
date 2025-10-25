// Video Captioning Constants
export const VIDEO_CAPTIONING_CONFIG = {
  // Default prompt for video description
  DEFAULT_PROMPT: "Describe this video in detail.",
  
  // Maximum tokens for caption generation
  DEFAULT_MAX_TOKENS: 128,
  
  // Video chunk duration in seconds
  CHUNK_DURATION: 5,
  
  // Supported video formats
  SUPPORTED_FORMATS: ['video/mp4', 'video/webm', 'video/ogg'],
  
  // Maximum file size (50MB)
  MAX_FILE_SIZE: 50 * 1024 * 1024,
  
  // Video quality settings for recording (mobile-optimized)
  RECORDING_CONSTRAINTS: {
    video: {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 },
      facingMode: { ideal: 'user' } // Front camera for mobile
    },
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true
    }
  }
} as const;

// Video processing utilities
export const VIDEO_UTILS = {
  // Convert seconds to HH:MM:SS format
  formatTime: (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  },
  
  // Validate video file
  validateVideoFile: (file: File): { isValid: boolean; error?: string } => {
    if (!VIDEO_CAPTIONING_CONFIG.SUPPORTED_FORMATS.includes(file.type as any)) {
      return {
        isValid: false,
        error: `Unsupported video format. Supported formats: ${VIDEO_CAPTIONING_CONFIG.SUPPORTED_FORMATS.join(', ')}`
      };
    }
    
    if (file.size > VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File too large. Maximum size: ${VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }
    
    return { isValid: true };
  }
} as const;
