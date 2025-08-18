import React from 'react';
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
  const latitude = typeof center?.lat === 'number' && center.lat !== 0 ? center.lat : DEFAULT_COORDS.lat;
  const longitude = typeof center?.lng === 'number' && center.lng !== 0 ? center.lng : DEFAULT_COORDS.lng;

  return (
    <YMaps>
      <Map
        defaultState={{
          center: [latitude, longitude],
          zoom,
        }}
        width={width}
        height={height}
      >
        <Placemark
          geometry={[latitude, longitude]}
          properties={{
            balloonContent,
          }}
        />
      </Map>
    </YMaps>
  );
};

export default YandexMap;


