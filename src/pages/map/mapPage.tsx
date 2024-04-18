import React, {createRef, useEffect, useRef, useState} from 'react';
import Selectbox from './../../components/selectbox/selectbox';
import Checkbox from './../../components/checkbox/checkbox';
import RightbarStation from './../../components/mapcomponents/rightbarStation';
import RightbarLink from './../../components/mapcomponents/rightbarLink';
import useHttpRequest, {Request} from '~/hooks/useHttpRequest';
import yellowicon from '~/assets/icons/noYellow.png';
import redicon from '~/assets/icons/noRed.png';
import orangeicon from '~/assets/icons/noOrange.png';
import {useMapEvents} from 'react-leaflet';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
  Tooltip,
} from 'react-leaflet';
import {
  MapServerIcon,
  NoRed,
  NoYellow,
  NoOrange,
  MapgroupServerIcon,
} from '~/components';

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
  const networkId = Cookies.get(networkExplored);
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [fullscreen, setfullscreen] = useState(false);
  const [showlinktoolkit, setShowlinltoolkit] = useState(false);
  const [leftbarstate, setLeftbarstate] = useState(false);
  const [switchstatus, setSwitchstatus] = useState(true);
  const [rightbarstate, setRightbarState] = useState('');
  const [yellowalarms, setyellowallarms] = useState(false);
  const [orangealarms, setorangeallarms] = useState(false);
  const [redalarms, setredallarms] = useState(false);
  const [regionname, setRegionname] = useState('');
  const [selectedStation, setSelectedStation] = useState([]);
  const [selectedLink, setSelectedLink] = useState([]);
  const [selectedregion, setSelectedregion] = useState<any>([]);
  const [sumselectedregionlatitude, setSumSelectedregionlatitude] =
    useState<any>([]);
  const [sumselectedregionlongitude, setSumSelectedregionlongitude] =
    useState<any>([]);
  const [selectboxregions, setSelectboxregions] = useState<
    {value: string; label: string}[]
  >([]);

  const {state, request} = useHttpRequest({
    selector: state => ({
      detail: state.http.mapDetail,
    }),
    initialRequests: request => {
      request('mapDetail', {params: {network_id: networkId!}});
    },
  });
console.log("detail",state.detail);

  const Stations = state?.detail?.data?.stations;
  const Regions = state?.detail?.data?.regions || [];

  const regiondata = (id: string) => {
    const find = Regions.find((data: any) => data.id == id);
    let sumlatitude = 0;
    let sumlongitude = 0;
    for (let i = 0; i < find.stations.length; i++) {
      sumlatitude += find.stations[i].latitude;
      sumlongitude += find.stations[i].longitude;
    }
    setSumSelectedregionlatitude(sumlatitude);
    setSumSelectedregionlongitude(sumlongitude);
    setSelectedregion(find);
  };


  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

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

  const Linktooltip = ({data}: any) => {
    return (
      <div
        style={{
          top: `${mousePosition.y - 335}px`,
          left: `${mousePosition.x - 100}px`,
        }}
        className={`absolute z-[1000]   h-[240px] w-[220px] flex-col bg-[#E7EFF7]`}>
        <div className="mb-[10px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
          Source:{data?.source?.name}
        </div>
        <div className="mb-[10px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
          Destination:{data?.destination?.name}
        </div>
        <div className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
          Region: Region1
        </div>

        <div className="ml-[8px] mt-[12px] text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={redicon} className="h-[35px] w-[35px]" />
        </div>
        <div className="ml-[8px] mt-[12px] text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={orangeicon} className="h-[35px] w-[35px]" />
        </div>
        <div className="ml-[8px] mt-[12px] text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={yellowicon} className="h-[35px] w-[35px]" />
        </div>
      </div>
    );
  };

  const onclicmenue=()=>{
    setLeftbarstate(true)
    if(selectboxregions.length == 0){
      const dataa = [...Regions];
      for (let i = 0; i < dataa?.length; i++) {
        setSelectboxregions(prev => [
          ...prev,
          {
            value: Regions[i].id,
            label: Regions[i]?.name,
          },
        ]);
      }
    }

  }
  // ******************** return ****************** return ************************** return *******************************
  return (
    <div className="relative flex  h-[calc(100vh-105px)] mt-[60px] w-full flex-row  overflow-x-hidden overflow-y-hidden bg-[red]">
      {showlinktoolkit ? <Linktooltip data={selectedLink} /> : null}

      <div
        className={`relative w-full  ${
          fullscreen
            ? 'mt-[-90px] h-[calc(100vh-10px)]'
            : 'h-[calc(100vh-90px)]'
        } `}>
        {/* ---------------left bar------------------- left bar----------------left bar-----------------*/}
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
                onClick={() => onclicmenue()}
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
                placeholder={regionname}
                  onclickItem={(e: {value: string; label: string}) => {
                    setRegionname(e.label);
                    regiondata(e.value);
                  }}
                  options={selectboxregions}
                  borderColor={'black'}
                  classname={
                    'w-[219px] mr-[9px] bg-[#B3BDF2] h-[40px] rounded-[8px]'
                  }
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
                    onclick={(e: boolean) => setyellowallarms(e)}
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
                    onclick={(e: boolean) => setorangeallarms(e)}
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
                    onclick={(e: boolean) => setredallarms(e)}
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

        {/* ---------------reightbars------------------------reightbars-------------------------reightbars--------- */}
        {rightbarstate == 'station' ? (
          <RightbarStation data={selectedStation} />
        ) : rightbarstate == 'link' ? (
          <RightbarLink data={selectedLink} />
        ) : rightbarstate == 'alarm' ? (
          <RightbarAlarm />
        ) : null}

        {/* -------------------- map ---------------- map ------------------- map ----------------- map ------------- */}
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
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

          {regionname.length > 0 ? (
            <>
              {switchstatus ? (
                <>
                  {selectedregion?.stations?.map((data: any, index: any) => (
                    <Marker
                      key={index}
                      eventHandlers={{
                        click: e => {
                          setRightbarState('station');
                          setSelectedStation(data);
                        },
                      }}
                      position={[data.latitude, data.longitude]}
                      icon={MapServerIcon}>
                      <Tooltip
                        opacity={1}
                        className="h-[150px] w-[215px]"
                        direction="top"
                        offset={[0, -25]}>
                        <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7] py-2">
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            {data.name}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Region: Region1
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Latitude:{data.latitude}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Longitude:{data.longitude}
                          </span>
                          <span className="ml-[8px]  text-[18px] font-light leading-[25.2px] text-[black]">
                            RTU(s):{data.RTUs.length}
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </>
              ) : (
                <>
                  <Marker
                    eventHandlers={{
                      click: e => {
                        setRightbarState('station');
                        // setSelectedStation(data)
                      },
                    }}
                    position={[
                      sumselectedregionlatitude /
                        selectedregion.stations.length,
                      sumselectedregionlongitude /
                        selectedregion.stations.length,
                    ]}
                    icon={MapgroupServerIcon}>
                    <Tooltip
                      opacity={1}
                      className="h-[150px] w-[215px]"
                      direction="top"
                      offset={[0, -25]}>
                      <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7] py-2">
                        <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          {selectedregion?.name}
                        </span>
                        <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          High Severity: 0
                        </span>
                        <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Medium Severity: 1
                        </span>
                        <span className="mb-[4px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Low Severity: 1
                        </span>
                      </div>
                    </Tooltip>
                  </Marker>
                </>
              )}
            </>
          ) : (
            <>
              {switchstatus ? (
                <>
                  {Stations?.map((data, index) => (
                    <Marker
                      key={index}
                      eventHandlers={{
                        click: e => {
                          setRightbarState('station');
                          setSelectedStation(data);
                        },
                      }}
                      position={[data.latitude, data.longitude]}
                      icon={MapServerIcon}>
                      <Tooltip
                        opacity={1}
                        className="h-[150px] w-[215px]"
                        direction="top"
                        offset={[0, -25]}>
                        <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7] py-2">
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            {data.name}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Region: Region1
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Latitude:{data.latitude}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Longitude:{data.longitude}
                          </span>
                          <span className="ml-[8px]  text-[18px] font-light leading-[25.2px] text-[black]">
                            RTU(s):{data.RTUs.length}
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </>
              ) : (
                <>
                  {state?.detail?.data?.regions.map((data, index) => {
                    let sumlatitude = 0;
                    let sumlongitude = 0;
                    for (let i = 0; i < data.stations.length; i++) {
                      sumlatitude += data.stations[i].latitude;
                      sumlongitude += data.stations[i].longitude;
                    }
                    return (
                      <Marker
                        key={index}
                        eventHandlers={{
                          click: e => {
                            setRightbarState('station');
                            // setSelectedStation(data)
                          },
                        }}
                        position={[
                          sumlatitude / data.stations.length,
                          sumlongitude / data.stations.length,
                        ]}
                        icon={MapgroupServerIcon}>
                        <Tooltip
                          opacity={1}
                          className="h-[150px] w-[215px]"
                          direction="top"
                          offset={[0, -25]}>
                          <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7] py-2">
                            <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                              {data?.name}
                            </span>
                            <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                              High Severity: 0
                            </span>
                            <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                              Medium Severity: 1
                            </span>
                            <span className="mb-[4px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                              Low Severity: 1
                            </span>
                          </div>
                        </Tooltip>
                      </Marker>
                    );
                  })}
                </>
              )}
            </>
          )}

          {yellowalarms ? (
            <>
              <Marker
                eventHandlers={{
                  click: e => {
                    setRightbarState('alarm');
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
            </>
          ) : null}

          {redalarms ? (
            <>
              <Marker
                eventHandlers={{
                  click: e => {
                    setRightbarState('alarm');
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
            </>
          ) : null}

          {orangealarms ? (
            <>
              <Marker
                eventHandlers={{
                  click: e => {
                    setRightbarState('alarm');
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
            </>
          ) : null}

          {regionname.length > 0 ? (
            <>
              {switchstatus ? (
                <>
                  {selectedregion.links.map((data: any, index: any) => {
                    let start = state?.detail?.data?.stations.find(
                      dat => dat.id == data.source.id,
                    );

                    let end = state?.detail?.data?.stations.find(
                      dat => dat.id == data.destination.id,
                    );

                    return (
                      <>
                        <Polyline
                          key={index}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('link');
                              setSelectedLink(data);
                            },
                            mouseover: e => {
                              setShowlinltoolkit(true);
                              setSelectedLink(data);
                            },
                            mouseout: e => {
                              setShowlinltoolkit(false);
                              // alert('dfdfd');
                            },
                          }}
                          positions={[
                            [start.latitude, start.longitude],
                            [end.latitude, end.longitude],
                          ]}
                          color="red"></Polyline>

                        <Polyline
                          key={index}
                          weight={5}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('link');
                              setSelectedLink(data);
                            },
                            mouseover: e => {
                              setShowlinltoolkit(true);
                              setSelectedLink(data);
                            },
                            mouseout: e => {
                              setShowlinltoolkit(false);
                            },
                          }}
                          positions={[
                            [start.latitude, start.longitude],
                            [end.latitude, end.longitude],
                          ]}
                          pathOptions={{color: 'black', weight: 20, opacity: 0}}
                          // color="black"
                        ></Polyline>
                      </>
                    );
                  })}
                </>
              ) : null}
            </>
          ) : (
            <>
              {switchstatus ? (
                <>
                  {state?.detail?.data?.links.map((data, index) => {
                    let start = state?.detail?.data?.stations.find(
                      dat => dat.id == data.source.id,
                    );

                    let end = state?.detail?.data?.stations.find(
                      dat => dat.id == data.destination.id,
                    );

                    return (
                      <>
                        <Polyline
                          key={index}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('link');
                              setSelectedLink(data);
                            },
                            mouseover: e => {
                              setShowlinltoolkit(true);
                              setSelectedLink(data);
                            },
                            mouseout: e => {
                              setShowlinltoolkit(false);
                              // alert('dfdfd');
                            },
                          }}
                          positions={[
                            [start.latitude, start.longitude],
                            [end.latitude, end.longitude],
                          ]}
                          color="red"></Polyline>

                        <Polyline
                          key={index}
                          weight={5}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('link');
                              setSelectedLink(data);
                            },
                            mouseover: e => {
                              setShowlinltoolkit(true);
                              setSelectedLink(data);
                            },
                            mouseout: e => {
                              setShowlinltoolkit(false);
                            },
                          }}
                          positions={[
                            [start.latitude, start.longitude],
                            [end.latitude, end.longitude],
                          ]}
                          pathOptions={{color: 'black', weight: 20, opacity: 0}}
                          // color="black"
                        ></Polyline>
                      </>
                    );
                  })}
                </>
              ) : null}
            </>
          )}

          <MapClickAlert />
        </MapContainer>
      </div>
      {leftbarstate ? null : (
        <div className="absolute bottom-2 left-16 z-[500] text-[20px] font-bold text-[#006BBC]">
          {regionname}
        </div>
      )}
    </div>
  );
};

export default MapPage;
