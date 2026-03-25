import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Phone, MapPin, Users } from 'lucide-react';

// Custom marker icon using logo.svg from public folder
const customIcon = L.icon({
  iconUrl: '/logo.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

export interface Dormitory {
  id: number | string;
  name: string;
  address: string;
  price: string;
  phone: string;
  latitude: number;
  longitude: number;
  availableSpots?: number;
}

interface DormitoryMapProps {
  dormitories?: Dormitory[];
  height?: string;
  center?: [number, number];
  zoom?: number;
}

// Helper to update map view when props change
const ChangeView: React.FC<{ center: [number, number]; zoom: number; dormitories: Dormitory[] }> = ({ center, zoom, dormitories }) => {
  const map = useMap();

  useEffect(() => {
    if (dormitories.length > 0) {
      const bounds = L.latLngBounds(dormitories.map(d => [d.latitude, d.longitude]));
      if (dormitories.length === 1) {
        map.setView([dormitories[0].latitude, dormitories[0].longitude], 15, { animate: true });
      } else {
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    } else {
      map.setView(center, zoom, { animate: true });
    }
  }, [dormitories, center, zoom, map]);

  return null;
};

const DormitoryMap: React.FC<DormitoryMapProps> = ({
  dormitories = [],
  height = '400px',
  center = [41.311081, 69.240562], // Tashkent default
  zoom = 12,
}) => {
  return (
    <div style={{ height, width: '100%', borderRadius: '12px', overflow: 'hidden' }} className="shadow-md border border-gray-200 dark:border-gray-700">
      <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {dormitories.map((dorm) => (
          <Marker 
            key={dorm.id} 
            position={[dorm.latitude, dorm.longitude]} 
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 min-w-[150px]">
                <h3 className="font-bold text-gray-900 mb-1 text-sm">{dorm.name}</h3>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                  <MapPin size={12} />
                  <span>{dorm.address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                  <span className="font-semibold text-teal-600">{dorm.price}</span>
                </div>
                {dorm.availableSpots !== undefined && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                    <Users size={12} />
                    <span>Bo'sh joylar: {dorm.availableSpots}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone size={12} />
                  <a href={`tel:${dorm.phone}`} className="text-blue-500 hover:underline">{dorm.phone}</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <ChangeView center={center} zoom={zoom} dormitories={dormitories} />
      </MapContainer>
    </div>
  );
};

export default DormitoryMap;
