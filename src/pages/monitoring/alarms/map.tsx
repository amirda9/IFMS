import React, {useEffect, useMemo, useRef, useState} from 'react';
import RightbarStation from '~/components/mapcomponents/rightbarStation';
import RightbarLink from '~/components/mapcomponents/rightbarLink';
import yellowicon from '~/assets/icons/noYellow.png';
import redicon from '~/assets/icons/noRed.png';
import orangeicon from '~/assets/icons/noOrange.png';
import {useMapEvents} from 'react-leaflet';
import {
  MapContainer,
  Marker,
  Polyline,
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


import serverIcon from '~/assets/icons/severIcon.png';
import {BsArrowsFullscreen} from 'react-icons/bs';
import {MdZoomInMap} from 'react-icons/md';
import noOrange from '~/assets/icons/noOrange.png';
import pluse from '~/assets/images/plus.svg';
import zoomout from '~/assets/images/zoomout.svg';
import groupserverIcon from '~/assets/images/groupserverIcon.svg';
import noRed from '~/assets/icons/noRed.png';
import noYellow from '~/assets/icons/noYellow.png';
import RightbarAlarm from '~/components/mapcomponents/rightbarAlarm';
import Multiselect from 'multiselect-react-dropdown';
import {$Get, $Post} from '~/util/requestapi';
import {deepcopy} from '~/util';
import Mainloading from '~/components/loading/mainloading';
import {useSearchParams} from 'react-router-dom';
/* ------ types ----------- */

type fullscreen = {
  fullscreen: Boolean;
};

type Stationtype = {
  rtus: {id: string; name: string}[];
  alarms: any[];
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  regionId?: string;
  regionName?: string;
};

type linktype = {
  alarms: any[];
  destination: {id: string; name: string};
  id: string;
  length: string;
  name: string;
  regionId: string;
  regionName: string;
  source: {id: string; name: string};
};

type regiontype = {
  id: string;
  links: linktype[];
  name: string;
  stations: Stationtype[];
};

type alarmtype = {
  network_id: string;
  regions: [
    {
      region_id: string;
      links: [
        {
          link_id: string;
          alarm_events: [
            {
              source_name: string;
              severity: string;
              status: string;
              measurement_fk: string;
              rtu_fk: string;
              link_fk: string;
              route_fk: string;
              network_id: string;
              region_id: string;
              latitude: number;
              longitude: number;
              alarm_type: string;
            },
          ];
        },
      ];
      stations: [
        {
          station_id: string;
          alarm_events: [
            {
              source_name: string;
              severity: string;
              status: string;
              measurement_fk: string;
              rtu_fk: string;
              link_fk: string;
              route_fk: string;
              network_id: string;
              region_id: string;
              latitude: number;
              longitude: number;
              alarm_type: string;
            },
          ];
        },
      ];
    },
  ];
};

type serverity = {
  source_name: string;
  severity: string;
  status: string;
  measurement_fk: string;
  rtu_fk: string;
  link_fk: string;
  route_fk: string;
  network_id: string;
  region_id: string;
  latitude: number;
  longitude: number;
  alarm_type: string;
};
type pointsdatatype = {
  longitude: string;
  latitude: string;
  linkdetail: linktype;
};

/* ------ component ----------- */

function ZoomComponent({fullscreen}: fullscreen) {
  const [zoomstate, setZoomstate] = useState(13);
  const map = useMap();
  useEffect(() => {
    map.setZoom(zoomstate);
  }, [zoomstate]);
  return (
    <div
      className={`absolute right-[26px] ${
        fullscreen ? `top-[107px]` : `top-[17px]`
      } z-[400] h-auto w-auto`}>
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
  const selectboxref: any = useRef();
  const [defaultzoom, setDefaultzoom] = useState(10);
  const [mapcenter, setMapcenter] = useState<[number, number]>([
    35.6892, 51.389,
  ]);
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [fullscreen, setfullscreen] = useState(false);
  const [alarms, setAlarms] = useState<alarmtype[]>([]);
  const [allLinkpoints, setAllLinkpoints] = useState<pointsdatatype[]>([]);
  const [showlinktoolkit, setShowlinltoolkit] = useState(false);
  const [leftbarstate, setLeftbarstate] = useState(false);
  const [switchstatus, setSwitchstatus] = useState(true);
  const [rightbarstate, setRightbarState] = useState('');
  const [yellowalarms, setyellowallarms] = useState(false);
  const [orangealarms, setorangeallarms] = useState(false);
  const [loadingnetwork, setLoadingnetwork] = useState(false);
  const [redalarms, setredallarms] = useState(false);
  const [regionname, setRegionname] = useState('');
  const [mount, setMount] = useState(false);
  const [selectedStation, setSelectedStation] = useState<Stationtype>();
  const [selectedLink, setSelectedLink] = useState<any>([]);
  const [Regions, setRegions] = useState<regiontype[]>([]);
  const [Stations, setStaations] = useState<Stationtype[]>([]);
  const [networkoptions, setNetworkoptions] = useState<any>([]);
  const [selectedregion, setSelectedregion] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [selectednetworks, setSelectednetworks] = useState<string[]>([]);
  const [lastselectednetwork, setLastselectednetwork] = useState('');
  const [links, setLinks] = useState<linktype[]>([]);
  const [showUpdateMapCenter, setShowUpdateMapCenter] = useState(false);
  const [sumselectedregionlatitude, setSumSelectedregionlatitude] =
    useState<any>([]);
  const [sumselectedregionlongitude, setSumSelectedregionlongitude] =
    useState<any>([]);
  const [selectboxregions, setSelectboxregions] = useState<
    {value: string; label: string}[]
  >([]);
  const [searchparams] = useSearchParams();
  const optical_route_id = searchparams.get('optical_route_id');
  const alarmlatitude = searchparams.get('latitude');
  const alarmlongitude = searchparams.get('longitude');
  const severity = searchparams.get('severity');

  useEffect(()=>{
const getroutes=async()=>{
  const getrouteResponse=await $Get(`otdr/optical-route/${optical_route_id}/routes`)
  if(getrouteResponse?.status){
    const getrouteResponseData=await getrouteResponse.json()
  }
}

getroutes()
  },[])
  console.log('redalarms', redalarms);

  const UpdateMapCenter = ({center}: any) => {
    const map = useMap();
    const [userInteracted, setUserInteracted] = useState(false);

    // این رویداد جابه‌جایی کاربر را ردیابی می‌کند
    useEffect(() => {
      const onMove = () => {
        setUserInteracted(true);
      };
      map.on('move', onMove);

      return () => {
        map.off('move', onMove);
      };
    }, [map]);

    useEffect(() => {
      if (!userInteracted && center) {
        map.setView(center); // حرکت نرم به مرکز جدید
      }
    }, [center, userInteracted, map]);

    return null;
  };

  function countSeverityAlarmsInArray(
    dataArray: alarmtype[],
    targetRegionId: string,
    status: string,
  ) {
    let highSeverityCount = 0;

    dataArray.forEach(data => {
      const region = data.regions.find(
        region => region.region_id === targetRegionId,
      );

      if (region) {
        region.links.forEach(link => {
          link.alarm_events.forEach(event => {
            if (event.severity === status) {
              highSeverityCount++;
            }
          });
        });
      }
    });

    return highSeverityCount;
  }

  function countLinkSeverityAlarms(
    dataArray: alarmtype[],
    targetLinkId: string,
    status: string,
  ) {
    let count = 0;

    Array.isArray(dataArray) &&
      dataArray.forEach(data => {
        data?.regions?.forEach(region => {
          region?.links?.forEach(link => {
            if (link?.link_id === targetLinkId) {
              link.alarm_events.forEach(event => {
                if (event.severity === status) {
                  count++;
                }
              });
            }
          });
        });
      });

    return count;
  }

  function countStationSeverityAlarms(
    dataArray: alarmtype[],
    targetLinkId: string,
    status: string,
  ) {
    let count = 0;
    Array.isArray(dataArray) &&
      dataArray.forEach(data => {
        data?.regions?.forEach(region => {
          region?.stations?.forEach(stationdata => {
            if (stationdata?.station_id === targetLinkId) {
              stationdata.alarm_events.forEach(event => {
                if (event.severity === status) {
                  count++;
                }
              });
            }
          });
        });
      });

    return count;
  }

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  // useEffect(() => {
  //   const getallnetwork = async () => {
  //     try {
  //       setLoadingnetwork(true);
  //       const response = await $Get(`otdr/network/?limit=100&skip=0`);
  //       const responseData = await response?.json();
  //       const newdata = responseData.map((data: any) => ({
  //         name: data.name,
  //         id: data.id,
  //       }));
  //       setNetworkoptions(newdata);
  //     } catch (error) {
  //     } finally {
  //       setLoadingnetwork(false);
  //     }
  //   };

  //   getallnetwork();
  // }, []);

  // const getalldetail = async () => {
  //   setSelectedregion([]);
  //   setRegionname('');
  //   if (!alarm_Id) {
  //     setorangeallarms(false);
  //     setredallarms(false);
  //     setyellowallarms(false);
  //   }

  //   try {
  //     let allpoints: any = [];
  //     setLoading(true);
  //     const [mapdetailresponse, allalarmsresponse] = await Promise.all([
  //       $Post(`otdr/map`, selectednetworks),
  //       mount ? null : $Post(`otdr/map/map_alarms/`, selectednetworks),
  //     ]);
  //     const responsedata = await mapdetailresponse?.json();
  //     console.log('responsedatauuuu', responsedata);

  //     if (!mount) {
  //       const alarmsdata: alarmtype[] = await allalarmsresponse?.json();
  //       const filteredData =
  //         selectedregion.length > 0
  //           ? alarmsdata.filter(item =>
  //               item.regions.some(
  //                 region => selectedregion.indexOf(region.region_id) > -1,
  //               ),
  //             )
  //           : alarmsdata;
  //       setAlarms(filteredData);
  //     }

  //     let regiondata: any = [];
  //     let stationdata: Stationtype[] = [];
  //     let linksdata = [];
  //     for (let i = 0; i < responsedata.length; i++) {
  //       regiondata.push(...responsedata[i].regions);
  //       for (let t = 0; t < responsedata[i].regions.length; t++) {
  //         stationdata.push(
  //           ...responsedata[i].regions[t].stations.map((data: any) => ({
  //             ...data,
  //             regionName: responsedata[i].regions[t].name || '',
  //             regionId: responsedata[i].regions[t].id || '',
  //           })),
  //         );
  //         linksdata.push(
  //           ...responsedata[i].regions[t].links.map((data: any) => ({
  //             ...data,
  //             regionName: responsedata[i].regions[t].name || '',
  //             regionId: responsedata[i].regions[t].id || '',
  //           })),
  //         );
  //       }

  //       for (let d = 0; d < responsedata[i].stations.length; d++) {
  //         const findstationdata = stationdata.findIndex(
  //           data => data.id == responsedata[i].stations[d].id,
  //         );
  //         if (findstationdata < 0) {
  //           stationdata.push(responsedata[i].stations[d]);
  //         }
  //       }
  //       let alldata = [];
  //       for (let d = 0; d < responsedata[i].links.length; d++) {
  //         const findsource = responsedata[i].links[d].link_points.find(
  //           (data: any) =>
  //             data.latitude == responsedata[i].links[d].source.latitude,
  //         );
  //         const finddestination = responsedata[i].links[d].link_points.find(
  //           (data: any) =>
  //             data.latitude == responsedata[i].links[d].destination.latitude,
  //         );

  //         if (responsedata[i].links[d].link_points.length > 0) {
  //           allpoints.push(
  //             ...(findsource
  //               ? []
  //               : [
  //                   {
  //                     latitude: responsedata[i].links[d].source.latitude,
  //                     longitude: responsedata[i].links[d].source.longitude,
  //                     linkdetail: responsedata[i].links[d],
  //                   },
  //                 ]),
  //             ...responsedata[i].links[d].link_points.map(
  //               (dataa: {latitude: number; longitude: number}) => ({
  //                 latitude: dataa.latitude,
  //                 longitude: dataa.longitude,
  //                 linkdetail: responsedata[i].links[d],
  //               }),
  //             ),
  //             ...(finddestination
  //               ? []
  //               : [
  //                   {
  //                     latitude: responsedata[i].links[d].destination.latitude,
  //                     longitude: responsedata[i].links[d].destination.longitude,
  //                     linkdetail: responsedata[i].links[d],
  //                   },
  //                 ]),
  //           );
  //         }

  //         // allpoints.push(
  //         //   ...responsedata[i].links[d].link_points.map(
  //         //     (dataa: {latitude: number; longitude: number}) => ({
  //         //       latitude: dataa.latitude,
  //         //       longitude: dataa.longitude,
  //         //       linkdetail: responsedata[i].links[d],
  //         //     }),
  //         //   ))

  //         const findstationdata = linksdata.findIndex(
  //           data => data.id == responsedata[i].links[d].id,
  //         );
  //         if (findstationdata < 0) {
  //           linksdata.push(responsedata[i].links[d]);
  //         }
  //       }
  //     }
  //     if (stationdata.length > 0) {
  //       if (lastselectednetwork.length == 0) {
  //         setMapcenter([
  //           stationdata[stationdata.length - 1].longitude,
  //           stationdata[stationdata.length - 1].latitude,
  //         ]);
  //       } else {
  //         const findnetowrks = responsedata.findIndex(
  //           (data: any) => data.id == lastselectednetwork,
  //         );

  //         if (
  //           findnetowrks > -1 &&
  //           responsedata[findnetowrks].stations.length > 0
  //         ) {
  //           const findedlongitude =
  //             responsedata[findnetowrks].stations[0].longitude;
  //           const findedlatitude =
  //             responsedata[findnetowrks].stations[0].latitude;
  //           setMapcenter([findedlongitude, findedlatitude]);
  //         } else {
  //           setMapcenter([
  //             stationdata[stationdata.length - 1].longitude,
  //             stationdata[stationdata.length - 1].latitude,
  //           ]);
  //         }
  //       }
  //     } else {
  //       setMapcenter([35.6892, 51.389]);
  //     }
  //     setAllLinkpoints(allpoints);
  //     setRegions(regiondata);
  //     setStaations(stationdata);
  //     setLinks(linksdata);
  //     setSelectboxregions(
  //       regiondata.map((data: any) => ({id: data.id, name: data.name})),
  //     );
  //   } catch (error) {
  //     console.log('getmapdetailerror', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   getalldetail();
  //   setTimeout(() => {
  //     setShowUpdateMapCenter(false);
  //   }, 10000);
  // }, [selectednetworks]);

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
          Region: {data.regionName}
        </div>

        <div className="ml-[8px] mt-[12px] flex flex-row items-center justify-between text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={redicon} className="h-[35px] w-[35px]" />
          <span className="mr-2">
            {countLinkSeverityAlarms(alarms, data.id, 'High')}
          </span>
        </div>
        <div className="ml-[8px] mt-[12px] flex flex-row items-center justify-between text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={orangeicon} className="h-[35px] w-[35px]" />
          <span className="mr-2">
            {countLinkSeverityAlarms(alarms, data.id, 'Medium')}
          </span>
        </div>
        <div className="ml-[8px] mt-[12px] flex flex-row items-center justify-between text-[20px] font-light leading-[25.2px] text-[black]">
          <img src={yellowicon} className="h-[35px] w-[35px]" />
          <span className="mr-2">
            {countLinkSeverityAlarms(alarms, data.id, 'Low')}
          </span>
        </div>
      </div>
    );
  };

  const onclicmenue = () => {
    setLeftbarstate(true);
    if (selectboxregions.length == 0) {
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
  };

  const selectrange = (data: {name: string; id: number}[]) => {
    setLastselectednetwork(data[data.length - 1]?.id?.toString() || '');
    setShowUpdateMapCenter(true);
    const dataa: string[] = [];

    for (let j = 0; j < data.length; j++) {
      dataa.push(data[j].id.toString());
    }

    setSelectednetworks(dataa);
  };



  async function getallalarms() {
    try {
      const getalarmsresponse = await $Post(
        `otdr/map/map_alarms/`,
        selectednetworks,
      );
      if (getalarmsresponse?.status == 200) {
        const getalarmsresponsedata = await getalarmsresponse.json();
      }
    } catch (error) {
      console.log(`get alarms error:${error}`);
    }
  }

  const highSeverityEvents: serverity[] = useMemo(() => {
    if (redalarms) {
      return alarms.flatMap(item =>
        item.regions.flatMap(region =>
          region.links.flatMap(link =>
            link.alarm_events.filter(event => event.severity === 'High'),
          ),
        ),
      );
    } else return [];
  }, [alarms, redalarms]);

  const LowSeverityEvents: serverity[] = useMemo(() => {
    if (yellowalarms) {
      return alarms.flatMap(item =>
        item.regions.flatMap(region =>
          region.links.flatMap(link =>
            link.alarm_events.filter(event => event.severity === 'Low'),
          ),
        ),
      );
    } else return [];
  }, [alarms, yellowalarms]);

  const MediumSeverityEvents: serverity[] = useMemo(() => {
    if (orangealarms) {
      return alarms.flatMap(item =>
        item.regions.flatMap(region =>
          region.links.flatMap(link =>
            link.alarm_events.filter(event => event.severity === 'Medium'),
          ),
        ),
      );
    } else return [];
  }, [alarms, orangealarms]);






  // ******************** return ****************** return ************************** return *******************************
  return (
    <>
  

      <div className="relative mt-[60px]  flex h-[calc(100vh-105px)] w-full flex-row  overflow-x-hidden overflow-y-hidden">
        {showlinktoolkit ? <Linktooltip data={selectedLink} /> : null}

        <div
          className={`relative w-full  ${
            fullscreen
              ? 'mt-[-90px] h-[calc(100vh-10px)]'
              : 'h-[calc(100vh-90px)]'
          } `}>
          {/* ---------------left bar------------------- left bar----------------left bar-----------------*/}
      

          {/* ---------------reightbars------------------------reightbars-------------------------reightbars--------- */}
          {rightbarstate == 'station' ? (
            <RightbarStation
              Hightalaems={countStationSeverityAlarms(
                alarms,
                selectedStation!.id,
                'High',
              )}
              Lowalarms={countStationSeverityAlarms(
                alarms,
                selectedStation!.id,
                'Low',
              )}
              Mediumalarms={countStationSeverityAlarms(
                alarms,
                selectedStation!.id,
                'Medium',
              )}
              data={selectedStation!}
            />
          ) : rightbarstate == 'link' ? (
            <RightbarLink
              data={selectedLink}
              Hightalaems={countLinkSeverityAlarms(
                alarms,
                selectedLink.id,
                'High',
              )}
              Lowalarms={countLinkSeverityAlarms(
                alarms,
                selectedLink.id,
                'Low',
              )}
              Mediumalarms={countLinkSeverityAlarms(
                alarms,
                selectedLink.id,
                'Medium',
              )}
            />
          ) : rightbarstate == 'alarm' ? (
            <RightbarAlarm />
          ) : null}

          {/* -------------------- map ---------------- map ------------------- map ----------------- map ------------- */}

          <MapContainer
            center={mapcenter}
            zoom={defaultzoom}
            scrollWheelZoom={true}
            zoomControl={false}
            className={`h-full w-full`}>
            {showUpdateMapCenter ? (
              <UpdateMapCenter center={mapcenter} />
            ) : null}

            {loading ? (
              <Mainloading classname="w-full h-full absolute left-0 right-0 top-0 z-[100] items-center justify-center bg-neutral-400 opacity-10" />
            ) : null}
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
                className={`absolute right-[23px] top-[194px] z-[400]`}
              />
            ) : (
              <BsArrowsFullscreen
                onClick={() => setfullscreen(true)}
                className="absolute right-[25px] top-[108px] z-[400]  h-[38.1px] w-[40px]"
              />
            )}

            <>
              {switchstatus ? (
                <>
                  {Stations?.map((data, index) => (
                    <Marker
                      key={data.id}
                      eventHandlers={{
                        click: e => {
                          setRightbarState('station');
                          setSelectedStation(data);
                        },
                      }}
                      position={[data?.longitude, data?.latitude]}
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
                            Region:{data.regionName}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Latitude:{data.latitude}
                          </span>
                          <span className="mb-[6px] ml-[8px] text-[18px] font-light leading-[25.2px] text-[black]">
                            Longitude:{data.longitude}
                          </span>
                          <span className="ml-[8px]  text-[18px] font-light leading-[25.2px] text-[black]">
                            RTU(s):{data.rtus?.length}
                          </span>
                        </div>
                      </Tooltip>
                    </Marker>
                  ))}
                </>
              ) : (
                <>
                  {/* {Regions?.map((data, index) => {
                    let sumlatitude = 0;
                    let sumlongitude = 0;
                    for (let i = 0; i < data.stations.length; i++) {
                      if (data.stations) {
                        sumlatitude += data.stations[i].latitude;
                        sumlongitude += data.stations[i].longitude;
                      }
                    }

            
                      return (
                        <Marker
                          key={`${data.id}${data.id}`}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('station');
                              //  setSelectedStation(data)
                            },
                          }}
                          position={[
                            sumlongitude / data.stations.length,
                            sumlatitude / data.stations.length,
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
                                High Severity:{' '}
                                {countSeverityAlarmsInArray(
                                  alarms,
                                  data.id,
                                  'High',
                                )}
                              </span>
                              <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                                Medium Severity:
                                {countSeverityAlarmsInArray(
                                  alarms,
                                  data.id,
                                  'Medium',
                                )}
                              </span>
                              <span className="mb-[4px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                                Low Severity:{' '}
                                {countSeverityAlarmsInArray(
                                  alarms,
                                  data.id,
                                  'Low',
                                )}
                              </span>
                            </div>
                          </Tooltip>
                        </Marker>
                      );
                 
                  })} */}
                </>
              )}
            </>

       
            
       
                  <>
                    <Marker
                      eventHandlers={{
                        click: e => {
                          setRightbarState('alarm');
                        },
                      }}
                      position={[Number(alarmlongitude!), Number(alarmlatitude!)]}
                      icon={severity == "High"?NoRed:severity == "Medium"?NoOrange:NoYellow}>
                      {/* <Tooltip
                        opacity={1}
                        className="h-[150px] w-[215px]"
                        direction="top"
                        offset={[0, -25]}>
                        <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-[220px] flex-col bg-[#E7EFF7]">
                          <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                            Primary Source: {data.source_name}
                          </span>
                          <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                            Type:{data.alarm_type}
                          </span>
                          <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                            Latitude: {data.latitude}
                          </span>
                          <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                            Longitude: {data.longitude}
                          </span>
                          <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                            State:{data.status}
                          </span>
                        </div>
                      </Tooltip> */}
                    </Marker>
                  </>
            
          
        

            {orangealarms ? (
              <>
                {MediumSeverityEvents.map(data => (
                  <Marker
                    eventHandlers={{
                      click: e => {
                        setRightbarState('alarm');
                      },
                    }}
                    position={[data?.longitude, data?.latitude]}
                    icon={NoOrange}>
                    <Tooltip
                      opacity={1}
                      className="h-[150px] w-[215px]"
                      direction="top"
                      offset={[0, -25]}>
                      <div className="z-1000 absolute right-[-2.5px] top-[-5px] flex h-[160px] w-auto min-w-[220px] flex-col bg-[#E7EFF7]">
                        <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Primary Source: {data.source_name}
                        </span>
                        <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Type:{data.alarm_type}
                        </span>
                        <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Latitude: {data.latitude}
                        </span>
                        <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          Longitude: {data.longitude}
                        </span>
                        <span className="ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                          State:{data.status}
                        </span>
                      </div>
                    </Tooltip>
                  </Marker>
                ))}
              </>
            ) : null}

            {regionname.length > 0 ? (
              <>
         
              </>
            ) : (
              <>
                {switchstatus ? (
    
                  <>
                    {allLinkpoints.map((pointdata, index) => {
                      const prevPointData =
                        index > 0 ? allLinkpoints[index - 1] : pointdata;
                      return (
                        <>
                          <Polyline
                            key={`${pointdata.latitude}${index}`}
                            eventHandlers={{
                              click: e => {
                                setRightbarState('link');
                                setSelectedLink(pointdata.linkdetail);
                              },
                              mouseover: e => {
                                setShowlinltoolkit(true);
                                setSelectedLink(pointdata.linkdetail);
                              },
                              mouseout: e => {
                                setShowlinltoolkit(false);
                                // alert('dfdfd');
                              },
                            }}
                            positions={[
                              [
                                Number(prevPointData.longitude),
                                Number(prevPointData.latitude),
                              ],
                              [
                                Number(pointdata.longitude),
                                Number(pointdata.latitude),
                              ],
                            ]}
                            color="red"></Polyline>

                          <Polyline
                            key={index}
                            weight={5}
                            eventHandlers={{
                              click: e => {
                                setRightbarState('link');
                                setSelectedLink(pointdata.linkdetail);
                              },
                              mouseover: e => {
                                setShowlinltoolkit(true);
                                setSelectedLink(pointdata.linkdetail);
                              },
                              mouseout: e => {
                                setShowlinltoolkit(false);
                              },
                            }}
                            positions={[
                              [
                                Number(prevPointData.longitude),
                                Number(prevPointData.latitude),
                              ],
                              [
                                Number(pointdata.longitude),
                                Number(pointdata.latitude),
                              ],
                            ]}
                            pathOptions={{
                              color: 'black',
                              weight: 20,
                              opacity: 0,
                            }}
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
    
      </div>
    </>
  );
};

export default MapPage;
