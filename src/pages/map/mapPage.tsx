import React, {createRef, useEffect, useRef, useState} from 'react';
import Selectbox from './../../components/selectbox/selectbox';
import Checkbox from './../../components/checkbox/checkbox';
import RightbarStation from './../../components/mapcomponents/rightbarStation';
import RightbarLink from './../../components/mapcomponents/rightbarLink';
import {useMapEvents} from 'react-leaflet';

import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  Tooltip,
} from 'react-leaflet';
import {MapServerIcon, NoRed, NoYellow, NoOrange} from '~/components';

import {IoMenu} from 'react-icons/io5';
import serverIcon from '~/assets/icons/severIcon.png';
import {BsArrowsFullscreen} from 'react-icons/bs';
import {IoMdClose} from 'react-icons/io';
import {MdZoomInMap} from 'react-icons/md';
import noOrange from '~/assets/icons/noOrange.png';
import pluse from '~/assets/images/plus.svg';
import zoomout from '~/assets/images/zoomout.svg';
import groupserverIcon from '~/assets/images/groupserverIcon.svg';
import noRed from '~/assets/icons/noRed.png';
import noYellow from '~/assets/icons/noYellow.png';
import RightbarAlarm from '~/components/mapcomponents/rightbarAlarm';
import {useDetectClickOutside} from 'react-detect-click-outside';
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
    <div className={`absolute right-[26px] top-[17px] z-[400] h-auto w-auto`}>
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
  const [switchstatus, setSwitchstatus] = useState(false);
  const [rightbarstate, setRightbarState] = useState('');

  const MapClickAlert = () => {
    useMapEvents({
      click(e) {
        if (rightbarstate != '') {
          setRightbarState('');
        }
      },
    });
    return null;
  };
  return (
    <div className="relative flex  w-full flex-row">
      <div
        className={`relative w-full ${
          fullscreen
            ? 'mt-[-90px] h-[calc(100vh-10px)]'
            : 'h-[calc(100vh-90px)]'
        } overflow-hidden`}>
        {fullscreen ? null : (
          <div
            className={` to-0 absolute left-0 z-[500] h-[100vh] bg-[#E7EFF7] ${
              leftbarstate ? 'w-[330px]' : 'w-12'
            } box-border flex flex-col overflow-hidden px-[10px]`}>
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
              <div className="mb-[25px] flex w-full flex-row items-center justify-between">
                <span className="text-[20px] font-light leading-[25.2px] text-[black]">
                  Region
                </span>
                <Selectbox
                  onclickItem={() => console.log('gghjgh')}
                  options={options}
                  borderColor={'black'}
                  classname={'w-[219px] mr-[9px] bg-[#B3BDF2]'}
                />
              </div>
            ) : null}
            <div className="mb-8 flex w-full flex-row items-center">
              <img src={serverIcon} className="ml-[3px] h-6 w-6" />

              {leftbarstate ? (
                <>
                  <div
                    className={`ml-[70px] flex flex-row ${
                      switchstatus ? 'justify-start' : 'justify-end'
                    } h-[20px] w-[59px] rounded-[10px] bg-[#ffffff]`}>
                    <button
                      onClick={() => setSwitchstatus(!switchstatus)}
                      className="h-[20px] w-[34px] rounded-[10px] bg-[#B3BDF2]"></button>
                  </div>
                  <img
                    src={groupserverIcon}
                    className="ml-[50px] h-[60px] w-[90px]"
                  />
                </>
              ) : null}
            </div>
            <div className="mb-6 flex w-full flex-row items-center">
              <img src={noYellow} className="h-7 w-7" />

              {leftbarstate ? (
                <>
                  <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                    Low Severity
                  </span>
                  <Checkbox
                    onclick={(e: boolean) => console.log(e, 'wweee')}
                    classname={'ml-[118px]'}
                  />
                </>
              ) : null}
            </div>

            <div className="mb-6 flex w-full flex-row items-center">
              <img src={noOrange} className="h-7 w-7" />
              {leftbarstate ? (
                <>
                  <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                    Low Severity
                  </span>
                  <Checkbox
                    onclick={(e: boolean) => console.log(e, 'wweee')}
                    classname={'ml-[118px]'}
                  />
                </>
              ) : null}
            </div>

            <div className="mb-6 flex w-full flex-row items-center">
              <img src={noRed} className="h-7 w-7" />
              {leftbarstate ? (
                <>
                  <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                    Low Severity
                  </span>
                  <Checkbox
                    onclick={(e: boolean) => console.log(e, 'wweee')}
                    classname={'ml-[118px]'}
                  />
                </>
              ) : null}
            </div>

            <div className="ml-[-10px] h-[1px] w-[330px] bg-[#ffffff]"></div>
            {leftbarstate ? (
              <>
                <button className="mt-[30px] h-[40px] w-[290px] rounded-[10px] bg-gradient-to-b from-[#BAC2ED]  to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
                  Add Station
                </button>

                <button className="from-9% mt-[30px] h-[40px]  w-[290px] rounded-[10px] bg-gradient-to-b from-[#B3BDF2] to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
                  Add Link
                </button>
              </>
            ) : null}
          </div>
        )}

        {rightbarstate == 'station' ? (
          <RightbarStation />
        ) : rightbarstate == 'link' ? (
          <RightbarLink />
        ) : rightbarstate == 'alarm' ? (
          <RightbarAlarm />
        ) : null}

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
              className={`absolute right-[23px] top-[104px] z-[400]`}
            />
          ) : (
            <BsArrowsFullscreen
              onClick={() => setfullscreen(true)}
              className="absolute right-[25px] top-[108px] z-[400]  h-[38.1px] w-[40px]"
            />
          )}

          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('station');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },

              // mouseout: e => {
              //   setRightbarState('');
              //   console.log(e.target.options.data); // will print 'FooBar' in console
              // },
            }}
            position={[51.505, -0.09]}
            icon={MapServerIcon}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>
          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('station');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            position={[51.517, -0.01]}
            icon={MapServerIcon}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>
          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('station');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            position={[51.519, -0.025]}
            icon={MapServerIcon}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>

          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('alarm');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            position={[51.519, -0.045]}
            icon={NoYellow}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>

          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('alarm');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            position={[51.519, -0.085]}
            icon={NoRed}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>

          <Marker
            eventHandlers={{
              click: e => {
                setRightbarState('alarm');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            position={[51.519, -0.0155]}
            icon={NoOrange}>
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Marker>

          <Polyline
            eventHandlers={{
              click: e => {
                setRightbarState('link');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            positions={[
              [51.505, -0.09],
              [51.51, -0.1],
            ]}
            color="red">
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Polyline>
          <MapClickAlert />
          <Polyline
            eventHandlers={{
              click: e => {
                setRightbarState('link');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            positions={[
              [51.505, -0.09],
              [51.519, -0.025],
            ]}
            color="red">
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Polyline>
          <Polyline
            eventHandlers={{
              click: e => {
                setRightbarState('link');
                console.log(e.target.options.data); // will print 'FooBar' in console
              },
            }}
            positions={[
              [51.505, -0.09],
              [51.517, -0.01],
            ]}
            color="red">
            <Tooltip
              opacity={1}
              className="h-[150px] w-[215px]"
              direction="top"
              offset={[0, -25]}>
              <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
                <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                  dfwd
                </span>
              </div>
            </Tooltip>
          </Polyline>
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
