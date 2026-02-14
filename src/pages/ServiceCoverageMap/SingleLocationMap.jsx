import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";

const location = {
  name: "Reliable Code Solution (RCS)",
  address: "1212, East Shewrapara, Kafrul, Mirpur, Dhaka-1216",
  position: [23.7940472, 90.3779611],
  googleMapUrl: "https://www.google.com/maps?q=23.7940472,90.3779611",
};

const SingleLocationMap = () => {
  const copyAddress = () => {
    navigator.clipboard.writeText(location.address);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <div className="card bg-base-100 border border-base-300 shadow-lg">
        <div className="card-body space-y-6">
          {/* Title */}
          <h2 className="text-4xl font-bold text-center leading-tight">
            Reliable <span className="text-rose-900">&#123;</span>
            Code
            <span className="text-rose-900">&#125;</span> Solutions{" "}
            <span className="text-base-content/60">(RCS)</span>
          </h2>

          {/* Address */}
          <p className="text-center text-base-content/70 text-lg -mt-8">
            {location.address}
          </p>

          {/* Action buttons */}
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href={location.googleMapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline btn-sm"
            >
              📍 Open in Google Maps
            </a>

            <button onClick={copyAddress} className="btn btn-outline btn-sm">
              📋 Copy Address
            </button>
          </div>

          {/* Map */}
          <div className="h-[450px] rounded-xl overflow-hidden">
            <MapContainer
              center={location.position}
              zoom={16}
              scrollWheelZoom={true}
              zoomControl={true}
              className="h-full w-full"
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker position={location.position}>
                <Tooltip direction="top" offset={[0, -20]} permanent>
                  {location.name}
                </Tooltip>

                <Popup>
                  <strong>{location.name}</strong>
                  <br />
                  {location.address}
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
