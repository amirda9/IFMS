import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {useNavigate} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {$Delete, $GET, $Get} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {
  allstationsrtutype,
} from './../../../store/slices/rtu';
import {deepcopy} from './../../../util/deepcopy';
import {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
  setleftbarStationcheckboxlist,
} from './../../../store/slices/rtu';
import {IoTrashOutline} from 'react-icons/io5';
import {RootState} from '~/store';
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
};
type Itemregionbtntype = {
  name: string;
  id: string;
  classname?: string;
  onclick?: () => void;
  canAdd?: boolean;
  netWorkid: string;
};
// -------------------- main ------------------------ main ------------------- main -----------------
const RtuLayout: FC = () => {
  const dispatch = useDispatch();
  const [mount, setMount] = useState(false);
  const [networkId, setNetworkId] = useState('');
  const [selectedtabId, setSelectedtabid] = useState('');
  const navigate = useNavigate();
  const {
    stationsrtu,
    regionstations,
    networkregions,
    leftbarStationcheckboxlist,
  } = useSelector((state: RootState) => state.rtu);

  const {
    request,
    state: {list, regions},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      regions: state.http.regionList,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
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

  const onclickstation = async (id: string) => {
    const dataa = await $GET(`otdr/station/${id}/rtus`);
    const findstation = stationsrtu.findIndex(data => data.stationid == id);
    if (findstation < 0 && dataa.length > 0) {
      let old = deepcopy(stationsrtu);

      old.push({
        stationid: id,
        rtues: dataa,
        deletertues: [...(old.deletertues || [])],
      });
      dispatch(setStationsrtu(old));
    }
    // ------------------------------------
    let oldleftbarStationcheckboxlist = deepcopy(leftbarStationcheckboxlist);
    let findstatininstationrtu = leftbarStationcheckboxlist.findIndex(
      data => data.stationid == id,
    );
    if (findstatininstationrtu < 0) {
      oldleftbarStationcheckboxlist.push({
        length: oldleftbarStationcheckboxlist.length,
        stationid: id,
        rtues: dataa.map((data: {id: string; name: string}) => data.id),
      });
      dispatch(setleftbarStationcheckboxlist(oldleftbarStationcheckboxlist));
    }
  };

  const ondeletenetworkrtu = async (id: string) => {
    let oldstationrtu = deepcopy(stationsrtu);
    //first get the network rtues
    try {
      const getnetworlrtues = await $Get(`otdr/rtu?network_id=${id}`);

      if (getnetworlrtues.status == 200) {
        const networlrtues = await getnetworlrtues.json();
        if (networlrtues.length > 0) {
          //then delete network rtues
          const deleteNetworkRtues = await $Delete(`otdr/rtu/batch_delete`, [
            networlrtues?.map((data: any) => data.id),
          ]);
          if (deleteNetworkRtues.status == 200) {
            let alldeletedrtu = deepcopy(
              networlrtues?.map((data: any) => data.id),
            );
            for (let i = 0; i < stationsrtu.length; i++) {
              let result = stationsrtu[i].rtues.filter(
                data => !alldeletedrtu.includes(data.id),
              );
              oldstationrtu[i].rtues = result;
            }
            dispatch(setStationsrtu(oldstationrtu));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onclickdeleteregion = async (regionid: string, netWorkid: string) => {
    let oldstationrtu = deepcopy(stationsrtu);
    try {
      const getregionrtues = await $Get(`otdr/rtu?region_id=${regionid}`);

      if (getregionrtues.status == 200) {
        const regionrtues = await getregionrtues.json();

        if (regionrtues.length > 0) {
          const deleteregionRtues = await $Delete(
            `otdr/rtu/batch_delete`,
            regionrtues?.map((data: any) => data.id),
          );

          if (deleteregionRtues.status == 201) {
            let alldeletedrtu = deepcopy(
              regionrtues?.map((data: any) => data.id),
            );
            for (let i = 0; i < stationsrtu.length; i++) {
              let result = stationsrtu[i].rtues.filter(
                data => !alldeletedrtu.includes(data.id),
              );
              oldstationrtu[i].rtues = result;
            }
            dispatch(setStationsrtu(oldstationrtu));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const ondeleteStaionrtu = async (stationid: string) => {
    let oldstationrtu = deepcopy(stationsrtu);
    try {
      const getstationrtues = await $Get(`otdr/station/${stationid}/rtus`);
      if (getstationrtues.status == 200) {
        const stationallrtues = await getstationrtues.json();

        if (stationallrtues.length > 0) {
          const deletestationRtues = await $Delete(
            `otdr/rtu/batch_delete`,
            stationallrtues?.map((data: any) => data.id),
          );

          if (deletestationRtues.status == 201) {
            let alldeletedrtu = deepcopy(
              stationallrtues?.map((data: any) => data.id),
            );
            for (let i = 0; i < stationsrtu.length; i++) {
              let result = stationsrtu[i].rtues.filter(
                data => !alldeletedrtu.includes(data.id),
              );
              oldstationrtu[i].rtues = result;
            }
            dispatch(setStationsrtu(oldstationrtu));
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
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
    onclick = () => {},
    canAdd = false,
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
    request('regionList', {params: {network_id: id}});
  };

  const onclickregion = async (id: string) => {
    let old = deepcopy(regionstations);
    const allstation = await $Get(`otdr/region/${id}/stations`);
    if (allstation.status === 200) {
      let dataa = await allstation.json();
      const finddata = regionstations.findIndex(data => data.regionid == id);
      let allregionsid: any = [];
      if (dataa.length > 0 && finddata < 0) {
        for (let i = 0; i < dataa?.length; i++) {
          allregionsid.push({id: dataa[i].id, name: dataa[i].name});
        }
        old.push({regionid: id, stations: allregionsid});
      }
      dispatch(setRegionstations(old));
    }
  };

  useEffect(() => {
    if (mount) {
      const finddata = networkregions.filter(
        data => data.networkid == networkId,
      );
      const maindata = regions?.data || [];

      let allregionsid: any = [];
      if (maindata.length > 0 && finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        const old = deepcopy(networkregions);
        old.push({
          networkid: (regions?.data && regions?.data[0]?.network_id) || '',
          regions: allregionsid,
        });
        dispatch(setNetworkregions(old));
      }
    } else {
      setMount(true);
    }
  }, [regions]);

  const ondeletesinglertu = async (rtuid: string, stationid: string) => {
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
        for (let i = 0; i < StationsrtuCopy[findstation]!.rtues!.length; i++) {
          let findrtu = StationsrtuCopy[findstation]!.deletertues.findIndex(
            data => data == StationsrtuCopy[findstation]!.rtues[i].id,
          );
          if (findrtu < 0) {
            newstationreues.push(StationsrtuCopy[findstation]!.rtues[i]);
          }
        }
        StationsrtuCopy[findstation].rtues = newstationreues;
        dispatch(setStationsrtu(StationsrtuCopy));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onclickCheckbox = (rtuId: string, stationId: string) => {
    const stationsrtuCopy: allstationsrtutype[] = deepcopy(stationsrtu);
    const findstations = stationsrtuCopy.findIndex(
      data => data.stationid == stationId,
    );
    console.log(stationId, 'findstationdeletertues');
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
  // ############################################################
  return (
    <SidebarLayout createTitle="">
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
            <span>Rtues</span>
          </button>
        </div>
        {openall ? (
          <div
            className={` mt-[-10px] w-full  border-l-[1px] border-dotted border-[#000000]`}>
            {list?.data?.map((data, index) => (
              <div key={index} className="flex flex-col">
                <Itembtn
                  onclick={() => {
                    onclicknetwork(data.id), () => setNetworkId(data.id);
                  }}
                  id={data.id}
                  name={data.name}
                />

                <div className=" relative ml-[17px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                  {networkselectedlist.indexOf(data.id) > -1 ? (
                    <div className="absolute left-[-1px] top-[-23px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                  ) : null}

                  {list?.data && index == list.data.length - 1 ? (
                    <div
                      className={`absolute left-[-1px] ${
                        networkselectedlist.indexOf(data.id) > -1
                          ? 'top-[-29px]'
                          : 'top-[-29px]'
                      }  left-[-20px] z-10 h-[calc(100%+100px)] w-[5px] bg-[#E7EFF7]`}></div>
                  ) : null}

                  <div
                    className={`absolute left-[-1px] ${
                      networkselectedlist.indexOf(data.id) > -1
                        ? 'bottom-[-11px]'
                        : 'bottom-[-16px]'
                    }  z-10 h-[40px] w-[5px] bg-[#E7EFF7]`}></div>
                  {networkselectedlist.indexOf(data.id) > -1 ? (
                    <>
                      {networkregions
                        .find(dataa => dataa.networkid == data.id)
                        ?.regions.map((dat: any, index: number) => {
                          return (
                            <div key={index} className="w-full">
                              <div className="flex w-full flex-row items-center">
                                <ItembtnRegion
                                  onclick={() => {
                            
                                    onclickregion(dat.id);
                                  }}
                                  netWorkid={data.id}
                                  id={dat.id}
                                  name={dat.name}
                                />
                              </div>
                              {networkselectedlist.indexOf(dat.id) > -1 ? (
                                <div className="relative w-full">
                                  <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                  <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                  {networkregions.find(
                                    dataa => dataa.networkid == data.id,
                                  )?.regions.length ==
                                  index + 1 ? (
                                    <div
                                      className={`absolute left-[-1px] ${
                                        networkselectedlist.indexOf(dat.id) > -1
                                          ? 'top-[-31px]'
                                          : 'top-[-29px]'
                                      }  left-[-2px] z-30 h-full w-[5px] bg-[#E7EFF7]`}></div>
                                  ) : null}

                                  {regionstations
                                    .find(dataa => dataa.regionid == dat.id)
                                    ?.stations.map(
                                      (datt: any, index: number) => {
                                        let findrtu =
                                          stationsrtu?.find(
                                            (data: any) =>
                                              data.stationid == datt.id,
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
                                          
                                                    onclickstation(datt.id);
                                                }}
                                                canAdd={true}
                                                id={datt.id}
                                                name={datt.name}
                                              />
                                            </div>
                                            {networkselectedlist.indexOf(
                                              datt.id,
                                            ) > -1 ? (
                                              <div
                                                className={`relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]`}>
                                                {findrtu.length > 0 ? (
                                                  <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                ) : null}
                                                {stationsrtu
                                                  ?.find(
                                                    data =>
                                                      data.stationid == datt.id,
                                                  )
                                                  ?.rtues.map(
                                                    (
                                                      dataaa: any,
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
                                                            checkstatus={findstationdeletertuid(
                                                              datt.id,
                                                              dataaa.id,
                                                            )}
                                                            onclickcheckbox={() =>
                                                              onclickCheckbox(
                                                                dataaa.id,
                                                                datt.id,
                                                              )
                                                            }
                                                            onDelete={() =>
                                                              ondeletesinglertu(
                                                                dataaa.id,
                                                                datt.id,
                                                              )
                                                            }
                                                            enabelcheck={true}
                                                            className="w-[200px]"
                                                            name={dataaa.name}
                                                            to={`${dataaa.id}_${datt.id}`}
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
