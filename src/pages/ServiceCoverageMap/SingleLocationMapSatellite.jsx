import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const location = {
  name: "Service Point – Dhaka",
  position: [23.7940472, 90.3779611],
};

const SingleLocationMapSatellite = () => {
  const [isSatellite, setIsSatellite] = useState(false);

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-2xl font-bold">Our Service Point</h2>

            {/* Toggle */}
            <button
              className={`btn btn-sm ${
                isSatellite ? "btn-primary" : "btn-outline"
              }`}
              onClick={() => setIsSatellite(!isSatellite)}
            >
              {isSatellite ? "Satellite View" : "Map View"}
            </button>
          </div>

          {/* Map */}
          <div className="h-[420px] rounded-lg overflow-hidden">
            <MapContainer
              center={location.position}
              zoom={16}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              {/* Tile Layer Switch */}
              {isSatellite ? (
                <TileLayer
                  attribution="&copy; Esri"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              ) : (
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              )}

              <Marker position={location.position}>
                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  23.7940472, 90.3779611
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SingleLocationMapSatellite;
