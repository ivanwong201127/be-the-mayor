"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Desktop camera states
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // States for unified flow
  const [generatedMusic, setGeneratedMusic] = useState<string | null>(null);
  const [rapLyrics, setRapLyrics] = useState<string>("");
  const [selectedCharacter, setSelectedCharacter] = useState<string>("blue");
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(
    null
  );
  const [cachedRecordedVideo, setCachedRecordedVideo] = useState<string | null>(
    null
  );

  // New states for unified flow
  const [isProcessingFlow, setIsProcessingFlow] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [progress, setProgress] = useState(0);
  const [streamingLyrics, setStreamingLyrics] = useState<string>("");
  const [isStreamingLyrics, setIsStreamingLyrics] = useState(false);
  const [finalVideo, setFinalVideo] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);

  // Detect desktop device
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(
        window.innerWidth >= 768 &&
          !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          )
      );
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Camera initialization function
  const initializeCamera = useCallback(async () => {
    if (!isDesktop) return;

    try {
      console.log("Requesting camera access...");
      setCameraLoading(true);
      setCameraError(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: { ideal: "user" },
        },
        audio: true,
      });

      console.log("Camera stream obtained:", stream);
      setCameraStream(stream);
      cameraStreamRef.current = stream;
      setCameraError(null);
      setCameraLoading(false);
    } catch (error) {
      console.error("Camera access error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Unable to access camera. Please check permissions.";
      setCameraError(errorMessage);
      setCameraLoading(false);
    }
  }, [isDesktop]);

  // Initialize camera on desktop
  useEffect(() => {
    if (isDesktop) {
      initializeCamera();
    }

    // Cleanup camera stream on unmount
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
    };
  }, [isDesktop, initializeCamera]);

  // Handle video element when camera stream changes
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.muted = true;
      videoRef.current.playsInline = true;

      const playVideo = async () => {
        try {
          await videoRef.current?.play();
        } catch (error) {
          console.error("Error playing video:", error);
        }
      };

      if (videoRef.current.readyState >= 2) {
        playVideo();
      } else {
        videoRef.current.onloadedmetadata = playVideo;
      }
    }
  }, [cameraStream]);

  // Load cached data on page load
  useEffect(() => {
    const loadCachedData = async () => {
      try {
        const response = await fetch("/api/cache");
        if (response.ok) {
          const data = await response.json();
          const cache = data.cache;

          // Load cached music and recorded video
          Object.keys(cache).forEach((key) => {
            if (key.startsWith("music-")) {
              const entry = cache[key];
              if (entry && entry.url) {
                setGeneratedMusic(entry.url);
                console.log("Loaded cached music:", entry.url);
              }
            }

            if (key.startsWith("captured-image-")) {
              const entry = cache[key];
              if (entry && entry.url) {
                setCachedRecordedVideo(entry.url);
                // Also set as current captured image so user doesn't need to re-capture
                setCapturedImage(entry.url);
                console.log("Loaded cached captured image:", entry.url);
              }
            }

            if (key.startsWith("lyrics-")) {
              const entry = cache[key];
              if (entry && entry.text) {
                setRapLyrics(entry.text);
                console.log("Loaded cached lyrics:", entry.text);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error loading cached data:", error);
      }
    };

    loadCachedData();
  }, []);

  // Character options for generation
  const characterOptions = [
    {
      id: "blue",
      name: "Blue Character",
      description:
        "A blue humanoid character, futuristic and sleek, with glowing blue skin, metallic blue armor, and confident posture. The character should look like a mayor or leader, standing tall with arms crossed or pointing forward. Blue eyes, blue hair, wearing a blue suit or armor. Sci-fi style, high quality, detailed. At the end of the video, the character will give you a kiss. The video should be at least 15 seconds long.",
    },
    {
      id: "bts-jungkook",
      name: "Jungkook (BTS)",
      description:
        "Jungkook from BTS, Korean pop star, handsome young man with dark hair, charismatic smile, wearing stylish modern outfit, confident pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jungkook will give you a kiss. The video should be at least 15 seconds long.",
    },
    {
      id: "bts-jimin",
      name: "Jimin (BTS)",
      description:
        "Jimin from BTS, Korean pop star, elegant and graceful young man with blonde hair, charming smile, wearing fashionable outfit, artistic pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jimin will give you a kiss. The video should be at least 15 seconds long.",
    },
    {
      id: "bts-v",
      name: "V (BTS)",
      description:
        "V from BTS, Korean pop star, handsome young man with dark hair, mysterious and charismatic expression, wearing trendy outfit, cool pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, V will give you a kiss. The video should be at least 15 seconds long.",
    },
    {
      id: "blackpink-jennie",
      name: "Jennie (BLACKPINK)",
      description:
        "Jennie from BLACKPINK, Korean pop star, beautiful young woman with dark hair, confident and stylish expression, wearing fashionable outfit, elegant pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Jennie will give you a kiss. The video should be at least 15 seconds long.",
    },
    {
      id: "blackpink-lisa",
      name: "Lisa (BLACKPINK)",
      description:
        "Lisa from BLACKPINK, Korean pop star, beautiful young woman with blonde hair, energetic and charismatic expression, wearing trendy outfit, dynamic pose, K-pop idol style, high quality portrait, detailed facial features. At the end of the video, Lisa will give you a kiss. The video should be at least 15 seconds long.",
    },
  ];

  const captureImage = useCallback(async () => {
    try {
      setError(null);

      if (!cameraStream) {
        setError("Camera not available. Please refresh the page.");
        return;
      }

      if (!videoRef.current) {
        setError("Video element not available.");
        return;
      }

      // Create canvas to capture image from video
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        setError("Canvas context not available.");
        return;
      }

      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      // Draw video frame to canvas
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setError("Failed to capture image.");
            return;
          }

          // Create image URL and file
          const imageUrl = URL.createObjectURL(blob);
          const file = new File([blob], "captured-image.jpg", {
            type: "image/jpeg",
          });

          setCapturedImage(imageUrl);
          setImageFile(file);
          setError(null);
          setCaption(null);

          console.log("Image captured successfully:", imageUrl);

          // Save to cache
          try {
            const formData = new FormData();
            formData.append("imageFile", file);

            const response = await fetch("/api/save-captured-image", {
              method: "POST",
              body: formData,
            });

            if (response.ok) {
              const data = await response.json();
              console.log("Saved captured image to cache:", data.imageUrl);
            }
          } catch (error) {
            console.error("Failed to save captured image to cache:", error);
          }
        },
        "image/jpeg",
        0.9
      );
    } catch (err) {
      console.error("Image capture error:", err);
      setError("Failed to capture image. Please check camera permissions.");
    }
  }, [cameraStream]);

  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Check if it's an image file
        if (!file.type.startsWith("image/")) {
          setError("Please select an image file");
          return;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          setError("Image file is too large. Maximum size is 10MB.");
          return;
        }

        setImageFile(file);
        setCapturedImage(URL.createObjectURL(file));
        setError(null);
        setCaption(null);

        // Save to cache
        try {
          const formData = new FormData();
          formData.append("imageFile", file);

          const response = await fetch("/api/save-captured-image", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Saved uploaded image to cache:", data.imageUrl);
          }
        } catch (error) {
          console.error("Failed to save uploaded image to cache:", error);
        }
      }
    },
    []
  );

  // Helper function to make API calls with retry logic
  const makeApiCallWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries = 3
  ): Promise<Response> => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (response.status === 429) {
          // Rate limited - wait and retry
          const retryAfter = response.headers.get("retry-after");
          const waitTime = retryAfter
            ? parseInt(retryAfter) * 1000
            : Math.pow(2, attempt) * 1000;

          if (attempt < maxRetries) {
            console.log(
              `Rate limited. Waiting ${waitTime}ms before retry ${
                attempt + 1
              }/${maxRetries}`
            );
            await new Promise((resolve) => setTimeout(resolve, waitTime));
            continue;
          }
        }

        return response;
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff for other errors
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(
          `API call failed. Waiting ${waitTime}ms before retry ${
            attempt + 1
          }/${maxRetries}`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    throw new Error("Max retries exceeded");
  };

  // Unified flow function
  const startUnifiedFlow = async () => {
    if (!imageFile && !cachedRecordedVideo) {
      setError("Please capture or upload an image first");
      return;
    }

    setIsProcessingFlow(true);
    setProgress(0);
    setError(null);
    setFinalVideo(null);

    // If we have a cached image but no current imageFile, create a file from the cached image
    let currentImageFile = imageFile;
    if (!currentImageFile && cachedRecordedVideo) {
      try {
        // Fetch the cached image and create a File object
        const response = await fetch(cachedRecordedVideo);
        const blob = await response.blob();
        currentImageFile = new File([blob], "cached-image.jpg", {
          type: blob.type,
        });
        console.log("Using cached captured image:", cachedRecordedVideo);
      } catch (error) {
        console.error("Failed to load cached image:", error);
        setError("Failed to load cached image. Please capture a new image.");
        setIsProcessingFlow(false);
        return;
      }
    }

    try {
      // Step 1: Generate Rap Lyrics with streaming (25%)
      setCurrentStep("Creating personalized rap lyrics...");
      setProgress(25);

      const selectedChar = characterOptions.find(
        (char) => char.id === selectedCharacter
      );
      if (!selectedChar) {
        throw new Error("Please select a character");
      }

      let lyricsData: { text: string; error?: string };

      // Check if we already have lyrics cached
      if (rapLyrics) {
        console.log("Using cached lyrics:", rapLyrics);
        lyricsData = { text: rapLyrics };
      } else {
        // Generate rap lyrics using AI
        setIsStreamingLyrics(true);
        setStreamingLyrics("");

        const rapPrompt = `Create a personalized rap song for ${
          selectedChar.name.split(" ")[0]
        }, a ${
          selectedChar.name.includes("BTS") ||
          selectedChar.name.includes("BLACKPINK")
            ? "K-pop star"
            : "celebrity character"
        }. The rap should be romantic and flirty, mentioning that they will give the listener a kiss at the end. Make it catchy, with rhymes and rhythm. Keep it to about 8 lines. The tone should be confident and charming.`;

        const lyricsResponse = await makeApiCallWithRetry("/api/generate-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: rapPrompt,
            verbosity: "medium",
            reasoning_effort: "minimal",
            max_completion_tokens: 500,
            system_prompt:
              "You are a talented rap songwriter. Create catchy, rhyming rap lyrics with a romantic and flirty tone. Focus on rhythm and flow. Keep responses concise and engaging.",
          }),
        });

        if (!lyricsResponse.ok) {
          throw new Error("Failed to generate rap lyrics");
        }

        lyricsData = await lyricsResponse.json();
        if (lyricsData.error) {
          throw new Error(lyricsData.error);
        }

        // Simulate streaming by breaking the text into lines and displaying them progressively
        const lines = lyricsData.text
          .split("\n")
          .filter((line: string) => line.trim());
        let currentLyrics = "";

        console.log("Generated lyrics:", lyricsData.text);
        console.log("Lyrics lines:", lines);

        for (let i = 0; i < lines.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 600)); // 600ms delay between lines
          currentLyrics += (currentLyrics ? "\n" : "") + lines[i];
          setStreamingLyrics(currentLyrics);
          console.log("Streaming lyrics so far:", currentLyrics);
        }

        setIsStreamingLyrics(false);
        setRapLyrics(lyricsData.text);
        console.log("Final lyrics set:", lyricsData.text);

        // Save lyrics to cache
        try {
          const lyricsCacheKey = `lyrics-${selectedChar.name}-${Date.now()}`;
          const response = await fetch("/api/cache", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key: lyricsCacheKey,
              data: {
                text: lyricsData.text,
                character: selectedChar.name,
                timestamp: Date.now(),
              },
            }),
          });
          
          if (response.ok) {
            console.log("Saved lyrics to cache:", lyricsCacheKey);
          }
        } catch (error) {
          console.error("Failed to save lyrics to cache:", error);
        }
      }

      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

      // Step 2: Generate Music (50%)
      setCurrentStep("Composing rap music...");
      setProgress(50);

      let musicUrl = generatedMusic;

      console.log(lyricsData.text);

      if (!musicUrl) {
        console.log("Generating music with lyrics:", lyricsData.text);

        const musicResponse = await makeApiCallWithRetry(
          "/api/generate-music",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lyrics: lyricsData.text,
              duration: 20, // 20 seconds as requested
              bitrate: 256000,
              sample_rate: 44100,
            }),
          }
        );

        if (!musicResponse.ok) {
          const errorText = await musicResponse.text();
          console.error("Music generation failed:", errorText);
          throw new Error("Failed to generate music");
        }

        const musicData = await musicResponse.json();
        console.log("Music generation response:", musicData);

        if (musicData.error) {
          console.error("Music generation error:", musicData.error);
          throw new Error(musicData.error);
        }

        musicUrl = musicData.audioUrl;
        setGeneratedMusic(musicUrl);

        if (musicData.cached) {
          console.log("Used cached music:", musicUrl);
        } else {
          console.log("Generated new music:", musicUrl);
        }
      } else {
        console.log("Using existing music:", musicUrl);
      }

      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

      // Step 3: Generate Image with Celebrity in Background (75%)
      setCurrentStep("Creating image with celebrity in background...");
      setProgress(75);

      const celebrityPrompt = `Create an image with ${selectedChar.name} in the background environment. The celebrity should be naturally integrated into the scene, looking like they belong in that environment. High quality, cinematic lighting, realistic composition. The celebrity will be rapping in this environment.`;

      const characterImageResponse = await fetch("/api/get-character-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName: selectedChar.name,
          characterDescription: celebrityPrompt,
        }),
      });

      if (!characterImageResponse.ok) {
        throw new Error("Failed to generate celebrity image");
      }

      const characterImageData = await characterImageResponse.json();
      if (characterImageData.error) {
        throw new Error(characterImageData.error);
      }

      setCharacterImageUrl(characterImageData.imageUrl);

      // Step 4: Generate Video with Celebrity Rapping (90%)
      setCurrentStep("Creating video with celebrity rapping...");
      setProgress(90);

      const omniHumanResponse = await fetch("/api/generate-video", {
        method: "POST",
        body: (() => {
          const formData = new FormData();
          if (musicUrl) formData.append("audio", musicUrl);
          if (characterImageData.imageUrl)
            formData.append("image", characterImageData.imageUrl);
          return formData;
        })(),
      });

      if (!omniHumanResponse.ok) {
        throw new Error("Failed to generate omni-human video");
      }

      const omniHumanData = await omniHumanResponse.json();
      if (omniHumanData.error) {
        throw new Error(omniHumanData.error);
      }

      setFinalVideo(omniHumanData.videoUrl);

      // Add delay to prevent rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 second delay

      setCurrentStep("Complete! Your celebrity lip sync video is ready!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      console.error("Unified flow error:", err);
    } finally {
      setIsProcessingFlow(false);
    }
  };

  const resetAll = () => {
    setCapturedImage(null);
    setImageFile(null);
    setCaption(null);
    setError(null);
    setGeneratedMusic(null);
    setFinalVideo(null);
    setStreamingLyrics("");
    setIsStreamingLyrics(false);
    setProgress(0);
    setCurrentStep("");
    setRapLyrics("");
    setCharacterImageUrl(null);
    setCachedRecordedVideo(null);

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
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
            Create a personalized video with your favorite K-pop star or blue
            character. They&apos;ll rap for you and give you a kiss at the end!
          </p>

          {/* Navigation */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
            {/* <Link
              href="/campaign"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              🗳️ Campaign Mode
            </Link> */}
            <button
              onClick={resetAll}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              🔄 Reset All Data
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Invite Your Celebrity
            </h2>

            <div className="space-y-6 sm:space-y-8">
              {/* Image Capture/Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Step 1: Capture or Upload Your Image
                </h3>

                {isDesktop ? (
                  // Desktop Recording Interface
                  <div className="space-y-4">
                    {/* Camera Preview */}
                    <div className="relative">
                      {cameraLoading ? (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <div className="text-gray-500 mb-2">📷</div>
                          <p className="text-gray-600 mb-4">
                            Initializing camera...
                          </p>
                          <div className="mt-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          </div>
                        </div>
                      ) : cameraError ? (
                        <div className="bg-gray-100 rounded-lg p-8 text-center">
                          <div className="text-gray-500 mb-2">📷</div>
                          <p className="text-gray-600 mb-4">{cameraError}</p>
                          <button
                            onClick={initializeCamera}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Retry Camera Access
                          </button>
                        </div>
                      ) : (
                        <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                          <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-96 sm:h-80 object-cover"
                            style={{
                              transform: "scaleX(-1)", // Mirror effect
                              backgroundColor: "#1f2937",
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Image Capture Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                      <button
                        onClick={captureImage}
                        disabled={!cameraStream || cameraLoading}
                        className="bg-blue-600 text-white py-4 px-8 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-3 text-lg"
                        style={{ minHeight: "48px", minWidth: "200px" }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Capture Image
                      </button>
                    </div>
                  </div>
                ) : (
                  // Mobile Upload Interface
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <div className="text-gray-500 mb-4">
                      <svg
                        className="mx-auto h-12 w-12"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-900">
                        Upload an image file
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, and other image formats
                      </p>
                      <p className="text-xs text-gray-400">
                        Maximum file size: 10 MB
                      </p>
                    </div>
                    <div className="mt-6">
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <span className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Choose Image File
                        </span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Image Preview */}
                {capturedImage && (
                  <div className="mt-6">
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Your Image
                    </h4>
                    <Image
                      src={capturedImage}
                      alt="Captured image"
                      width={800}
                      height={400}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                )}
              </div>

              {/* Character Selection */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Step 2: Choose Your Celebrity
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {characterOptions.map((character) => (
                    <button
                      key={character.id}
                      onClick={() => setSelectedCharacter(character.id)}
                      className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                        selectedCharacter === character.id
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">
                          {character.id === "blue"
                            ? "🔵"
                            : character.id.includes("jungkook")
                            ? "🎤"
                            : character.id.includes("jimin")
                            ? "✨"
                            : character.id.includes("v")
                            ? "🎭"
                            : character.id.includes("jennie")
                            ? "💄"
                            : character.id.includes("lisa")
                            ? "💃"
                            : "⭐"}
                        </div>
                        <div className="text-xs">{character.name}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Unified Flow Button */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Step 3: Create Your Celebrity Video
                </h3>

                <button
                  onClick={startUnifiedFlow}
                  disabled={
                    (!imageFile && !cachedRecordedVideo) || isProcessingFlow
                  }
                  className="bg-linear-to-r from-purple-600 to-pink-600 text-white py-6 px-12 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-4 text-xl touch-manipulation shadow-lg"
                  style={{ minHeight: "60px", minWidth: "300px" }}
                >
                  {isProcessingFlow ? (
                    <>
                      <svg
                        className="animate-spin h-8 w-8"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
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
                        className="bg-linear-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <p className="text-center text-gray-600 font-medium">
                      {currentStep}
                    </p>
                  </div>
                )}

                {/* Streaming Lyrics */}
                {isStreamingLyrics && (
                  <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                    <h4 className="text-md font-medium text-gray-900 mb-3 text-center">
                      🎤 Creating Your Rap Lyrics...
                    </h4>
                    <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm whitespace-pre-line min-h-[120px]">
                      {streamingLyrics}
                      {isStreamingLyrics && (
                        <span className="animate-pulse">|</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Generated Lyrics Display */}
                {rapLyrics && !isStreamingLyrics && (
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h4 className="text-md font-medium text-blue-900 mb-3 text-center">
                      🎤 Your Generated Rap Lyrics
                    </h4>
                    <div className="bg-white text-gray-800 p-4 rounded-lg font-medium whitespace-pre-line min-h-[100px] border">
                      {rapLyrics}
                    </div>
                  </div>
                )}

                {/* Final Video */}
                {finalVideo && (
                  <div className="mt-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 text-center">
                      🎉 Your Celebrity Video is Ready!
                    </h4>
                    <video
                      controls
                      src={finalVideo}
                      className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
                      style={{ maxHeight: "500px" }}
                    >
                      Your browser does not support the video tag.
                    </video>
                    <div className="mt-4 text-center">
                      <p className="text-gray-600 mb-2">
                        Your celebrity will give you a kiss at the end! 💋
                      </p>
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
                    <div className="shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
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
                  <h3 className="text-sm font-medium text-green-800 mb-2">
                    Video Caption
                  </h3>
                  <p className="text-sm text-green-700">{caption}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Preview Section */}
        {(rapLyrics ||
          generatedMusic ||
          characterImageUrl ||
          finalVideo ||
          cachedRecordedVideo) && (
          <div className="max-w-4xl mx-auto mt-8">
            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center">
                📁 Current Saved Data
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cached Captured Image Preview */}
                {cachedRecordedVideo && (
                  <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3 flex items-center gap-2">
                      📸 Cached Captured Image
                    </h3>
                    <div className="bg-white p-3 rounded-lg border">
                      <Image
                        src={cachedRecordedVideo}
                        alt="Cached captured image"
                        width={400}
                        height={200}
                        className="w-full rounded-lg"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  </div>
                )}

                {/* Lyrics Preview */}
                {rapLyrics && (
                  <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      🎤 Generated Lyrics
                    </h3>
                    <div className="bg-white text-gray-800 p-3 rounded-lg font-medium whitespace-pre-line text-sm max-h-32 overflow-y-auto border">
                      {rapLyrics}
                    </div>
                  </div>
                )}

                {/* Music Preview */}
                {generatedMusic && (
                  <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                      🎵 Generated Music
                    </h3>
                    <div className="bg-white p-3 rounded-lg border">
                      <audio controls className="w-full">
                        <source src={generatedMusic} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                )}

                {/* Character Image Preview */}
                {characterImageUrl && (
                  <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                      🖼️ Character Image
                    </h3>
                    <div className="bg-white p-3 rounded-lg border">
                      <Image
                        src={characterImageUrl}
                        alt="Generated Character"
                        width={400}
                        height={128}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Final Video Preview */}
                {finalVideo && (
                  <div className="bg-pink-50 rounded-lg p-4 border-2 border-pink-200 md:col-span-2">
                    <h3 className="text-lg font-semibold text-pink-900 mb-3 flex items-center gap-2">
                      🎬 Final Video
                    </h3>
                    <div className="bg-white p-3 rounded-lg border">
                      <video
                        controls
                        src={finalVideo}
                        className="w-full max-w-2xl mx-auto rounded-lg"
                        style={{ maxHeight: "300px" }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
