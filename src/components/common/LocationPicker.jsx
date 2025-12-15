import React, { useState, useRef, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { MapPin, Navigation, Loader, AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({ value, onChange, error }) {
  // value = { coordinates: [lng, lat], city: "", state: "" }
  // onChange = (newLocation) => {}

  const [position, setPosition] = useState(
    value?.coordinates &&
      value.coordinates[0] !== 0 &&
      value.coordinates[1] !== 0
      ? [value.coordinates[1], value.coordinates[0]] // Convert [lng, lat] to [lat, lng] for Leaflet
      : null
  );
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const mapRef = useRef(null);

  // Default center (Nigeria center)
  const defaultCenter = [9.082, 8.6753];

  // Update parent when position changes (coordinates only, no geocoding)
  useEffect(() => {
    if (position) {
      const [lat, lng] = position;
      onChange({
        ...value,
        coordinates: [lng, lat], // Just save coordinates
        // Don't auto-fill city/state - let user type manually
      });
    }
  }, [position]);

  // Get user's current location
 const handleGetMyLocation = () => {
   if (!navigator.geolocation) {
     setLocationError("Geolocation is not supported by your browser");
     return;
   }

   setIsGettingLocation(true);
   setLocationError(null);

   navigator.geolocation.getCurrentPosition(
     (pos) => {
       const { latitude, longitude } = pos.coords;

       // Set Leaflet position: [lat, lng]
       setPosition([latitude, longitude]);

       // CRITICAL FIX: Save to form immediately in [lng, lat] order
       onChange({
         ...value,
         coordinates: [longitude, latitude], // [lng, lat] → GeoJSON
       });

       // Fly to location
       if (mapRef.current) {
         mapRef.current.flyTo([latitude, longitude], 13);
       }

       setIsGettingLocation(false);
     },
     (error) => {
       console.error("Geolocation error:", error);
       setLocationError(
         "Could not get your location. Please enable location services or click on the map."
       );
       setIsGettingLocation(false);
     },
     {
       enableHighAccuracy: true,
       timeout: 5000,
       maximumAge: 0,
     }
   );
 };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-900">
          📍 Pin Your Location *
        </label>
        <button
          type="button"
          onClick={handleGetMyLocation}
          disabled={isGettingLocation}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all disabled:opacity-50 hover:shadow-md"
          style={{
            backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
          }}
        >
          {isGettingLocation ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span>Getting location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Use My Location</span>
            </>
          )}
        </button>
      </div>

      <div
        className={`relative rounded-xl overflow-hidden border-2 ${
          error ? "border-red-500" : "border-gray-200"
        }`}
        style={{ height: "350px" }}
      >
        <MapContainer
          center={position || defaultCenter}
          zoom={position ? 13 : 6}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="&copy; Esri"
            maxZoom={19}
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>

        {!position && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 pointer-events-none">
            <div className="bg-white px-4 py-3 rounded-lg shadow-lg text-center">
              <MapPin className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-gray-900">
                Click on the map or use your location
              </p>
            </div>
          </div>
        )}
      </div>

      {locationError && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">{locationError}</p>
        </div>
      )}

      {position && (
        <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <MapPin className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-900">
              Location Set!
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Coordinates: {position[1].toFixed(6)}, {position[0].toFixed(6)}
            </p>
            <p className="text-xs text-green-700 mt-1">
              📍 Now enter your city and state below
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}

      <p className="text-xs text-gray-500">
        💡 Click anywhere on the map to set your exact GPS location. Then
        manually enter your city and state in the fields below.
      </p>
    </div>
  );
}
