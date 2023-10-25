import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import { useNavigate,useSearchParams } from 'react-router-dom';

import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclick?: Function;
  canAdd?:boolean
};


const RtuLayout: FC = () => {
  const [change, setChange] = useState(false);
  const [mount, setMount] = useState(false);
  const [networkId, setNetworkId] = useState('');
  const [regionId, setRegionId] = useState('');
  const navigate=useNavigate()


  
  const [networkregions, setNetworkregions] = useState<
    {networkid: string; regions: {name: string; id: string}[]}[]
  >([]);
  const [regionstations, setRegionstations] = useState<
    {regionid: string; stations: {name: string; id: string}[]}[]
  >([]);
  const {
    request,
    state: {list, deleteRequest, regions, regionStations},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      regions: state.http.regionList,
      deleteRequest: state.http.networkDelete,
      regionStations: state.http.regionStationList,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
  });



  const [openall, setOpenall] = useState(false);
  const [networkselectedlist, setNetworkselectedlist] = useState<string[]>([]);

  const Itembtn = ({name, id, classname, onclick = () => {},canAdd=false}: Itembtntype) => {
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
            opennetworkopticallist(id), onclick();
          }}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
        {canAdd?
        <>
             {networkselectedlist.indexOf(id) > -1 ? (
              <BsPlusLg onClick={()=>navigate(`create/${id}`)} color="#18C047" className="ml-[10px] cursor-pointer" />
            ) : null}
            </>
      :
      
      false}
   
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

  const networklist = list?.data || [];
  const regionrklist = regions?.data || [];
  const stationlist = regionStations?.data || [];

  const onclicknetwork = (id: string) => {
    request('regionList', {params: {network_id: id}});
  };

  const onclickregion = (id: string) => {
    request('regionStationList', {params: {region_id: id}});
    setRegionId(id);
  };



  useEffect(() => {
    if (mount) {
      const finddata = networkregions.filter(
        (data: any) => data.networkid == networkId,
      );
      console.log(finddata, 'finddatafinddatafinddata');
      const maindata = regions?.data || [];

      let allregionsid: any = [];
      if (finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        setNetworkregions(prev => [
          ...prev,
          {networkid: regionrklist[0]?.network_id, regions: allregionsid},
        ]);
      }

    } else {
    }
  }, [regions]);


  useEffect(() => {
    if (mount) {
      const finddata = regionstations.filter(
        (data: any) => data.regionid == regionId,
      );
      console.log(finddata, 'finddatafinddatafinddata');
      const maindata = regionStations?.data || [];
      console.log(maindata, 'dataaaa');
      let allregionsid: any = [];
      if (finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        console.log(allregionsid, 'ssssss');

        setRegionstations(prev => [
          ...prev,
          {regionid: regionId, stations: allregionsid},
        ]);
      }
      //   console.log(allregionsid,'allregionsid');
    } else {
      setMount(true);
    }
  }, [regionStations]);

// ############################################################
  return (
    // <SidebarLayout createTitle="Remote Test Units" canAdd>
    //   <SidebarItem name="RTU1" to="rtu-id-goes-here" />
    // </SidebarLayout>
    <SidebarLayout createTitle="">
      <div className="flex flex-row items-center">
        <label htmlFor="search" className="mr-2">
          Search
        </label>

        <TextInput
          id="search"
          className="mr-10 w-full"
          onChange={event => {
            // console.log(event);
          }}
        />
      </div>
      <div className="mt-[30px] flex w-full flex-col">
        <button
          onClick={() => setOpenall(!openall)}
          className="flex w-[95px] flex-row text-[20px] font-bold text-[#000000]">
          {openall ? (
            <span className="ml-[-4px] mr-[5px] font-light">-</span>
          ) : (
            <span className="mb-[5px] ml-[-6px] mr-[5px] font-light">+</span>
          )}

          <span>Networks</span>
        </button>
        {openall ? (
          <div
            className={` mt-[-10px] w-full  border-l-[1px] border-dotted border-[#000000]`}>
            {networklist.map((data, index) => (
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

                  {index == networklist.length - 1 ? (
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
                        ?.regions.map((dat, index) =>
                        
                        {
                          
                          return(
                          (
                            <div key={index} className="w-full">
                              <div className="flex w-full flex-row items-center">
                                <Itembtn
                                  onclick={() => {
                                    onclickregion(dat.id),
                                      () => setRegionId(dat.id);
                                  }}
                                  id={dat.id}
                                  name={dat.name}
                                />
                              </div>
                              {networkselectedlist.indexOf(dat.id) > -1 ? (
                                <div className="relative w-full">
                                  <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                  <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                  {networkregions
                        .find(dataa => dataa.networkid == data.id)
                        ?.regions.length == index+1 ? 
                                  <div
                                  className={`absolute left-[-1px] ${
                                    networkselectedlist.indexOf(dat.id) > -1
                                      ? 'top-[-31px]'
                                      : 'top-[-29px]'
                                  }  left-[-2px] z-30 h-full w-[5px] bg-[#E7EFF7]`}></div>:null}
                               
                                  {regionstations
                                    .find(dataa => dataa.regionid == dat.id)
                                    ?.stations.map((dat, index) =>
                                    {
                                      let findd=regionstations
                                      .find(dataa => dataa.regionid == dat.id)
                                      ?.stations;
                                      return(
                                        (
                                          <div
                                            key={index}
                                            className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                            <div className="absolute bottom-[-17px]  left-[25px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                                            {/* {index == regionstations.length - 1 ? ( */}
      
                                            {/* ) : null} */}
                                            <div className="flex w-full flex-row items-center ">
                                              <span className="mt-[-6px] w-[10px] text-[12px]">
                                                ...
                                              </span>
                                              <Itembtn canAdd={true} id={dat.id} name={dat.name} />
                                            </div>
                                            {networkselectedlist.indexOf(dat.id) >
                                            -1 ? (
                                              <div className=" relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                                       
                                                  {/* <div
                                                    className={`absolute left-[-1px] ${
                                                      networkselectedlist.indexOf(
                                                        dat.id,
                                                      ) > -1
                                                        ? 'top-[-31px]'
                                                        : 'top-[-29px]'
                                                    }  left-[-30px] z-30 h-full w-[5px] bg-[red]`}></div> */}
                                        
                                      
                                              
                                                <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                                                <div className="ml-[0px] mt-[10px] flex w-full flex-row items-center">
                                                  <span className="mt-[-6px] w-[20px] text-[12px]">
                                                    .....
                                                  </span>
                                                  <SidebarItem
                                                    className="w-[calc(100%-30px)]"
                                                    name="RTU1"
                                                    to="rtu-id-goes-here"
                                                  />
                                                </div>
                                                <div className="ml-[0px] mt-[10px] flex w-full flex-row items-center">
                                                  <span className="mt-[-6px] w-[20px] text-[12px]">
                                                    .....
                                                  </span>
                                                  <SidebarItem
                                                    className="w-[calc(100%-30px)]"
                                                    name="RTU1"
                                                    to="rtu-id-goes-here"
                                                  />
                                                </div>
                                              </div>
                                            ) : null}
                                          </div>
                                        )
                                      )
                                    }
                                    
                                   )}
                                </div>
                              ) : null}
                            </div>
                          )
                        )}
                        
                       )}

                      {/* <div className="flex w-full flex-row items-center">
                          <Itembtn name={'Region 2'} />
                        </div> */}
                    </>
                  ) : null}
                </div>
              </div>
            ))}

            {/* <Itembtn name={'Network2'} /> */}

            {/* <div className="relative flex flex-col ">
            <div className="absolute left-[-5px] top-[36px] z-10 h-full w-[10px] bg-[#E7EFF7]"></div>
            {networkselectedlist.indexOf('Network3') > -1 ? (
              <div className="absolute left-[16px] top-[38px] z-10 h-[calc(100%-59px)]  border-l-[1px]  border-dotted border-[#000000] bg-[#E7EFF7]"></div>
            ) : null}
            <Itembtn name={'Network3'} />
            {networkselectedlist.indexOf('Network3') > -1 ? (
              <div className="ml-[17px] flex w-full flex-row items-center overflow-hidden">
                <span className="w-[15px] text-[12px]">....</span>
                <SidebarItem
                  className="w-[calc(100%-10px)]"
                  onclick={() => alert('rree')}
                  name="Optical Route 1"
                  to="#"
                />
              </div>
            ) : null}
          </div> */}
          </div>
        ) : null}
      </div>
    </SidebarLayout>
  );
};

export default RtuLayout;
