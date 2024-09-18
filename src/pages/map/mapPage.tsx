import React, {useEffect, useMemo, useRef, useState} from 'react';
import Checkbox from './../../components/checkbox/checkbox';
import RightbarStation from './../../components/mapcomponents/rightbarStation';
import RightbarLink from './../../components/mapcomponents/rightbarLink';
import yellowicon from '~/assets/icons/noYellow.png';
import redicon from '~/assets/icons/noRed.png';
import orangeicon from '~/assets/icons/noOrange.png';
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
import Multiselect from 'multiselect-react-dropdown';
import {$Get, $Post} from '~/util/requestapi';
import {deepcopy} from '~/util';
import Mainloading from '~/components/loading/mainloading';
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
              alarm_type:string
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
              alarm_type:string
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
  alarm_type:string
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
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [fullscreen, setfullscreen] = useState(false);
  const [alarms, setAlarms] = useState<alarmtype[]>([]);
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
  const [links, setLinks] = useState<linktype[]>([]);
  const [sumselectedregionlatitude, setSumSelectedregionlatitude] =
    useState<any>([]);
  const [sumselectedregionlongitude, setSumSelectedregionlongitude] =
    useState<any>([]);
  const [selectboxregions, setSelectboxregions] = useState<
    {value: string; label: string}[]
  >([]);

  function countSeverityAlarmsInArray(dataArray:alarmtype[], targetRegionId:string,status:string) {
    let highSeverityCount = 0;
    
    dataArray.forEach(data => {
    const region = data.regions.find(region => region.region_id === targetRegionId);
    
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

    Array.isArray(dataArray) &&   dataArray.forEach(data => {
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
    Array.isArray(dataArray) &&   dataArray.forEach(data => {
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
console.log(Regions,'👄Regions');

  // console.log('Regions', Regions);

  // const Stations = state?.detail?.data?.stations;
  // const Regions = state?.detail?.data?.regions || [];

  // const regiondata = (id: string) => {
  //   const find = Regions.find((data: any) => data.id == id);
  //   let sumlatitude = 0;
  //   let sumlongitude = 0;
  //   for (let i = 0; i < find.stations.length; i++) {
  //     sumlatitude += find.stations[i].latitude;
  //     sumlongitude += find.stations[i].longitude;
  //   }
  //   setSumSelectedregionlatitude(sumlatitude);
  //   setSumSelectedregionlongitude(sumlongitude);
  //   setSelectedregion(find);
  // };

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  useEffect(() => {
    const getallnetwork = async () => {
      try {
        setLoadingnetwork(true);
        const response = await $Get(`otdr/network/?limit=100&skip=0`);
        const responseData = await response?.json();
        const newdata = responseData.map((data: any) => ({
          name: data.name,
          id: data.id,
        }));
        setNetworkoptions(newdata);
      } catch (error) {
      } finally {
        setLoadingnetwork(false);
      }
    };

    getallnetwork();
  }, []);

  // const getmapdetail = async () => {
  //   setSelectedregion([]);
  //   setRegionname('');
  //   try {
  //     const response = await $Post(`otdr/map`, selectednetworks);
  //     const responsedata = await response?.json();
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

  //       for (let d = 0; d < responsedata[i].links.length; d++) {
  //         const findstationdata = linksdata.findIndex(
  //           data => data.id == responsedata[i].links[d].id,
  //         );
  //         if (findstationdata < 0) {
  //           linksdata.push(responsedata[i].links[d]);
  //         }
  //       }
  //     }
  //     // console.log('stationdata', stationdata);
  //     // console.log('linksdata', linksdata);
  //     // console.log('regiondata', regiondata);
  //     setRegions(regiondata);
  //     setStaations(stationdata);
  //     setLinks(linksdata);
  //     setSelectboxregions(
  //       regiondata.map((data: any) => ({id: data.id, name: data.name})),
  //     );
  //   } catch (error) {
  //     console.log('getmapdetailerror', error);
  //   }
  // };

  // useEffect(() => {
  //   if (mount) {
  //     const getalarms = async () => {
  //       try {
  //         setLoading(true);
  //         const [allalarmsresponse] = await Promise.all([
  //           $Post(`otdr/map/map_alarms/`, selectednetworks),
  //         ]);

  //         const alarmsdata: alarmtype[] = await allalarmsresponse?.json();
  //         const filteredData =
  //           selectedregion.length > 0
  //             ? alarmsdata.filter(item =>
  //                 item.regions.some(
  //                   region => selectedregion.indexOf(region.region_id) > -1,
  //                 ),
  //               )
  //             : alarmsdata;
  //         setAlarms(filteredData);
  //       } catch (error) {
  //         console.log(`get allalarms error is:${error}`);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };
  //     getalarms();
  //   } else {
  //     setMount(true);
  //   }
  // }, [redalarms, yellowalarms, orangealarms]);

  const getalldetail = async () => {
    setSelectedregion([]);
    setRegionname('');
    setorangeallarms(false);
    setredallarms(false);
    setyellowallarms(false);
    try {
      setLoading(true);
      const [mapdetailresponse, allalarmsresponse] = await Promise.all([
        $Post(`otdr/map`, selectednetworks),
       mount?null: $Post(`otdr/map/map_alarms/`, selectednetworks)
      ]);
      const responsedata = await mapdetailresponse?.json();
if(!mount){
  const alarmsdata: alarmtype[] = await allalarmsresponse?.json();
  const filteredData =
    selectedregion.length > 0
      ? alarmsdata.filter(item =>
          item.regions.some(
            region => selectedregion.indexOf(region.region_id) > -1,
          ),
        )
      : alarmsdata;
  setAlarms(filteredData);
}

   
      let regiondata: any = [];
      let stationdata: Stationtype[] = [];
      let linksdata = [];
      for (let i = 0; i < responsedata.length; i++) {
        regiondata.push(...responsedata[i].regions);
        for (let t = 0; t < responsedata[i].regions.length; t++) {
          stationdata.push(
            ...responsedata[i].regions[t].stations.map((data: any) => ({
              ...data,
              regionName: responsedata[i].regions[t].name || '',
              regionId: responsedata[i].regions[t].id || '',
            })),
          );
          linksdata.push(
            ...responsedata[i].regions[t].links.map((data: any) => ({
              ...data,
              regionName: responsedata[i].regions[t].name || '',
              regionId: responsedata[i].regions[t].id || '',
            })),
          );
        }

        for (let d = 0; d < responsedata[i].stations.length; d++) {
          const findstationdata = stationdata.findIndex(
            data => data.id == responsedata[i].stations[d].id,
          );
          if (findstationdata < 0) {
            stationdata.push(responsedata[i].stations[d]);
          }
        }

        for (let d = 0; d < responsedata[i].links.length; d++) {
          const findstationdata = linksdata.findIndex(
            data => data.id == responsedata[i].links[d].id,
          );
          if (findstationdata < 0) {
            linksdata.push(responsedata[i].links[d]);
          }
        }
      }
      setRegions(regiondata);
      setStaations(stationdata);
      setLinks(linksdata);
      setSelectboxregions(
        regiondata.map((data: any) => ({id: data.id, name: data.name})),
      );
    } catch (error) {
      console.log('getmapdetailerror', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getalldetail();
  }, [selectednetworks]);

  console.log('alarms', alarms);

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
    const dataa: string[] = [];

    for (let j = 0; j < data.length; j++) {
      dataa.push(data[j].id.toString());
    }

    setSelectednetworks(dataa);
  };

  const changeselectedregion = (data: {name: string; id: number}[]) => {
    const RegionsCopy = deepcopy(Regions);
    if (data.length == 0) {
      getalldetail();
    } else {
      const alarmsCopy: alarmtype[] = deepcopy(alarms);
      const filteredData = alarmsCopy.filter(item =>
        item.regions.some(
          region => selectedregion.indexOf(region.region_id) > -1,
        ),
      );
      setAlarms(filteredData);
      const dataa: any = [];
      let stationdata: any = [];
      let linkdata: any = [];
      for (let j = 0; j < data.length; j++) {
        const finddataindex = RegionsCopy.findIndex(
          (Regionsdata: any) => Regionsdata.id == data[j].id,
        );
        dataa.push(RegionsCopy[finddataindex]);
      }

      for (let k = 0; k < dataa.length; k++) {
        stationdata.push(...dataa[k].stations);
        linkdata.push(...dataa[k].links);
      }
      // setRegions(dataa);
      setStaations(stationdata);
      setLinks(linkdata);
    }
  };

  // console.log("💪",Stations);
  // console.log("selectednetworks",selectednetworks);

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
  }, [alarms,redalarms]);

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
  }, [alarms,yellowalarms]);
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
  }, [alarms,orangealarms]);
  console.log('highSeverityEvents', highSeverityEvents);

  // ******************** return ****************** return ************************** return *******************************
  return (
    <>
      {/* {loading?
  <Mainloading />
    :
        null    
    } */}

      <div className="relative mt-[60px]  flex h-[calc(100vh-105px)] w-full flex-row  overflow-x-hidden overflow-y-hidden">
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
              } box-border flex flex-col overflow-y-auto overflow-x-hidden px-[10px] pb-[130px]`}>
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
                <div className="relative z-30  my-4 mr-[20px] flex w-full flex-row items-center">
                  {/* <button
                  onClick={() => selectboxref.current.onmouseleave}
                  className="bg-blue-light absolute bottom-[14px] left-[9px] z-20 rounded-sm px-1 text-white">
                  بستن
                </button> */}
                  <div className="Content mb-2 mr-4 ">Network</div>
                  <div className="relative w-[220px]">
                    <Multiselect
                      className="rounded-lg  border-[1px] border-black bg-white"
                      showCheckbox={true}
                      placeholder={loadingnetwork ? 'loading...' : 'Select'}
                      ref={selectboxref}
                      options={networkoptions} // Options to display in the dropdown
                      // selectedValues={defaultranges}
                      onSelect={data => selectrange(data)} // Function will trigger on select event
                      onRemove={data => selectrange(data)} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />
                  </div>
                </div>
              ) : null}

              {leftbarstate ? (
                <div className="relative z-20  my-4 mr-[20px] flex w-full flex-row items-center">
                  {/* <button
                  onClick={() => selectboxref.current.onmouseleave}
                  className="bg-blue-light absolute bottom-[14px] left-[9px] z-20 rounded-sm px-1 text-white">
                  بستن
                </button> */}
                  <div className="Content mb-2 mr-[30px] ">Region </div>
                  <div className="relative w-[220px]">
                    <Multiselect
                      disable={!switchstatus}
                      className="rounded-lg  border-[1px] border-black bg-white"
                      showCheckbox={true}
                      ref={selectboxref}
                      options={selectboxregions} // Options to display in the dropdown
                      // selectedValues={defaultranges}
                      onSelect={data => changeselectedregion(data)} // Function will trigger on select event
                      onRemove={data => changeselectedregion(data)} // Function will trigger on remove event
                      displayValue="name" // Property name to display in the dropdown options
                    />
                  </div>
                </div>
              ) : null}

              {/* {leftbarstate ? (
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
            ) : null} */}

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
                  <div className="ml-[8px] flex  w-full flex-row items-center justify-between">
                    <span className="text-[20px] font-light leading-[25.2px] text-[black]">
                      Low Severity
                    </span>
                    <Checkbox
                      checkstatus={yellowalarms}
                      onclick={(e: boolean) => setyellowallarms(e)}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mb-6 flex w-full flex-row items-center">
                <img src={noOrange} className="h-7 w-7" />
                {leftbarstate ? (
                  <div className="ml-[8px] flex  w-full flex-row items-center justify-between">
                    <span className="text-[20px] font-light leading-[25.2px] text-[black]">
                      Medium Severity
                    </span>
                    <Checkbox
                      checkstatus={orangealarms}
                      onclick={(e: boolean) => setorangeallarms(e)}
                    />
                  </div>
                ) : null}
              </div>

              <div className="mb-6 flex w-full flex-row items-center">
                <img src={noRed} className="h-7 w-7" />
                {leftbarstate ? (
                  <div className="ml-[8px] flex  w-full flex-row items-center justify-between">
                    <span className="text-[20px] font-light leading-[25.2px] text-[black]">
                      High Severity
                    </span>
                    <Checkbox
                      checkstatus={redalarms}
                      onclick={(e: boolean) => setredallarms(e)}
                      // classname={'ml-[100px]'}
                    />
                  </div>
                ) : null}
              </div>

              <div className="ml-[-10px] h-[1px] w-[330px] bg-[#ffffff]"></div>
              {leftbarstate ? (
                <div className='w-full flex flex-col h-[250px]'>
                  <button className="mt-[30px] h-[40px] w-[290px] rounded-[10px] bg-gradient-to-b from-[#BAC2ED]  to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
                    Add Station
                  </button>

                  <button className="from-9% mt-[30px] h-[40px]  w-[290px] rounded-[10px] bg-gradient-to-b from-[#B3BDF2] to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
                    Add Link
                  </button>
                  <button className="from-9% mt-[30px] h-[40px]  w-[290px] rounded-[10px] bg-gradient-to-b from-[#B3BDF2] to-[#B3BDF2] text-[20px] font-light leading-[25.2px] text-[black]">
                    Add RTU
                  </button>
                </div>
              ) : null}
            </div>
          )}

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
            data={selectedStation!} />
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
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
            zoomControl={false}
            className={`h-full w-full`}>
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
            {/* 
          {regionname.length > 0 ? (
            <>
              {switchstatus ? (
                <>
                  {Stations.map((data, index: number) => (
                    <Marker
                      key={data.id}
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
                            Region:{data.regionName}
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
                  {Regions?.map((data: any) => {
                    let sumlatitude = 0;
                    let sumlongitude = 0;
                    for (let i = 0; i < data.stations.length; i++) {
                      sumlatitude += data.stations[i].latitude;
                      sumlongitude += data.stations[i].longitude;
                    }
                    if (data.stations.length > 0) {
                      return (
                        <Marker
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
                    } else {
                      return <></>;
                    }
                  })}
                </>
              )}
            </>
          ) : ( */}
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
                  {Regions?.map((data, index) => {
                    let sumlatitude = 0;
                    let sumlongitude = 0;
                    for (let i = 0; i < data.stations.length; i++) {
                      if (data.stations) {
                        sumlatitude += data.stations[i].latitude;
                        sumlongitude += data.stations[i].longitude;
                      }
                    }

                    if (data?.stations?.length > 0) {
                      return (
                        <Marker
                          key={data.id}
                          eventHandlers={{
                            click: e => {
                              setRightbarState('station');
                              //  setSelectedStation(data)
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
                                High Severity: {countSeverityAlarmsInArray(alarms,data.id,"High")}
                              </span>
                              <span className="mb-[12px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                                Medium Severity:{countSeverityAlarmsInArray(alarms,data.id,"Medium")}
                              </span>
                              <span className="mb-[4px] ml-[8px] text-[20px] font-light leading-[25.2px] text-[black]">
                                Low Severity: {countSeverityAlarmsInArray(alarms,data.id,"Low")}
                              </span>
                            </div>
                          </Tooltip>
                        </Marker>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </>
              )}
            </>

            {yellowalarms ? (
              <>
                {LowSeverityEvents.map(data => (
                  <Marker
                    eventHandlers={{
                      click: e => {
                        setRightbarState('alarm');
                      },
                    }}
                    position={[data.latitude, data.longitude]}
                    icon={NoYellow}>
                    <Tooltip
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
                    </Tooltip>
                  </Marker>
                ))}
              </>
            ) : null}

            {redalarms ? (
              <>
                {highSeverityEvents.map(data => (
                  <>
                    <Marker
                      eventHandlers={{
                        click: e => {
                          setRightbarState('alarm');
                        },
                      }}
                      position={[data?.latitude, data?.longitude]}
                      icon={NoRed}>
                      <Tooltip
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
                      </Tooltip>
                    </Marker>
                  </>
                ))}
              </>
            ) : null}

            {orangealarms ? (
              <>
                {MediumSeverityEvents.map(data => (
                  <Marker
                    eventHandlers={{
                      click: e => {
                        setRightbarState('alarm');
                      },
                    }}
                    position={[data?.latitude, data?.longitude]}
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
                {/* {switchstatus ? (
                <>
                  {Regions?.links?.map((data: any, index: any) => {
                    let start = Stations.find(
                      dat => dat?.id == data?.source.id,
                    );

                    let end = Stations.find(
                      dat => dat?.id == data?.destination?.id,
                    );
                    if (start && end) {
                      return (
                        <>
                          <Polyline
                            key={data.id}
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
                              [start?.latitude, start?.longitude],
                              [end?.latitude, end?.longitude],
                            ]}
                            color="red"></Polyline>

                          <Polyline
                            key={data.id}
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
                            pathOptions={{
                              color: 'black',
                              weight: 20,
                              opacity: 0,
                            }}
                            // color="black"
                          ></Polyline>
                        </>
                      );
                    } else {
                      return <></>;
                    }
                  })}
                </>
              ) : null} */}
              </>
            ) : (
              <>
                {switchstatus ? (
                  <>
                    {links?.map((data, index) => {
                      let start = Stations?.find(
                        dat => dat?.id == data?.source?.id,
                      );

                      let end = Stations?.find(
                        dat => dat?.id == data?.destination?.id,
                      );
                      if (start && end) {
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
                                [ start.longitude,start.latitude],
                                [end.longitude,end.latitude],
                              ]}
                              color="red"></Polyline>

                            <Polyline
                              key={data.id}
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
                              pathOptions={{
                                color: 'black',
                                weight: 20,
                                opacity: 0,
                              }}
                              // color="black"
                            ></Polyline>
                          </>
                        );
                      } else {
                        return <></>;
                      }
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
    </>
  );
};

export default MapPage;
