import React, {useEffect, useState} from 'react';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import {MapServerIcon} from '~/components';
import {IoMenu} from 'react-icons/io5';
import serverIcon from '~/assets/icons/severIcon.png';
import {BsArrowsFullscreen} from 'react-icons/bs';
import {MdZoomInMap} from 'react-icons/md';
import noOrange from '~/assets/icons/noOrange.png';
import pluse from '~/assets/images/plus.svg';
import zoomout from '~/assets/images/zoomout.svg';
import noRed from '~/assets/icons/noRed.png';
import noYellow from '~/assets/icons/noYellow.png';

/* ------ types ----------- */

type fullscreen = {
  fullscreen: Boolean;
};

/* ------ component ----------- */

function ZoomComponent({fullscreen}: fullscreen) {
  const [zoomstate, setZoomstate] = useState(13);
  const map = useMap();
  useEffect(() => {
    if (zoomstate != 0) {
      map.setZoom(zoomstate);
    }
  }, [zoomstate]);
  return (
    <div
      className={`absolute  ${
        fullscreen ? 'right-[26px] top-[17px]' : 'right-[75px] top-[10px]'
      }  z-[1000] h-auto w-auto`}>
      <img
        onClick={() => setZoomstate(zoomstate + 1)}
        src={pluse}
        className="h-[38.1px] w-[40px]"
      />
      <img
        onClick={() => setZoomstate(zoomstate - 1)}
        src={zoomout}
        className="mt-2 h-[38.1px] w-[40px]"
      />
    </div>
  );
}

// ------------- main --------------------------- main ----------------------- main -------------------- main ----------

const MapPage = () => {
  const [fullscreen, setfullscreen] = useState(false);
  return (
    <div className="relative flex  w-full flex-row">
      {/* ------- right bar ------------ right bar --------- */}
      <div
        className={`flex h-full ${
          fullscreen ? 'w-[0px]' : 'w-12'
        } flex-col items-center gap-y-5 bg-white py-3`}>
        <button type="button" className="active:opacity-50">
          <IoMenu className="h-8 w-8" />
        </button>
        <img src={serverIcon} className="h-6 w-6" />
        <img src={noYellow} className="h-7 w-7" />
        <img src={noOrange} className="h-7 w-7" />
        <img src={noRed} className="h-7 w-7" />
      </div>
      {/* ------- right bar ------------ right bar --------- */}

      <div
        className={`relative w-full ${
          fullscreen
            ? 'mt-[-90px] h-[calc(100vh-10px)]'
            : 'h-[calc(100vh-90px)]'
        } overflow-hidden`}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={false}
          zoomControl={false}
          className={`h-full w-full`}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ------ component -----------  */}
          <ZoomComponent fullscreen={fullscreen} />
          {/* ------ component ----------- */}

          {fullscreen ? (
            <MdZoomInMap
              onClick={() => setfullscreen(false)}
              size={46}
              className={`absolute right-[23px] top-[104px] z-[1000]`}
            />
          ) : (
            <BsArrowsFullscreen
              onClick={() => setfullscreen(true)}
              className="absolute right-[75px] top-[102px] z-[1000]  h-[38.1px] w-[40px]"
            />
          )}

          <Marker position={[51.505, -0.09]} icon={MapServerIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <Marker position={[51.517, -0.01]} icon={MapServerIcon}>
            <Popup>
              A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
          </Marker>
          <Marker position={[51.519, -0.025]} icon={MapServerIcon}>
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
           <Polyline
            positions={[
              [51.505, -0.09],
              [51.519, -0.025],
            ]}
            color="red"
          />
           <Polyline
            positions={[
              [51.505, -0.09],
              [51.517, -0.01],
            ]}
            color="red"
          />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
