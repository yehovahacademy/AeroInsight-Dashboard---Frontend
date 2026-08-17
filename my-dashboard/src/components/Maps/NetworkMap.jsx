import {
  MapContainer,
  TileLayer,
  Marker,
  Popup
} from "react-leaflet";

import "./NetworkMap.css";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "leaflet/dist/leaflet.css";

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function NetworkMap() {
  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[19.0887, 72.8679]}>
        <Popup>
          BOM — Mumbai
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default NetworkMap;