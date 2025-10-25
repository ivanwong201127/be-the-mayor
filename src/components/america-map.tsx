'use client';

import { useState } from 'react';

interface City {
  id: string;
  name: string;
  state: string;
  x: number;
  y: number;
  population: string;
  region: string;
}

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

export function AmericaMap() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const handleCityClick = (cityId: string) => {
    setSelectedCities(prev => 
      prev.includes(cityId) 
        ? prev.filter(id => id !== cityId)
        : [...prev, cityId]
    );
  };

  const getCityColor = (cityId: string) => {
    if (selectedCities.includes(cityId)) return 'fill-emerald-500';
    if (hoveredCity === cityId) return 'fill-red-600';
    return 'fill-red-500';
  };

  const selectedCitiesData = majorCities.filter(city => selectedCities.includes(city.id));
  const filteredCities = selectedRegion 
    ? majorCities.filter(city => city.region === selectedRegion)
    : majorCities;

  // Convert lat/lng to SVG coordinates with better USA bounds
  const latLngToSvg = (lat: number, lng: number) => {
    // USA bounds: roughly 24-49 N, 66-125 W
    const x = ((lng + 125) / 59) * 380 + 10; // Convert longitude to x (10-390)
    const y = ((49 - lat) / 25) * 230 + 10; // Convert latitude to y (10-240)
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
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3 flex items-center">
            <span className="mr-3">🗺️</span>
            Explore Major Cities Across America
          </h2>
          <p className="text-gray-600 text-lg">
            Click on any city to select it. Use the region filter to focus on specific areas.
          </p>
        </div>

        {/* Region Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedRegion(null)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
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
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedRegion === region 
                    ? 'bg-gray-800 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {region} ({regionStats[region]})
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Map */}
          <div className="xl:col-span-3">
            <div className="bg-linear-to-br from-blue-50 via-blue-100 to-indigo-100 rounded-2xl p-6 h-[600px] shadow-inner">
              <svg
                className="w-full h-full"
                viewBox="0 0 400 250"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* More detailed USA outline */}
                <path
                  d="M20 30 L380 30 L380 220 L360 220 L360 200 L340 200 L340 220 L320 220 L320 200 L300 200 L300 220 L280 220 L280 200 L260 200 L260 220 L240 220 L240 200 L220 200 L220 220 L200 220 L200 200 L180 200 L180 220 L160 220 L160 200 L140 200 L140 220 L120 220 L120 200 L100 200 L100 220 L80 220 L80 200 L60 200 L60 220 L40 220 L40 200 L20 200 Z"
                  fill="var(--color-map-land)"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                  className="drop-shadow-md"
                />
                
                {/* Additional landmass for better USA shape */}
                <path
                  d="M20 30 L40 30 L40 50 L60 50 L60 30 L80 30 L80 50 L100 50 L100 30 L120 30 L120 50 L140 50 L140 30 L160 30 L160 50 L180 50 L180 30 L200 30 L200 50 L220 50 L220 30 L240 30 L240 50 L260 50 L260 30 L280 30 L280 50 L300 50 L300 30 L320 30 L320 50 L340 50 L340 30 L360 30 L360 50 L380 50 L380 30 Z"
                  fill="var(--color-map-land)"
                  stroke="#6b7280"
                  strokeWidth="1.5"
                />
                
                {/* Cities */}
                {filteredCities.map((city) => {
                  const { x, y } = latLngToSvg(city.x, city.y);
                  const isSelected = selectedCities.includes(city.id);
                  const isHovered = hoveredCity === city.id;
                  
                  return (
                    <g key={city.id}>
                      {/* City dot with enhanced effects */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isSelected ? "5" : "3"}
                        className={`city-dot ${getCityColor(city.id)} ${
                          isSelected ? 'city-selected' : ''
                        }`}
                        onClick={() => handleCityClick(city.id)}
                        onMouseEnter={() => setHoveredCity(city.id)}
                        onMouseLeave={() => setHoveredCity(null)}
                        style={{
                          filter: isHovered ? 'drop-shadow(0 0 12px rgba(239, 68, 68, 0.8))' : 
                                  isSelected ? 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' : 
                                  'drop-shadow(0 3px 6px rgba(0, 0, 0, 0.2))'
                        }}
                      />
                      
                      {/* City label with better positioning */}
                      <text
                        x={x + 8}
                        y={y - 8}
                        className="city-label fill-gray-800 font-semibold"
                        style={{ fontSize: '11px' }}
                      >
                        {city.name}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Selected Cities Panel */}
          <div className="space-y-6">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center">
                <span className="mr-2">📍</span>
                Selected Cities ({selectedCities.length})
              </h3>
              {selectedCitiesData.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {selectedCitiesData.map((city) => (
                    <div
                      key={city.id}
                      className="bg-white rounded-xl p-4 shadow-md border border-blue-200 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-900">{city.name}</h4>
                          <p className="text-sm text-gray-600">{city.state}</p>
                          <p className="text-xs text-gray-500">Population: {city.population}</p>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${regionColors[city.region as keyof typeof regionColors]}`}>
                            {city.region}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCityClick(city.id)}
                          className="text-red-500 hover:text-red-700 text-lg font-bold transition-colors hover:scale-110"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-5xl mb-3">🗺️</div>
                  <p className="text-blue-700 text-sm font-medium">No cities selected yet</p>
                  <p className="text-blue-600 text-xs mt-1">Click on the map to start exploring!</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-linear-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-emerald-900 mb-4 flex items-center">
                <span className="mr-2">📊</span>
                Quick Stats
              </h3>
              <div className="space-y-3 text-sm text-emerald-800">
                <div className="flex justify-between items-center">
                  <span>Total Cities:</span>
                  <span className="font-bold text-lg">{majorCities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Selected:</span>
                  <span className="font-bold text-lg text-emerald-600">{selectedCities.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Remaining:</span>
                  <span className="font-bold text-lg">{majorCities.length - selectedCities.length}</span>
                </div>
                {selectedRegion && (
                  <div className="pt-2 border-t border-emerald-200">
                    <div className="flex justify-between items-center">
                      <span>Filtered:</span>
                      <span className="font-bold text-lg">{filteredCities.length}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={() => setSelectedCities([])}
                className="w-full bg-gray-500 text-white py-3 px-4 rounded-xl hover:bg-gray-600 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={selectedCities.length === 0}
              >
                🗑️ Clear All
              </button>
              <button
                onClick={() => setSelectedCities(majorCities.map(city => city.id))}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                ✅ Select All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}