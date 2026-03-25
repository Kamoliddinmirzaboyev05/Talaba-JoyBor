import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Navigation, Phone, DollarSign } from 'lucide-react';

// --- Custom Icon Setup ---
const customIcon = L.icon({
  iconUrl: '/logo.svg', // public papkasidagi logotip ishlatiladi
  iconSize: [45, 45],
  iconAnchor: [22, 45],
  popupAnchor: [0, -45],
});

// --- Interface ---
interface DormitoryLocationMapProps {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  month_price: number;
  phone_number: string;
  className?: string;
}

const DormitoryLocationMap: React.FC<DormitoryLocationMapProps> = ({
  name,
  address,
  latitude,
  longitude,
  month_price,
  phone_number,
  className = '',
}) => {
  const position: [number, number] = [latitude, longitude];

  const handleOpenNavigation = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price) + " so'm / oy";
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Map Container */}
      <div className="relative w-full h-[300px] rounded-[12px] overflow-hidden shadow-md border border-gray-200 dark:border-gray-800">
        <MapContainer
          center={position}
          zoom={17}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            // For a "dark" theme feel without complex providers, we can use CSS filters
            className="dark:brightness-75 dark:saturate-150"
          />

          <Marker position={position} icon={customIcon}>
            <Popup minWidth={200}>
              <div className="p-1">
                <h4 className="font-bold text-gray-900 text-sm mb-1">{name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                  <MapPin size={12} className="text-gray-400" />
                  <span>{address}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                  <DollarSign size={12} className="text-gray-400" />
                  <span>{formatPrice(month_price)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Phone size={12} className="text-gray-400" />
                  <a href={`tel:${phone_number}`} className="text-blue-500 hover:underline">
                    {phone_number}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Navigation Button */}
      <button
        onClick={handleOpenNavigation}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98]"
      >
        <Navigation size={18} />
        <span>Yo‘lni boshlash</span>
      </button>
    </div>
  );
};

export default DormitoryLocationMap;
