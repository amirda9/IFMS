import React from 'react';
import {MapContainer, TileLayer, Marker, Popup,Polyline} from 'react-leaflet';
import {MapServerIcon} from '~/components';

const MapPage = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="h-full w-12 bg-white"></div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]} icon={MapServerIcon}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        <Polyline positions={[
          [51.505, -0.09],
          [51.51, -0.1],
        ]} color={'red'}/>
      </MapContainer>
    </div>
  );
};

export default MapPage;
