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
} from './../store/slices/networktreeslice';
import {$Get} from '~/util/requestapi';
import {BsPlusLg} from 'react-icons/bs';

const allregions = ['13', '14', '15', '16'];
const allstation = ['17', '18', '19', '20'];
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

  // useEffect(()=>{
  //  const element = document.getElementById('9a57882c-759a-4ef7-98d3-321dcc7cf9e3');
  //  if (element) {
  //    // 👇 Will scroll smoothly to the top of the next section
  //    element.scrollIntoView({ behavior: 'smooth' });
  //  }
  // },[])
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
          createurl={createurl}
          key={key}
          enabelcheck={enabelcheck}
          checkstatus={checkstatus}
          onDelete={() => onDelete()}
        />
        {/* { canAdd && allselectedId.indexOf(id) > -1 ?
              <BsPlusLg
                onClick={() =>{}
                  // navigate(`create/${id}_${regionid}_${networkid}`)
                }
                color="#18C047"
                size={25}
                className="absolute right-[25px] top-[15px] cursor-pointer"
              />:null} */}
      </div>
    );
  };

  const onclickstations = async (id: string) => {
    let old = deepcopy(regionstations);
    const allstation = await $Get(`otdr/region/${id}/stations`);
    if (allstation.status === 200) {
      let allstationdata = await allstation.json();
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
    // const findId = allselectedId.findIndex(data => data == id);
    // if (findId > -1) {
    //   let allselectedIdCopy: string[] = deepcopy(allselectedId);
    //   const newlist = allselectedIdCopy.filter(data => data != id);
    //   setAllselectedId(newlist);
    // } else {
    //   setAllselectedId(prev => [...prev, id]);
    // }
  };
  return (
    <>
      <div className="flex h-[calc(100vh-120px)] w-[30%] flex-col overflow-y-auto border-r-2  border-g p-4">
        <div
          className={`flex h-[45px] w-full flex-row items-center px-[8px] ${
            showAllnetworks ? 'bg-[#C0E7F2]' : 'bg-[#E7EFF7]'
          }`}>
          {showAllnetworks ? (
            <span
              onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
              className="mt-[-7px] cursor-pointer text-[20px]">
              _
            </span>
          ) : (
            <span
              onClick={() => dispatch(setShowallnetworks(!showAllnetworks))}
              className="cursor-pointer text-[20px]">
              +
            </span>
          )}

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
                  onDelete={() => {}}
                  onclick={() => {
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
                        ?.regions.map((regionsdata,index) => (
                          <>
                            <Items
                              key={Number(regionsdata.id)}
                              to={`/regions/${regionsdata.id}`}
                              selected={false}
                              canAdd={false}
                              onDelete={() => {}}
                              onclick={() => {
                                onclikitems(regionsdata.id);
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
                                  createurl={`/stations/create/${regionsdata.id}`}
                              
                                  selected={false}
                                  onDelete={() => {}}
                                  onclick={() => {
                                    onclikitems(
                                      `${regionsdata.id}${regionsdata.id}`,
                                    ),
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
                                      ?.stations.map((stationsdata,index) => (
                                        <Items
                                          key={Number(index)}
                                          to={`/stations/${stationsdata.id}`}
                                          selected={false}
                                          onDelete={() => {}}
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
                                          onclick={() =>
                                            onclikitems(stationsdata.id)
                                          }
                                          id={stationsdata.id}
                                          name={stationsdata.name}
                                        />
                                      ))}
                                  </div>
                                ) : null}
                                <Items
                                  key={Number(`${regionsdata.id}${networkdata.id}`)}
                                  to={`/regions/${regionsdata.id}`}
                                  selected={false}
                                  onDelete={() => {}}
                                  onclick={() => {
                                    onclikitems(
                                      `${regionsdata.id}&${regionsdata.id}`
                                    ),
                                      onclicklinks(regionsdata.id);
                                  }}
                                  createurl={`/links/create/${regionsdata.id}`}
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
                                      ?.links.map((linksdata,index) => (
                                        <Items
                                          key={Number(index)}
                                          to={`/links/${linksdata.id}`}
                                          createurl={`/links/create`}
                                          selected={false}
                                          onDelete={() => {}}
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
                                          onclick={() =>
                                            onclikitems(linksdata.id)
                                          }
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
                      <Items
                        key={Number(networkdata.id)}
                        to={'dede'}
                        selected={false}
                        onDelete={() => {}}
                        onclick={() => onclikitems('iioio')}
                        id={'ikuiuiu'}
                        name="Default Region"
                      />
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
      <div className="flex w-full px-8 py-6">
        <Outlet />
      </div>
    </>
  );
}

export default NetworktreeLayout;
