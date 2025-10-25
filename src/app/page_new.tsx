'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { VideoCaptioningResponse, MusicGenerationResponse, VideoCompositionResponse } from '@/types';
import { VIDEO_CAPTIONING_CONFIG, VIDEO_UTILS } from '@/constants/video-captioning';
import Link from 'next/link';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  
  // New states for character and music generation
  const [blueCharacter, setBlueCharacter] = useState<string | null>(null);
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [composedVideo, setComposedVideo] = useState<string | null>(null);
  const [isComposingVideo, setIsComposingVideo] = useState(false);
  const [rapLyrics, setRapLyrics] = useState<string>('Yo, I\'m the mayor of this city, blue and bold, Making changes that never get old, From the streets to the sky, I reach for the stars, Building bridges, breaking down bars');
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('blue');
  
  // New states for unified flow
  const [isProcessingFlow, setIsProcessingFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [streamingLyrics, setStreamingLyrics] = useState<string>('');
  const [isStreamingLyrics, setIsStreamingLyrics] = useState(false);
  const [finalVideo, setFinalVideo] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Detect mobile device on mount and resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Character options for generation
  const characterOptions = [
    {
      id: 'blue',
      name: 'Blue Character',
      description: 'A blue humanoid character, futuristic and sleek, with glowing blue skin, metallic blue armor, and confident posture. The character should look like a mayor or leader, standing tall with arms crossed or pointing forward. Blue eyes, blue hair, wearing a blue suit or armor. Sci-fi style, high quality, detailed. At the end of the video, the character will give you a kiss. The video should be at least 15 seconds long.'
    },
    {
      id: 'bts-jungkook',
      name: 'Jungkook (BTS)',
      description: 'Jungkook from BTS, Korean pop star, handsome young man with dark hair, charismatic smile, wearing stylish modern outfit, confident pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jungkook will give you a kiss. The video should be at least 15 seconds long.'
    },
    {
      id: 'bts-jimin',
      name: 'Jimin (BTS)',
      description: 'Jimin from BTS, Korean pop star, elegant and graceful young man with blonde hair, charming smile, wearing fashionable outfit, artistic pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jimin will give you a kiss. The video should be at least 15 seconds long.'
    },
    {
      id: 'bts-v',
      name: 'V (BTS)',
      description: 'V from BTS, Korean pop star, handsome young man with dark hair, mysterious and charismatic expression, wearing trendy outfit, cool pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, V will give you a kiss. The video should be at least 15 seconds long.'
    },
    {
      id: 'blackpink-jennie',
      name: 'Jennie (BLACKPINK)',
      description: 'Jennie from BLACKPINK, Korean pop star, beautiful young woman with dark hair, confident and stylish expression, wearing fashionable outfit, elegant pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jennie will give you a kiss. The video should be at least 15 seconds long.'
    },
    {
      id: 'blackpink-lisa',
      name: 'Lisa (BLACKPINK)',
      description: 'Lisa from BLACKPINK, Korean pop star, beautiful young woman with blonde hair, energetic and charismatic expression, wearing trendy outfit, dynamic pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Lisa will give you a kiss. The video should be at least 15 seconds long.'
    }
  ];

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Camera access is not supported on this device');
        return;
      }

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        setError('Video recording is not supported on this device');
        return;
      }

      // Progressive constraints with fallback
      const constraints = {
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
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Dynamic MIME type detection
      const mimeTypes = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
      let selectedMimeType = '';
      
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      if (!selectedMimeType) {
        throw new Error('No supported video format found');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: selectedMimeType
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: selectedMimeType });
        const videoUrl = URL.createObjectURL(blob);
        setRecordedVideo(videoUrl);
        setVideoFile(new File([blob], 'recorded-video.webm', { type: selectedMimeType }));
        setError(null);
        setCaption(null);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // 1-second chunks for better mobile compatibility
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Recording error:', err);
      let errorMessage = 'Failed to start recording. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Camera permission denied. Please allow camera access and try again.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found. Please check your camera connection.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'Camera not supported on this device.';
        } else {
          errorMessage += 'Please check camera permissions.';
        }
      }
      
      setError(errorMessage);
    }
  }, []);

  // Unified function that handles recording on desktop and upload on mobile
  const handleStartRecordingOrUpload = useCallback(() => {
    if (isMobile) {
      // On mobile, trigger file upload
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'video/*';
      fileInput.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const validation = {
            isValid: true,
            error: undefined
          };
          
          if (!file.type.startsWith('video/')) {
            setError('Invalid file type. Please upload a video file.');
            return;
          }

          if (file.size > VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE) {
            setError(`File too large. Maximum size: ${VIDEO_CAPTIONING_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`);
            return;
          }

          setVideoFile(file);
          setRecordedVideo(URL.createObjectURL(file));
          setError(null);
          setCaption(null);
        }
      };
      fileInput.click();
    } else {
      // On desktop, start recording
      startRecording();
    }
  }, [isMobile, startRecording]);

  // Unified flow function
  const startUnifiedFlow = async () => {
    if (!videoFile) {
      setError('Please record or upload a video first');
      return;
    }

    setIsProcessingFlow(true);
    setProgress(0);
    setError(null);
    setFinalVideo(null);

    try {
      // Step 1: Generate Character (20%)
      setCurrentStep('Generating celebrity character...');
      setProgress(20);
      
      const selectedChar = characterOptions.find(char => char.id === selectedCharacter);
      if (!selectedChar) {
        throw new Error('Please select a character');
      }

      const characterResponse = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: selectedChar.description }),
      });

      if (!characterResponse.ok) {
        throw new Error('Failed to generate character');
      }

      const characterData = await characterResponse.json();
      if (characterData.error) {
        throw new Error(characterData.error);
      }

      setBlueCharacter(characterData.imageUrl);

      // Step 2: Generate Rap Lyrics with streaming (40%)
      setCurrentStep('Creating personalized rap lyrics...');
      setProgress(40);
      
      // Simulate streaming lyrics
      setIsStreamingLyrics(true);
      setStreamingLyrics('');
      
      const lyricsLines = [
        `Yo, I'm ${selectedChar.name.split(' ')[0]}, your celebrity crush`,
        'Making moves that will make your heart rush',
        'From the stage to your screen, I'm here to stay',
        'This is our moment, don't let it slip away',
        'Every beat drops like my love for you',
        'This rap is real, and our connection is too',
        'At the end of this video, you'll see what I mean',
        'A kiss from me, like a beautiful dream'
      ];

      for (let i = 0; i < lyricsLines.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800)); // 800ms delay between lines
        setStreamingLyrics(prev => prev + (prev ? '\n' : '') + lyricsLines[i]);
      }

      setIsStreamingLyrics(false);
      const finalLyrics = lyricsLines.join('\n');
      setRapLyrics(finalLyrics);

      // Step 3: Generate Music (60%)
      setCurrentStep('Composing rap music...');
      setProgress(60);

      const musicResponse = await fetch('/api/generate-music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Rap music with lyrics: ${finalLyrics}. Hip hop beat, urban style, energetic rhythm`,
          duration: 15, // 15 seconds as requested
          modelVersion: 'stereo-large',
          outputFormat: 'wav'
        }),
      });

      if (!musicResponse.ok) {
        throw new Error('Failed to generate music');
      }

      const musicData = await musicResponse.json();
      if (musicData.error) {
        throw new Error(musicData.error);
      }

      setGeneratedMusic(musicData.audioUrl);

      // Step 4: Compose Video (80%)
      setCurrentStep('Composing final video with celebrity...');
      setProgress(80);

      const composeResponse = await fetch('/api/compose-video', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('backgroundVideo', videoFile);
          formData.append('characterImage', characterData.imageUrl);
          if (musicData.audioUrl) {
            formData.append('musicUrl', musicData.audioUrl);
          }
          return formData;
        })(),
      });

      if (!composeResponse.ok) {
        throw new Error('Failed to compose video');
      }

      const composeData = await composeResponse.json();
      if (composeData.error) {
        throw new Error(composeData.error);
      }

      setComposedVideo(composeData.videoUrl);

      // Step 5: Generate Caption (100%)
      setCurrentStep('Adding final touches...');
      setProgress(100);

      const captionResponse = await fetch('/api/caption-video', {
        method: 'POST',
        body: (() => {
          const formData = new FormData();
          formData.append('videoFile', videoFile);
          formData.append('prompt', VIDEO_CAPTIONING_CONFIG.DEFAULT_PROMPT);
          formData.append('maxNewTokens', VIDEO_CAPTIONING_CONFIG.DEFAULT_MAX_TOKENS.toString());
          return formData;
        })(),
      });

      if (!captionResponse.ok) {
        throw new Error('Failed to generate caption');
      }

      const captionData = await captionResponse.json();
      if (captionData.error) {
        throw new Error(captionData.error);
      }

      setCaption(captionData.caption);
      setFinalVideo(composeData.videoUrl);
      setCurrentStep('Complete! Your celebrity video is ready!');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      console.error('Unified flow error:', err);
    } finally {
      setIsProcessingFlow(false);
    }
  };

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = VIDEO_UTILS.validateVideoFile(file);
      
      if (!validation.isValid) {
        setError(validation.error || 'Invalid video file');
        return;
      }

      setVideoFile(file);
      setRecordedVideo(URL.createObjectURL(file));
      setError(null);
      setCaption(null);
    }
  }, []);

  const captionVideo = async () => {
    if (!videoFile) {
      setError('Please record or upload a video first');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setCaption(null);

    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('prompt', VIDEO_CAPTIONING_CONFIG.DEFAULT_PROMPT);
      formData.append('maxNewTokens', VIDEO_CAPTIONING_CONFIG.DEFAULT_MAX_TOKENS.toString());

      const response = await fetch('/api/caption-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data: VideoCaptioningResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setCaption(data.caption);
      }
    } catch (err) {
      setError('Failed to generate caption. Please try again.');
      console.error('Caption generation error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateCharacter = async () => {
    setIsGeneratingCharacter(true);
    setError(null);

    try {
      const selectedChar = characterOptions.find(char => char.id === selectedCharacter);
      if (!selectedChar) {
        setError('Please select a character');
        return;
      }

      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: selectedChar.description
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate character');
      }

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setBlueCharacter(data.imageUrl);
      }
    } catch (err) {
      setError('Failed to generate character. Please try again.');
      console.error('Character generation error:', err);
    } finally {
      setIsGeneratingCharacter(false);
    }
  };

  const generateMusic = async () => {
    if (!rapLyrics.trim()) {
      setError('Please enter rap lyrics');
      return;
    }

    setIsGeneratingMusic(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-music', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Rap music with lyrics: ${rapLyrics}. Hip hop beat, urban style, energetic rhythm`,
          duration: 30,
          modelVersion: 'stereo-large',
          outputFormat: 'wav'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate music');
      }

      const data: MusicGenerationResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setGeneratedMusic(data.audioUrl || null);
      }
    } catch (err) {
      setError('Failed to generate music. Please try again.');
      console.error('Music generation error:', err);
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const composeVideo = async () => {
    if (!videoFile || !blueCharacter) {
      setError('Please record a video and generate a character first');
      return;
    }

    setIsComposingVideo(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('backgroundVideo', videoFile);
      formData.append('characterImage', blueCharacter);
      if (generatedMusic) {
        formData.append('musicUrl', generatedMusic);
      }

      const response = await fetch('/api/compose-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to compose video');
      }

      const data: VideoCompositionResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setComposedVideo(data.videoUrl || null);
      }
    } catch (err) {
      setError('Failed to compose video. Please try again.');
      console.error('Video composition error:', err);
    } finally {
      setIsComposingVideo(false);
    }
  };

  const resetAll = () => {
    setIsRecording(false);
    setRecordedVideo(null);
    setVideoFile(null);
    setCaption(null);
    setError(null);
    setRecordingTime(0);
    setBlueCharacter(null);
    setGeneratedMusic(null);
    setComposedVideo(null);
    setFinalVideo(null);
    setStreamingLyrics('');
    setIsStreamingLyrics(false);
    setProgress(0);
    setCurrentStep('');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current = null;
    }
    
    chunksRef.current = [];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Invite Your Celebrity
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Create a personalized video with your favorite K-pop star or blue character. 
            They'll rap for you and give you a kiss at the end!
          </p>
          
          {/* Navigation */}
          <div className="mt-6">
            <Link 
              href="/campaign" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              🗳️ Campaign Mode
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Invite Your Celebrity
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {/* Video Recording Section */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Step 1: Record Your Video</h3>
                
                {/* Recording Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecordingOrUpload}
                      className="bg-red-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-3 text-lg touch-manipulation"
                      style={{ minHeight: '48px', minWidth: '200px' }}
                    >
                      <span className="w-4 h-4 bg-white rounded-full"></span>
                      Start Recording
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="bg-gray-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center gap-3 text-lg touch-manipulation"
                      style={{ minHeight: '48px', minWidth: '200px' }}
                    >
                      <span className="w-4 h-4 bg-white rounded-full"></span>
                      Stop Recording ({VIDEO_UTILS.formatTime(recordingTime)})
                    </button>
                  )}
                </div>

                {/* Video Preview */}
                {recordedVideo && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Your Video</h4>
                    <video
                      ref={videoRef}
                      src={recordedVideo}
                      controls
                      playsInline
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                )}
              </div>

              {/* Character Selection */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Step 2: Choose Your Celebrity</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {characterOptions.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => setSelectedCharacter(character.id)}
                      className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                        selectedCharacter === character.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">
                          {character.id === 'blue' ? '🔵' : 
                           character.id.includes('jungkook') ? '🎤' :
                           character.id.includes('jimin') ? '✨' :
                           character.id.includes('v') ? '🎭' :
                           character.id.includes('jennie') ? '💄' :
                           character.id.includes('lisa') ? '💃' : '⭐'}
                        </div>
                        <div className="text-xs">{character.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Unified Flow Button */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Step 3: Create Your Celebrity Video</h3>
                
                <button
                  onClick={startUnifiedFlow}
                  disabled={!videoFile || isProcessingFlow}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-6 px-12 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-4 text-xl touch-manipulation shadow-lg"
                  style={{ minHeight: '60px', minWidth: '300px' }}
                >
                  {isProcessingFlow ? (
                    <>
                      <svg className="animate-spin h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Magic...
                    </>
                  ) : (
                    <>
                      <span className="text-2xl">✨</span>
                      Invite Your Celebrity
                    </>
                  )}
                </button>

                {/* Progress Bar */}
                {isProcessingFlow && (
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-gray-600 font-medium">{currentStep}</p>
                  </div>
                )}

                {/* Streaming Lyrics */}
                {isStreamingLyrics && (
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <h4 className="text-md font-medium text-gray-900 mb-3 text-center">🎤 Creating Your Rap Lyrics...</h4>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-line min-h-[120px]">
                      {streamingLyrics}
                      {isStreamingLyrics && <span className="animate-pulse">|</span>}
                    </div>
                  </div>
                )}

                {/* Final Video */}
                {finalVideo && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">🎉 Your Celebrity Video is Ready!</h4>
                    <video
                      controls
                      src={finalVideo}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '500px' }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 mb-2">Your celebrity will give you a kiss at the end! 💋</p>
                      <button
                        onClick={resetAll}
                        className="bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                      >
                        🔄 Create Another Video
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Caption Display */}
              {caption && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-green-800 mb-2">Video Caption</h3>
                  <p className="text-sm text-green-700">{caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
