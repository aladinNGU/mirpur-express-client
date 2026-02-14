import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const location = {
  name: "Reliable Code Solution (RCS)",
  position: [23.7940472, 90.3779611],
};

const SingleLocationMap = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="text-4xl font-bold text-center">
            Reliable <span className="text-rose-900">&#123;</span>Code
            <span className="text-rose-900">&#125;</span> Solution (RCS)
          </h2>

          <p className="text-center text-base-content/70 text-xl -mt-6">
            1212, East Shewrapara, Kafrul, Mirpur, Dhaka-1216.
          </p>

          {/* Map */}
          <div className="h-[420px] rounded-lg overflow-hidden">
            <MapContainer
              center={location.position}
              zoom={13} // 🔍 Close zoom
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

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

export default SingleLocationMap;
