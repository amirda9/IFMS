import React, {useRef, } from 'react';
import {Select, Table} from '~/components';
import Checkbox from '~/components/checkbox/checkbox';
import dateicon from '~/assets/images/dateicon.png';
import './index.css';
import {Link} from 'react-router-dom';
import {IoOpenOutline} from 'react-icons/io5';
import {
  BiChevronLeft,
  BiChevronRight,
  BiChevronsLeft,
  BiChevronsRight,
} from 'react-icons/bi';
import {useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {NavLink} from 'react-router-dom';
import {SimpleBtn} from '~/components';
import {
  setresultNetworkselectedlist,
  setresultbrozernetworkoptical,
  resultbrosernetworkopticaltype,
  setopenallopt,
} from './../../../store/slices/resultbroserOpticalroutslice';
type resultbrosernetworklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};
type Itembtnopttype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};
import {BsPlusLg} from 'react-icons/bs';
import {useLocation, useNavigate} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {$Delete, $Get} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {
  allstationsrtutype,
  setRtuNetworkidadmin,
  setRtuRegionidadmin,
  setRtuStationidadmin,
  setrtugetdetailStatus,
} from './../../../store/slices/resultbrouserRtuslice';
import {deepcopy} from './../../../util/deepcopy';

import {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
} from './../../../store/slices/rtu';
import {IoTrashOutline} from 'react-icons/io5';
import {RootState} from '~/store';
import Swal from 'sweetalert2';
import {UserRole} from '~/constant/users';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
// --------- type ---------------------- type ------------------ type ------------
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclick?: () => void;
  canAdd?: boolean;
};
type Itemstationbtntype = {
  name: string;
  id: string;
  classname?: string;
  onclick?: () => void;
  canAdd?: boolean;
  regionid: string;
  networkid: string;
  candelete: boolean;
};

type Itemregionbtntype = {
  name: string;
  id: string;
  classname?: string;
  onclick?: () => void;
  canAdd?: boolean;
  netWorkid: string;
};
type getallrtuestype = {
  id: string;
  name: string;
  station: {
    id: string;
    name: string;
    network: {
      id: string;
      name: string;
    };
  };
  connection: string;
  last_comm: string;
  last_successful_comm: string;
}[];

// -------------------- main ------------------------ main ------------------- main -----------------
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};
type Radiotype = {
  check: boolean;
  onclick: () => void;
};

const topcolumns = {
  index: {label: 'Index', size: 'w-[2%]'},
  date: {label: 'Test Date', size: 'w-[16%]'},
  rtu: {label: 'RTU', size: 'w-[10%]'},
  opticalRoute: {label: 'Optical Route', size: 'w-[16%]'},
  testSetup: {label: 'Test Setup', size: 'w-[16%]'},
  faultStatus: {label: 'Fault Status', size: 'w-[9%]'},
  faultType: {label: 'Fault Type', size: 'w-[11%]'},
  distance: {label: 'Distance (km)', size: 'w-[11%]'},
  Loss: {label: 'Loss (dB)', size: 'w-[6%]'},
  detail: {label: 'Detail', size: 'w-[2%]'},
  delete: {label: 'Delete', size: 'w-[2%]'},
};

const topitems = [
  {
    index: 0,
    date: '2022-10-29 22:59:59',
    rtu: 'RTU 1',
    opticalRoute: 'Optical Route 1',
    testSetup: 'Test Setup 1',
    faultType: 'Break',
    faultStatus: 'Still There',
    distance: '200',
    Loss: '4',
    detail: '',
    delete: '',
  },
  {
    index: 1,
    date: '2022-10-29 22:59:59',
    rtu: 'RTU 1',
    opticalRoute: 'Optical Route 1',
    testSetup: 'Test Setup 1',
    faultType: 'Break',
    faultStatus: 'Still There',
    distance: '200',
    Loss: '4',
    detail: '',
    delete: '',
  },
  {
    index: 1,
    date: '2022-10-29 22:59:59',
    rtu: 'RTU 1',
    opticalRoute: 'Optical Route 1',
    testSetup: 'Test Setup 1',
    faultType: 'Break',
    faultStatus: 'Still There',
    distance: '200',
    Loss: '4',
    detail: '',
    delete: '',
  },
];

function Resultbrowser() {
  const fromdateref: any = useRef(null);
  const lastdateref: any = useRef(null);
  const [fromdate, setFromdate] = useState('');
  const [lastdate, setLastdate] = useState('');
  const [filterByTime, setFilterByTime] = useState(false);
  const [selectedradio, setSelectedradio] = useState('Filter By Optical Route');
  const [selectedradiotime, setSelectedradiotime] = useState('Last');
  const [last, setLast] = useState(0);
  const opennetworkopticallist = async (id: string) => {
    try {
      setLoadingopticaldata(true);
      const findnetwork = resultnetworkselectedlist.findIndex(data => data == id);
      //We first check whether network has been clicked before or not.
      if (findnetwork > -1) {
        let old = [...resultnetworkselectedlist];
        old.splice(findnetwork, 1);
        dispatch(setresultNetworkselectedlist(old));
      } else {
        let old = [...resultnetworkselectedlist];
        old.push(id);
        dispatch(setresultNetworkselectedlist(old));
      }
      // -------------------
      const findopt = resultbrosernetworkoptical.findIndex(data => data.networkid == id);
      const opticals = await $Get(`otdr/optical-route/?network_id=${id}`);
      if (opticals?.status == 200) {
        const opticalslist = await opticals?.json();
        //Here we add or remove the opticalroutes related to this network to the listopt.
        if (findopt > -1) {
          let old = [...resultbrosernetworkoptical];
          let newdata = old.filter(data => data.networkid != id);
          newdata.push({networkid: id, opticalrouts: opticalslist});
          dispatch(setresultbrozernetworkoptical(newdata));
        } else {
          let old = [...resultbrosernetworkoptical];
          old.push({networkid: id, opticalrouts: opticalslist});
          dispatch(setresultbrozernetworkoptical(old));
        }
      }
    } catch (error) {
      console.log(`error is :${error}`);
    } finally {
      setLoadingopticaldata(false);
    }
  };
  function RadioButton({check, onclick}: Radiotype) {
    return (
      <div className="flex flex-row items-center">
        <button
          onClick={() => onclick()}
          className="flex h-[20px] w-[20px] items-center justify-center rounded-[10px] bg-[#ffffff]">
          <div
            className={`h-[10px] w-[10px] rounded-[5px] ${
              check ? 'bg-[#0E9836]' : 'bg-[#ffffff]'
            } `}></div>
        </button>
      </div>
    );
  }
  // ----- optical ------------------------ optical ----------------------- optical ---------------------------

  const navigte = useNavigate();
  const [selectedIdopt, setSelectedIdopt] = useState('');
  const [listopt, setListopt] = useState<resultbrosernetworklisttype[]>([]);
  const [loadingopticalid, setLoadingopticalid] = useState('');
  const [loadingopticaldata, setLoadingopticaldata] = useState(false);
  const [skipopt, setSkipopt] = useState(0);
  const [networkopticalloading, setNetworkloading] = useState(false);
  const {resultnetworkselectedlist, resultbrosernetworkoptical, alldeleteopticalroute, openallopt} =
    useSelector((state: RootState) => state.resultbroserOpticalroutslice);

  useEffect(() => {
    const getnetworklist = async () => {
      try {
        setLoadingopticaldata(true);
        setNetworkloading(true);
        const response = await $Get(`otdr/network?limit=10&skipopt=${skipopt}`);
        if (response?.status == 200) {
          const responsedata = await response?.json();
          const listCopy = deepcopy(listopt);
          const newlist = [...listCopy, ...responsedata];
          setListopt(newlist);
        }
      } catch (error) {
      } finally {
        setLoadingopticaldata(false);
        setNetworkloading(false);
      }
    };
    getnetworklist();
  }, [skipopt]);

  const findoptical = (networkId: string, opticalId: string) => {
    const findopt = alldeleteopticalroute
      ?.find(data => data.networkid == networkId)
      ?.opticalrouts?.findIndex((data2: string) => data2 == opticalId);
    if (findopt != undefined && findopt > -1) {
      return true;
    } else {
      return false;
    }
  };

  // const [openall, setOpenall] = useState(false);

  const Itembtnopt = ({name, id, classname}: Itembtnopttype) => {
    return (
      <div
        className={`flex h-[70px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {resultnetworkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => {
            opennetworkopticallist(id), setSelectedIdopt(id), setLoadingopticalid(id);
          }}
          className={`${
            resultnetworkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
      
    
      </div>
    );
  };








  const lastnetworkopt = useMemo(() => {
    return (listopt && listopt[listopt.length - 1]?.id) || '';
  }, [listopt]);
  // ----------------------------------- rtu -------------------------- rtu -------------------------- rtu ------------
  const dispatch = useDispatch();
  const location = useLocation();
  const [loadingid, setLoadingid] = useState('');
  const [loadingdata, setLoadingdata] = useState(false);
  const [selectedtabId, setSelectedtabid] = useState('');
  const [list, setList] = useState<networklisttype[]>();
  const navigate = useNavigate();
  const {
    stationsrtu,
    regionstations,
    networkregions,
    rtunetworkidadmin,
    rturegionidadmin,
  } = useSelector((state: RootState) => state.resultbrouserRtuslice);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {
    state: {regions},
  } = useHttpRequest({
    selector: state => ({
      regions: state.http.regionList,
    }),
  });

  const [openall, setOpenall] = useState(false);
  const [networkselectedlist, setNetworkselectedlist] = useState<string[]>([]);
  // ---------- func ----------- func -----------
  const findstationdeletertuid = (stationid: string, rtuid: string) => {
    let findId = stationsrtu
      ?.find(data => data.stationid == stationid)
      ?.deletertues.findIndex(data => data == rtuid);
    if (findId == undefined || findId < 0) {
      return false;
    } else {
      return true;
    }
  };
  // ***************************
  useEffect(() => {
    const getnetworklist = async () => {
      setLoadingdata(true);
      try {
        const response = await $Get(`otdr/network`);
        const responsedata = await response?.json();
        setList(responsedata);
      } catch (error) {
        console.log(`get networklist data=${error}`);
      } finally {
        setLoadingdata(false);
      }
    };
    getnetworklist();
  }, []);

  const onclickstation = async (
    id: string,
    regionid: string,
    networkid: string,
  ) => {
    try {
      setLoadingdata(true);
      const [stationrtuesresponse, stationdetailresponse] = await Promise.all([
        $Get(`otdr/station/${id}/rtus`),
        $Get(`otdr/station/${id}`),
      ]);
      let stationdetail = await stationdetailresponse?.json();

      if (stationrtuesresponse?.status == 200) {
        const stationrtuesdata = await stationrtuesresponse?.json();
        const findstation = stationsrtu.findIndex(data => data.stationid == id);
        if (findstation < 0 && stationrtuesdata.length > 0) {
          let stationsrtuCopy = deepcopy(stationsrtu);

          stationsrtuCopy.push({
            regionid: regionid,
            networkid: networkid,
            stationid: id,
            rtues: stationrtuesdata,
            deletertues: [...(stationsrtuCopy.deletertues || [])],
          });
          dispatch(setStationsrtu(stationsrtuCopy));
        }
      }
      if (stationdetail.access.access === 'ADMIN') {
        dispatch(setRtuStationidadmin(id));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingdata(false);
    }

    // ------------------------------------
  };

  // const opennetworkopticallist = (id: string) => {
  //   const findnetwork = networkselectedlist.findIndex(data => data == id);
  //   if (findnetwork > -1) {
  //     let old = [...networkselectedlist];
  //     old.splice(findnetwork, 1);
  //     setNetworkselectedlist(old);
  //   } else {
  //     setNetworkselectedlist(prev => [...prev, id]);
  //   }
  // };

  const Itembtn = ({
    name,
    id,
    classname,
    onclick = () => {},
    canAdd = false,
  }: Itembtntype) => {
    return (
      <div
        className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => {
            setSelectedtabid(id);
            opennetworkopticallist(id), onclick();
          }}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
 
      </div>
    );
  };

  const ItembtnRegion = ({
    name,
    id,
    classname,
    netWorkid,
    onclick = () => {},
    canAdd = false,
  }: Itemregionbtntype) => {
    return (
      <div
        className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => {
            setSelectedtabid(id);
            opennetworkopticallist(id), onclick();
          }}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          } w-[120px] text-left`}>
          {name}
        </button>
      </div>
    );
  };

  const ItembtnStation = ({
    name,
    id,
    classname,
    networkid,
    regionid,
    onclick = () => {},
    canAdd = false,
    candelete = false,
  }: Itemstationbtntype) => {
    return (
      <div
        className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}
        <button
          onClick={() => {
            setSelectedtabid(id);
            opennetworkopticallist(id), onclick();
          }}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          } w-[95px] text-left`}>
          {name}
        </button>
      </div>
    );
  };



  const onclicknetwork = async (id: string) => {
    try {
      setLoadingdata(true);
      const [allregions, networkdetail] = await Promise.all([
        await $Get(`otdr/region/network/${id}`),
        await $Get(`otdr/network/${id}`),
      ]);
      const regions = await allregions?.json();
      const networkdetaildata = await networkdetail?.json();
      const finddata = networkregions.filter(data => data.networkid == id);
      const maindata = regions || [];

      let allregionsid: any = [];
      if (maindata.length > 0 && finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        const old = deepcopy(networkregions);

        old.push({
          networkid: (regions && regions[0]?.network_id) || '',
          regions: allregionsid,
        });

        dispatch(setNetworkregions(old));
      }

      if (networkdetaildata.access.access === 'ADMIN') {
        dispatch(setRtuNetworkidadmin(id));
      }
    } catch (error) {
      console.log(`get network regions error=${error}`);
    } finally {
      setLoadingdata(false);
    }
  };

  const onclickregion = async (regionid: string) => {
    try {
      setLoadingdata(true);
      let old = deepcopy(regionstations);
      const [allstationresponse, regiondetail] = await Promise.all([
        await $Get(`otdr/region/${regionid}/stations`),
        await $Get(`otdr/region/${regionid}`),
      ]);

      const regiondetaildata = await regiondetail?.json();

      dispatch(setRtuRegionidadmin(regionid));

      if (allstationresponse?.status === 200) {
        let allstationdata = await allstationresponse?.json();
        const finddata = regionstations.findIndex(
          data => data.regionid == regionid,
        );
        let allregionsid: any = [];
        if (allstationdata.length > 0 && finddata < 0) {
          for (let i = 0; i < allstationdata?.length; i++) {
            allregionsid.push({
              id: allstationdata[i].id,
              name: allstationdata[i].name,
            });
          }
          old.push({regionid: regionid, stations: allregionsid});
        }
        dispatch(setRegionstations(old));
      }

      if (regiondetaildata.access.access === 'ADMIN') {
        dispatch(setRtuNetworkidadmin(regionid));
      }
    } catch (error) {
      console.log(`error is =${error}`);
    } finally {
      setLoadingdata(false);
    }
  };

  const ondeletesinglertu = async (rtuid: string, stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let StationsrtuCopy: allstationsrtutype[] = deepcopy(stationsrtu);
        let findstation = StationsrtuCopy.findIndex(
          data => data.stationid == stationid,
        );

        try {
          //We delete all the rtus related to the station that have their checkboxes checked.

          const promises = StationsrtuCopy[findstation]?.deletertues.map(
            (data: string) => $Delete(`otdr/rtu/${data}`),
          );
          const results = await Promise.allSettled(promises);

          //then update the station rtu list
          let newstationreues = [];
          for (
            let i = 0;
            i < StationsrtuCopy[findstation]!.rtues!.length;
            i++
          ) {
            let findrtu = StationsrtuCopy[findstation]!.deletertues.findIndex(
              data => data == StationsrtuCopy[findstation]!.rtues[i].id,
            );
            if (findrtu < 0) {
              newstationreues.push(StationsrtuCopy[findstation]!.rtues[i]);
            }
          }
          StationsrtuCopy[findstation].rtues = newstationreues;
          StationsrtuCopy[findstation].deletertues = [];
          dispatch(setStationsrtu(StationsrtuCopy));
          navigate(`/config/remote-test-units`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const onclickCheckbox = (rtuId: string, stationId: string) => {
    const stationsrtuCopy: allstationsrtutype[] = deepcopy(stationsrtu);
    const findstations = stationsrtuCopy.findIndex(
      data => data.stationid == stationId,
    );

    let findstationdeletertues = stationsrtuCopy[findstations].deletertues.find(
      data => data == rtuId,
    );

    if (findstationdeletertues) {
      const newstationrtu = stationsrtuCopy[findstations].deletertues.filter(
        data => data != rtuId,
      );
      stationsrtuCopy[findstations].deletertues = newstationrtu;
    } else {
      stationsrtuCopy[findstations].deletertues.push(rtuId);
    }
    dispatch(setStationsrtu(stationsrtuCopy));
  };
  // ****************** main ****************** main ************************************* main ***********************
  return (
    <div className="border-box flex w-full flex-col p-[20px] pt-[100px]">
      <h1 className="my-6 mt-2 text-[20px] font-bold text-[red]">
        This page requires a Full-Access license to view the content
      </h1>
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[calc(50%-190px)] flex-col">
          <div className="mb-[20px] flex flex-row">
            <RadioButton
              check={selectedradio == 'Filter By RTU' ? true : false}
              onclick={() => setSelectedradio('Filter By RTU')}
            />
            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By RTU
            </span>
          </div>

          <div className="flex h-[350px] w-full flex-col overflow-y-auto bg-white pl-6">
            {/* ----------------- rtu ------------------------------- rtu --------------------------------------- rtu --------------------------- */}

            <div className="mt-[30px] flex w-full flex-col">
              <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
                {openall ? (
                  <span className="ml-[-4px] mr-[5px] font-light">-</span>
                ) : (
                  <span className="mb-[5px] ml-[-6px] mr-[5px] font-light">
                    +
                  </span>
                )}

                <button
                  onClick={() => {
                    setOpenall(!openall), setLoadingid('allrtues');
                  }}>
                  <span>Rtu</span>
                </button>
              </div>

              {openall ? (
                <>
                  {loadingid == 'allrtues' && loadingdata ? (
                    <GeneralLoadingSpinner
                      size="w-8 h-8"
                      className="ml-8 mt-2"
                    />
                  ) : (
                    <>
                      <div
                        className={` mt-[-10px] w-full  border-l-[1px] border-dotted border-[#000000]`}>
                        {Array.isArray(list) &&
                          list?.map((networkdata, index) => (
                            <div key={index} className="flex flex-col">
                              <Itembtn
                                onclick={() => {
                                  setLoadingid(networkdata.id);
                                  onclicknetwork(networkdata.id);
                                }}
                                id={networkdata.id}
                                name={networkdata.name}
                              />

                              <div className=" relative ml-[17px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                {networkselectedlist.indexOf(networkdata.id) >
                                -1 ? (
                                  <div className="absolute left-[-1px] top-[-23px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                ) : null}

                                {list && index == list.length - 1 ? (
                                  <div
                                    className={`absolute left-[-1px] ${
                                      networkselectedlist.indexOf(
                                        networkdata.id,
                                      ) > -1
                                        ? 'top-[-29px]'
                                        : 'top-[-29px]'
                                    }  left-[-20px] z-10 h-[calc(100%+100px)] w-[5px] bg-white`}></div>
                                ) : null}

                                <div
                                  className={`absolute left-[-1px] ${
                                    networkselectedlist.indexOf(
                                      networkdata.id,
                                    ) > -1
                                      ? 'bottom-[-11px]'
                                      : 'bottom-[-16px]'
                                  }  z-10 h-[40px] w-[5px] bg-white`}></div>
                                {networkselectedlist.indexOf(networkdata.id) >
                                -1 ? (
                                  <>
                                    {loadingid == networkdata.id &&
                                    loadingdata ? (
                                      <GeneralLoadingSpinner
                                        size="w-8 h-8"
                                        className="ml-8 mt-2"
                                      />
                                    ) : (
                                      <>
                                        {networkregions
                                          .find(
                                            networkregionsdata =>
                                              networkregionsdata.networkid ==
                                              networkdata.id,
                                          )
                                          ?.regions.map(
                                            (regionsdata, index: number) => {
                                              return (
                                                <div
                                                  key={index}
                                                  className="w-full">
                                                  <div className="flex w-full flex-row items-center">
                                                    <ItembtnRegion
                                                      onclick={() => {
                                                        onclickregion(
                                                          regionsdata.id,
                                                        );
                                                        setLoadingid(
                                                          regionsdata.id,
                                                        );
                                                      }}
                                                      netWorkid={networkdata.id}
                                                      id={regionsdata.id}
                                                      name={regionsdata.name}
                                                    />
                                                  </div>
                                                  {networkselectedlist.indexOf(
                                                    regionsdata.id,
                                                  ) > -1 ? (
                                                    <>
                                                      {loadingid ==
                                                        regionsdata.id &&
                                                      loadingdata ? (
                                                        <GeneralLoadingSpinner
                                                          size="w-8 h-8"
                                                          className="ml-8 mt-2"
                                                        />
                                                      ) : (
                                                        <div className="relative w-full">
                                                          <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                          <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] bg-white"></div>
                                                          {networkregions.find(
                                                            dataa =>
                                                              dataa.networkid ==
                                                              networkdata.id,
                                                          )?.regions.length ==
                                                          index + 1 ? (
                                                            <div
                                                              className={`absolute left-[-1px] ${
                                                                networkselectedlist.indexOf(
                                                                  regionsdata.id,
                                                                ) > -1
                                                                  ? 'top-[-31px]'
                                                                  : 'top-[-29px]'
                                                              }  left-[-2px] z-30 h-full w-[5px] bg-white`}></div>
                                                          ) : null}

                                                          {regionstations
                                                            .find(
                                                              dataa =>
                                                                dataa.regionid ==
                                                                regionsdata.id,
                                                            )
                                                            ?.stations.map(
                                                              (
                                                                satationdata,
                                                                index: number,
                                                              ) => {
                                                                let findrtu =
                                                                  stationsrtu?.find(
                                                                    data =>
                                                                      data.stationid ==
                                                                      satationdata.id,
                                                                  )?.rtues ||
                                                                  [];
                                                                return (
                                                                  <div
                                                                    key={index}
                                                                    className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                                                    <div className="absolute bottom-[-17px]  left-[25px] z-10 h-[40px] w-[5px]  bg-white"></div>
                                                                    {/* {index == regionstations.length - 1 ? ( */}

                                                                    {/* ) : null} */}
                                                                    <div className="flex w-[290px] flex-row items-center ">
                                                                      <span className="mt-[-6px] w-[10px] text-[12px]">
                                                                        ...
                                                                      </span>
                                                                      <ItembtnStation
                                                                        onclick={() => {
                                                                          setLoadingid(
                                                                            satationdata.id,
                                                                          );
                                                                          onclickstation(
                                                                            satationdata.id,
                                                                            regionsdata.id,
                                                                            networkdata.id,
                                                                          );
                                                                          // dispatch(setRtuStationidadmin(satationdata.id))
                                                                        }}
                                                                        canAdd={
                                                                          false
                                                                        }
                                                                        candelete={
                                                                          false
                                                                        }
                                                                        id={
                                                                          satationdata.id
                                                                        }
                                                                        regionid={
                                                                          regionsdata.id
                                                                        }
                                                                        networkid={
                                                                          networkdata.id
                                                                        }
                                                                        name={
                                                                          satationdata.name
                                                                        }
                                                                      />
                                                                    </div>
                                                                    {networkselectedlist.indexOf(
                                                                      satationdata.id,
                                                                    ) > -1 ? (
                                                                      <>
                                                                        {loadingid ==
                                                                          satationdata.id &&
                                                                        loadingdata ? (
                                                                          <GeneralLoadingSpinner
                                                                            size="w-8 h-8"
                                                                            className="ml-[60px] mt-2"
                                                                          />
                                                                        ) : (
                                                                          <div
                                                                            className={`relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]`}>
                                                                            {findrtu.length >
                                                                            0 ? (
                                                                              <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                                            ) : null}
                                                                            {stationsrtu
                                                                              ?.find(
                                                                                data =>
                                                                                  data.stationid ==
                                                                                  satationdata.id,
                                                                              )
                                                                              ?.rtues.map(
                                                                                (
                                                                                  rtudata,
                                                                                  index: number,
                                                                                ) => {
                                                                                  return (
                                                                                    <div
                                                                                      key={
                                                                                        index
                                                                                      }
                                                                                      className="ml-[0px] mt-[10px] flex w-full flex-row items-center">
                                                                                      <span className="mt-[-6px] w-[20px] text-[12px] ">
                                                                                        .....
                                                                                      </span>
                                                                                      <SidebarItem
                                                                                        onclick={() => {
                                                                                          if (
                                                                                            !location.pathname.includes(
                                                                                              `${rtudata.id}/${satationdata.id}/${regionsdata.id}/${networkdata.id}`,
                                                                                            )
                                                                                          ) {
                                                                                            dispatch(
                                                                                              setrtugetdetailStatus(
                                                                                                false,
                                                                                              ),
                                                                                            );
                                                                                          }

                                                                                          setSelectedtabid(
                                                                                            rtudata.id,
                                                                                          );
                                                                                        }}
                                                                                        selected={
                                                                                          selectedtabId ==
                                                                                          rtudata.id
                                                                                            ? true
                                                                                            : false
                                                                                        }
                                                                                        checkstatus={findstationdeletertuid(
                                                                                          satationdata.id,
                                                                                          rtudata.id,
                                                                                        )}
                                                                                        onclickcheckbox={() =>
                                                                                          onclickCheckbox(
                                                                                            rtudata.id,
                                                                                            satationdata.id,
                                                                                          )
                                                                                        }
                                                                                        canDelete={
                                                                                          loggedInUser.role ===
                                                                                            UserRole.SUPER_USER ||
                                                                                          rtunetworkidadmin.includes(
                                                                                            networkdata.id,
                                                                                          ) ||
                                                                                          rturegionidadmin.includes(
                                                                                            networkdata.id,
                                                                                          )
                                                                                        }
                                                                                        onDelete={() =>
                                                                                          ondeletesinglertu(
                                                                                            rtudata.id,
                                                                                            satationdata.id,
                                                                                          )
                                                                                        }
                                                                                        enabelcheck={
                                                                                          true
                                                                                        }
                                                                                        className="w-[200px]"
                                                                                        name={
                                                                                          rtudata.name
                                                                                        }
                                                                                        to={`#`}
                                                                                      />
                                                                                    </div>
                                                                                  );
                                                                                },
                                                                              )}
                                                                          </div>
                                                                        )}
                                                                      </>
                                                                    ) : null}
                                                                  </div>
                                                                );
                                                              },
                                                            )}
                                                        </div>
                                                      )}
                                                    </>
                                                  ) : null}
                                                </div>
                                              );
                                            },
                                          )}
                                      </>
                                    )}
                                  </>
                                ) : null}
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </>
              ) : null}
            </div>

            {/* ----------------- rtu ------------------------------- rtu --------------------------------------- rtu --------------------------- */}
          </div>
        </div>

        <div className="flex w-[calc(50%-190px)] flex-col">
          <div className="mb-[20px] flex flex-row">
            <RadioButton
              check={selectedradio == 'Filter By Optical Route' ? true : false}
              onclick={() => setSelectedradio('Filter By Optical Route')}
            />
            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By Optical Route
            </span>
          </div>
          <div className="flex h-[350px] w-full flex-col overflow-y-auto pl-4 bg-white">
            {/* ----------------------- optical route --------------------------- optical route --------------  optical route ---------------- */}


      <div className={`relative mt-[30px] flex w-full flex-col`}>
        <div
          className={`absolute h-[40px] w-[10px] ${
            resultnetworkselectedlist.indexOf(lastnetworkopt) > -1
              ? 'bottom-[-20px]'
              : 'bottom-[-15.5px]'
          }  left-[-5px] bg-[#E7EFF7]`}></div>
        <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
          {openallopt ? (
            <span className="ml-[-4px] mr-[5px] font-light">-</span>
          ) : (
            <span className="mb-[5px] ml-[3px] mr-[5px] font-light">+</span>
          )}

          <button
            onClick={() => {
              dispatch(setopenallopt(!openallopt)), setLoadingopticalid('allnetworks');
            }}>
            <span>Optical Routes</span>
          </button>
        </div>

        {openallopt ? (
          <>
            {loadingopticalid == 'allnetworks' && loadingopticaldata ? (
              <GeneralLoadingSpinner size="w-8 h-8" className="ml-8 mt-2" />
            ) : (
              <>
                {Array.isArray(listopt) &&
                  listopt?.map((networkdata, index) => (
                    <div
                      key={index}
                      className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                        listopt && index == listopt?.length - 1
                          ? 'border-none'
                          : 'border-[#000000]'
                      }  `}>
                      {listopt && index == listopt?.length - 1 ? (
                        <div className="absolute ml-[0px] h-[36px] border-l-[1px] border-dotted border-[#000000]"></div>
                      ) : null}
                      <div
                        className={`absolute z-10 ${
                          resultnetworkselectedlist.indexOf(networkdata.id) > -1
                            ? 'bottom-[-2px]'
                            : 'bottom-[-7px]'
                        }  left-[15px] h-[25px] w-[5px] bg-[#E7EFF7]`}></div>

                      <div className="relative flex flex-col">
                        <Itembtnopt
                          classname="mb-[-10px]"
                          name={networkdata.name}
                          id={networkdata.id}
                        />
                        <div className='overflow-y-hidden'>
                         
                            <>
                              {resultnetworkselectedlist.indexOf(networkdata.id) >
                              -1 ? (
                                <>
                                {(loadingopticalid == networkdata.id && loadingopticaldata) ?
                                   <GeneralLoadingSpinner
                                   size="w-8 h-8"
                                   className="ml-8 mt-2"
                                 />
                                :
                                <div className="relative ml-[18px] bg-[red] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                                <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                                {resultbrosernetworkoptical
                                  ?.find(
                                    dataa =>
                                      dataa.networkid == networkdata.id,
                                  )
                                  ?.opticalrouts.map(
                                    (data, index: number) => (
                                      <div
                                        key={index}
                                        className="flex w-full flex-row items-center">
                                        <span className="w-[15px] text-[12px]">
                                          .....
                                        </span>

                                        <SidebarItem
                                          selected={
                                            selectedIdopt == data.id
                                              ? true
                                              : false
                                          }
                                          onclick={() =>
                                            setSelectedIdopt(data.id)
                                          }
                                          onclickcheckbox={e =>{}
                                            // onclickopticalchecbox(
                                            //   e,
                                            //   data.id,
                                            //   networkdata.id,
                                            // )
                                          }
                                          checkstatus={findoptical(
                                            networkdata.id,
                                            data.id,
                                          )}
                                          onDelete={() =>{}
                                            // deleteoneopticalroute(
                                            //   data.id,
                                            //   networkdata.id,
                                            // )
                                          }
                                          enabelcheck={true}
                                          className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                                          name={data.name}
                                          to={`${data.id}/${networkdata.id}`}
                                        />
                                      </div>
                                    ),
                                  )}
                              </div>
                              }
                                </>
                           
                              ) : null}
                            </>
                       
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </>
        ) : null}

        {openallopt && listopt.length >= 10 ? (
          <SimpleBtn
            loading={networkopticalloading}
            onClick={() => setSkipopt(skipopt + 10)}
            className="mx-auto mt-4">
            more
          </SimpleBtn>
        ) : null}
      </div>
                    {/* ----------------------- optical route --------------------------- optical route --------------  optical route ---------------- */}

          </div>
        </div>

        <div className="flex h-[350px] w-[350px] flex-col ">
          <div className="flex w-full flex-row items-center">
            <Checkbox
              checkstatus={filterByTime}
              onclick={e => setFilterByTime(e)}
              iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px] text-[#18C047]"
              classname={
                'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] text-[#18C047] border-[#000000]'
              }
            />

            <span className="ml-[15px] text-[20px] font-bold leading-[24.2px] text-[#000000]">
              Filter By Time
            </span>
          </div>

          <div className="mt-[20px] flex w-full flex-row items-center justify-between">
            <RadioButton
              check={selectedradiotime == 'Last' ? true : false}
              onclick={() => setSelectedradiotime('Last')}
            />
            <div className="flex w-[calc(100%-20px)] flex-row items-center">
              <span className="ml-[15px] w-[30px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                Last
              </span>
              <div className="flex w-[calc(100%-60px)] flex-row justify-between">
                <input
                  type="number"
                  onChange={e => setLast(Number(e.target.value))}
                  className="ml-6 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white"
                />

                <Select
                  onChange={e => {}}
                  className="mr-[40px] h-[40px] w-[120px]">
                  <option value="" className="hidden">
                    light
                  </option>
                  <option value={undefined} className="hidden">
                    light
                  </option>

                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    dark
                  </option>
                  <option className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                    light
                  </option>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-[140px] mt-[40px] flex w-full flex-row items-center justify-between">
            <RadioButton
              check={selectedradiotime == 'From' ? true : false}
              onclick={() => setSelectedradiotime('From')}
            />
            <div className="flex w-[calc(100%-20px)]   flex-col items-center">
              <div className="mb-[20px] flex w-full flex-row items-center justify-between">
                <span className="ml-[15px] w-[30px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                  From
                </span>

                <input
                  onChange={e => {
                    setFromdate(e.target.value);
                  }}
                  value={fromdate}
                  ref={fromdateref}
                  type="datetime-local"
                  className="appearance:none ml-6 h-[40px] w-[calc(100%-90px)] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => fromdateref.current.showPicker()}
                  className="ml-[5px] mr-[15px] h-[35px] w-[35px]"
                />
              </div>
              <div className="flex w-full flex-row items-center justify-between">
                <span className="ml-[15px] w-[30px] text-[20px] font-normal leading-[24.2px] text-[#000000]">
                  Last
                </span>

                <input
                  onChange={e => {
                    setLastdate(e.target.value);
                  }}
                  value={lastdate}
                  ref={lastdateref}
                  type="datetime-local"
                  className="appearance:none ml-6 h-[40px] w-[calc(100%-90px)] rounded-md border border-black px-2"
                />
                <img
                  src={dateicon}
                  onClick={() => lastdateref.current.showPicker()}
                  className="ml-[5px] mr-[15px] h-[35px] w-[35px]"
                />
              </div>
            </div>
          </div>
          <SimpleBtn className="ml-[calc(100%-100px)]">Apply</SimpleBtn>
        </div>
      </div>

      <Table
        // loading={state.regionstationlist?.httpRequestStatus !== 'success'}
        // onclicktitle={(tabname: string, sortalfabet: boolean) => {
        //   const dataa = [...reightstationsorted];
        //   if (sortalfabet) {
        //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
        //   } else {
        //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
        //   }
        //   setReightstationssorted(dataa);
        // }}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={topitems}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left min-h-[72px]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
        dynamicColumns={['detail', 'delete']}
        renderDynamicColumn={({key, value}) => {
          if (key === 'detail')
            return (
              <Link to={value.detail}>
                <IoOpenOutline size={22} className="mx-auto" />
              </Link>
            );
          else if (key === 'delete')
            return (
              <IoTrashOutline
                onClick={() => {}}
                className="mx-auto cursor-pointer text-red-500"
                size={22}
              />
            );
          else return <></>;
        }}
      />
      <div className="relative flex h-[40px] w-full flex-row justify-center">
        <div className="mt-[20px] flex flex-row  items-center">
          <SimpleBtn className="px-[2px] py-[5px]" type="button">
            <BiChevronsLeft size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronLeft size={20} />
          </SimpleBtn>
          <span className="ml-[20px] text-[20px] font-normal leading-6">
            page
          </span>
          <input
            type="number"
            className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
          <span className="ml-2">/5</span>
          <SimpleBtn className="ml-[20px] px-[2px] py-[5px]" type="button">
            <BiChevronRight size={20} />
          </SimpleBtn>
          <SimpleBtn className="ml-2 px-[2px] py-[5px]" type="button">
            <BiChevronsRight size={20} />
          </SimpleBtn>
        </div>
        <div className="absolute right-0 top-[12px] flex flex-row items-center">
          <span className="text-[20px] font-normal leading-6">
            Rows Per Page
          </span>
          <input
            type="number"
            className="ml-2 h-[40px] w-[74px] rounded-[10px] border-[1px] border-[#000000] bg-white text-center"
          />
        </div>
      </div>
    </div>
  );
}

export default Resultbrowser;
