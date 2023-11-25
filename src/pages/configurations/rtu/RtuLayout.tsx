import {FC, useEffect, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {useNavigate, useSearchParams} from 'react-router-dom';
import Checkbox from '~/components/checkbox/checkbox';
import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {$DELETE, $Delete, $GET, $Get} from '~/util/requestapi';
import {useDispatch, useSelector} from 'react-redux';
import {
  rtuleftbar,
  allnetworkregionstype,
  regiontype,
  allstationsrtutype,
  stationtype,
  allregionstationstype,
  initialStatetype,
} from './../../../store/slices/rtu';
import {deepcopy} from './../../../util/deepcopy';
import {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
  setleftbarNetworkcheckboxlist,
  setleftbarRegioncheckboxlist,
  setleftbarStationcheckboxlist,
  setleftbarcheckboxlist,
} from './../../../store/slices/rtu';
import {IoTrashOutline} from 'react-icons/io5';
import {setAllcheckednetwork} from '~/store/slices/opticalroutslice';
import {RootState} from '~/store';

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
  regionid: string;
  networkid: string;

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

const RtuLayout: FC = () => {
  const dispatch = useDispatch();
  const [change, setChange] = useState(false);
  const [mount, setMount] = useState(false);
  const [networkId, setNetworkId] = useState('');
  const [regionId, setRegionId] = useState('');
  const [stationid, setStationid] = useState('');
  const [selectedtabId, setSelectedtabid] = useState('');
  const navigate = useNavigate();
  const [checkallnetwork, setChekallnetwork] = useState(false);
  const {
    stationsrtu,
    regionstations,
    networkregions,
    leftbarNetworkcheckboxlist,
    leftbarRegioncheckboxlist,
    leftbarStationcheckboxlist,
    leftbarcheckboxlist,
  } = useSelector((state: RootState) => state.rtu);
console.log(stationsrtu,'🤩');

  const {
    request,
    state: {list, deleteRequest, regions, regionStations, stationrtulist},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      regions: state.http.regionList,
      deleteRequest: state.http.networkDelete,
      regionStations: state.http.regionStationList,
      stationrtulist: state.http.stationrtuList,
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
  const findNetworkIndex = (id: string) => {
    return leftbarcheckboxlist.findIndex(data => data.networkid == id);
  };
  const findNetwork = (id: string) => {
    return leftbarcheckboxlist.find(data => data.networkid == id);
  };
  const findStation = (
    networkId: string,
    regionId: string,
    stationId: string,
  ) => {
    return leftbarcheckboxlist
      .find(data => data.networkid == networkId)
      ?.region?.find(data => data.regionid == regionId)
      ?.station?.find(data => data.stationid == stationId);
  };
  // ***************************
  const onclickmiannetworkcheckbox = async(e: boolean) => {
    let alldata = list?.data || [];
    console.log(alldata, 'alldata');

    setChekallnetwork(!checkallnetwork);
    let olddata = deepcopy(leftbarcheckboxlist);
    if (leftbarcheckboxlist.length == 0) {
      olddata = alldata.map(data => ({
        networkid: data.id,
        check: true,
      }));
    } else {
      if (e) {
        let dataa = [];

        for (let i = 0; i < leftbarcheckboxlist.length; i++) {
          olddata[i].check = true;
          for (let j = 0; j < leftbarcheckboxlist[i]?.region?.length; j++) {
            olddata[i].region[j].check = true;
            for (let c = 0; c < olddata[i]?.region[j]?.station?.length; c++) {
              olddata[i].region[j].station[c].stationid = true;
            }
          }
        }
      } else {
        for (let i = 0; i < leftbarcheckboxlist.length; i++) {
          olddata[i].check = false;
          for (let j = 0; j < leftbarcheckboxlist[i]?.region?.length; j++) {
            olddata[i].region[j].check = false;
            for (let c = 0; c < olddata[i]?.region[j]?.station?.length; c++) {
              olddata[i].region[j].station[c].stationid = false;
            }
          }
        }
      }

      for (let i = 0; i < alldata.length; i++) {
        let finddataa = leftbarcheckboxlist.findIndex(
          data => data.networkid == alldata[i].id,
        );
        if (finddataa < 0) {
          olddata.push({
            networkid: alldata[i].id,
            check: true,
          });
        }
      }
    }


    dispatch(setleftbarcheckboxlist(olddata));
    // *****************************

    //   for(let i=0;i<alldata.length;i++){
    // const finddataa=networkregions.findIndex((data:any)=> data.networkid == alldata[i].id)

    // const old = deepcopy(leftbarcheckboxlist);
    // if(networkselectedlist.indexOf(alldata[i].id)>-1){

    //   const findd=old.findIndex((data:any)=> data.networkid == alldata[i].id)

    //   if(findd > -1){
    //   //   console.log(alldata[i].name,'name');
    //   //   const old = deepcopy(leftbarcheckboxlist);
    //   //   console.log(old,'old');

    //   //  const old2=deepcopy(leftbarcheckboxlist[findd].region)
    //   //  console.log(old2,'old2');
    // //     old2.push(networkregions[finddataa].regions.map((data:any)=> ({regionid:data.id,station:[]})))
    // //     old[findd]={networkid:alldata[i].id, region:old2}
    // //  dispatch(setleftbarcheckboxlist(old))
    //   }else{
    //     console.log(alldata[i].name,'name');
    //     // console.log(2);

    //          console.log(old,'old');
    //          console.log(networkregions[finddataa],'networkregions');
    //   old.push({networkid:alldata[i].id, region:networkregions[finddataa].regions.map((data:any)=> ({regionid:data.id,station:[]}))})

    //   }

    // }
    //    dispatch(setleftbarcheckboxlist(old))
    //   }

    //   const old = deepcopy(leftbarNetworkcheckboxlist);
    //   if (e) {

    //     const newdata = [...old, ...(list?.data?.map((data: any) => data.id) || [])];
    //     dispatch(
    //       setleftbarNetworkcheckboxlist(newdata),
    //     );
    //   } else {
    //     dispatch(setleftbarNetworkcheckboxlist([]));
    //   }

    // console.log('💠', old);
  };

  const onclicknetworkcheckbox = async (id: string, e: boolean) => {
    let old = deepcopy(leftbarcheckboxlist);
    const finddata = old.findIndex((data: rtuleftbar) => data.networkid == id);

    if (e) {
      const getallregions=await $Get(`otdr/region/network/${id}`)
   
      if (finddata > -1) {
      
        old[finddata].check = true;
        for (let i = 0; i < old[finddata]?.region?.length; i++) {
          old[finddata].region[i].check = true;
          for (let j = 0; j < old[finddata]?.region[i]?.station?.length; j++) {
            old[finddata].region[i].station[j].check = true;
          }
        }
        if(getallregions.status == 200){
          const all= await getallregions.json()
          old[finddata].Length = all.length;
        }else{
        }
      } else {
    
        if(getallregions.status == 200){
          const all= await getallregions.json()
          old.push({networkid: id, check: true,Length:all.length});
        }else{
        }
      }
    } else {
      if (finddata > -1) {
        old[finddata].check = false;
        old[finddata].Length = 0;
        for (let i = 0; i < old[finddata]?.region?.length; i++) {
          old[finddata].region[i].check = false;
          for (let j = 0; j < old[finddata]?.region[i]?.station?.length; j++) {
            old[finddata].region[i].station[j].check = false;
          }
        }
      } else {
      
        old.push({networkid: id, check: false,Length:0});
      }
    }
    
    // if(e){
    //   const getallregions=await $Get(`otdr/region/network/${id}`)
    //   if(getallregions.status == 200){
    //     const all= await getallregions.json()
    //     console.log(all,'all');
    //     const oldleftbarcheckboxlist=deepcopy(leftbarcheckboxlist)
    //     const findnetworkincjecked=leftbarcheckboxlist.findIndex((data)=> data.networkid == id)
    //     if(findnetworkincjecked <0){
    //        oldleftbarcheckboxlist.push({Length:all.length,networkid:id,check:false})
    //       dispatch(setleftbarcheckboxlist(oldleftbarcheckboxlist))
    //     }
    //   }else{
  
    //   }
    // }else{

    // }
    dispatch(setleftbarcheckboxlist(old));
  
  };




  const onclickregioncheckbox = (
    regionid: string,
    networkid: string,
    e: boolean,
  ) => {
    let old = deepcopy(leftbarcheckboxlist);
    const finddata = leftbarcheckboxlist.findIndex(
      (data: rtuleftbar) => data.networkid == networkid,
    );

    if (finddata > -1) {
      
      const finddata2 = old[finddata]?.region?.findIndex(
        (data: regiontype) => data.regionid == regionid,
      );

      if (finddata2 > -1) {
        old[finddata].region[finddata2].check = e;
        for (
          let i = 0;
          i < old[finddata]?.region[finddata2]?.station?.length;
          i++
        ) {
          old[finddata].region[finddata2].station[i].check = e;
        }
      } else {
        old[finddata] = {
          networkid: networkid,
          check: old[finddata].check,
          region:
            old[finddata]?.region && Array.isArray(old[finddata].region)
              ? [...old[finddata].region, {check: e, regionid: regionid}]
              : [{check: e, regionid: regionid}],
        };
      }
    } else {
      old.push({
        networkid: networkid,
        check: false,
        region: [{regionid: regionid, check: e}],
      });
    }
    if(e){

      old[finddata].Length=leftbarcheckboxlist[finddata].Length+1
      const findnetworlregion=networkregions.find((data) => data.networkid == networkid)
      if(findnetworlregion?.regions.length == leftbarcheckboxlist[finddata].Length+1){
        old[finddata].check=true;
      }
    }else{

      // old[finddata].check=false;
      old[finddata].Length=leftbarcheckboxlist[finddata].Length-1
      if(old[finddata].Length == 0){
        old[finddata].check=false;
      }
    }
    dispatch(setleftbarcheckboxlist(old));
  };




  const onclickchecboxstation = async (
    e: boolean,
    id: string,
    regionid: string,
    networkid: string,
  ) => {
    let old: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
    const finddata = old.findIndex(data => data.networkid == networkid);
      const finddata2 = old[finddata]?.region?.findIndex(
        data => data.regionid == regionid,
      );
      if (finddata2 > -1) {
        const finddata3 = old[finddata]?.region[finddata2]?.station?.findIndex(
          data => data.stationid == id,
        );
        if (finddata3 > -1) {
          old[finddata].region[finddata2].station[finddata3].check = e;
        } else {
          old[finddata].region[finddata2] = {
            check: old[finddata].region[finddata2].check,
            Length:old[finddata].region[finddata2].Length,
            regionid: regionid,
            station:
              old[finddata]?.region[finddata2].station &&
              Array.isArray(old[finddata].region[finddata2].station)
                ? [
                    ...old[finddata].region[finddata2].station,
                    {check: e, stationid: id},
                  ]
                : [{check: e, stationid: id}],
          };
        }
      } else {
        old[finddata].region = [
          {
            Length:0,
            regionid: regionid,
            check: false,
            station: [{check: e, stationid: id,}],
          },
        ];
      }

    dispatch(setleftbarcheckboxlist(old));
    // -----------------------------------------------
    let oldleftbarStationcheckboxlist = deepcopy(leftbarStationcheckboxlist);
    let findstatininstationrtu = leftbarStationcheckboxlist.findIndex(
      data => data.stationid == id,
    );
    if (e) {
      const dataa = await $GET(`otdr/station/${id}/rtus`);
      if (findstatininstationrtu > -1) {
        oldleftbarStationcheckboxlist[findstatininstationrtu] = {
          length: oldleftbarStationcheckboxlist.length,
          stationid: id,
          rtues: dataa.map((data: {id: string; name: string}) => data.id),
        };
      } else {
        oldleftbarStationcheckboxlist.push({
          length: oldleftbarStationcheckboxlist.length,
          stationid: id,
          rtues: dataa.map((data: {id: string; name: string}) => data.id),
        });
      }

      dispatch(setleftbarStationcheckboxlist(oldleftbarStationcheckboxlist));
    } else {
    }
  };

  const onclickstation = async (id: string) => {
    setStationid(id);
    const dataa = await $GET(`otdr/station/${id}/rtus`);
     console.log(dataa, 'ppp');

    const findstation = stationsrtu.findIndex(data => data.stationid == id);
    if (findstation < 0 && dataa.length > 0) {
      let old = deepcopy(stationsrtu);
      console.log(old,'😛');
      
      old.push({stationid: id, rtues: dataa});
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

  console.log(leftbarcheckboxlist, '💩ii');
  // console.log(leftbarStationcheckboxlist, 'leftbarStationcheckboxlist');

  const ondeletenetworkrtu = async (id: string) => {

    let oldstationrtu = deepcopy(stationsrtu);
    let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
    let findnetworkindex = oldleftbarcheckboxlist.findIndex(
      data => data.networkid == id,
    );

    if (
      findnetworkindex < 0 ||
      oldleftbarcheckboxlist[findnetworkindex].Length < networkregions!.find(data => data.networkid == id)!.regions?.length
    ) {

      try {
        const getnetworlrtues = await $Get(`otdr/rtu?network_id=${id}`);
        console.log(await getnetworlrtues.json(),'😵‍💫');
        
        if (getnetworlrtues.status == 200) {
          const networlrtues = await getnetworlrtues.json();
          if (networlrtues.length > 0) {
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
            } else {
            }
          }
          // console.log(networlrtues, 'mjj');
        } else {
        }
        // console.log(getnetworlrtues);
      } catch (error) {}
    } else {
      for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
        if (oldleftbarcheckboxlist[i].check) {
          try {
            const getnetworlrtues = await $Get(
              `otdr/rtu?network_id=${oldleftbarcheckboxlist[i].networkid}`,
            );
       
            
            if (getnetworlrtues.status == 200) {
              const networlrtues = await getnetworlrtues.json();
       
              const deleteNetworkRtues = await $Delete(
                `otdr/rtu/batch_delete`,
                networlrtues?.map((data: any) => data.id),
              );
              if (deleteNetworkRtues.status == 201) {
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
              } else {
              }
            } else {
            }
          } catch (error) {}
        }
      }
      let findnetworkindex = oldleftbarcheckboxlist.findIndex(
        data => data.check == true,
      );
    }
  };

  const onclickdeleteregion = async (regionid: string, netWorkid: string) => {
 
    let oldstationrtu = deepcopy(stationsrtu);
    let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
    const findregiondata = findNetwork(netWorkid)?.region?.find(
      (data: any) => data.regionid == regionid,
    );

   
    if (!findregiondata || findregiondata?.check == false) {
      try {
        const getregionrtues = await $Get(`otdr/rtu?region_id=${regionid}`);

        if (getregionrtues.status == 200) {
          const regionrtues = await getregionrtues.json();
          console.log(regionrtues, 'oopppp');

          if (regionrtues.length > 0) {
            const deleteregionRtues = await $Delete(
              `otdr/rtu/batch_delete`,
              regionrtues?.map((data: any) => data.id),
            );
            console.log(deleteregionRtues, 'deleteregionRtues');
            if (deleteregionRtues.status == 201) {
              console.log('hhhhhhhhhhhh');

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
            } else {
            }
          }
        }
      } catch (error) {}
    } else {
      for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
        for (let j = 0; j < oldleftbarcheckboxlist[i].region.length; j++) {
          if (oldleftbarcheckboxlist[i].region[j].check) {
            try {
              const getregionrtues = await $Get(
                `otdr/rtu?region_id=${regionid}`,
              );
              if (getregionrtues.status == 200) {
                const regionrtues = await getregionrtues.json();
                if (regionrtues.length > 0) {
                  const deleteregionRtues = await $Delete(
                    `otdr/rtu/batch_delete`,
                    [regionrtues?.map((data: any) => data.id)],
                  );
                  if (deleteregionRtues.status == 200) {
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
                  } else {
                  }
                }
              }
            } catch (error) {}
          }
        }
      }
    }
  };

  const ondeleteStaionrtu = async (
    stationid: string,
    regionId: string,
    networkId: string,
  ) => {
    let oldstationrtu = deepcopy(stationsrtu);
    let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
    const finstation = findStation(networkId, regionId, stationid);
    if (!finstation || finstation?.check == false) {
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
            } else {
            }
          }
        }
      } catch (error) {}
    } else {
      for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
        for (let j = 0; j < oldleftbarcheckboxlist[i].region.length; j++) {
          for (
            let c = 0;
            c < oldleftbarcheckboxlist[i]?.region[j]?.station.length;
            c++
          ) {
            if (oldleftbarcheckboxlist[i].region[j].station[c].check) {
              try {
                const getstationrtues = await $Get(
                  `otdr/station/${oldleftbarcheckboxlist[i].region[j].station[c].stationid}/rtus`,
                );
                if (getstationrtues.status == 200) {
                  const stationallrtues = await getstationrtues.json();
                  if (stationallrtues.length > 0) {
                    const deletestationRtues = await $Delete(
                      `otdr/rtu/batch_delete`,
                      [stationallrtues?.map((data: any) => data.id)],
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
                    } else {
                    }
                  }
                }
              } catch (error) {}
            }
          }
        }
      }
    }
  };

  const Itembtn = ({
    name,
    id,
    classname,
    onclick = () => {},
    canAdd = false,
  }: Itembtntype) => {
  
    let findnetworkregions = networkregions.find(data => data.networkid == id);
    let findnetworkregionincheck = leftbarcheckboxlist.find(
      data => data.networkid == id,
    );

    
    let compairinlist =
      findnetworkregions &&
      findnetworkregionincheck && (findnetworkregionincheck.Length == 0?false:
      findnetworkregions.regions?.length >
        findnetworkregionincheck.Length
        ? true
        : false)
        // console.log(compairinlist,'yyy');
        
    return (
      <div
        className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        {compairinlist ? (
          <button
            onClick={() => onclicknetworkcheckbox(id, true)}
            className={` border-[#000000 mr-[4px] mt-[5px] h-[20px] w-[20px] border-[1px] bg-[#FFFFFF]`}>
            -
          </button>
        ) : (
          <Checkbox
            checkstatus={
              leftbarcheckboxlist.find(data => data.networkid == id)?.check
                ? true
                : false
            }
            onclick={(e: boolean) => onclicknetworkcheckbox(id, e)}
            iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
            classname={
              'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
            }
          />
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

        <Checkbox
          checkstatus={
           false
          }
          // leftbarcheckboxlist
          // .find(data => data.networkid == netWorkid)
          // ?.region?.findIndex(data => data.regionid == id) > -1
          // ? leftbarcheckboxlist
          //     .find(data => data.networkid == netWorkid)
          //     ?.region?.find(data => data.regionid == id)?.check
          // : leftbarcheckboxlist?.find(data => data.networkid == netWorkid)
          //     ?.check
          onclick={(e: boolean) => onclickregioncheckbox(id, netWorkid, e)}
          iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
          classname={
            'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
          }
        />
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
    regionid,
    networkid,

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
        <Checkbox
          checkstatus={
            false
          }

          // leftbarcheckboxlist
          // .find(data => data.networkid == networkid)
          // ?.region?.find(data => data.regionid == regionid)
          // ?.station?.findIndex(data => data.stationid == id) > -1
          // ? leftbarcheckboxlist
          //     .find(data => data.networkid == networkid)
          //     ?.region?.find(data => data.regionid == regionid)
          //     ?.station?.find(data => data.stationid == id)?.check
          // : leftbarcheckboxlist
          //     .find(data => data.networkid == networkid)
          //     ?.region?.find(data => data.regionid == regionid)?.check ||
          //   leftbarcheckboxlist?.find(data => data.networkid == networkid)
          //     ?.check

          onclick={(e: boolean) =>
            onclickchecboxstation(e, id, regionid, networkid)
          }
          iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
          classname={
            'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
          }
        />
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
            onClick={() => ondeleteStaionrtu(id, regionid, networkid)}
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

  const networklist = list?.data || [];
   console.log(networklist, '➡️trtrtrtrff');

  const regionrklist = regions?.data || [];

  const onclicknetwork = async(id: string) => {
    request('regionList', {params: {network_id: id}});

    const getallregions=await $Get(`otdr/region/network/${id}`)

    
    if(getallregions.status == 200){
      const all= await getallregions.json()
      // console.log(all,'all');
      const oldleftbarcheckboxlist=deepcopy(leftbarcheckboxlist)
      const findnetworkincjecked=leftbarcheckboxlist.findIndex((data)=> data.networkid == id)
      if(findnetworkincjecked <0){
         oldleftbarcheckboxlist.push({Length:0,networkid:id,check:false})
        dispatch(setleftbarcheckboxlist(oldleftbarcheckboxlist))
      }
    //  console.log(regions?.data?.length,'uuu');
    }else{

    }


   
;
  };

  const onclickregion = async (id: string,networkid:string) => {

    let old = deepcopy(regionstations);
    const allstation = await $Get(`otdr/region/${id}/stations`);
    if(allstation.status === 200){
      let dataa=await allstation.json()
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
      // console.log(finddata, 'finddatafinddatafinddata');
      const maindata = regions?.data || [];

      let allregionsid: any = [];
      if (maindata.length > 0 && finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        const old = JSON.parse(JSON.stringify(networkregions));
        old.push({
          networkid: regionrklist[0]?.network_id,
          regions: allregionsid,
        });
        dispatch(setNetworkregions(old));
      }
    } else {
      setMount(true);
    }
  }, [regions]);

  const ondeletesinglertu = async (rtuid: string, stationid: string) => {
    const deletedata = await $DELETE(`otdr/rtu/${rtuid}`);
    let old = deepcopy(stationsrtu);
    const finddataindex = old.findIndex(
      (data: any) => data.stationid == stationid,
    );
    const newrtu = old[finddataindex].rtues.filter(
      (data: any) => data.id != rtuid,
    );
    old[finddataindex].rtues = newrtu;
    dispatch(setStationsrtu(old));
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
          <Checkbox
            checkstatus={checkallnetwork}
            onclick={e => onclickmiannetworkcheckbox(e)}
            iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
            classname={
              'w-[20px] h-[20px] mr-[4px]  border-[1px] border-[#000000]'
            }
          />
          <button onClick={() => setOpenall(!openall)}>
            <span>Networks</span>
          </button>
          <IoTrashOutline
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        </div>
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
                        ?.regions.map((dat: any, index: number) => {
                          return (
                            <div key={index} className="w-full">
                              <div className="flex w-full flex-row items-center">
                                <ItembtnRegion
                                  onclick={() => {
                                    setRegionId(dat.id);
                                    onclickregion(dat.id,data.id);
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
                                        let findd = regionstations.find(
                                          dataa => dataa.regionid == datt.id,
                                        )?.stations;
                                        // console.log(findd,'🤠');
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
                                                regionid={dat.id}
                                                networkid={data.id}
                                                onclick={() => {
                                                  setStationid(datt.id),
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
                                                            onDelete={() =>
                                                              ondeletesinglertu(
                                                                dataaa.id,
                                                                datt.id,
                                                              )
                                                            }
                                                            enabelcheck={true}
                                                            className="w-[200px]"
                                                            name={dataaa.name}
                                                            to={dataaa.id}
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


// *********************************************************************
// *********************************************************************
// import {FC, useEffect, useState} from 'react';
// import {BsPlusLg} from 'react-icons/bs';
// import {useNavigate, useSearchParams} from 'react-router-dom';
// import Checkbox from '~/components/checkbox/checkbox';
// import {SidebarItem, TextInput} from '~/components';
// import {useHttpRequest} from '~/hooks';
// import {SidebarLayout} from '~/layout';
// import {$DELETE, $Delete, $GET, $Get} from '~/util/requestapi';
// import {useDispatch, useSelector} from 'react-redux';
// import {
//   rtuleftbar,
//   allnetworkregionstype,
//   regiontype,
//   allstationsrtutype,
//   stationtype,
//   allregionstationstype,
//   initialStatetype,
//   statustype,
//   allLeftbartype,
// } from './../../../store/slices/rtu';
// import {deepcopy} from './../../../util/deepcopy';
// import {
//   setNetworkregions,
//   setRegionstations,
//   setStationsrtu,
//   setleftbarNetworkcheckboxlist,
//   setleftbarRegioncheckboxlist,
//   setleftbarStationcheckboxlist,
//   setleftbarcheckboxlist,
//   setallLeftbar,
// } from './../../../store/slices/rtu';
// import {IoTrashOutline} from 'react-icons/io5';
// import {setAllcheckednetwork} from '~/store/slices/opticalroutslice';
// import {RootState} from '~/store';
// import { RegionListType } from '~/types/RegionType';

// type allrtues = [
//   {
//     id: string;
//     name: string;
//     station: {
//       id: string;
//       name: string;
//       network: {
//         id: string;
//         name: string;
//       };
//     };
//     connection: string;
//     last_comm: string;
//     last_successful_comm: string;
//   },
// ];

// type Itembtntype = {
//   name: string;
//   id: string;
//   classname?: string;
//   onclick?: () => void;
//   canAdd?: boolean;
// };
// type Itemstationbtntype = {
//   name: string;
//   id: string;
//   regionid: string;
//   networkid: string;

//   classname?: string;
//   onclick?: () => void;
//   canAdd?: boolean;
// };
// type Itemregionbtntype = {
//   name: string;
//   id: string;
//   classname?: string;
//   onclick?: () => void;
//   canAdd?: boolean;
//   netWorkid: string;
// };

// const RtuLayout: FC = () => {
//   const dispatch = useDispatch();
//   const [change, setChange] = useState(false);
//   const [mount, setMount] = useState(false);
//   const [networkId, setNetworkId] = useState('');
//   const [regionId, setRegionId] = useState('');
//   const [stationid, setStationid] = useState('');
//   const [selectedtabId, setSelectedtabid] = useState('');
//   const navigate = useNavigate();
//   const [checkallnetwork, setChekallnetwork] = useState(false);
//   const {
//     stationsrtu,
//     regionstations,
//     networkregions,
//     leftbarNetworkcheckboxlist,
//     leftbarRegioncheckboxlist,
//     leftbarStationcheckboxlist,
//     leftbarcheckboxlist,
//     allLeftbar,
//   } = useSelector((state: RootState) => state.rtu);

//   const {
//     request,
//     state: {list, deleteRequest, regions, regionStations, stationrtulist},
//   } = useHttpRequest({
//     selector: state => ({
//       list: state.http.networkList,
//       regions: state.http.regionList,
//       deleteRequest: state.http.networkDelete,
//       regionStations: state.http.regionStationList,
//       stationrtulist: state.http.stationrtuList,
//     }),
//     initialRequests: request => {
//       if (list?.httpRequestStatus !== 'success') {
//         request('networkList', undefined);
//       }
//     },
//   });

//   const [openall, setOpenall] = useState(false);
//   const [networkselectedlist, setNetworkselectedlist] = useState<string[]>([]);
//   // ---------- func ----------- func -----------
//   const findNetworkIndex = (id: string) => {
//     return leftbarcheckboxlist.findIndex(data => data.networkid == id);
//   };
//   const findNetwork = (id: string) => {
//     return leftbarcheckboxlist.find(data => data.networkid == id);
//   };

//   const FindNetworkIndex = (id: string) => {
//     return allLeftbar.findIndex(data => data.networkId == id);
//   };
//   const FindNetwork = (id: string) => {
//     return allLeftbar.find(data => data.networkId == id);
//   };
//   const FindNetworkRegion = (Regionid: string,networkid:string) => {
//     return allLeftbar.find(data => data.networkId == networkid)?.Regions?.find((data:any) => data.RegionId == Regionid)
//   }; 
//   const FindNetworkRegionIndex = (Regionid: string,networkid:string) => {
//     return allLeftbar.find(data => data.networkId == networkid)?.Regions?.findIndex((data:any) => data.RegionId == Regionid)
//   }
//   const findStation = (
//     networkId: string,
//     regionId: string,
//     stationId: string,
//   ) => {
//     return leftbarcheckboxlist
//       .find(data => data.networkid == networkId)
//       ?.region?.find(data => data.regionid == regionId)
//       ?.station?.find(data => data.stationid == stationId);
//   };
//   // ***************************
//   const onclickmiannetworkcheckbox = async (e: boolean) => {
//     let alldata = list?.data || [];
 

//     setChekallnetwork(!checkallnetwork);
//     let olddata = deepcopy(leftbarcheckboxlist);
//     if (leftbarcheckboxlist.length == 0) {
//       olddata = alldata.map(data => ({
//         networkid: data.id,
//         check: true,
//       }));
//     } else {
//       if (e) {
//         let dataa = [];

//         for (let i = 0; i < leftbarcheckboxlist.length; i++) {
//           olddata[i].check = true;
//           for (let j = 0; j < leftbarcheckboxlist[i]?.region?.length; j++) {
//             olddata[i].region[j].check = true;
//             for (let c = 0; c < olddata[i]?.region[j]?.station?.length; c++) {
//               olddata[i].region[j].station[c].stationid = true;
//             }
//           }
//         }
//       } else {
//         for (let i = 0; i < leftbarcheckboxlist.length; i++) {
//           olddata[i].check = false;
//           for (let j = 0; j < leftbarcheckboxlist[i]?.region?.length; j++) {
//             olddata[i].region[j].check = false;
//             for (let c = 0; c < olddata[i]?.region[j]?.station?.length; c++) {
//               olddata[i].region[j].station[c].stationid = false;
//             }
//           }
//         }
//       }

//       for (let i = 0; i < alldata.length; i++) {
//         let finddataa = leftbarcheckboxlist.findIndex(
//           data => data.networkid == alldata[i].id,
//         );
//         if (finddataa < 0) {
//           olddata.push({
//             networkid: alldata[i].id,
//             check: true,
//           });
//         }
//       }
//     }

//     dispatch(setleftbarcheckboxlist(olddata));
//   };


// const onclicmain=async()=>{
//   const getallnetworks=await $Get(`otdr/network`)
//   if(getallnetworks.status == 200){
//     const responsedata=await getallnetworks.json()

//     dispatch(setallLeftbar(responsedata.map((data:any) => ({networkId:data.id,name:data.name,Length: 0,
//       Max: 0,
//       check:"false",
//       MainRtues:[],
//       Rtues:[],
//       open:false
//     }))))
//   }
//   // dispatch(setallLeftbar())
// }

//   const onclicknetworkcheckbox = async (id: string, e: boolean) => {
//     let findNetworkindex = FindNetworkIndex(id);
//     // let findnetworkregionindex=FindNetworkRegionIndex()
//     let allleftbarCopy = deepcopy(allLeftbar);

//       if (e) {
//         allleftbarCopy[findNetworkindex].check=statustype.TRUE
//           allleftbarCopy[findNetworkindex].Length =allLeftbar[findNetworkindex].Max;
//           allleftbarCopy[findNetworkindex].Rtues=allLeftbar[findNetworkindex].MainRtues
//           if(allLeftbar[findNetworkindex].Regions){
//             for(let i=0;i<allLeftbar[findNetworkindex].Regions.length;i++){
//               allleftbarCopy[findNetworkindex].Regions[i].check=statustype.TRUE
//               allleftbarCopy[findNetworkindex].Regions[i].Length=allLeftbar[findNetworkindex].Regions[i].Max
//               allleftbarCopy[findNetworkindex].Regions[i].Rtues=allLeftbar[findNetworkindex].Regions[i].MainRtues
//               if(allLeftbar[findNetworkindex].Regions[i].Stations){
//                 allleftbarCopy[findNetworkindex].Regions[i].Stations[i].check=statustype.TRUE
//                 allleftbarCopy[findNetworkindex].Regions[i].Stations[i].Length =allLeftbar[findNetworkindex].Regions[i].Stations[i].Max
//                 allleftbarCopy[findNetworkindex].Regions[i].Stations[i].Rtues=allLeftbar[findNetworkindex].Regions[i].Stations[i].MainRtues
//               }
//             }
//           }
//       } else {
//         allleftbarCopy[findNetworkindex].check=statustype.FALSE
//         allleftbarCopy[findNetworkindex].Length =0;
//         allleftbarCopy[findNetworkindex].Rtues=allLeftbar[findNetworkindex].MainRtues
   
//           for(let i=0;i<allLeftbar[findNetworkindex]?.Regions?.length;i++){
//             allleftbarCopy[findNetworkindex].Regions[i].check=statustype.FALSE
//             allleftbarCopy[findNetworkindex].Regions[i].Length=0
//             allleftbarCopy[findNetworkindex].Regions[i].Rtues=allLeftbar[findNetworkindex].Regions[i].MainRtues
//             if(allLeftbar[findNetworkindex].Regions[i].Stations){
//               allleftbarCopy[findNetworkindex].Regions[i].Stations[i].check=statustype.FALSE
//               allleftbarCopy[findNetworkindex].Regions[i].Stations[i].Length =0
//               allleftbarCopy[findNetworkindex].Regions[i].Stations[i].Rtues=allLeftbar[findNetworkindex].Regions[i].Stations[i].MainRtues
//             }
//           }
        
//       }
  
//     dispatch(setallLeftbar(allleftbarCopy) )
//     // ##########################################################################
//     let old = deepcopy(leftbarcheckboxlist);
//     const finddata = old.findIndex((data: rtuleftbar) => data.networkid == id);

//     if (e) {
//       const getallregions = await $Get(`otdr/region/network/${id}`);

//       if (finddata > -1) {
//         old[finddata].check = true;
//         for (let i = 0; i < old[finddata]?.region?.length; i++) {
//           old[finddata].region[i].check = true;
//           for (let j = 0; j < old[finddata]?.region[i]?.station?.length; j++) {
//             old[finddata].region[i].station[j].check = true;
//           }
//         }
//         if (getallregions.status == 200) {
//           const all = await getallregions.json();
//           old[finddata].Length = all.length;
//         } else {
//         }
//       } else {
//         if (getallregions.status == 200) {
//           const all = await getallregions.json();
//           old.push({networkid: id, check: true, Length: all.length});
//         } else {
//         }
//       }
//     } else {
//       if (finddata > -1) {
//         old[finddata].check = false;
//         old[finddata].Length = 0;
//         for (let i = 0; i < old[finddata]?.region?.length; i++) {
//           old[finddata].region[i].check = false;
//           for (let j = 0; j < old[finddata]?.region[i]?.station?.length; j++) {
//             old[finddata].region[i].station[j].check = false;
//           }
//         }
//       } else {
//         old.push({networkid: id, check: false, Length: 0});
//       }
//     }

//     // if(e){
//     //   const getallregions=await $Get(`otdr/region/network/${id}`)
//     //   if(getallregions.status == 200){
//     //     const all= await getallregions.json()
//     //     console.log(all,'all');
//     //     const oldleftbarcheckboxlist=deepcopy(leftbarcheckboxlist)
//     //     const findnetworkincjecked=leftbarcheckboxlist.findIndex((data)=> data.networkid == id)
//     //     if(findnetworkincjecked <0){
//     //        oldleftbarcheckboxlist.push({Length:all.length,networkid:id,check:false})
//     //       dispatch(setleftbarcheckboxlist(oldleftbarcheckboxlist))
//     //     }
//     //   }else{

//     //   }
//     // }else{

//     // }
//     dispatch(setleftbarcheckboxlist(old));
//   };



//   console.log(allLeftbar,'😘');
//   const onclickregioncheckbox = (
//     regionid: string,
//     networkid: string,
//     e: boolean,
//   ) => {
//     let old = deepcopy(leftbarcheckboxlist);
//     const finddata = leftbarcheckboxlist.findIndex(
//       (data: rtuleftbar) => data.networkid == networkid,
//     );

//     if (finddata > -1) {
//       const finddata2 = old[finddata]?.region?.findIndex(
//         (data: regiontype) => data.regionid == regionid,
//       );

//       if (finddata2 > -1) {
//         old[finddata].region[finddata2].check = e;
//         for (
//           let i = 0;
//           i < old[finddata]?.region[finddata2]?.station?.length;
//           i++
//         ) {
//           old[finddata].region[finddata2].station[i].check = e;
//         }
//       } else {
//         old[finddata] = {
//           networkid: networkid,
//           check: old[finddata].check,
//           region:
//             old[finddata]?.region && Array.isArray(old[finddata].region)
//               ? [...old[finddata].region, {check: e, regionid: regionid}]
//               : [{check: e, regionid: regionid}],
//         };
//       }
//     } else {
//       old.push({
//         networkid: networkid,
//         check: false,
//         region: [{regionid: regionid, check: e}],
//       });
//     }
//     if (e) {
//       old[finddata].Length = leftbarcheckboxlist[finddata].Length + 1;
//       const findnetworlregion = networkregions.find(
//         data => data.networkid == networkid,
//       );
//       if (
//         findnetworlregion?.regions.length ==
//         leftbarcheckboxlist[finddata].Length + 1
//       ) {
//         old[finddata].check = true;
//       }
//     } else {
//       // old[finddata].check=false;
//       old[finddata].Length = leftbarcheckboxlist[finddata].Length - 1;
//       if (old[finddata].Length == 0) {
//         old[finddata].check = false;
//       }
//     }
//     dispatch(setleftbarcheckboxlist(old));
//   };

//   const onclickchecboxstation = async (
//     e: boolean,
//     id: string,
//     regionid: string,
//     networkid: string,
//   ) => {
//     let old: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
//     const finddata = old.findIndex(data => data.networkid == networkid);
//     const finddata2 = old[finddata]?.region?.findIndex(
//       data => data.regionid == regionid,
//     );
//     if (finddata2 > -1) {
//       const finddata3 = old[finddata]?.region[finddata2]?.station?.findIndex(
//         data => data.stationid == id,
//       );
//       if (finddata3 > -1) {
//         old[finddata].region[finddata2].station[finddata3].check = e;
//       } else {
//         old[finddata].region[finddata2] = {
//           check: old[finddata].region[finddata2].check,
//           Length: old[finddata].region[finddata2].Length,
//           regionid: regionid,
//           station:
//             old[finddata]?.region[finddata2].station &&
//             Array.isArray(old[finddata].region[finddata2].station)
//               ? [
//                   ...old[finddata].region[finddata2].station,
//                   {check: e, stationid: id},
//                 ]
//               : [{check: e, stationid: id}],
//         };
//       }
//     } else {
//       old[finddata].region = [
//         {
//           Length: 0,
//           regionid: regionid,
//           check: false,
//           station: [{check: e, stationid: id}],
//         },
//       ];
//     }

//     dispatch(setleftbarcheckboxlist(old));
//     // -----------------------------------------------
//     let oldleftbarStationcheckboxlist = deepcopy(leftbarStationcheckboxlist);
//     let findstatininstationrtu = leftbarStationcheckboxlist.findIndex(
//       data => data.stationid == id,
//     );
//     if (e) {
//       const dataa = await $GET(`otdr/station/${id}/rtus`);
//       if (findstatininstationrtu > -1) {
//         oldleftbarStationcheckboxlist[findstatininstationrtu] = {
//           length: oldleftbarStationcheckboxlist.length,
//           stationid: id,
//           rtues: dataa.map((data: {id: string; name: string}) => data.id),
//         };
//       } else {
//         oldleftbarStationcheckboxlist.push({
//           length: oldleftbarStationcheckboxlist.length,
//           stationid: id,
//           rtues: dataa.map((data: {id: string; name: string}) => data.id),
//         });
//       }

//       dispatch(setleftbarStationcheckboxlist(oldleftbarStationcheckboxlist));
//     } else {
//     }
//   };

//   const onclickstation = async (id: string) => {
//     setStationid(id);
//     const dataa = await $GET(`otdr/station/${id}/rtus`);
   

//     const findstation = stationsrtu.findIndex(data => data.stationid == id);
//     if (findstation < 0 && dataa.length > 0) {
//       let old = deepcopy(stationsrtu);
//       old.push({stationid: id, rtues: dataa});
//       dispatch(setStationsrtu(old));
//     }
//     // ------------------------------------
//     let oldleftbarStationcheckboxlist = deepcopy(leftbarStationcheckboxlist);
//     let findstatininstationrtu = leftbarStationcheckboxlist.findIndex(
//       data => data.stationid == id,
//     );
//     if (findstatininstationrtu < 0) {
//       oldleftbarStationcheckboxlist.push({
//         length: oldleftbarStationcheckboxlist.length,
//         stationid: id,
//         rtues: dataa.map((data: {id: string; name: string}) => data.id),
//       });
//       dispatch(setleftbarStationcheckboxlist(oldleftbarStationcheckboxlist));
//     }
//   };




//   const ondeletenetworkrtu = async (id: string) => {
//     let oldstationrtu = deepcopy(stationsrtu);
//     let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
//     let findnetworkindex = oldleftbarcheckboxlist.findIndex(
//       data => data.networkid == id,
//     );

//     if (
//       findnetworkindex < 0 ||
//       oldleftbarcheckboxlist[findnetworkindex].Length <
//         networkregions!.find(data => data.networkid == id)!.regions?.length
//     ) {
//       try {
//         const getnetworlrtues = await $Get(`otdr/rtu?network_id=${id}`);
     

//         if (getnetworlrtues.status == 200) {
//           const networlrtues = await getnetworlrtues.json();
//           if (networlrtues.length > 0) {
//             const deleteNetworkRtues = await $Delete(`otdr/rtu/batch_delete`, [
//               networlrtues?.map((data: any) => data.id),
//             ]);
//             if (deleteNetworkRtues.status == 200) {
//               let alldeletedrtu = deepcopy(
//                 networlrtues?.map((data: any) => data.id),
//               );
//               for (let i = 0; i < stationsrtu.length; i++) {
//                 let result = stationsrtu[i].rtues.filter(
//                   data => !alldeletedrtu.includes(data.id),
//                 );
//                 oldstationrtu[i].rtues = result;
//               }
//               dispatch(setStationsrtu(oldstationrtu));
//             } else {
//             }
//           }
    
//         } else {
//         }
  
//       } catch (error) {}
//     } else {
//       for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
//         if (oldleftbarcheckboxlist[i].check) {
//           try {
//             const getnetworlrtues = await $Get(
//               `otdr/rtu?network_id=${oldleftbarcheckboxlist[i].networkid}`,
//             );

//             if (getnetworlrtues.status == 200) {
//               const networlrtues = await getnetworlrtues.json();

//               const deleteNetworkRtues = await $Delete(
//                 `otdr/rtu/batch_delete`,
//                 networlrtues?.map((data: any) => data.id),
//               );
//               if (deleteNetworkRtues.status == 201) {
//                 let alldeletedrtu = deepcopy(
//                   networlrtues?.map((data: any) => data.id),
//                 );
//                 for (let i = 0; i < stationsrtu.length; i++) {
//                   let result = stationsrtu[i].rtues.filter(
//                     data => !alldeletedrtu.includes(data.id),
//                   );
//                   oldstationrtu[i].rtues = result;
//                 }
//                 dispatch(setStationsrtu(oldstationrtu));
//               } else {
//               }
//             } else {
//             }
//           } catch (error) {}
//         }
//       }
//       let findnetworkindex = oldleftbarcheckboxlist.findIndex(
//         data => data.check == true,
//       );
//     }
//   };

//   const onclickdeleteregion = async (regionid: string, netWorkid: string) => {
//     let oldstationrtu = deepcopy(stationsrtu);
//     let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
//     const findregiondata = findNetwork(netWorkid)?.region?.find(
//       (data: any) => data.regionid == regionid,
//     );

//     if (!findregiondata || findregiondata?.check == false) {

//       try {
//         const getregionrtues = await $Get(`otdr/rtu?region_id=${regionid}`);

//         if (getregionrtues.status == 200) {
//           const regionrtues = await getregionrtues.json();
        

//           if (regionrtues.length > 0) {
//             const deleteregionRtues = await $Delete(
//               `otdr/rtu/batch_delete`,
//               regionrtues?.map((data: any) => data.id),
//             );
       
//             if (deleteregionRtues.status == 201) {
          

//               let alldeletedrtu = deepcopy(
//                 regionrtues?.map((data: any) => data.id),
//               );
//               for (let i = 0; i < stationsrtu.length; i++) {
//                 let result = stationsrtu[i].rtues.filter(
//                   data => !alldeletedrtu.includes(data.id),
//                 );
//                 oldstationrtu[i].rtues = result;
//               }
//               dispatch(setStationsrtu(oldstationrtu));
//             } else {
//             }
//           }
//         }
//       } catch (error) {}
//     } else {
//       for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
//         for (let j = 0; j < oldleftbarcheckboxlist[i].region.length; j++) {
//           if (oldleftbarcheckboxlist[i].region[j].check) {
//             try {
//               const getregionrtues = await $Get(
//                 `otdr/rtu?region_id=${regionid}`,
//               );
//               if (getregionrtues.status == 200) {
//                 const regionrtues = await getregionrtues.json();
//                 if (regionrtues.length > 0) {
//                   const deleteregionRtues = await $Delete(
//                     `otdr/rtu/batch_delete`,
//                     [regionrtues?.map((data: any) => data.id)],
//                   );
//                   if (deleteregionRtues.status == 200) {
//                     let alldeletedrtu = deepcopy(
//                       regionrtues?.map((data: any) => data.id),
//                     );
//                     for (let i = 0; i < stationsrtu.length; i++) {
//                       let result = stationsrtu[i].rtues.filter(
//                         data => !alldeletedrtu.includes(data.id),
//                       );
//                       oldstationrtu[i].rtues = result;
//                     }
//                     dispatch(setStationsrtu(oldstationrtu));
//                   } else {
//                   }
//                 }
//               }
//             } catch (error) {}
//           }
//         }
//       }
//     }
//   };

//   const ondeleteStaionrtu = async (
//     stationid: string,
//     regionId: string,
//     networkId: string,
//   ) => {
//     let oldstationrtu = deepcopy(stationsrtu);
//     let oldleftbarcheckboxlist: rtuleftbar[] = deepcopy(leftbarcheckboxlist);
//     const finstation = findStation(networkId, regionId, stationid);
//     if (!finstation || finstation?.check == false) {
//       try {
//         const getstationrtues = await $Get(`otdr/station/${stationid}/rtus`);

//         if (getstationrtues.status == 200) {
//           const stationallrtues = await getstationrtues.json();

//           if (stationallrtues.length > 0) {
//             const deletestationRtues = await $Delete(
//               `otdr/rtu/batch_delete`,
//               stationallrtues?.map((data: any) => data.id),
//             );

//             if (deletestationRtues.status == 201) {
//               let alldeletedrtu = deepcopy(
//                 stationallrtues?.map((data: any) => data.id),
//               );
//               for (let i = 0; i < stationsrtu.length; i++) {
//                 let result = stationsrtu[i].rtues.filter(
//                   data => !alldeletedrtu.includes(data.id),
//                 );
//                 oldstationrtu[i].rtues = result;
//               }
//               dispatch(setStationsrtu(oldstationrtu));
//             } else {
//             }
//           }
//         }
//       } catch (error) {}
//     } else {
//       for (let i = 0; i < oldleftbarcheckboxlist.length; i++) {
//         for (let j = 0; j < oldleftbarcheckboxlist[i].region.length; j++) {
//           for (
//             let c = 0;
//             c < oldleftbarcheckboxlist[i]?.region[j]?.station.length;
//             c++
//           ) {
//             if (oldleftbarcheckboxlist[i].region[j].station[c].check) {
//               try {
//                 const getstationrtues = await $Get(
//                   `otdr/station/${oldleftbarcheckboxlist[i].region[j].station[c].stationid}/rtus`,
//                 );
//                 if (getstationrtues.status == 200) {
//                   const stationallrtues = await getstationrtues.json();
//                   if (stationallrtues.length > 0) {
//                     const deletestationRtues = await $Delete(
//                       `otdr/rtu/batch_delete`,
//                       [stationallrtues?.map((data: any) => data.id)],
//                     );
//                     if (deletestationRtues.status == 201) {
//                       let alldeletedrtu = deepcopy(
//                         stationallrtues?.map((data: any) => data.id),
//                       );
//                       for (let i = 0; i < stationsrtu.length; i++) {
//                         let result = stationsrtu[i].rtues.filter(
//                           data => !alldeletedrtu.includes(data.id),
//                         );
//                         oldstationrtu[i].rtues = result;
//                       }
//                       dispatch(setStationsrtu(oldstationrtu));
//                     } else {
//                     }
//                   }
//                 }
//               } catch (error) {}
//             }
//           }
//         }
//       }
//     }
//   };

//   const Itembtn = ({
//     name,
//     id,
//     classname,
//     onclick = () => {},
//     canAdd = false,
//   }: Itembtntype) => {
//     let findnetworkregions = networkregions.find(data => data.networkid == id);
//     let findnetworkregionincheck = leftbarcheckboxlist.find(
//       data => data.networkid == id,
//     );

//     let compairinlist =
//       findnetworkregions &&
//       findnetworkregionincheck &&
//       (findnetworkregionincheck.Length == 0
//         ? false
//         : findnetworkregions.regions?.length > findnetworkregionincheck.Length
//         ? true
//         : false);


//     return (
//       <div
//         className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
//         <span className="mt-[-6px] text-[12px] ">...</span>
//         {networkselectedlist.indexOf(id) > -1 ? (
//           <span className="mx-[3px] font-light">-</span>
//         ) : (
//           <span className="mx-[3px] mt-[-2px] font-light">+</span>
//         )}

//         {FindNetwork(id)?.check == "none"? (
//           <button
//             onClick={() => onclicknetworkcheckbox(id, true)}
//             className={` border-[#000000 mr-[4px] mt-[5px] h-[20px] w-[20px] border-[1px] bg-[#FFFFFF]`}>
//             -
//           </button>
//         ) : (
//           <Checkbox
//             checkstatus={!FindNetwork(id)?false:FindNetwork(id)?.check  == "false"?false:true}
          
            
//             onclick={(e: boolean) => onclicknetworkcheckbox(id, e)}
//             iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
//             classname={
//               'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
//             }
//           />
//         )}

//         <button
//           onClick={() => {
//             setSelectedtabid(id);
//             opennetworkopticallist(id), onclick();
//           }}
//           className={`${
//             networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
//           }`}>
//           {name}
//         </button>
//         {canAdd ? (
//           <>
//             {networkselectedlist.indexOf(id) > -1 ? (
//               <BsPlusLg
//                 onClick={() => navigate(`create/${id}`)}
//                 color="#18C047"
//                 className="ml-[10px] cursor-pointer"
//               />
//             ) : null}
//           </>
//         ) : (
//           false
//         )}

//         {selectedtabId == id ? (
//           <IoTrashOutline
//             onClick={() => ondeletenetworkrtu(id)}
//             color="#FF0000"
//             size={24}
//             className="ml-[20px] cursor-pointer"
//           />
//         ) : null}
//       </div>
//     );
//   };

//   const ItembtnRegion = ({
//     name,
//     id,
//     classname,
//     netWorkid,
//     onclick = () => {},
//     canAdd = false,
//   }: Itemregionbtntype) => {
//     return (
//       <div
//         className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
//         <span className="mt-[-6px] text-[12px] ">...</span>
//         {networkselectedlist.indexOf(id) > -1 ? (
//           <span className="mx-[3px] font-light">-</span>
//         ) : (
//           <span className="mx-[3px] mt-[-2px] font-light">+</span>
//         )}

//         <Checkbox
//           checkstatus={
//             leftbarcheckboxlist
//               .find(data => data.networkid == netWorkid)
//               ?.region?.findIndex(data => data.regionid == id) > -1
//               ? leftbarcheckboxlist
//                   .find(data => data.networkid == netWorkid)
//                   ?.region?.find(data => data.regionid == id)?.check
//               : leftbarcheckboxlist?.find(data => data.networkid == netWorkid)
//                   ?.check
//           }
//           onclick={(e: boolean) => onclickregioncheckbox(id, netWorkid, e)}
//           iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
//           classname={
//             'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
//           }
//         />
//         <button
//           onClick={() => {
//             setSelectedtabid(id);
//             opennetworkopticallist(id), onclick();
//           }}
//           className={`${
//             networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
//           } w-[120px] text-left`}>
//           {name}
//         </button>
//         {canAdd ? (
//           <>
//             {networkselectedlist.indexOf(id) > -1 ? (
//               <BsPlusLg
//                 onClick={() => navigate(`create/${id}`)}
//                 color="#18C047"
//                 className="ml-[10px] cursor-pointer"
//               />
//             ) : null}
//           </>
//         ) : (
//           false
//         )}
//         {selectedtabId == id ? (
//           <IoTrashOutline
//             onClick={() => onclickdeleteregion(id, netWorkid)}
//             color="#FF0000"
//             size={24}
//             className="ml-[20px] cursor-pointer"
//           />
//         ) : null}
//       </div>
//     );
//   };

//   const ItembtnStation = ({
//     name,
//     id,
//     regionid,
//     networkid,

//     classname,
//     onclick = () => {},
//     canAdd = false,
//   }: Itemstationbtntype) => {
//     return (
//       <div
//         className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
//         <span className="mt-[-6px] text-[12px] ">...</span>
//         {networkselectedlist.indexOf(id) > -1 ? (
//           <span className="mx-[3px] font-light">-</span>
//         ) : (
//           <span className="mx-[3px] mt-[-2px] font-light">+</span>
//         )}
//         <Checkbox
//           checkstatus={
//             leftbarcheckboxlist
//               .find(data => data.networkid == networkid)
//               ?.region?.find(data => data.regionid == regionid)
//               ?.station?.findIndex(data => data.stationid == id) > -1
//               ? leftbarcheckboxlist
//                   .find(data => data.networkid == networkid)
//                   ?.region?.find(data => data.regionid == regionid)
//                   ?.station?.find(data => data.stationid == id)?.check
//               : leftbarcheckboxlist
//                   .find(data => data.networkid == networkid)
//                   ?.region?.find(data => data.regionid == regionid)?.check ||
//                 leftbarcheckboxlist?.find(data => data.networkid == networkid)
//                   ?.check
//           }
//           onclick={(e: boolean) =>
//             onclickchecboxstation(e, id, regionid, networkid)
//           }
//           iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
//           classname={
//             'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
//           }
//         />
//         <button
//           onClick={() => {
//             setSelectedtabid(id);
//             opennetworkopticallist(id), onclick();
//           }}
//           className={`${
//             networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
//           } w-[120px] text-left`}>
//           {name}
//         </button>
//         {canAdd ? (
//           <>
//             {networkselectedlist.indexOf(id) > -1 ? (
//               <BsPlusLg
//                 onClick={() => navigate(`create/${id}`)}
//                 color="#18C047"
//                 className="ml-[10px] cursor-pointer"
//               />
//             ) : null}
//           </>
//         ) : (
//           false
//         )}
//         {selectedtabId == id ? (
//           <IoTrashOutline
//             onClick={() => ondeleteStaionrtu(id, regionid, networkid)}
//             color="#FF0000"
//             size={24}
//             className="ml-[20px] cursor-pointer"
//           />
//         ) : null}
//       </div>
//     );
//   };

//   const opennetworkopticallist = async(id: string) => {
//     const allleftbarCopy:allLeftbartype[]=deepcopy(allLeftbar)
//     const findnetwork=FindNetworkIndex(id)
//     if(!allleftbarCopy[findnetwork].Regions){
//       const getNetworkregion=await $Get(`otdr/region/network/${id}`)
//       if(getNetworkregion.status == 200){
//         const responsedata:RegionListType[]=await getNetworkregion.json()
//         console.log(responsedata,'🥰');
        
//         allleftbarCopy[findnetwork].Regions=responsedata.map((data)=> ({id:data.id,name:data.name,open:true,check:allleftbarCopy[findnetwork].check,Rtues:[],MainRtues:[],Length:0,Max:0,Stations:[]}))
//       }
//       // allleftbarCopy[findnetwork].Regions=
//     }
//     // const findnetwork = networkselectedlist.findIndex(data => data == id);
//     // if (findnetwork > -1) {
//     //   let old = [...networkselectedlist];
//     //   old.splice(findnetwork, 1);
//     //   setNetworkselectedlist(old);
//     // } else {
//     //   setNetworkselectedlist(prev => [...prev, id]);
//     // }
//   };

//   const networklist = list?.data || [];


//   const regionrklist = regions?.data || [];

//   const onclicknetwork = async (id: string) => {
//     const getallregions = await $Get(`otdr/region/network/${id}`);
//     if (getallregions.status == 200) {
//       const all = await getallregions.json();
//       console.log(all,'😛');
      
//     }
//     // #########################################################
//     // request('regionList', {params: {network_id: id}});

//     // const getallregions = await $Get(`otdr/region/network/${id}`);

//     // if (getallregions.status == 200) {
//     //   const all = await getallregions.json();
    
//     //   const oldleftbarcheckboxlist = deepcopy(leftbarcheckboxlist);
//     //   const findnetworkincjecked = leftbarcheckboxlist.findIndex(
//     //     data => data.networkid == id,
//     //   );
//     //   if (findnetworkincjecked < 0) {
//     //     oldleftbarcheckboxlist.push({Length: 0, networkid: id, check: false});
//     //     dispatch(setleftbarcheckboxlist(oldleftbarcheckboxlist));
//     //   }

//     // } else {
//     // }
//   };

//   const onclickregion = async (id: string, networkid: string) => {
//     let old = deepcopy(regionstations);
//     const allstation = await $Get(`otdr/region/${id}/stations`);
//     if (allstation.status === 200) {
//       let dataa = await allstation.json();
//       const finddata = regionstations.findIndex(data => data.regionid == id);
//       let allregionsid: any = [];
//       if (dataa.length > 0 && finddata < 0) {
//         for (let i = 0; i < dataa?.length; i++) {
//           allregionsid.push({id: dataa[i].id, name: dataa[i].name});
//         }
//         old.push({regionid: id, stations: allregionsid});
//       }

//       dispatch(setRegionstations(old));
//     }
//   };

//   useEffect(() => {
//     if (mount) {
//       const finddata = networkregions.filter(
//         data => data.networkid == networkId,
//       );
//       const maindata = regions?.data || [];

//       let allregionsid: any = [];
//       if (maindata.length > 0 && finddata.length == 0) {
//         for (let i = 0; i < maindata?.length; i++) {
//           allregionsid.push({id: maindata[i].id, name: maindata[i].name});
//         }
//         const old = JSON.parse(JSON.stringify(networkregions));
//         old.push({
//           networkid: regionrklist[0]?.network_id,
//           regions: allregionsid,
//         });
//         dispatch(setNetworkregions(old));
//       }
//     } else {
//       setMount(true);
//     }
//   }, [regions]);

//   const ondeletesinglertu = async (rtuid: string, stationid: string) => {
//     const deletedata = await $DELETE(`otdr/rtu/${rtuid}`);
//     let old = deepcopy(stationsrtu);
//     const finddataindex = old.findIndex(
//       (data: any) => data.stationid == stationid,
//     );
//     const newrtu = old[finddataindex].rtues.filter(
//       (data: any) => data.id != rtuid,
//     );
//     old[finddataindex].rtues = newrtu;
//     dispatch(setStationsrtu(old));
//   };

//   // ############################################################
//   return (
//     <SidebarLayout createTitle="">
//       <div className="flex flex-row items-center">
//         <label htmlFor="search" className="mr-2">
//           Search
//         </label>

//         <TextInput
//           id="search"
//           className="mr-10 w-full"
//           onChange={event => {}}
//         />
//       </div>
//       <div className="mt-[30px] flex w-full flex-col">
//         <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
//           {openall ? (
//             <span className="ml-[-4px] mr-[5px] font-light">-</span>
//           ) : (
//             <span className="mb-[5px] ml-[-6px] mr-[5px] font-light">+</span>
//           )}
//           <Checkbox
//             checkstatus={checkallnetwork}
//             onclick={e => onclickmiannetworkcheckbox(e)}
//             iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
//             classname={
//               'w-[20px] h-[20px] mr-[4px]  border-[1px] border-[#000000]'
//             }
//           />
//           <button onClick={() => {setOpenall(!openall),onclicmain()}}>
//             <span>Networks</span>
//           </button>
//           <IoTrashOutline
//             color="#FF0000"
//             size={24}
//             className="ml-[20px] cursor-pointer"
//           />
//         </div>
//         {openall ? (
//           <div
//             className={` mt-[-10px] w-full  border-l-[1px] border-dotted border-[#000000]`}>
//             {allLeftbar.map((data, index) => (
//               <div key={index} className="flex flex-col">
//                 <Itembtn
//                   onclick={() => {
//                     onclicknetwork(data.networkId), () => setNetworkId(data.networkId);
//                   }}
//                   id={data.networkId}
//                   name={data.name}
//                 />

//                 <div className=" relative ml-[17px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
//                   {networkselectedlist.indexOf(data.networkId) > -1 ? (
//                     <div className="absolute left-[-1px] top-[-23px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
//                   ) : null}

//                   {index == networklist.length - 1 ? (
//                     <div
//                       className={`absolute left-[-1px] ${
//                         networkselectedlist.indexOf(data.networkId) > -1
//                           ? 'top-[-29px]'
//                           : 'top-[-29px]'
//                       }  left-[-20px] z-10 h-[calc(100%+100px)] w-[5px] bg-[#E7EFF7]`}></div>
//                   ) : null}

//                   <div
//                     className={`absolute left-[-1px] ${
//                       networkselectedlist.indexOf(data.networkId) > -1
//                         ? 'bottom-[-11px]'
//                         : 'bottom-[-16px]'
//                     }  z-10 h-[40px] w-[5px] bg-[#E7EFF7]`}></div>
//                   {networkselectedlist.indexOf(data.networkId) > -1 ? (
//                     <>
//                       {networkregions
//                         .find(dataa => dataa.networkid == data.networkId)
//                         ?.regions.map((dat: any, index: number) => {
//                           return (
//                             <div key={index} className="w-full">
//                               <div className="flex w-full flex-row items-center">
//                                 <ItembtnRegion
//                                   onclick={() => {
//                                     setRegionId(dat.id);
//                                     onclickregion(dat.id, data.networkId);
//                                   }}
//                                   netWorkid={data.networkId}
//                                   id={dat.id}
//                                   name={dat.name}
//                                 />
//                               </div>
//                               {networkselectedlist.indexOf(dat.id) > -1 ? (
//                                 <div className="relative w-full">
//                                   <div className="absolute left-[16px] top-[-28.5px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
//                                   <div className="absolute bottom-[-11px]  left-[14px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
//                                   {networkregions.find(
//                                     dataa => dataa.networkid == data.networkId,
//                                   )?.regions.length ==
//                                   index + 1 ? (
//                                     <div
//                                       className={`absolute left-[-1px] ${
//                                         networkselectedlist.indexOf(dat.id) > -1
//                                           ? 'top-[-31px]'
//                                           : 'top-[-29px]'
//                                       }  left-[-2px] z-30 h-full w-[5px] bg-[#E7EFF7]`}></div>
//                                   ) : null}

//                                   {regionstations
//                                     .find(dataa => dataa.regionid == dat.id)
//                                     ?.stations.map(
//                                       (datt: any, index: number) => {
//                                         let findd = regionstations.find(
//                                           dataa => dataa.regionid == datt.id,
//                                         )?.stations;
                                    
//                                         let findrtu =
//                                           stationsrtu?.find(
//                                             (data: any) =>
//                                               data.stationid == datt.id,
//                                           )?.rtues || [];
//                                         return (
//                                           <div
//                                             key={index}
//                                             className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
//                                             <div className="absolute bottom-[-17px]  left-[25px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
//                                             {/* {index == regionstations.length - 1 ? ( */}

//                                             {/* ) : null} */}
//                                             <div className="flex w-[290px] flex-row items-center ">
//                                               <span className="mt-[-6px] w-[10px] text-[12px]">
//                                                 ...
//                                               </span>
//                                               <ItembtnStation
//                                                 regionid={dat.id}
//                                                 networkid={data.id}
//                                                 onclick={() => {
//                                                   setStationid(datt.id),
//                                                     onclickstation(datt.id);
//                                                 }}
//                                                 canAdd={true}
//                                                 id={datt.id}
//                                                 name={datt.name}
//                                               />
//                                             </div>
//                                             {networkselectedlist.indexOf(
//                                               datt.id,
//                                             ) > -1 ? (
//                                               <div
//                                                 className={`relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]`}>
//                                                 {findrtu.length > 0 ? (
//                                                   <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
//                                                 ) : null}
//                                                 {stationsrtu
//                                                   ?.find(
//                                                     data =>
//                                                       data.stationid == datt.id,
//                                                   )
//                                                   ?.rtues.map(
//                                                     (
//                                                       dataaa: any,
//                                                       index: number,
//                                                     ) => {
//                                                       return (
//                                                         <div
//                                                           key={index}
//                                                           className="ml-[0px] mt-[10px] flex w-full flex-row items-center">
//                                                           <span className="mt-[-6px] w-[20px] text-[12px] ">
//                                                             .....
//                                                           </span>
//                                                           <SidebarItem
//                                                             onDelete={() =>
//                                                               ondeletesinglertu(
//                                                                 dataaa.id,
//                                                                 datt.id,
//                                                               )
//                                                             }
//                                                             enabelcheck={true}
//                                                             className="w-[200px]"
//                                                             name={dataaa.name}
//                                                             to={dataaa.id}
//                                                           />
//                                                         </div>
//                                                       );
//                                                     },
//                                                   )}
//                                               </div>
//                                             ) : null}
//                                           </div>
//                                         );
//                                       },
//                                     )}
//                                 </div>
//                               ) : null}
//                             </div>
//                           );
//                         })}

//                       {/* <div className="flex w-full flex-row items-center">
//                           <Itembtn name={'Region 2'} />
//                         </div> */}
//                     </>
//                   ) : null}
//                 </div>
//               </div>
//             ))}

//             {/* <Itembtn name={'Network2'} /> */}

//             {/* <div className="relative flex flex-col ">
//             <div className="absolute left-[-5px] top-[36px] z-10 h-full w-[10px] bg-[#E7EFF7]"></div>
//             {networkselectedlist.indexOf('Network3') > -1 ? (
//               <div className="absolute left-[16px] top-[38px] z-10 h-[calc(100%-59px)]  border-l-[1px]  border-dotted border-[#000000] bg-[#E7EFF7]"></div>
//             ) : null}
//             <Itembtn name={'Network3'} />
//             {networkselectedlist.indexOf('Network3') > -1 ? (
//               <div className="ml-[17px] flex w-full flex-row items-center overflow-hidden">
//                 <span className="w-[15px] text-[12px]">....</span>
//                 <SidebarItem
//                   className="w-[calc(100%-10px)]"
//                   onclick={() => alert('rree')}
//                   name="Optical Route 1"
//                   to="#"
//                 />
//               </div>
//             ) : null}
//           </div> */}
//           </div>
//         ) : null}
//       </div>
//     </SidebarLayout>
//   );
// };

// export default RtuLayout;
