'use client';

import { useState } from 'react';
import { City } from '@/types';

const majorCities: City[] = [
  { id: 'nyc', name: 'New York', state: 'NY', x: 40.7, y: -74.0, population: '8.3M', region: 'Northeast' },
  { id: 'la', name: 'Los Angeles', state: 'CA', x: 34.0, y: -118.2, population: '3.9M', region: 'West' },
  { id: 'chicago', name: 'Chicago', state: 'IL', x: 41.8, y: -87.6, population: '2.7M', region: 'Midwest' },
  { id: 'houston', name: 'Houston', state: 'TX', x: 29.7, y: -95.3, population: '2.3M', region: 'South' },
  { id: 'phoenix', name: 'Phoenix', state: 'AZ', x: 33.4, y: -112.0, population: '1.6M', region: 'West' },
  { id: 'philadelphia', name: 'Philadelphia', state: 'PA', x: 39.9, y: -75.1, population: '1.6M', region: 'Northeast' },
  { id: 'san-antonio', name: 'San Antonio', state: 'TX', x: 29.4, y: -98.4, population: '1.5M', region: 'South' },
  { id: 'san-diego', name: 'San Diego', state: 'CA', x: 32.7, y: -117.1, population: '1.4M', region: 'West' },
  { id: 'dallas', name: 'Dallas', state: 'TX', x: 32.7, y: -96.7, population: '1.3M', region: 'South' },
  { id: 'san-jose', name: 'San Jose', state: 'CA', x: 37.3, y: -121.8, population: '1.0M', region: 'West' },
  { id: 'austin', name: 'Austin', state: 'TX', x: 30.2, y: -97.7, population: '978K', region: 'South' },
  { id: 'jacksonville', name: 'Jacksonville', state: 'FL', x: 30.3, y: -81.6, population: '950K', region: 'South' },
  { id: 'fort-worth', name: 'Fort Worth', state: 'TX', x: 32.7, y: -97.3, population: '918K', region: 'South' },
  { id: 'columbus', name: 'Columbus', state: 'OH', x: 39.9, y: -82.9, population: '906K', region: 'Midwest' },
  { id: 'charlotte', name: 'Charlotte', state: 'NC', x: 35.2, y: -80.8, population: '885K', region: 'South' },
  { id: 'seattle', name: 'Seattle', state: 'WA', x: 47.6, y: -122.3, population: '749K', region: 'West' },
  { id: 'denver', name: 'Denver', state: 'CO', x: 39.7, y: -104.9, population: '715K', region: 'West' },
  { id: 'washington', name: 'Washington', state: 'DC', x: 38.9, y: -77.0, population: '705K', region: 'Northeast' },
  { id: 'boston', name: 'Boston', state: 'MA', x: 42.3, y: -71.0, population: '695K', region: 'Northeast' },
  { id: 'el-paso', name: 'El Paso', state: 'TX', x: 31.7, y: -106.4, population: '678K', region: 'South' },
  { id: 'nashville', name: 'Nashville', state: 'TN', x: 36.1, y: -86.7, population: '670K', region: 'South' },
  { id: 'detroit', name: 'Detroit', state: 'MI', x: 42.3, y: -83.0, population: '639K', region: 'Midwest' },
  { id: 'oklahoma-city', name: 'Oklahoma City', state: 'OK', x: 35.4, y: -97.5, population: '655K', region: 'South' },
  { id: 'portland', name: 'Portland', state: 'OR', x: 45.5, y: -122.6, population: '652K', region: 'West' },
  { id: 'las-vegas', name: 'Las Vegas', state: 'NV', x: 36.1, y: -115.1, population: '641K', region: 'West' },
  { id: 'memphis', name: 'Memphis', state: 'TN', x: 35.1, y: -90.0, population: '633K', region: 'South' },
  { id: 'louisville', name: 'Louisville', state: 'KY', x: 38.2, y: -85.7, population: '633K', region: 'South' },
  { id: 'baltimore', name: 'Baltimore', state: 'MD', x: 39.2, y: -76.6, population: '585K', region: 'Northeast' },
  { id: 'milwaukee', name: 'Milwaukee', state: 'WI', x: 43.0, y: -87.9, population: '577K', region: 'Midwest' },
  { id: 'albuquerque', name: 'Albuquerque', state: 'NM', x: 35.0, y: -106.6, population: '564K', region: 'West' },
];

const regionColors = {
  'Northeast': 'bg-blue-100 text-blue-800 border-blue-200',
  'South': 'bg-green-100 text-green-800 border-green-200',
  'Midwest': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'West': 'bg-purple-100 text-purple-800 border-purple-200',
};

interface AmericaMapProps {
  onCitySelect?: (cityName: string) => void;
}

export function AmericaMap({ onCitySelect }: AmericaMapProps = {}) {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleCityClick = (cityId: string) => {
    const city = majorCities.find(c => c.id === cityId);
    if (!city) return;

    // Single city selection - toggle if same city, otherwise select new city
    if (selectedCity === cityId) {
      setSelectedCity(null);
      if (onCitySelect) {
        onCitySelect('');
      }
    } else {
      setSelectedCity(cityId);
      if (onCitySelect) {
        onCitySelect(city.name);
      }
    }
  };

  const getCityColor = (cityId: string) => {
    if (selectedCity === cityId) return 'fill-emerald-500';
    if (hoveredCity === cityId) return 'fill-red-600';
    return 'fill-red-500';
  };

  const selectedCityData = selectedCity ? majorCities.find(city => city.id === selectedCity) : null;
  const filteredCities = selectedRegion 
    ? majorCities.filter(city => city.region === selectedRegion)
    : majorCities;

  // Convert lat/lng to SVG coordinates with accurate USA bounds
  const latLngToSvg = (lat: number, lng: number) => {
    // USA bounds: roughly 24.5-49 N, 66.9-125 W
    const x = ((lng + 125) / 58.1) * 380 + 10; // Convert longitude to x (10-390)
    const y = ((49 - lat) / 24.5) * 230 + 10; // Convert latitude to y (10-240)
    return { x: Math.max(10, Math.min(390, x)), y: Math.max(10, Math.min(240, y)) };
  };

  const getRegionStats = () => {
    const stats = majorCities.reduce((acc, city) => {
      acc[city.region] = (acc[city.region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const regionStats = getRegionStats();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 flex items-center">
            <span className="mr-2 sm:mr-3">🗺️</span>
            <span className="break-words">Explore Major Cities Across America</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg">
            Click on any city to select it. Use the region filter to focus on specific areas.
          </p>
        </div>

        {/* Region Filter */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                selectedRegion === null 
                  ? 'bg-gray-800 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Regions
            </button>
            {Object.keys(regionStats).map(region => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  selectedRegion === region 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="hidden sm:inline">{region} ({regionStats[region]})</span>
                <span className="sm:hidden">{region}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Map */}
          <div className="lg:col-span-3 order-1">
            <div className="bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-2xl p-3 sm:p-4 lg:p-6 h-[400px] sm:h-[500px] lg:h-[600px] shadow-inner">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 250"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Simplified but more accurate USA outline */}
                <path
                  d="M15 40 L385 40 L385 210 L375 210 L375 200 L365 200 L365 210 L355 210 L355 200 L345 200 L345 210 L335 210 L335 200 L325 200 L325 210 L315 210 L315 200 L305 200 L305 210 L295 210 L295 200 L285 200 L285 210 L275 210 L275 200 L265 200 L265 210 L255 210 L255 200 L245 200 L245 210 L235 210 L235 200 L225 200 L225 210 L215 210 L215 200 L205 200 L205 210 L195 210 L195 200 L185 200 L185 210 L175 210 L175 200 L165 200 L165 210 L155 210 L155 200 L145 200 L145 210 L135 210 L135 200 L125 200 L125 210 L115 210 L115 200 L105 200 L105 210 L95 210 L95 200 L85 200 L85 210 L75 210 L75 200 L65 200 L65 210 L55 210 L55 200 L45 200 L45 210 L35 210 L35 200 L25 200 L25 210 L15 210 Z"
                  fill="#e5f3ff"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  className="drop-shadow-sm"
                />
                
                {/* Continental USA shape approximation */}
                <path
                  d="M25 45 L375 45 L375 55 L365 55 L365 65 L355 65 L355 75 L345 75 L345 85 L335 85 L335 95 L325 95 L325 105 L315 105 L315 115 L305 115 L305 125 L295 125 L295 135 L285 135 L285 145 L275 145 L275 155 L265 155 L265 165 L255 165 L255 175 L245 175 L245 185 L235 185 L235 195 L225 195 L225 185 L215 185 L215 175 L205 175 L205 165 L195 165 L195 155 L185 155 L185 145 L175 145 L175 135 L165 135 L165 125 L155 125 L155 115 L145 115 L145 105 L135 105 L135 95 L125 95 L125 85 L115 85 L115 75 L105 75 L105 65 L95 65 L95 55 L85 55 L85 45 L25 45 Z"
                  fill="#f0f9ff"
                  stroke="#1d4ed8"
                  strokeWidth="1.5"
                />
                
                {/* Cities */}
                {filteredCities.map((city) => {
                  const { x, y } = latLngToSvg(city.x, city.y);
                  const isSelected = selectedCity === city.id;
                  const isHovered = hoveredCity === city.id;
                  
                  return (
                    <g key={city.id}>
                      {/* City dot with fixed size - no movement on selection */}
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        className={`city-dot ${getCityColor(city.id)} ${
                          isSelected ? 'city-selected' : ''
                        }`}
                        onClick={() => handleCityClick(city.id)}
                        onMouseEnter={() => setHoveredCity(city.id)}
                        onMouseLeave={() => setHoveredCity(null)}
                        style={{
                          filter: isHovered ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))' : 
                                  isSelected ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' : 
                                  'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2))',
                          cursor: 'pointer'
                        }}
                      />
                      
                      {/* City label with responsive positioning */}
                      <text
                        x={x + 8}
                        y={y - 8}
                        className="city-label fill-gray-800 font-semibold"
                        style={{ fontSize: '9px' }}
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected City Panel */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Selected City
              </h3>
              {selectedCityData ? (
                <div className="bg-white rounded-xl p-3 sm:p-4 shadow-md border border-blue-200 hover:shadow-lg transition-all duration-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{selectedCityData.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{selectedCityData.state}</p>
                      <p className="text-xs text-gray-500">Population: {selectedCityData.population}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${regionColors[selectedCityData.region as keyof typeof regionColors]}`}>
                        {selectedCityData.region}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCityClick(selectedCityData.id)}
                      className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors hover:scale-110 ml-2 flex-shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🗺️</div>
                  <p className="text-blue-700 text-xs sm:text-sm font-medium">No city selected</p>
                  <p className="text-blue-600 text-xs mt-1">Click on the map to select a city!</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl p-4 sm:p-6 shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold text-emerald-900 mb-3 sm:mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Quick Stats
              </h3>
              <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-emerald-800">
                <div className="flex justify-between items-center">
                  <span>Total Cities:</span>
                  <span className="font-bold text-base sm:text-lg">{majorCities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Selected:</span>
                  <span className="font-bold text-base sm:text-lg text-emerald-600">{selectedCity ? '1' : '0'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Available:</span>
                  <span className="font-bold text-base sm:text-lg">{majorCities.length - (selectedCity ? 1 : 0)}</span>
                </div>
                {selectedRegion && (
                  <div className="pt-2 border-t border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span>Filtered:</span>
                      <span className="font-bold text-base sm:text-lg">{filteredCities.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => setSelectedCity(null)}
                className="w-full bg-gray-500 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
                disabled={!selectedCity}
              >
                🗑️ Clear Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}