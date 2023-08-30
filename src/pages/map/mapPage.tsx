import React from 'react';
import {MapContainer, Marker, Polyline, Popup, TileLayer} from 'react-leaflet';
import {MapServerIcon} from '~/components';
import {IoMenu} from 'react-icons/io5';
import serverIcon from '~/assets/icons/severIcon.png';
import noOrange from '~/assets/icons/noOrange.png';
import noRed from '~/assets/icons/noRed.png';
import noYellow from '~/assets/icons/noYellow.png';

const MapPage = () => {
  return (
    <div className="flex h-full w-full flex-row">
      <div className="flex h-full w-12 flex-col items-center gap-y-5 bg-white py-3">
        <button type="button" className="active:opacity-50">
          <IoMenu className="h-8 w-8" />
        </button>
        <img src={serverIcon} className="h-6 w-6" />
        <img src={noYellow} className="h-7 w-7" />
        <img src={noOrange} className="h-7 w-7" />
        <img src={noRed} className="h-7 w-7" />
      </div>
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
        <Polyline
          positions={[
            [51.505, -0.09],
            [51.51, -0.1],
          ]}
          color="red"
        />
      </MapContainer>
    </div>
  );
};

export default MapPage;
