import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import Selectbox from './../../components/selectbox/selectbox';
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
import {IoMdClose} from 'react-icons/io';
import {MdZoomInMap} from 'react-icons/md';
import noOrange from '~/assets/icons/noOrange.png';
import pluse from '~/assets/images/plus.svg';
import zoomout from '~/assets/images/zoomout.svg';
import noRed from '~/assets/icons/noRed.png';
import noYellow from '~/assets/icons/noYellow.png';
const options = [
  {value: 'chocolate', label: 'Chocolate'},
  {value: 'strawberry', label: 'Strawberry'},
  {value: 'vanilla', label: 'Vanilla'},
];
/* ------ types ----------- */

type fullscreen = {
  fullscreen: Boolean;
};

/* ------ component ----------- */

function ZoomComponent({fullscreen}: fullscreen) {
  const [zoomstate, setZoomstate] = useState(13);
  const map = useMap();
  useEffect(() => {
    map.setZoom(zoomstate);
  }, [zoomstate]);
  return (
    <div className={`absolute right-[26px] top-[17px] z-[1000] h-auto w-auto`}>
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
  const [leftbarstate, setLeftbarstate] = useState(false);
  const [selectOptions, setSelectoptions] = useState(null);
  const handleChange = (e: any) => {
    console.log(e, 'eee');
  };
  return (
    <div className="relative flex  w-full flex-row">
      {/* ------- left bar ------------ left bar --------- */}
      {/* <div
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
      </div> */}

      {/* ------- left bar ------------ left bar --------- */}

      <div
        className={`relative w-full ${
          fullscreen
            ? 'mt-[-90px] h-[calc(100vh-10px)]'
            : 'h-[calc(100vh-90px)]'
        } overflow-hidden`}>
        {fullscreen ? null : (
          <div
            className={` to-0 absolute left-0 z-[1000] h-[100vh] bg-[#E7EFF7] ${
              leftbarstate ? 'w-[330px]' : 'w-12'
            } flex flex-col overflow-hidden px-[10px] box-border`}>
            {leftbarstate ? (
              <div className="mb-[40px] mt-[10px] flex w-full flex-row items-center justify-between">
                <span className="text-[24px] font-bold leading-[29.05px] text-[#636363]">
                  Map View
                </span>
                <IoMdClose
                  onClick={() => setLeftbarstate(false)}
                  color={'#636363'}
                  className="h-[18px] w-[19px] cursor-pointer"
                />
              </div>
            ) : (
              <button
                onClick={() => setLeftbarstate(true)}
                type="button"
                className="mb-4  active:opacity-50">
                <IoMenu className="h-8 w-8" />
              </button>
            )}

            {leftbarstate ? (
              <div className="flex-row mb-[25px] flex w-full items-center justify-between">
                <span className="text-[20px] font-light leading-[25.2px] text-[black]">
                  Region
                </span>
                <Selectbox
                  onclickItem={() => console.log('gghjgh')}
                  options={options}
                  borderColor={'black'}
                  classname={'w-[219px] mr-[9px]'}
                />
              </div>
            ) : null}

            <img src={serverIcon} className="mb-4 ml-[3px] h-6 w-6" />
            <img src={noYellow} className="mb-4 h-7 w-7" />
            <img src={noOrange} className="mb-4 h-7 w-7" />
            <img src={noRed} className="mb-4 h-7 w-7" />
          </div>
        )}

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
              className="absolute right-[25px] top-[108px] z-[1000]  h-[38.1px] w-[40px]"
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
