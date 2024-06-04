import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet, useNavigate} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
import Swal from 'sweetalert2';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
  setShowallnetworks,
  setAllselectedId,
  setRegionLinks,
  onclickstationcheckbox,
  onclicklinkcheckbox,
  setNetworklist,
  setSelectedid,
  deletegroupstation,
  deletegrouplinks,
  deleteRegion,
  setdefaultRegionLinks,
  setdefaultRegionstations,
  onclickdefaultlinkcheckbox,
  onclickdefaultstationcheckbox,
  deletedefaultgroupstation,
  deletedefaultgrouplinks,
  deletenetwork,
  deletedefaultRegion,
  setRegionidadmin,
  chageLoading,
} from './../store/slices/networktreeslice';
import {$Delete, $Get} from '~/util/requestapi';
import {BsPlusLg} from 'react-icons/bs';
import Mainloading from '~/components/loading/mainloading';
import {useAppSelector, useHttpRequest} from '~/hooks';
import {UserRole} from '~/constant/users';
import { toast } from 'react-toastify';

type ItemspROPS = {
  to: string;
  selected: boolean;
  key?: number | string;
  onDelete: () => void;
  onclick: () => void;
  id: string;
  name: string;
  enabelcheck?: boolean;
  checkstatus?: boolean;
  pluse?: boolean;
  onclickcheckbox?: () => void;
  canAdd?: boolean;
  createurl?: string;
  canDelete?: boolean;
  disabledcheckbox?: boolean;
};
type Iprops = {
  children: any;
};

const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};

function NetworktreeLayout({ children}:Iprops) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [showAllnetworks, setShowallnetworks] = useState(false);
  // const [allselectedId, setAllselectedId] = useState<string[]>([]);
  const [networkId, setNetworkId] = useState('');
  const [mount, setMount] = useState(false);
  const {
    networkslist,
    stationsrtu,
    regionstations,
    networkregions,
    showAllnetworks,
    allselectedId,
    regionLinks,
    selectedstations,
    selectedlinks,
    selectedid,
    defaultregionstations,
    defaultregionLinks,
    selecteddefaultstations,
    selectedefaultdlinks,
    loading,
  } = useSelector((state: RootState) => state.networktree);
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const {networkidadmin} = useSelector((state: any) => state.networktree);
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
  const onclicknetwork = async (id: string) => {
    request('regionList', {params: {network_id: id}});
  };

  useEffect(() => {
    const element = document.getElementById(selectedid);
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView();
    }
  }, []);
  useEffect(() => {
    const getnetworklist = async () => {
      try {
        const getnetworks = await $Get(`otdr/network`);
        const networksdata = await getnetworks?.json();
        if (getnetworks?.status == 200) {
          dispatch(setNetworklist(networksdata));
        }
      } catch (error) {}
    };
    getnetworklist();
  }, []);
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

  const Items = ({
    to,
    selected,
    key,
    onDelete,
    onclick,
    id,
    canAdd = true,
    name,
    enabelcheck = false,
    checkstatus = false,
    pluse = true,
    createurl = '',
    canDelete = true,
    disabledcheckbox = false,
    onclickcheckbox = () => {},
  }: ItemspROPS) => {
    return (
      <div className="relative mb-[15px] flex h-[40px] flex-row items-center">
        <span className="mr-[4px] text-[10px]">........</span>
        {pluse ? (
          <>
            {allselectedId.indexOf(id) > -1 ? (
              <span
                // onClick={() => onclikitems(id)}
                className="z-50 mt-[-6.5px] cursor-pointer font-light">
                _
              </span>
            ) : (
              <>
                <span
                  // onClick={() => onclikitems(id)}
                  className="mb-[-5px] cursor-pointer text-[20px]">
                  +
                </span>
              </>
            )}
          </>
        ) : null}

        <SidebarItem
          onclick={() => onclick()}
          selected={true}
          onclickcheckbox={onclickcheckbox}
          className="flex-start mb-[-5px] ml-[5px] w-full pl-[2px]"
          name={name}
          to={to}
          canAdd={canAdd}
          disabledcheckbox={disabledcheckbox}
          id={id}
          createurl={createurl}
          key={key}
          enabelcheck={enabelcheck}
          checkstatus={checkstatus}
          canDelete={canDelete}
          onDelete={() => onDelete()}
        />
      </div>
    );
  };

  const onclickstations = async (networkid: string, id: string) => {
    let old = deepcopy(regionstations);
    const allstation = await $Get(`otdr/region/${id}/stations`);
    if (allstation?.status === 200) {
      let allstationdata = await allstation?.json();

      const finddata = regionstations.findIndex(data => data.regionid == id);
      let allregionsid: any = [];
      if (allstationdata.length > 0 && finddata < 0) {
        for (let i = 0; i < allstationdata?.length; i++) {
          allregionsid.push({
            id: allstationdata[i].id,
            name: allstationdata[i].name,
          });
        }
        old.push({networkid: networkid, regionid: id, stations: allregionsid});
      }
      dispatch(setRegionstations(old));
    }
  };

  const onclicklinks = async (networkid: string, id: string) => {
    let old = deepcopy(regionLinks);
    const alllinksurl = `otdr/region/${id}/links`;
    // const  getnetworkstationsurl=`otdr/station/network/${networkid}`;
    // getnetworkstations
    const [alllinks] = await Promise.all([
      $Get(alllinksurl),
      // $Get(getnetworkstationsurl),
    ]);
    // const dataaaa=await getnetworkstations?.json()
    // console.log("getnetworkstations",dataaaa);
    // && getnetworkstations?.status == 200
    if (alllinks?.status === 200) {
      let alllinksdata = await alllinks?.json();

      // const allnetworkstations:[
      //   {
      //     id: string,
      //     name: string,
      //     network_id: string,
      //     time_created: string,
      //     time_updated: string,
      //     region_id: string
      //   }
      // ]=await getnetworkstations?.json()
      const finddata = regionLinks.findIndex(data => data.regionid == id);
      let allregionsid: any = [];
      if (alllinksdata.length > 0 && finddata < 0) {
        for (let i = 0; i < alllinksdata?.length; i++) {
          // const findsouceregionid=allnetworkstations.find(data => data.id == alllinksdata[i].source)
          // const finddestinationregionid=allnetworkstations.find(data => data.id == alllinksdata[i].destination)

          allregionsid.push({
            id: alllinksdata[i].id,
            name: alllinksdata[i].name,
            source_id: alllinksdata[i].source.id,
            destination_id: alllinksdata[i].destination.id,
            //  source:alllinksdata[i].source,
            // destination:alllinksdata[i].destination,
            // sourceregionid:findsouceregionid?.region_id,
            // destinationregionid:finddestinationregionid?.region_id
          });
        }

        old.push({networkid: networkid, regionid: id, links: allregionsid});
      }
      dispatch(setRegionLinks(old));
    }
  };

  const onclikitems = (id: string) => {
    dispatch(setAllselectedId(id));
  };

  const deletegroupsationds = async (regionid: string,networkid:string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const deletestationlist = selectedstations.find(
            data => data.regionid == regionid,
          );

          const list = deletestationlist?.stationsID || [];
          const promises = list.map((data: string) =>
            $Delete(`otdr/station/${data}`),
          );

          const results = await Promise.all(promises);
          console.log('results', results);

          dispatch(
            deletegroupstation({
              networkid:networkid,
              regionid: regionid,
              stationsid: deletestationlist?.stationsID || [],
            }),
          );
        } catch (error) {
          `deleteStationError is:${error}`;
        } finally {
          dispatch(chageLoading(false));
          navigate(`/regions/defaultregionemptypage/${regionid}_Stations`);
        }
      }
    });
  };

  const deletedefaultgroupsationds = async (networkid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const deletestationlist = selecteddefaultstations.find(
            data => data.networkid == networkid,
          );
          const list = deletestationlist?.stationsID || [];
          const promises = list.map((data: string) =>
            $Delete(`otdr/station/${data}`),
          );
          const results = await Promise.all(promises);

          dispatch(
            deletedefaultgroupstation({
              networkid: networkid,
              stationsid: deletestationlist?.stationsID || [],
            }),
          );
        } catch (error) {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
          `deleteStationError is:${error}`;
        } finally {
          dispatch(chageLoading(false));
          navigate(`/regions/defaultregionemptypage/${networkid}_Stations`);
        }
      }
    });
  };

  const ondeletelinksgroup = async (regionid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const deletestationlist = selectedlinks.find(
            data => data.regionid == regionid,
          );
          const list = deletestationlist?.linkID || [];
          const promises = list.map((data: string) =>
            $Delete(`otdr/link/${data}`),
          );
          const results = await Promise.all(promises);
          dispatch(
            deletegrouplinks({
              regionid: regionid,
              linksid: deletestationlist?.linkID || [],
            }),
          );
        } catch (error) {
          console.log(`deletelinkError is:${error}`);
        } finally {
          dispatch(chageLoading(false));
          navigate(`/regions/defaultregionemptypage/${regionid}_Linkss`);
        }
      }
    });
  };

  const ondeletedefaultlinksgroup = async (networkid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const deletestationlist = selectedefaultdlinks.find(
            data => data.networkid == networkid,
          );

          const list = deletestationlist?.linkID || [];
          const promises = list.map((data: string) =>
            $Delete(`otdr/link/${data}`),
          );

          dispatch(
            deletedefaultgrouplinks({
              networkid: networkid,
              linksid: deletestationlist?.linkID || [],
            }),
          );
        } catch (error) {
          console.log(`deletelinkError is:${error}`);
        } finally {
          dispatch(chageLoading(true));
          navigate(`/regions/defaultregionemptypage/${networkid}_Linkss`);
        }
      }
    });
  };

  const Deleteregion = async (regionid: string, networkid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const response = await $Delete(`otdr/region/${regionid}`);
          if (response?.status == 200) {
            dispatch(deleteRegion({regionid: regionid, networkid: networkid}));
            
          }
        } catch (error) {
          console.log(`delete region Error is:${error}`);
          
        } finally {
          dispatch(chageLoading(false));
        }
       
      }
    });
  };



  const onclikdefaultStations=async (networkid: string) => {
    let allStations = [];
    const responsestation = await $Get(`otdr/station/network/${networkid}`);
    if(responsestation?.status == 200){
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
  }

  const onclickdefaultlinks=async (networkid: string) => {
    let allLinks = [];
    const responselink = await $Get(`otdr/link/network/${networkid}`);
    if(responselink?.status == 200){
      const responselinkData = await responselink?.json();
      for (let j = 0; j < responselinkData.length; j++) {
        if (responselinkData[j].region_id == null) {
          allLinks.push({
            id: responselinkData[j].id,
            name: responselinkData[j].name,
            source_id: responselinkData[j].source.id,
            destination_id: responselinkData[j].destination.id,
          });
        }
      }
      dispatch(setdefaultRegionLinks({networkid: networkid, links: allLinks}));
    }
  }


  const Deletenetwork = async (networkid: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          dispatch(chageLoading(true));
          const deletenetworkresponse = await $Delete(
            `otdr/network/${networkid}`,
          );
          if (deletenetworkresponse?.status == 200) {
            toast('It was done successfully', {type: 'success', autoClose: 1000});
            dispatch(deletenetwork(networkid));
            navigate('./');
          } else{
            toast('Encountered an error', {type: 'error', autoClose: 1000});
          }
        } catch (error) {
          toast('Encountered an error', {type: 'error', autoClose: 1000});
          console.log(`delete network error is:${error}`);
          
        } finally{
dispatch(chageLoading(false));
        }
      
      }
    });
  };
  return (
    <>
      {/* <div className="flex h-[calc(100vh-120px)] opacity-0 w-[30%] flex-col  border-r-2 overflow-scroll  no-scrollbar border-g p-4">

    </div> */}
      {loading ? (
        <Mainloading
          spinerclassname={`fixed left-[calc(15%-50px)] top-[35%] z-[300000] h-[100px] w-[100px]`}
          classname={`fixed left-0 top-0 z-[200000] flex h-screen w-[30%] items-center justify-center bg-neutral-400 opacity-60`}
        />
      ) : null}
      <div className="no-scrollbar fixed bottom-[0px] left-0  top-20 flex h-[calc(100vh-120px)] w-[30%]  flex-col overflow-scroll  border-r-2 border-g bg-[#E7EFF7] p-4 ">
        <div className="flex w-full flex-row items-center">
          <>
            {showAllnetworks ? (
              <span
                onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
                className="mr-[7px] mt-[-14px] cursor-pointer font-light">
                -
              </span>
            ) : (
              <span
                onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
                className="cursor-pointer text-[20px]">
                +
              </span>
            )}
          </>
          <div
            className={`flex h-[45px] w-full flex-row items-center px-[8px] ${
              showAllnetworks ? 'bg-[#C0E7F2]' : 'bg-[#E7EFF7]'
            }`}>
            <div className="flex w-[calc(100%-20px)] flex-row items-center justify-between">
              <span
                onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
                className="ml-[5px] cursor-pointer text-[20px] font-bold">
                Networks
              </span>
              {showAllnetworks && loggedInUser.role === UserRole.SUPER_USER ? (
                <BsPlusLg
                  onClick={() => navigate('/networks/create')}
                  color="#18C047"
                  size={25}
                  className="cursor-pointer"
                />
              ) : null}
            </div>
          </div>
        </div>

        {showAllnetworks ? (
          <div className="relative ml-[3px]  mt-[-22px] flex w-full flex-col  border-l-[1px] border-dotted border-black pt-[45px]">
            {networkslist?.map((networkdata, index) => (
              <div key={index} className="w-full">
                <Items
                  key={networkdata.id + index}
                  to={
                    loggedInUser.role === UserRole.SUPER_USER
                      ? `/networks/${networkdata.id}`
                      : '#'
                  }
                  createurl={`/regions/create/${networkdata.id}`}
                  selected={false}
                  canAdd={
                    loggedInUser.role === UserRole.SUPER_USER 
                    // || networkidadmin.includes(networkdata.id)
                  }
                  canDelete={loggedInUser.role === UserRole.SUPER_USER}
                  onDelete={() => Deletenetwork(networkdata.id)}
                  onclick={() => {
                    dispatch(setSelectedid(networkdata.id)),
                      onclikitems(networkdata.id),
                      onclicknetwork(networkdata.id),
                      () => setNetworkId(networkdata.id);
                  }}
                  // onclick={() => onclikitems(data.id)}
                  id={networkdata.id}
                  name={networkdata.name}
                />
                {index == networkslist.length - 1 ? (
                  <div className="absolute left-[-5px] z-10 mt-[-30px] h-full w-[20px] bg-[#E7EFF7]"></div>
                ) : null}

                {allselectedId.indexOf(networkdata.id) > -1 ? (
                  <>
                    <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                      <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[33.6px] w-[20px] bg-[#E7EFF7]"></div>
                      {networkregions
                        .find(
                          networkregionsdata =>
                            networkregionsdata.networkid == networkdata.id,
                        )
                        ?.regions.map((regionsdata, index) => (
                          <div key={index} className="full">
                            <Items
                              key={regionsdata.id}
                              to={`/regions/${regionsdata.id}_${networkdata.id}`}
                              selected={false}
                              canAdd={false}
                              canDelete={
                                loggedInUser.role === UserRole.SUPER_USER ||
                                networkidadmin.includes(networkdata.id)
                              }
                              onDelete={() =>
                                Deleteregion(regionsdata.id, networkdata.id)
                              }
                              onclick={() => {
                                dispatch(setSelectedid(networkdata.id)),
                                  onclikitems(regionsdata.id);
                                // onclickstations(networkdata.id, regionsdata.id);
                                onclicklinks(networkdata.id, regionsdata.id);
                              }}
                              id={regionsdata.id}
                              name={regionsdata.name}
                            />
                            {allselectedId.indexOf(regionsdata.id) > -1 ? (
                              <div className="relative ml-[32px]  mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                                <div
                                  className={`absolute ${
                                    allselectedId.indexOf(
                                      `${regionsdata.id}&${regionsdata.id}`,
                                    ) > -1
                                      ? 'bottom-[-9px]'
                                      : 'bottom-[-3px]'
                                  } left-[-10px] z-10 h-[34px] w-[20px] bg-[#E7EFF7]`}></div>
                                <Items
                                  key={Number(regionsdata.id)}
                                  to={`/regions/defaultregionemptypage/${networkdata.id}_Stations`}
                                  createurl={`/stations/create/${regionsdata.id}_${networkdata.id}`}
                                  canDelete={false}
                                  canAdd={
                                    loggedInUser.role === UserRole.SUPER_USER ||
                                    networkidadmin.includes(networkdata.id)
                                  }
                                  selected={false}
                                  onDelete={() => {}}
                                  onclick={() => {
                                    dispatch(setSelectedid(networkdata.id)),
                                      onclikitems(
                                        `${regionsdata.id}${regionsdata.id}`,
                                      );
                                    onclickstations(
                                      networkdata.id,
                                      regionsdata.id,
                                    );
                                  }}
                                  id={`${regionsdata.id}${regionsdata.id}`}
                                  name="Stations"
                                />

                                {allselectedId.indexOf(
                                  `${regionsdata.id}${regionsdata.id}`,
                                ) > -1 ? (
                                  <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                                    <div className="absolute bottom-[-4px] left-[-10px] z-10 h-[35px] w-[20px] bg-[#E7EFF7]"></div>

                                    {regionstations
                                      .find(
                                        dataa =>
                                          dataa.regionid == regionsdata.id,
                                      )
                                      ?.stations.map((stationsdata, index) => (
                                        <Items
                                          key={index + stationsdata.id}
                                          to={`/stations/${stationsdata.id}_${regionsdata.id}_${networkdata.id}`}
                                          selected={false}
                                          canDelete={true}
                                          onDelete={() =>
                                            deletegroupsationds(regionsdata.id,networkdata.id)
                                          }
                                          disabledcheckbox={
                                            loggedInUser.role !==
                                              UserRole.SUPER_USER &&
                                            !networkidadmin.includes(
                                              networkdata.id,
                                            )
                                          }
                                          canAdd={false}
                                          enabelcheck={true}
                                          onclickcheckbox={() =>
                                            dispatch(
                                              onclickstationcheckbox({
                                                networkid: networkdata.id,
                                                regionid: regionsdata.id,
                                                stationid: stationsdata.id,
                                              }),
                                            )
                                          }
                                          checkstatus={selectedstations
                                            .find(
                                              data =>
                                                data.regionid == regionsdata.id,
                                            )
                                            ?.stationsID.includes(
                                              stationsdata.id,
                                            )}
                                          pluse={false}
                                          createurl={`/stations/create`}
                                          onclick={() => {
                                            dispatch(
                                              setSelectedid(stationsdata.id),
                                            ),
                                              onclikitems(stationsdata.id);
                                          }}
                                          id={stationsdata.id}
                                          name={stationsdata.name}
                                        />
                                      ))}
                                  </div>
                                ) : null}
                                <Items
                                  key={Number(
                                    `${regionsdata.id}${networkdata.id}`,
                                  )}
                                  to={`/regions/defaultregionemptypage/${networkdata.id}_Linkss`}
                                  selected={false}
                                  canDelete={false}
                                  canAdd={
                                    loggedInUser.role === UserRole.SUPER_USER ||
                                    networkidadmin.includes(networkdata.id)
                                  }
                                  onDelete={() => {}}
                                  onclick={() => {
                                    dispatch(setSelectedid(regionsdata.id)),
                                      onclikitems(
                                        `${regionsdata.id}&${regionsdata.id}_Linkss`,
                                      );
                                    onclicklinks(
                                      networkdata.id,
                                      regionsdata.id,
                                    );
                                    // onclicklinks(regionsdata.id);
                                  }}
                                  createurl={`/links/create/${regionsdata.id}_${networkdata.id}`}
                                  id={`${regionsdata.id}&${regionsdata.id}`}
                                  name="Links"
                                />
                                {allselectedId.indexOf(
                                  `${regionsdata.id}&${regionsdata.id}_Linkss`,
                                ) > -1 ? (
                                  <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                                    <div
                                      className={`absolute ${
                                        allselectedId.indexOf(
                                          `${regionsdata.id}&${regionsdata.id}_Linkss`,
                                        ) > -1
                                          ? 'bottom-[-4px]'
                                          : 'bottom-[-8px]'
                                      } left-[-10px] z-10 h-[35px] w-[20px] bg-[#E7EFF7]`}></div>
                                    <div className="absolute bottom-[5.8px] left-[-40px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                                    {regionLinks
                                      .find(
                                        dataa =>
                                          dataa.regionid == regionsdata.id,
                                      )
                                      ?.links.map((linksdata, index) => (
                                        <Items
                                          key={linksdata.id}
                                          canAdd={false}
                                          to={`/links/${linksdata.id}_${regionsdata.id}_${networkdata.id}`}
                                          createurl={`/links/create`}
                                          selected={false}
                                          disabledcheckbox={
                                            loggedInUser.role !==
                                              UserRole.SUPER_USER &&
                                            !networkidadmin.includes(
                                              networkdata.id,
                                            )
                                          }
                                          onDelete={() =>
                                            ondeletelinksgroup(regionsdata.id)
                                          }
                                          enabelcheck={true}
                                          onclickcheckbox={() =>
                                            dispatch(
                                              onclicklinkcheckbox({
                                                networkid: networkdata.id,
                                                regionid: regionsdata.id,
                                                linkid: linksdata.id,
                                              }),
                                            )
                                          }
                                          checkstatus={selectedlinks
                                            .find(
                                              data =>
                                                data.regionid == regionsdata.id,
                                            )
                                            ?.linkID.includes(linksdata.id)}
                                          onclick={() => {
                                            dispatch(
                                              setSelectedid(linksdata.id),
                                            ),
                                              onclikitems(linksdata.id);
                                          }}
                                          id={linksdata.id}
                                          pluse={false}
                                          name={linksdata.name}
                                        />
                                      ))}
                                  </div>
                                ) : null}
                              </div>
                            ) : null}
                          </div>
                        ))}

                      {/* -----------------------------------------------------------------------------                    */}
                      <>
                        <Items
                          key={Number(networkdata.id)}
                          to={`/regions/defaultregionemptypage/${networkdata.id}`}
                          canAdd={false}
                          canDelete={false}
                          selected={false}
                          onDelete={() =>
                            dispatch(
                              deletedefaultRegion({networkid: networkdata.id}),
                            )
                          }
                          onclick={() => {
                            onclikitems(`${networkdata.id}${networkdata.id}&`)
                              // onclickdefaltregion(networkdata.id);
                          }}
                          id={'ikuiuiu'}
                          name="Default Region"
                        />
                        {allselectedId.indexOf(
                          `${networkdata.id}${networkdata.id}&`,
                        ) > -1 ? (
                          <div className="relative ml-[32px]  mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                            <div className="absolute left-[-40px] top-[-6px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                            {/* {defaultregionLinks.length == 0?
                           null
                          : */}

                            <div
                              className={`absolute ${
                                allselectedId.indexOf(
                                  `&${networkdata.id}&${networkdata.id}`,
                                ) > -1
                                  ? 'bottom-[-6px]'
                                  : 'bottom-[-1px]'
                              } left-[-10px] z-10 h-[32px] w-[20px] bg-[#E7EFF7]`}></div>

                            {/* // } */}

                            <Items
                              key={Number(`${networkdata.id}`)}
                              to={`/regions/defaultregionemptypage/${networkdata.id}_Stations`}
                              createurl={`../stations/createdefault/${networkdata.id}`}
                              canDelete={false}
                              selected={false}
                              onDelete={() => {}}
                              onclick={() => {
                                dispatch(
                                  setSelectedid(
                                    `&${networkdata.id}${networkdata.id}&`,
                                  ),
                                ),
                                  onclikitems(
                                    `&${networkdata.id}${networkdata.id}&`,
                                  );
                                  onclikdefaultStations(networkdata.id)
                                // onclickstations(networkdata.id);
                              }}
                              id={`&${networkdata.id}${networkdata.id}&`}
                              name="Stations"
                            />

                            {allselectedId.indexOf(
                              `&${networkdata.id}${networkdata.id}&`,
                            ) > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                                <div className="absolute bottom-[-4px] left-[-10px] z-10 h-[35px] w-[20px] bg-[#E7EFF7]"></div>

                                {defaultregionstations
                                  .find(
                                    dataa => dataa.networkid == networkdata.id,
                                  )
                                  ?.stations.map((stationsdata, index) => (
                                    <Items
                                      key={stationsdata.id + stationsdata.id}
                                      to={`/stations/${stationsdata.id}_${networkdata.id}/defaultstationDetailPage`}
                                      canAdd={false}
                                      disabledcheckbox={
                                        loggedInUser.role !==
                                          UserRole.SUPER_USER &&
                                        !networkidadmin.includes(networkdata.id)
                                      }
                                      selected={false}
                                      onDelete={() =>
                                        deletedefaultgroupsationds(
                                          networkdata.id,
                                        )
                                      }
                                      enabelcheck={true}
                                      onclickcheckbox={() =>
                                        dispatch(
                                          onclickdefaultstationcheckbox({
                                            networkid: networkdata.id,
                                            stationid: stationsdata.id,
                                          }),
                                        )
                                      }
                                      checkstatus={selecteddefaultstations
                                        .find(
                                          data =>
                                            data.networkid == networkdata.id,
                                        )
                                        ?.stationsID.includes(stationsdata.id)}
                                      pluse={false}
                                      createurl={`/stations/create`}
                                      onclick={() => {
                                        dispatch(
                                          setSelectedid(stationsdata.id),
                                        ),
                                          onclikitems(stationsdata.id);
                                      }}
                                      id={stationsdata.id}
                                      name={stationsdata.name}
                                    />
                                  ))}
                              </div>
                            ) : null}

                            <Items
                              key={Number(`${networkdata.id}${networkdata.id}`)}
                              to={`/regions/defaultregionemptypage/_Links_${networkdata.id}`}
                              selected={false}
                              canDelete={false}
                              onDelete={() => {}}
                              onclick={() => {
                                dispatch(setSelectedid(networkdata.id)),
                                  onclikitems(
                                    `&${networkdata.id}&${networkdata.id}_Linkss`,
                                  );
                                  onclickdefaultlinks(networkdata.id)
                            //  onclicklinks(networkdata.id);
                              }}
                              createurl={`/links/createdefaultregionlink/${networkdata.id}`}
                              id={`&${networkdata.id}&${networkdata.id}&`}
                              name="Links"
                            />
                            {allselectedId.indexOf(
                              `&${networkdata.id}&${networkdata.id}_Linkss`,
                            ) > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[1px] border-dotted border-black pt-[20px]">
                                <div
                                  className={`absolute ${
                                    allselectedId.indexOf(
                                      `&${networkdata.id}&${networkdata.id}`,
                                    ) > -1
                                      ? 'bottom-[-4px]'
                                      : 'bottom-[-8px]'
                                  } left-[-10px] z-10 h-[35px] w-[20px] bg-[#E7EFF7]`}></div>
                                <div className="absolute bottom-[5px] left-[-40px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                                {defaultregionLinks
                                  .find(
                                    dataa => dataa.networkid == networkdata.id,
                                  )
                                  ?.links.map((linksdata, index) => (
                                    <Items
                                      key={linksdata.id + index}
                                      to={`/links/${linksdata.id}_${networkdata.id}/defaultregionlinkdetailpage`}
                                      createurl={`/links/create`}
                                      canAdd={false}
                                      selected={false}
                                      onDelete={() =>
                                        ondeletedefaultlinksgroup(
                                          networkdata.id,
                                        )
                                      }
                                      disabledcheckbox={
                                        loggedInUser.role !==
                                          UserRole.SUPER_USER &&
                                        !networkidadmin.includes(networkdata.id)
                                      }
                                      enabelcheck={true}
                                      onclickcheckbox={() =>
                                        dispatch(
                                          onclickdefaultlinkcheckbox({
                                            networkid: networkdata.id,
                                            linkid: linksdata.id,
                                          }),
                                        )
                                      }
                                      checkstatus={selectedefaultdlinks
                                        .find(
                                          data =>
                                            data.networkid == networkdata.id,
                                        )
                                        ?.linkID.includes(linksdata.id)}
                                      onclick={() => {
                                        dispatch(setSelectedid(linksdata.id)),
                                          onclikitems(linksdata.id);
                                      }}
                                      id={linksdata.id}
                                      pluse={false}
                                      name={linksdata.name}
                                    />
                                  ))}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    </div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}

        {/* <div className="ml-[5px] mt-[-6px] border-l-[1px]  border-dashed border-black  pt-[20px]">
               {children}
            </div> */}
      </div>
      <div className="flex w-full pb-10 pl-[32%] pr-8 pt-[70px] ">
        <Outlet />
      </div>
    </>
  );
}

export default NetworktreeLayout;
