'use client';

import { useState } from 'react';
import { AmericaMap } from "@/components/america-map";
import { AvatarGenerationResponse, CampaignPosterResponse, CampaignVideoResponse } from "@/types";
import { CAMPAIGN_STYLES } from "@/constants/campaign";

export default function Home() {
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAvatar, setGeneratedAvatar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Campaign poster states
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('republican');
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
  const [posterError, setPosterError] = useState<string | null>(null);
  
  // Campaign video states
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoSettings, setVideoSettings] = useState({
    fps: 24,
    duration: 5,
    resolution: '720p' as '480p' | '720p',
    aspect_ratio: '16:9' as '16:9' | '9:16' | '1:1',
    camera_fixed: false
  });

  const generateAvatar = async () => {
    if (!description.trim()) {
      setError('Please enter a description of yourself');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate avatar');
      }

      const data: AvatarGenerationResponse = await response.json();
      setGeneratedAvatar(data.imageUrl || null);
    } catch (err) {
      setError('Failed to generate avatar. Please try again.');
      console.error('Avatar generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCampaignPoster = async () => {
    if (!description.trim()) {
      setPosterError('Please enter a description of yourself');
      return;
    }

    if (!selectedCity) {
      setPosterError('Please select a city from the map');
      return;
    }

    setIsGeneratingPoster(true);
    setPosterError(null);

    try {
      const response = await fetch('/api/generate-campaign-poster', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          description, 
          selectedCity, 
          campaignStyle: selectedStyle 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate campaign poster');
      }

      const data: CampaignPosterResponse = await response.json();
      setGeneratedPoster(data.imageUrl || null);
    } catch (err) {
      setPosterError('Failed to generate campaign poster. Please try again.');
      console.error('Campaign poster generation error:', err);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  const generateCampaignVideo = async () => {
    if (!description.trim()) {
      setVideoError('Please enter a description of yourself');
      return;
    }

    if (!selectedCity) {
      setVideoError('Please select a city from the map');
      return;
    }

    setIsGeneratingVideo(true);
    setVideoError(null);

    try {
      const response = await fetch('/api/generate-campaign-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          description, 
          selectedCity, 
          campaignStyle: selectedStyle,
          videoSettings
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate campaign video');
      }

      const data: CampaignVideoResponse = await response.json();
      setGeneratedVideo(data.videoUrl || null);
    } catch (err) {
      setVideoError('Failed to generate campaign video. Please try again.');
      console.error('Campaign video generation error:', err);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="text-blue-600">Be The Mayor</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Create your avatar, campaign posters, and videos. Explore interactive maps.
          </p>
        </div>

        {/* Unified Campaign Generation Section */}
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Create Your Campaign Materials
            </h2>
            
            <div className="space-y-8">
              {/* Description Input */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Describe yourself
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe yourself in detail... (e.g., 'A friendly software engineer with curly brown hair, wearing glasses, in a casual blue shirt')"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>

              {/* Campaign Style Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose Campaign Style
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CAMPAIGN_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedStyle === style.id
                          ? `border-${style.colorScheme} bg-${style.colorScheme} text-white`
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-sm">{style.name}</div>
                      <div className="text-xs opacity-75 mt-1">{style.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected City
                </label>
                <div className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                  {selectedCity ? (
                    <span className="text-gray-900 font-medium">{selectedCity}</span>
                  ) : (
                    <span className="text-gray-500">Select a city from the map below</span>
                  )}
                </div>
              </div>

              {/* Video Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Video Settings
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Duration</label>
                    <select
                      value={videoSettings.duration}
                      onChange={(e) => setVideoSettings(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value={3}>3s</option>
                      <option value={5}>5s</option>
                      <option value={10}>10s</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Resolution</label>
                    <select
                      value={videoSettings.resolution}
                      onChange={(e) => setVideoSettings(prev => ({ ...prev, resolution: e.target.value as '480p' | '720p' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Aspect Ratio</label>
                    <select
                      value={videoSettings.aspect_ratio}
                      onChange={(e) => setVideoSettings(prev => ({ ...prev, aspect_ratio: e.target.value as '16:9' | '9:16' | '1:1' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="16:9">16:9</option>
                      <option value="9:16">9:16</option>
                      <option value="1:1">1:1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Camera</label>
                    <select
                      value={videoSettings.camera_fixed ? 'fixed' : 'dynamic'}
                      onChange={(e) => setVideoSettings(prev => ({ ...prev, camera_fixed: e.target.value === 'fixed' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="dynamic">Dynamic</option>
                      <option value="fixed">Fixed</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Generation Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Avatar Generation */}
                <button
                  onClick={generateAvatar}
                  disabled={isGenerating || !description.trim()}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    '🎭 Generate Avatar'
                  )}
                </button>

                {/* Poster Generation */}
                <button
                  onClick={generateCampaignPoster}
                  disabled={isGeneratingPoster || !description.trim() || !selectedCity}
                  className="bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGeneratingPoster ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    '🎨 Generate Poster'
                  )}
                </button>

                {/* Video Generation */}
                <button
                  onClick={generateCampaignVideo}
                  disabled={isGeneratingVideo || !description.trim() || !selectedCity}
                  className="bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isGeneratingVideo ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    '🎬 Generate Video'
                  )}
                </button>
              </div>

              {/* Error Messages */}
              {(error || posterError || videoError) && (
                <div className="space-y-2">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      Avatar: {error}
                    </div>
                  )}
                  {posterError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      Poster: {posterError}
                    </div>
                  )}
                  {videoError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                      Video: {videoError}
                    </div>
                  )}
                </div>
              )}

              {/* Generated Results */}
              {(generatedAvatar || generatedPoster || generatedVideo) && (
                <div className="space-y-6">
                  {generatedAvatar && (
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Avatar</h3>
                      <img
                        src={generatedAvatar}
                        alt="Generated Avatar"
                        className="mx-auto rounded-lg shadow-lg max-w-sm w-full"
                      />
                    </div>
                  )}

                  {generatedPoster && (
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Campaign Poster</h3>
                      <img
                        src={generatedPoster}
                        alt="Generated Campaign Poster"
                        className="mx-auto rounded-lg shadow-lg max-w-full w-full"
                      />
                    </div>
                  )}

                  {generatedVideo && (
                    <div className="text-center">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Your Campaign Video</h3>
                      <video
                        src={generatedVideo}
                        controls
                        className="mx-auto rounded-lg shadow-lg max-w-full w-full"
                        poster={generatedPoster || undefined}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Interactive America Map */}
        <div className="mt-16">
          <AmericaMap onCitySelect={setSelectedCity} />
        </div>
      </div>
    </div>
  );
}
