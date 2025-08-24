import React, { useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

export interface YandexMapProps {
  center?: { lat: number; lng: number };
  balloonContent?: string;
  width?: string | number;
  height?: string | number;
  zoom?: number;
}

const DEFAULT_COORDS = { lat: 41.2995, lng: 69.2401 }; // Codial Academy (Tashkent)

const YandexMap: React.FC<YandexMapProps> = ({
  center,
  balloonContent = 'Codial Academy',
  width = '100%',
  height = '200px',
  zoom = 16,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const latitude = typeof center?.lat === 'number' && center.lat !== 0 ? center.lat : DEFAULT_COORDS.lat;
  const longitude = typeof center?.lng === 'number' && center.lng !== 0 ? center.lng : DEFAULT_COORDS.lng;

  const handleMapLoad = () => {
    setIsLoading(false);
  };

  const handleMapError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg"
        style={{ width, height }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-sm">Xaritani yuklab bo'lmadi</p>
          <p className="text-xs mt-1">{balloonContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg z-10"
        >
          <div className="text-center text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto mb-2"></div>
            <p className="text-sm">Xarita yuklanmoqda...</p>
          </div>
        </div>
      )}
      
      <YMaps>
        <Map
          defaultState={{
            center: [latitude, longitude],
            zoom,
          }}
          width={width}
          height={height}
          options={{
            suppressMapOpenBlock: true,
          }}
          modules={['control.ZoomControl', 'control.FullscreenControl']}
          onLoad={handleMapLoad}
          onError={handleMapError}
        >
          <Placemark
            geometry={[latitude, longitude]}
            properties={{
              balloonContent,
              hintContent: balloonContent,
            }}
            options={{
              preset: 'islands#redDotIcon',
            }}
          />
        </Map>
      </YMaps>
    </div>
  );
};

export default YandexMap;




