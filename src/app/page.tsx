'use client';

import { useState, useRef, useCallback } from 'react';
import { VideoCaptioningResponse } from '@/types';
import { VIDEO_CAPTIONING_CONFIG, VIDEO_UTILS } from '@/constants/video-captioning';

export default function Home() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [customPrompt, setCustomPrompt] = useState<string>(VIDEO_CAPTIONING_CONFIG.DEFAULT_PROMPT);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access not supported on this device');
      }
      
      // Try to get media stream with mobile-optimized constraints
      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(VIDEO_CAPTIONING_CONFIG.RECORDING_CONSTRAINTS);
      } catch (constraintError) {
        // Fallback to basic constraints if advanced ones fail
        console.warn('Advanced constraints failed, trying basic constraints:', constraintError);
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: true
        });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Ensure video plays on mobile
      }

      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('Video recording not supported on this device');
      }

      // Determine the best MIME type for the device
      let mimeType = 'video/webm';
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        mimeType = 'video/webm;codecs=vp8';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
        setVideoFile(new File([videoBlob], `recorded-video.${mimeType.split('/')[1].split(';')[0]}`, { type: mimeType }));
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Record in 1-second chunks for better mobile performance
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Error starting recording:', err);
      let errorMessage = 'Failed to start recording. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage += 'Please allow camera access in your browser settings.';
        } else if (err.name === 'NotFoundError') {
          errorMessage += 'No camera found on this device.';
        } else if (err.name === 'NotSupportedError') {
          errorMessage += 'Video recording not supported on this device.';
        } else {
          errorMessage += err.message;
        }
      } else {
        errorMessage += 'Please check camera permissions.';
      }
      
      setError(errorMessage);
    }
  }, []);

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
      formData.append('prompt', customPrompt);
      formData.append('maxNewTokens', VIDEO_CAPTIONING_CONFIG.DEFAULT_MAX_TOKENS.toString());

      const response = await fetch('/api/caption-video', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to caption video');
      }

      const data: VideoCaptioningResponse = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setCaption(data.caption || 'No caption generated');
      }
    } catch (err) {
      setError('Failed to caption video. Please try again.');
      console.error('Captioning error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetAll = () => {
    setIsRecording(false);
    setRecordedVideo(null);
    setVideoFile(null);
    setCaption(null);
    setError(null);
    setRecordingTime(0);
    
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="text-blue-600">Be The Mayor</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Record or upload videos and get AI-powered captions. Create campaign materials.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Video Recording & Captioning
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {/* Video Recording Section */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Record or Upload Video</h3>
                
                {/* Recording Controls */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="bg-red-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-3 text-lg touch-manipulation"
                      style={{ minHeight: '48px', minWidth: '200px' }} // Touch-friendly sizing
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
                  
                  <div className="text-gray-500 text-sm sm:text-base">or</div>
                  
                  <label className="bg-blue-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer touch-manipulation text-lg" style={{ minHeight: '48px', minWidth: '200px' }}>
                    Upload Video
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Video Preview */}
                {recordedVideo && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Video Preview</h4>
                    <video
                      ref={videoRef}
                      src={recordedVideo}
                      controls
                      playsInline // Important for mobile iOS
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                    <div className="mt-2 text-center text-sm text-gray-600">
                      Video ready for captioning
                    </div>
                  </div>
                )}
              </div>

              {/* Caption Settings */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Caption Settings</h3>
                
                <div>
                  <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Prompt
                  </label>
                  <textarea
                    id="prompt"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe this video in detail."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                    rows={2}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={captionVideo}
                  disabled={!videoFile || isProcessing}
                  className="bg-green-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 text-lg touch-manipulation"
                  style={{ minHeight: '48px', minWidth: '200px' }}
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    '🎬 Generate Caption'
                  )}
                </button>
                
                <button
                  onClick={resetAll}
                  className="bg-gray-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-600 transition-colors text-lg touch-manipulation"
                  style={{ minHeight: '48px', minWidth: '200px' }}
                >
                  🔄 Reset All
                </button>
              </div>

              {/* Error Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base">
                  {error}
                </div>
              )}

              {/* Generated Caption */}
              {caption && (
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Generated Caption</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{caption}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navigation to Campaign Page */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Ready to create campaign materials?</p>
            <a
              href="/campaign"
              className="inline-block bg-purple-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-purple-700 transition-colors text-lg touch-manipulation"
              style={{ minHeight: '48px', minWidth: '200px' }}
            >
              🎨 Go to Campaign Creator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}