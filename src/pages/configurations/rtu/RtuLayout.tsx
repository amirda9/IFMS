import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
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
import { UserRole } from '~/constant/users';
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
  candelete:boolean
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
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
type networklisttype={ 
  id:string
  name:string
  time_created:string
  time_updated:string
  }
const RtuLayout: FC = () => {
  const dispatch = useDispatch();
  const [selectedtabId, setSelectedtabid] = useState('');
  const [list,setList]=useState<networklisttype[]>()
  const navigate = useNavigate();
  const {stationsrtu, regionstations, networkregions,rtunetworkidadmin,rturegionidadmin} = useSelector(
    (state: RootState) => state.rtu,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {
    request,
    state: { regions},
  } = useHttpRequest({
    selector: state => ({
      // list: state.http.networkList,
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
      try {
        const response = await $Get(`otdr/network`);
        const responsedata = await response.json();
        setList(responsedata)
      } catch (error) {
        
      }

    };
    getnetworklist();
  }, []);
  const onclickstation = async (
    id: string,
    regionid: string,
    networkid: string,
  ) => {
    // const stationrtues = await $Get(`otdr/station/${id}/rtus`);

    try {
      const [stationrtuesresponse,stationdetailresponse] = await Promise.all([
        $Get(`otdr/station/${id}/rtus`),
         $Get(`otdr/station/${id}`),
      ]);
      let stationdetail=await stationdetailresponse.json()
      console.log("stationrtues",stationrtuesresponse);
      
      if (stationrtuesresponse.status == 200) {
        const stationrtuesdata = await stationrtuesresponse.json();
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
      if(stationdetail.access.access === "ADMIN"){
      dispatch(setRtuStationidadmin(id))

      }
    } catch (error) {
      console.log(error);
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

          if (getnetworlrtues.status == 200) {
            const networlrtues: getallrtuestype = await getnetworlrtues.json();
            if (networlrtues.length > 0) {
              //then delete network rtues
              const deleteNetworkRtues = await $Delete(
                `otdr/rtu/batch_delete`,
                networlrtues?.map(data => data.id),
              );
              if (deleteNetworkRtues.status == 201) {
                for (let i = 0; i < stationsrtu.length; i++) {
                  if (stationsrtu[i].networkid == id) {
                    oldstationrtu[i].rtues = [];
                    oldstationrtu[i].deletertues = [];
                  }
                }
                dispatch(setStationsrtu(oldstationrtu));
              }
            }
          }
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
          if (getregionrtues.status == 200) {
            const regionrtues: getallrtuestype = await getregionrtues.json();
            if (regionrtues.length > 0) {
              //delete region rtues
              const deleteregionRtues = await $Delete(
                `otdr/rtu/batch_delete`,
                regionrtues?.map(data => data.id),
              );

              if (deleteregionRtues.status == 201) {
                //update station rtues
                for (let i = 0; i < stationsrtu.length; i++) {
                  if (stationsrtu[i].regionid == regionid) {
                    oldstationrtu[i].rtues = [];
                    oldstationrtu[i].deletertues = [];
                  }
                }
                dispatch(setStationsrtu(oldstationrtu));
              }
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
          if (getstationrtues.status == 200) {
            const stationallrtues: {id: string; name: string}[] =
              await getstationrtues.json();

            if (stationallrtues.length > 0) {
              //delete station rtues
              const deletestationRtues = await $Delete(
                `otdr/rtu/batch_delete`,
                stationallrtues?.map(data => data.id),
              );

              if (deletestationRtues.status == 201) {
                let alldeletedrtu = deepcopy(
                  stationallrtues?.map(data => data.id),
                );
                //update station rtu list
                for (let i = 0; i < stationsrtu.length; i++) {
                  let result = stationsrtu[i].rtues.filter(
                    data => !alldeletedrtu.includes(data.id),
                  );
                  oldstationrtu[i].rtues = result;
                }
                oldstationrtu[findstationrtu].deletertues = [];
                dispatch(setStationsrtu(oldstationrtu));
              }
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

        {selectedtabId == id ? (
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
    name,
    id,
    classname,
    networkid,
    regionid,
    onclick = () => {},
    canAdd = false,
    candelete=false
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
                  navigate(`create/${id}_${regionid}_${networkid}`)
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
            onClick={() => ondeleteStaionrtu(id)}
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
      const [allregions, networkdetail] = await Promise.all([
        await $Get(`otdr/region/network/${id}`),
        await $Get(`otdr/network/${id}`),
      ]);
      const regions = await allregions.json();
      const networkdetaildata = await networkdetail.json();
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
    } catch (error) {}
    // request('regionList', {params: {network_id: id}});
  };

  const onclickregion = async (regionid: string) => {
    let old = deepcopy(regionstations);
    const [allstationresponse,regiondetail] = await Promise.all([
      await $Get(`otdr/region/${regionid}/stations`),
      await $Get(`otdr/region/${regionid}`),
    ]);
    // const allstation=await allstationresponse.json()
    const regiondetaildata=await regiondetail.json()
    
    dispatch(setRtuRegionidadmin(regionid))

    if (allstationresponse.status === 200) {
      let allstationdata = await allstationresponse.json();
      const finddata = regionstations.findIndex(data => data.regionid == regionid);
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
  };

  // useEffect(() => {
  //   if (mount) {
  //     const finddata = networkregions.filter(
  //       data => data.networkid == networkId,
  //     );
  //     const maindata = regions?.data || [];

  //     let allregionsid: any = [];
  //     if (maindata.length > 0 && finddata.length == 0) {
  //       for (let i = 0; i < maindata?.length; i++) {
  //         allregionsid.push({id: maindata[i].id, name: maindata[i].name});
  //       }
  //       const old = deepcopy(networkregions);
  //       old.push({
  //         networkid: (regions?.data && regions?.data[0]?.network_id) || '',
  //         regions: allregionsid,
  //       });
  //       dispatch(setNetworkregions(old));
  //     }
  //   } else {
  //     setMount(true);
  //   }
  // }, [regions]);

  const ondeletesinglertu = async (rtuid: string, stationid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let StationsrtuCopy: allstationsrtutype[] = deepcopy(stationsrtu);
        let findstation = StationsrtuCopy.findIndex(
          data => data.stationid == stationid,
        );

        try {
          //We delete all the rtus related to the station that have their checkboxes checked.
          const deletestationRtues = await $Delete(
            `otdr/rtu/batch_delete`,
            StationsrtuCopy[findstation]?.deletertues,
          );
          if (deletestationRtues.status == 201) {
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
          }
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

  console.log('list?.data', list);

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

          <button onClick={() => setOpenall(!openall)}>
            <span>Rtu</span>
          </button>
        </div>
        {openall ? (
          <div
            className={` mt-[-10px] w-full  border-l-[1px] border-dotted border-[#000000]`}>
            {list?.map((networkdata, index) => (
              <div key={index} className="flex flex-col">
                <Itembtn
                  onclick={() => {
                    onclicknetwork(networkdata.id)
                
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
                      {networkregions
                        .find(
                          networkregionsdata =>
                            networkregionsdata.networkid == networkdata.id,
                        )
                        ?.regions.map((regionsdata, index: number) => {
                          return (
                            <div key={index} className="w-full">
                              <div className="flex w-full flex-row items-center">
                                <ItembtnRegion
                                  onclick={() => {
                                    onclickregion(regionsdata.id);
                                  }}
                                  netWorkid={networkdata.id}
                                  id={regionsdata.id}
                                  name={regionsdata.name}
                                />
                              </div>
                              {networkselectedlist.indexOf(regionsdata.id) >
                              -1 ? (
                                <div className="relative w-full">
                                  <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                  <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                  {networkregions.find(
                                    dataa => dataa.networkid == networkdata.id,
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
                                  ) : null}

                                  {regionstations
                                    .find(
                                      dataa => dataa.regionid == regionsdata.id,
                                    )
                                    ?.stations.map(
                                      (satationdata, index: number) => {
                                        let findrtu =
                                          stationsrtu?.find(
                                            data =>
                                              data.stationid == satationdata.id,
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
                                                  onclickstation(
                                                    satationdata.id,
                                                    regionsdata.id,
                                                    networkdata.id,
                                                  );
                                                  // dispatch(setRtuStationidadmin(satationdata.id))
                                                }}                                              
                                                canAdd={(loggedInUser.role === UserRole.SUPER_USER || rtunetworkidadmin.includes(networkdata.id) || rturegionidadmin.includes(regionsdata.id))}
                                                candelete={(loggedInUser.role === UserRole.SUPER_USER || rtunetworkidadmin.includes(networkdata.id) || rturegionidadmin.includes(regionsdata.id))}
                                                id={satationdata.id}
                                                regionid={regionsdata.id}
                                                networkid={networkdata.id}
                                                name={satationdata.name}
                                              />
                                            </div>
                                            {networkselectedlist.indexOf(
                                              satationdata.id,
                                            ) > -1 ? (
                                              <div
                                                className={`relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]`}>
                                                {findrtu.length > 0 ? (
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
                                                          key={index}
                                                          className="ml-[0px] mt-[10px] flex w-full flex-row items-center">
                                                          <span className="mt-[-6px] w-[20px] text-[12px] ">
                                                            .....
                                                          </span>
                                                          <SidebarItem
                                                            onclick={() =>
                                                              setSelectedtabid(
                                                                rtudata.id,
                                                              )
                                                            }
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
                                                            canDelete={(loggedInUser.role === UserRole.SUPER_USER || rtunetworkidadmin.includes(networkdata.id) || rturegionidadmin.includes(networkdata.id))}
                                                            onDelete={() =>
                                                              ondeletesinglertu(
                                                                rtudata.id,
                                                                satationdata.id,
                                                              )
                                                            }
                                                            enabelcheck={true}
                                                            className="w-[200px]"
                                                            name={rtudata.name}
                                                            to={`${rtudata.id}_${satationdata.id}_${networkdata.id}_${regionsdata.id}`}
                                                          />
                                                        </div>
                                                      );
                                                    },
                                                  )}
                                              </div>
                                            ) : null}
                                          </div>
                                        );
                                      },
                                    )}
                                </div>
                              ) : null}
                            </div>
                          );
                        })}
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </SidebarLayout>
  );
};

export default RtuLayout;
