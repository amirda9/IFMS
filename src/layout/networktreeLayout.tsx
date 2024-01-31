import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Outlet, useNavigate} from 'react-router-dom';
import {SidebarItem} from '~/components';
import {useHttpRequest} from '~/hooks';
import {RootState} from '~/store';
import {deepcopy} from '~/util';
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
} from './../store/slices/networktreeslice';
import {$Delete, $Get} from '~/util/requestapi';
import {BsPlusLg} from 'react-icons/bs';
type ItemspROPS = {
  to: string;
  selected: boolean;
  key: number;
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
};
type Iprops = {
  children: React.ReactNode;
};

function NetworktreeLayout({children}: Iprops) {
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
  } = useSelector((state: RootState) => state.networktree);
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
        const networksdata = await getnetworks.json();
        if (getnetworks.status == 200) {
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
    onclickcheckbox = () => {},
  }: ItemspROPS) => {
    return (
      <div className="relative mb-[15px] flex h-[40px] flex-row items-center">
        <span className="mr-[4px] text-[20px]">....</span>
        {pluse ? (
          <>
            {allselectedId.indexOf(id) > -1 ? (
              <span
                // onClick={() => onclikitems(id)}
                className="z-50 mt-[-4px] cursor-pointer text-[20px]">
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

  const onclickstations = async (id: string) => {
    let old = deepcopy(regionstations);
    const allstation = await $Get(`otdr/region/${id}/stations`);
    if (allstation.status === 200) {
      let allstationdata = await allstation.json();
      console.log('🥵', allstationdata);

      const finddata = regionstations.findIndex(data => data.regionid == id);
      let allregionsid: any = [];
      if (allstationdata.length > 0 && finddata < 0) {
        for (let i = 0; i < allstationdata?.length; i++) {
          allregionsid.push({
            id: allstationdata[i].id,
            name: allstationdata[i].name,
          });
        }
        old.push({regionid: id, stations: allregionsid});
      }
      dispatch(setRegionstations(old));
    }
  };

  const onclicklinks = async (id: string) => {
    let old = deepcopy(regionLinks);
    const alllinks = await $Get(`otdr/region/${id}/links`);
    if (alllinks.status === 200) {
      let alllinksdata = await alllinks.json();
      const finddata = regionLinks.findIndex(data => data.regionid == id);
      let allregionsid: any = [];
      if (alllinksdata.length > 0 && finddata < 0) {
        for (let i = 0; i < alllinksdata?.length; i++) {
          allregionsid.push({
            id: alllinksdata[i].id,
            name: alllinksdata[i].name,
          });
        }
        old.push({regionid: id, links: allregionsid});
      }
      dispatch(setRegionLinks(old));
    }
  };

  const onclikitems = (id: string) => {
    dispatch(setAllselectedId(id));
  };

  const deletegroupsationds = async (regionid: string) => {
    const deletestationlist = selectedstations.find(
      data => data.regionid == regionid,
    );
    const response = await $Delete(
      `otdr/station/batch_delete`,
      deletestationlist?.stationsID,
    );
    if (response.status == 200) {
      dispatch(
        deletegroupstation({
          regionid: regionid,
          stationsid: deletestationlist?.stationsID || [],
        }),
      );
    }
  };

  console.log("😋",defaultregionstations);
  
  const deletedefaultgroupsationds = async (networkid: string) => {
    const deletestationlist = selecteddefaultstations.find(
      data => data.networkid == networkid,
    );
    const response = await $Delete(
      `otdr/station/batch_delete`,
      deletestationlist?.stationsID,
    );
    if (response.status == 200) {
      dispatch(
        deletedefaultgroupstation({
          networkid: networkid,
          stationsid: deletestationlist?.stationsID || [],
        }),
      );
    }
  };

  const ondeletelinksgroup = async (regionid: string) => {
    const deletestationlist = selectedlinks.find(
      data => data.regionid == regionid,
    );
    const response = await $Delete(
      `otdr/link/batch_delete`,
      deletestationlist?.linkID,
    );
    if (response.status == 200) {
      dispatch(
        deletegrouplinks({
          regionid: regionid,
          linksid: deletestationlist?.linkID || [],
        }),
      );
    }
  };

  const ondeletedefaultlinksgroup = async (networkid: string) => {
    const deletestationlist = selectedefaultdlinks.find(
      data => data.networkid == networkid,
    );
    // const response = await $Delete(
    //   `otdr/link/batch_delete`,
    //   deletestationlist?.linkID,
    // );
    // if (response.status == 200) {
    dispatch(
      deletedefaultgrouplinks({
        networkid: networkid,
        linksid: deletestationlist?.linkID || [],
      }),
    );
    // }
  };

  const Deleteregion = (regionid: string, networkid: string) => {
    // const response = await $Delete(`otdr/region/${regionid}`);
    // if (response.status == 200) {
    dispatch(deleteRegion({regionid: regionid, networkid: networkid}));
    // }
  };
  const onclickdefaltregion = async (networkid: string) => {
    let allLinks = [];
    let allStations = [];
    const responsestation = await $Get(`otdr/station/network/${networkid}`);
    const responsestationData = await responsestation.json();
    const responselink = await $Get(`otdr/link/network/${networkid}`);
    console.log('👺', responsestationData);

    const responselinkData = await responselink.json();
    if (responsestation.status == 200 && responselink.status == 200) {
      for (let i = 0; i < responsestationData.length; i++) {
        if (responsestationData[i].region_id == null) {
          allStations.push({
            id: responsestationData[i].id,
            name: responsestationData[i].name,
          });
        }
      }
      for (let j = 0; j < responselinkData.length; j++) {
        if (responselinkData[j].region_id == null) {
          allLinks.push({
            id: responselinkData[j].id,
            name: responselinkData[j].name,
          });
        }
      }
      dispatch(setdefaultRegionLinks({networkid: networkid, links: allLinks}));
      dispatch(
        setdefaultRegionstations({networkid: networkid, stations: allStations}),
      );
    }
  };

  const Deletenetwork = async (networkid: string) => {
      const deletenetworkresponse = await $Delete(`otdr/network/${networkid}`);
      if (deletenetworkresponse.status == 200) {
        dispatch(deletenetwork(networkid));
      }
  };
  return (
    <>
    {/* <div className="flex h-[calc(100vh-120px)] opacity-0 w-[30%] flex-col  border-r-2 overflow-scroll  no-scrollbar border-g p-4">

    </div> */}
      <div className="flex h-[calc(100vh-120px)] fixed left-0  top-20 bottom-[0px] w-[30%] flex-col  border-r-2 overflow-scroll  bg-[#E7EFF7] no-scrollbar border-g p-4 ">
        <div className="flex w-full flex-row items-center">
          <>
            {showAllnetworks ? (
              <span
                onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
                className="mr-[7px] mt-[-14px] cursor-pointer text-[20px]">
                _
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
              {showAllnetworks ? (
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
          <div className="relative flex  w-full flex-col border-l-2 border-dashed border-black">
            <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
            {networkslist?.map(networkdata => (
              <>
                <Items
                  key={Number(networkdata.id)}
                  to={`/networks/${networkdata.id}`}
                  createurl={`/regions/create/${networkdata.id}`}
                  selected={false}
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

                {allselectedId.indexOf(networkdata.id) > -1 ? (
                  <>
                    <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                      <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
                      {networkregions
                        .find(
                          networkregionsdata =>
                            networkregionsdata.networkid == networkdata.id,
                        )
                        ?.regions.map((regionsdata, index) => (
                          <>
                            <Items
                              key={Number(regionsdata.id)}
                              to={`/regions/${regionsdata.id}_${networkdata.id}`}
                              selected={false}
                              canAdd={false}
                              onDelete={() =>
                                Deleteregion(regionsdata.id, networkdata.id)
                              }
                              onclick={() => {
                                dispatch(setSelectedid(networkdata.id)),
                                  onclikitems(regionsdata.id);
                                onclickstations(regionsdata.id);
                                onclicklinks(regionsdata.id);
                              }}
                              id={regionsdata.id}
                              name={regionsdata.name}
                            />
                            {allselectedId.indexOf(regionsdata.id) > -1 ? (
                              <div className="relative ml-[32px]  mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                <div
                                  className={`absolute ${
                                    allselectedId.indexOf(
                                      `${regionsdata.id}&${regionsdata.id}`,
                                    ) > -1
                                      ? 'bottom-[-7px]'
                                      : 'bottom-[-3px]'
                                  } left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]`}></div>
                                <Items
                                  key={Number(`${index}`)}
                                  to={`/regions/${regionsdata.id}`}
                                  createurl={`/stations/create/${regionsdata.id}_${networkdata.id}`}
                                  canDelete={false}
                                  selected={false}
                                  onDelete={() => {}}
                                  onclick={() => {
                                    dispatch(setSelectedid(networkdata.id)),
                                      onclikitems(
                                        `${regionsdata.id}${regionsdata.id}`,
                                      );
                                 onclickstations(regionsdata.id);
                                  }}
                                  id={`${regionsdata.id}${regionsdata.id}`}
                                  name="Stations"
                                />

                                {allselectedId.indexOf(
                                  `${regionsdata.id}${regionsdata.id}`,
                                ) > -1 ? (
                                  <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                    <div className="absolute bottom-[-4px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>

                                    {regionstations
                                      .find(
                                        dataa =>
                                          dataa.regionid == regionsdata.id,
                                      )
                                      ?.stations.map((stationsdata, index) => (
                                        <Items
                                          key={Number(index)}
                                          to={`/stations/${stationsdata.id}`}
                                          selected={false}
                                          onDelete={() =>
                                            deletegroupsationds(regionsdata.id)
                                          }
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
                                  to={`/regions/${regionsdata.id}`}
                                  selected={false}
                                  canDelete={false}
                                  onDelete={() => {}}
                                  onclick={() => {
                                    dispatch(setSelectedid(regionsdata.id)),
                                      onclikitems(
                                        `${regionsdata.id}&${regionsdata.id}`,
                                      );
                                    // onclicklinks(regionsdata.id);
                                  }}
                                  createurl={`/links/create/${regionsdata.id}_${networkdata.id}`}
                                  id={`${regionsdata.id}&${regionsdata.id}`}
                                  name="Links"
                                />
                                {allselectedId.indexOf(
                                  `${regionsdata.id}&${regionsdata.id}`,
                                ) > -1 ? (
                                  <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                    <div
                                      className={`absolute ${
                                        allselectedId.indexOf(
                                          `${regionsdata.id}&${regionsdata.id}`,
                                        ) > -1
                                          ? 'bottom-[-4px]'
                                          : 'bottom-[-8px]'
                                      } left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]`}></div>
                                    <div className="absolute bottom-[3px] left-[-40px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                                    {regionLinks
                                      .find(
                                        dataa =>
                                          dataa.regionid == regionsdata.id,
                                      )
                                      ?.links.map((linksdata, index) => (
                                        <Items
                                          key={Number(index)}
                                          to={`/links/${linksdata.id}_${regionsdata.id}`}
                                          createurl={`/links/create`}
                                          selected={false}
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
                          </>
                        ))}

                      {/* -----------------------------------------------------------------------------                    */}
                      <>
                        <Items
                          key={Number(networkdata.id)}
                          to={'dede'}
                          canAdd={false}
                          canDelete={false}
                          selected={false}
                          onDelete={() => {}}
                          onclick={() => {
                            onclikitems(`${networkdata.id}${networkdata.id}&`),
                              onclickdefaltregion(networkdata.id);
                          }}
                          id={'ikuiuiu'}
                          name="Default Region"
                        />
                        {allselectedId.indexOf(
                          `${networkdata.id}${networkdata.id}&`,
                        ) > -1 ? (
                          <div className="relative ml-[32px]  mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                           <div className='absolute z-10 left-[-40px] top-[-3px] h-full bg-[#E7EFF7] w-[20px]'></div>
                            <div
                              className={`absolute ${
                                allselectedId.indexOf(
                                  `${networkdata.id}${networkdata.id}&`,
                                ) > -1
                                  ? 'bottom-[-7px]'
                                  : 'bottom-[-3px]'
                              } left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]`}></div>
                            <Items
                              key={Number(`${networkdata.id}`)}
                              to={`/regions/${networkdata.id}`}
                              createurl={`/stations/create/${networkdata.id}`}
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
                                  ),
                                  onclickstations(networkdata.id);
                              }}
                              id={`&${networkdata.id}${networkdata.id}&`}
                              name="Stations"
                            />

                            {allselectedId.indexOf(
                              `&${networkdata.id}${networkdata.id}&`,
                            ) > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                <div className="absolute bottom-[-4px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>

                                {defaultregionstations
                                  .find(
                                    dataa => dataa.networkid == networkdata.id,
                                  )
                                  ?.stations.map((stationsdata, index) => (
                                    <Items
                                      key={Number(index)}
                                      to={`/stations/${stationsdata.id}`}
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
                              to={`/regions/${networkdata.id}`}
                              selected={false}
                              canDelete={false}
                              onDelete={() => {}}
                              onclick={() => {
                                dispatch(setSelectedid(networkdata.id)),
                                  onclikitems(
                                    `&${networkdata.id}&${networkdata.id}`,
                                  ),
                                  onclicklinks(networkdata.id);
                              }}
                              createurl={`/links/createdefaultregionlink/${networkdata.id}`}
                              id={`&${networkdata.id}&${networkdata.id}`}
                              name="Links"
                            />
                            {allselectedId.indexOf(
                              `&${networkdata.id}&${networkdata.id}`,
                            ) > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                <div
                                  className={`absolute ${
                                    allselectedId.indexOf(
                                      `&${networkdata.id}&${networkdata.id}`,
                                    ) > -1
                                      ? 'bottom-[-4px]'
                                      : 'bottom-[-8px]'
                                  } left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]`}></div>
                                <div className="absolute bottom-[3px] left-[-40px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                                {defaultregionLinks
                                  .find(
                                    dataa => dataa.networkid == networkdata.id,
                                  )
                                  ?.links.map((linksdata, index) => (
                                    <Items
                                      key={Number(index)}
                                      to={`/links/defaultregionlinkdetailpage/${linksdata.id}`}
                                      createurl={`/links/create`}
                                      selected={false}
                                      onDelete={() =>
                                        ondeletedefaultlinksgroup(
                                          networkdata.id,
                                        )
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
              </>
            ))}
          </div>
        ) : null}

        {/* <div className="ml-[5px] mt-[-6px] border-l-[1px]  border-dashed border-black  pt-[20px]">
               {children}
            </div> */}
      </div>
      <div className="flex w-full pr-8 pl-[32%] pt-[70px] pb-10 ">
        <Outlet />
      </div>
    </>
  );
}

export default NetworktreeLayout;
