import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const serviceAreas = [
  {
    name: "Reliable Code Solution (RCS)",
    position: [23.7940472, 90.3779611],
  },
  {
    name: "Dhaka",
    position: [23.8103, 90.4125],
  },
  {
    name: "Chittagong",
    position: [22.3569, 91.7832],
  },
  {
    name: "Sylhet",
    position: [24.8949, 91.8687],
  },
  {
    name: "Khulna",
    position: [22.8456, 89.5403],
  },
  {
    name: "Rajshahi",
    position: [24.3636, 88.6241],
  },
];

const ServiceCoverageMap = () => {
  const [selectedArea, setSelectedArea] = useState(serviceAreas[0]);

  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Service Coverage Area
          </h2>

          {/* Dropdown */}
          <div className="flex justify-center">
            <select
              className="select select-bordered w-full max-w-xs"
              value={selectedArea.name}
              onChange={(e) =>
                setSelectedArea(
                  serviceAreas.find((area) => area.name === e.target.value),
                )
              }
            >
              {serviceAreas.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name}
                </option>
              ))}
            </select>
          </div>

          {/* Map */}
          <div className="h-[450px] rounded-lg overflow-hidden">
            <MapContainer
              center={selectedArea.position}
              zoom={7}
              scrollWheelZoom={false}
              className="h-full w-full"
              key={selectedArea.name}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {serviceAreas.map((area) => (
                <Marker key={area.name} position={area.position}>
                  <Popup>
                    <strong>{area.name}</strong>
                    <br />
                    Service Available
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceCoverageMap;
