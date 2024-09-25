import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {useLocation, useNavigate} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {$Delete, $Get} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {
  alldefaultstationsrtutype,
  allstationsrtutype,
  defaultstationsrtutype,
  setRtuNetworkidadmin,
  setRtuRegionidadmin,
  setRtuStationidadmin,
  setdefaultRegionstations,
  setdefaultStationsrtu,
  setrtugetdetailStatus,
} from './../../../store/slices/rtu';
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
  candelete?:boolean;
  id: string;
  classname?: string;
  onclick?: () => void;
  canAdd?: boolean;
};
type Itemstationbtntype = {
  type?:string,
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
const RtuLayout: FC = () => {
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
    defaultregionstations,
    defaultstationsrtu
  } = useSelector((state: RootState) => state.rtu);
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

  const finddefaultstationdeletertuid = (stationid: string, rtuid: string) => {
    let findId = defaultstationsrtu
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

  const onclickdefaultstation = async (
    id: string,
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
          let defaultstationsrtuCopy = deepcopy(defaultstationsrtu);

          defaultstationsrtuCopy.push({
            networkid: networkid,
            stationid: id,
            rtues: stationrtuesdata,
            deletertues: [...(defaultstationsrtuCopy.deletertues || [])],
          });
          dispatch(setdefaultStationsrtu(defaultstationsrtuCopy));
        }
      }
      // if (stationdetail.access.access === 'ADMIN') {
      //   dispatch(setRtuStationidadmin(id));
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingdata(false);
    }

    // ------------------------------------
  };



  const ondeletenetworkrtu = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let oldstationrtu = deepcopy(stationsrtu);
        //first get the network rtues
        try {
          const getnetworlrtues = await $Get(`otdr/rtu?network_id=${id}`);
          const networlrtues: getallrtuestype = await getnetworlrtues?.json();
          const promises = networlrtues?.map(
            (data: {id: string; name: string}) =>
              $Delete(`otdr/rtu/${data.id}`),
          );
          const results = await Promise.allSettled(promises);
          if (networlrtues.length > 0) {
            //then delete network rtues
            const deleteNetworkRtues = await $Delete(
              `otdr/rtu/batch_delete`,
              networlrtues?.map(data => data.id),
            );
            if (deleteNetworkRtues?.status == 201) {
              for (let i = 0; i < stationsrtu.length; i++) {
                if (stationsrtu[i].networkid == id) {
                  oldstationrtu[i].rtues = [];
                  oldstationrtu[i].deletertues = [];
                }
              }
              dispatch(setStationsrtu(oldstationrtu));
            }
          }
          navigate(`/config/remote-test-units`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const onclickdeleteregion = async (regionid: string, netWorkid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let oldstationrtu = deepcopy(stationsrtu);
        try {
          //get region rtues
          const getregionrtues = await $Get(`otdr/rtu?region_id=${regionid}`);
          if (getregionrtues?.status == 200) {
            const regionrtues: getallrtuestype = await getregionrtues?.json();
            if (regionrtues.length > 0) {
              //delete region rtues
              const promises = regionrtues?.map(
                (data: {id: string; name: string}) =>
                  $Delete(`otdr/rtu/${data.id}`),
              );
              const results = await Promise.allSettled(promises);

              //update station rtues
              for (let i = 0; i < stationsrtu.length; i++) {
                if (stationsrtu[i].regionid == regionid) {
                  oldstationrtu[i].rtues = [];
                  oldstationrtu[i].deletertues = [];
                }
              }
              dispatch(setStationsrtu(oldstationrtu));
              navigate(`/config/remote-test-units`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const ondeleteStaionrtu = async (stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let oldstationrtu = deepcopy(stationsrtu);
        const findstationrtu = stationsrtu.findIndex(
          data => data.stationid == stationid,
        );
        try {
          //get station rtues
          const getstationrtues = await $Get(`otdr/station/${stationid}/rtus`);
          if (getstationrtues?.status == 200) {
            const stationallrtues: {id: string; name: string}[] =
              await getstationrtues?.json();

            if (stationallrtues.length > 0) {
              //delete station rtues
              const promises = stationallrtues?.map(
                (data: {id: string; name: string}) =>
                  $Delete(`otdr/rtu/${data.id}`),
              );
              const results = await Promise.allSettled(promises);
              let alldeletedrtu = deepcopy(
                stationallrtues?.map(data => data.id),
              );
              //update station rtu list
              for (let i = 0; i < stationsrtu.length; i++) {
                let result = stationsrtu[i].rtues.filter(
                  (data: any) => !alldeletedrtu.includes(data.id),
                );
                oldstationrtu[i].rtues = result;
              }
              oldstationrtu[findstationrtu].deletertues = [];
              dispatch(setStationsrtu(oldstationrtu));
              navigate(`/config/remote-test-units`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };



  const ondeletedefaultStaionrtu = async (stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let oldsdefaultstationsrtu = deepcopy(defaultstationsrtu);
        const findstationrtu = defaultstationsrtu.findIndex(
          data => data.stationid == stationid,
        );
        try {
          //get station rtues
          const getdefaultstationrtues = await $Get(`otdr/station/${stationid}/rtus`);
          if (getdefaultstationrtues?.status == 200) {
            const defaultstationallrtues: {id: string; name: string}[] =
              await getdefaultstationrtues?.json();

            if (defaultstationallrtues.length > 0) {
              //delete station rtues
              const promises = defaultstationallrtues?.map(
                (data: {id: string; name: string}) =>
                  $Delete(`otdr/rtu/${data.id}`),
              );
              const results = await Promise.allSettled(promises);
              let alldeletedrtu = deepcopy(
                defaultstationallrtues?.map(data => data.id),
              );
              //update station rtu list
              for (let i = 0; i < stationsrtu.length; i++) {
                let result = stationsrtu[i].rtues.filter(
                  (data: any) => !alldeletedrtu.includes(data.id),
                );
                oldsdefaultstationsrtu[i].rtues = result;
              }
              oldsdefaultstationsrtu[findstationrtu].deletertues = [];
              dispatch(setdefaultStationsrtu(oldsdefaultstationsrtu));
              navigate(`/config/remote-test-units`);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };



  const Itembtn = ({
    name,
    id,
    candelete=true,
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
        {canAdd ? (
          <>
            {networkselectedlist.indexOf(id) > -1 ? (
              <BsPlusLg
                onClick={() => navigate(`create/${id}`)}
                color="#18C047"
                className="ml-[10px] cursor-pointer"
              />
            ) : null}
          </>
        ) : (
          false
        )}

        {selectedtabId == id && candelete? (
          <IoTrashOutline
            onClick={() => ondeletenetworkrtu(id)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
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
        {canAdd ? (
          <>
            {networkselectedlist.indexOf(id) > -1 ? (
              <BsPlusLg
                onClick={() => navigate(`create/${id}`)}
                color="#18C047"
                className="ml-[10px] cursor-pointer"
              />
            ) : null}
          </>
        ) : (
          false
        )}
        {selectedtabId == id ? (
          <IoTrashOutline
            onClick={() => onclickdeleteregion(id, netWorkid)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
      </div>
    );
  };

  const ItembtnStation = ({
    type="",
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

        {canAdd ? (
          <>
            {networkselectedlist.indexOf(id) > -1 ? (
              <BsPlusLg
                onClick={() =>
                  navigate(`create/${id}/${regionid}/${networkid}`)
                }
                color="#18C047"
                className="ml-[10px] cursor-pointer"
              />
            ) : null}
          </>
        ) : (
          false
        )}

        {candelete && networkselectedlist.indexOf(id) > -1 ? (
          <IoTrashOutline
            onClick={type.length > 0?() => ondeletedefaultStaionrtu(id):() => ondeleteStaionrtu(id)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = (id: string) => {
    const findnetwork = networkselectedlist.findIndex(data => data == id);
    if (findnetwork > -1) {
      let old = [...networkselectedlist];
      old.splice(findnetwork, 1);
      setNetworkselectedlist(old);
    } else {
      setNetworkselectedlist(prev => [...prev, id]);
    }
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


  const onclickdefaultregion = async (networkid: string) => {
    try {
      setLoadingdata(true)
      let allStations = [];
      const responsestation = await $Get(`otdr/station/network/${networkid}`);
      if (responsestation?.status == 200) {
        const responsestationData = await responsestation?.json();
        for (let i = 0; i < responsestationData.length; i++) {
          if (responsestationData[i].region_id == null) {
            allStations.push({
              id: responsestationData[i].id,
              name: responsestationData[i].name,
            });
          }
        }
      }
      dispatch(
        setdefaultRegionstations({networkid: networkid, stations: allStations}),
      );
    } catch (error) {
      console.log(`get default stations error is:${error}`);
      
    } finally {
      setLoadingdata(false)
    }
  };

  const ondeletesinglertu = async (rtuid: string, stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let stationsrtuCopy: allstationsrtutype[] = deepcopy(stationsrtu);
        let findstation = stationsrtuCopy.findIndex(
          data => data.stationid == stationid,
        );

        try {
          //We delete all the rtus related to the station that have their checkboxes checked.

          const promises = stationsrtuCopy[findstation]?.deletertues.map(
            (data: string) => $Delete(`otdr/rtu/${data}`),
          );
          const results = await Promise.allSettled(promises);

          //then update the station rtu list
          let newstationreues = [];
          for (
            let i = 0;
            i < stationsrtuCopy[findstation]!.rtues!.length;
            i++
          ) {
            let findrtu = stationsrtuCopy[findstation]!.deletertues.findIndex(
              data => data == stationsrtuCopy[findstation]!.rtues[i].id,
            );
            if (findrtu < 0) {
              newstationreues.push(stationsrtuCopy[findstation]!.rtues[i]);
            }
          }
          stationsrtuCopy[findstation].rtues = newstationreues;
          stationsrtuCopy[findstation].deletertues = [];
          dispatch(setStationsrtu(stationsrtuCopy));
          navigate(`/config/remote-test-units`);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };


  const ondeletedefaultsinglertu = async (rtuid: string, stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let defaultstationsrtuCopy: alldefaultstationsrtutype[] = deepcopy(defaultstationsrtu);
        let findstation = defaultstationsrtuCopy.findIndex(
          data => data.stationid == stationid,
        );

        try {
          //We delete all the rtus related to the station that have their checkboxes checked.

          const promises = defaultstationsrtuCopy[findstation]?.deletertues.map(
            (data: string) => $Delete(`otdr/rtu/${data}`),
          );
          const results = await Promise.allSettled(promises);

          //then update the station rtu list
          let newstationreues = [];
          for (
            let i = 0;
            i < defaultstationsrtuCopy[findstation]!.rtues!.length;
            i++
          ) {
            let findrtu = defaultstationsrtuCopy[findstation]!.deletertues.findIndex(
              data => data == defaultstationsrtuCopy[findstation]!.rtues[i].id,
            );
            if (findrtu < 0) {
              newstationreues.push(defaultstationsrtuCopy[findstation]!.rtues[i]);
            }
          }
          defaultstationsrtuCopy[findstation].rtues = newstationreues;
          defaultstationsrtuCopy[findstation].deletertues = [];
          dispatch(setdefaultStationsrtu(defaultstationsrtuCopy));
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


  const onclickdefaultrtuCheckbox = (rtuId: string, stationId: string) => {
    const defaultstationsrtuCopy: alldefaultstationsrtutype[] = deepcopy(defaultstationsrtu);
    const findstations = defaultstationsrtuCopy.findIndex(
      data => data.stationid == stationId,
    );

    let findstationdeletertues = defaultstationsrtuCopy[findstations].deletertues.find(
      data => data == rtuId,
    );

    if (findstationdeletertues) {
      const newstationrtu = defaultstationsrtuCopy[findstations].deletertues.filter(
        data => data != rtuId,
      );
      defaultstationsrtuCopy[findstations].deletertues = newstationrtu;
    } else {
      defaultstationsrtuCopy[findstations].deletertues.push(rtuId);
    }
    dispatch(setdefaultStationsrtu(defaultstationsrtuCopy));
  };
  // ############################################################
  return (
    <SidebarLayout>
      <div className="flex flex-row items-center">
        <label htmlFor="search" className="mr-2">
          Search
        </label>

        <TextInput
          id="search"
          className="mr-10 w-full"
          onChange={event => {}}
        />
      </div>
      <div className="mt-[30px] flex w-full flex-col">
        <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
          {openall ? (
            <span className="ml-[-4px] mr-[5px] font-light">-</span>
          ) : (
            <span className="mb-[5px] ml-[-6px] mr-[5px] font-light">+</span>
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
              <GeneralLoadingSpinner size="w-8 h-8" className="ml-8 mt-2" />
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
                          {networkselectedlist.indexOf(networkdata.id) > -1 ? (
                            <div className="absolute left-[-1px] top-[-23px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                          ) : null}

                          {list && index == list.length - 1 ? (
                            <div
                              className={`absolute left-[-1px] ${
                                networkselectedlist.indexOf(networkdata.id) > -1
                                  ? 'top-[-29px]'
                                  : 'top-[-29px]'
                              }  left-[-20px] z-10 h-[calc(100%+100px)] w-[5px] bg-[#E7EFF7]`}></div>
                          ) : null}

                          <div
                            className={`absolute left-[-1px] ${
                              networkselectedlist.indexOf(networkdata.id) > -1
                                ? 'bottom-[-11px]'
                                : 'bottom-[-16px]'
                            }  z-10 h-[40px] w-[5px] bg-[#E7EFF7]`}></div>
                          {networkselectedlist.indexOf(networkdata.id) > -1 ? (
                            <>
                              {loadingid == networkdata.id && loadingdata ? (
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
                                          <div key={index} className="w-full">
                                            <div className="flex w-full flex-row items-center">
                                              <ItembtnRegion
                                                onclick={() => {
                                                  onclickregion(regionsdata.id);
                                                  setLoadingid(regionsdata.id);
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
                                                {loadingid == regionsdata.id &&
                                                loadingdata ? (
                                                  <GeneralLoadingSpinner
                                                    size="w-8 h-8"
                                                    className="ml-8 mt-2"
                                                  />
                                                ) : (
                                                  <div className="relative w-full">
                                                    <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                    <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                                    {/* {networkregions.find(
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
                                                        }  left-[-2px] z-30 h-full w-[5px] bg-[#E7EFF7]`}></div>
                                                    ) : null} */}

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
                                                            )?.rtues || [];
                                                          return (
                                                            <div
                                                              key={index}
                                                              className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                                              <div className="absolute bottom-[-17px]  left-[25px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
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
                                                                    loggedInUser.role ===
                                                                      UserRole.SUPER_USER ||
                                                                    rtunetworkidadmin.includes(
                                                                      networkdata.id,
                                                                    ) ||
                                                                    rturegionidadmin.includes(
                                                                      regionsdata.id,
                                                                    )
                                                                  }
                                                                  candelete={
                                                                    loggedInUser.role ===
                                                                      UserRole.SUPER_USER ||
                                                                    rtunetworkidadmin.includes(
                                                                      networkdata.id,
                                                                    ) ||
                                                                    rturegionidadmin.includes(
                                                                      regionsdata.id,
                                                                    )
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
                                                                                  to={`${rtudata.id}/${satationdata.id}/${regionsdata.id}/${networkdata.id}`}
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

<div className='w-full'>

                              <Itembtn
                                // key={`${networkdata.id}&${networkdata.id}`}
                                // to={`/regions/defaultregionemptypage/${networkdata.id}`}
                                // canAdd={false}
                                // canDelete={false}
                                // selected={false}
                                // onDelete={() =>
                                //   dispatch(
                                //     deletedefaultRegion({
                                //       networkid: networkdata.id,
                                //     }),
                                //   )
                                // }
                                candelete={false}
                                onclick={() => {
                                  setLoadingid(`${networkdata.id}${networkdata.id}`);
                                  // onclikitems(
                                  //   `${networkdata.id}${networkdata.id}&`
                                  // );
                                  onclickdefaultregion(networkdata.id)
                              
                                }}
                                id={`${networkdata.id}${networkdata.id}`}
                                name="Default Region"
                              />
                         
                            </div>
                            {networkselectedlist.indexOf(
                                              `${networkdata.id}${networkdata.id}`
                                            ) > -1 ? (
                                              <>
                                                {loadingid == `${networkdata.id}${networkdata.id}` &&
                                                loadingdata ? (
                                                  <GeneralLoadingSpinner
                                                    size="w-8 h-8"
                                                    className="ml-8 mt-2"
                                                  />
                                                ) : (
                                                  <div className="relative w-full">
                                                    <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                    <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                                    {networkregions.find(
                                                      dataa =>
                                                        dataa.networkid ==
                                                        networkdata.id,
                                                    )?.regions.length ==
                                                    index + 1 ? (
                                                      <div
                                                        className={`absolute left-[-1px] ${
                                                          networkselectedlist.indexOf(
                                                            networkdata.id,
                                                          ) > -1
                                                            ? 'top-[-31px]'
                                                            : 'top-[-29px]'
                                                        }  left-[-2px] z-30 h-full w-[5px] bg-[#E7EFF7]`}></div>
                                                    ) : null}

                                                    {defaultregionstations
                                                    .find(
                                                     dataa =>
                                                     dataa?.networkid == networkdata?.id,
                                                       )
                                                      ?.stations.map(
                                                        (
                                                          satationdata,
                                                          index: number,
                                                        ) => {
                                                          let findrtu =
                                                            defaultstationsrtu?.find(
                                                              data =>
                                                                data.stationid ==
                                                                satationdata.id,
                                                            )?.rtues || [];
                                                          return (
                                                            <div
                                                              key={index}
                                                              className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                                              <div className="absolute bottom-[-17px]  left-[25px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                                              {/* {index == regionstations.length - 1 ? ( */}

                                                              {/* ) : null} */}
                                                              <div className="flex w-[290px] flex-row items-center ">
                                                                <span className="mt-[-6px] w-[10px] text-[12px]">
                                                                  ...
                                                                </span>
                                                                <ItembtnStation
                                                                type="default"
                                                                  onclick={() => {
                                                                    setLoadingid(
                                                                      satationdata.id,
                                                                    );
                                                                    onclickdefaultstation(
                                                                      satationdata.id,
                                                                      // regionsdata.id,
                                                                      // networkdata.id,
                                                                      networkdata.id,
                                                                    );
                                                                    // dispatch(setRtuStationidadmin(satationdata.id))
                                                                  }}
                                                                  canAdd={
                                                                    loggedInUser.role ===
                                                                      UserRole.SUPER_USER ||
                                                                    rtunetworkidadmin.includes(
                                                                      networkdata.id,
                                                                    ) ||
                                                                    rturegionidadmin.includes(
                                                                      networkdata.id,
                                                                    )
                                                                  }
                                                                  candelete={
                                                                    loggedInUser.role ===
                                                                      UserRole.SUPER_USER ||
                                                                    rtunetworkidadmin.includes(
                                                                      networkdata.id,
                                                                    ) ||
                                                                    rturegionidadmin.includes(
                                                                      networkdata.id,
                                                                    )
                                                                  }
                                                                  id={
                                                                    satationdata.id
                                                                  }
                                                                  regionid={
                                                                    "1111"
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
                                                                      className={`relative ml-[28px] flex  flex-col  border-l-[1px] border-dotted  border-[#000000]`}>
                                                                      {findrtu.length >
                                                                      0 ? (
                                                                        <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                                      ) : null}
                                                                      {defaultstationsrtu
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
                                                                                        `${rtudata.id}/${satationdata.id}/${networkdata.id}/${networkdata.id}`,
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
                                                                                  checkstatus={finddefaultstationdeletertuid(
                                                                                    satationdata.id,
                                                                                    rtudata.id,
                                                                                  )}
                                                                                  onclickcheckbox={() =>
                                                                                    onclickdefaultrtuCheckbox(
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
                                                                                    ondeletedefaultsinglertu(
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
                                                                                  to={`${rtudata.id}/${satationdata.id}/${networkdata.id}/${networkdata.id}`}
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
    </SidebarLayout>
  );
};

export default RtuLayout;
