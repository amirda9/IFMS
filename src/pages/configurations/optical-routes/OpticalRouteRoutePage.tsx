import {FC, useEffect, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import {useHttpRequest} from '~/hooks';
import {useNavigate, useParams} from 'react-router-dom';
import {IoTrashOutline} from 'react-icons/io5';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {BsPlusLg} from 'react-icons/bs';
import {$Delete, $Get, $Post, $Put} from '~/util/requestapi';
import {deepcopy} from '~/util';
// ----------- type ------------------------------- type ---------------------------- type ---------
type Iprops = {
  classname: string;
  onclick: Function;
};
type allroutestype = {
  index: number;
  new: boolean;
  link_id: string;
  cable: string;
  core: number | string;
  id: string;
  source: {
    id: string;
    name: string;
  };
  destination: {
    id: string;
    name: string;
  };
};
type allselectedsourcetype = {
  index: number;
  sourceId: string;
  linkId: string;
  cableid: string;
  data:
    | {
        id: string;
        name: string;
        network_id: string;
        version_id: string;
        time_created: string;
        time_updated: string;
        region_id: string;
        source: {
          id: string;
          name: string;
        };
        destination: {
          id: string;
          name: string;
        };
      }[]
    | [];
  cableandducts:
    | {
        cables: null | {id: string; number_of_cores: number}[];
        ducts:
          | null
          | {
              id: string;
              mini_ducts: {id: string; number_of_fibers: number}[];
            }[];
      }
    | {cables: null; ducts: null};
};
type allcreatedroutestype = {
  index: number;
  link_id: string;
  cable: string;
  core: number;
};

type allupdatedroutestype = {
  index: number;
  link_id: string;
  id: string;
  cable: string;
  core: number;
};
type mainprops={
  opticalRouteId:string
  networkId:string
}
// ---- component ------ component -----------------component-------------------------------
const Addbox = ({classname, onclick}: Iprops) => {
  return (
    <div
      className={`flex flex-row items-center justify-between opacity-0 hover:opacity-100 ${classname}`}>
      <button
        onClick={() => onclick()}
        className="mr-[3px] h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-[15px] bg-[#32C65D]">
        <BsPlusLg color="white" size={35} className="ml-[-2.5px] mt-[-2.5px]" />
      </button>
      <div className="w-full  border-t-[2px] border-dashed  border-[#32C65D]"></div>
    </div>
  );
};

// ------------main ---------------main -------------------main ------------main -----------
const OpticalRouteRoutePage: FC = () => {
  const params = useParams<mainprops>();
  const navigate=useNavigate()
  const networkId = params.networkId!;
  const [loading, setLoading] = useState(false);
  const [allroutes, setAllroutes] = useState<allroutestype[]>([]);
  const [alldeleteroutes, setAllDeleteroutes] = useState<string[]>([]);

  const [allselectedsource, setAllselectedsource] = useState<
    allselectedsourcetype[]
  >([]);

  const [allcreatedroutes, setAllCreatedroutes] = useState<
    allcreatedroutestype[]
  >([]);
  const [allupdatedroutes, setAllUpdatedroutes] = useState<
    allupdatedroutestype[]
  >([]);

  // -------------------- func ------------------------ func -------------------------- func ------------
  const fndseletedsource = (index: number) => {
    const data = allselectedsource?.find((data: any) => data.index == index);
    return data;
  };

  const fndseletedsourceIndex = (index: number) => {
    const data = allselectedsource?.findIndex(
      (data: any) => data.index == index,
    );
    return data;
  };

  const finrouteIndex = (index: number) => {
    const data = allroutes?.findIndex((data: any) => data.index == index);
    return data;
  };
  const finroute = (index: number) => {
    const data = allroutes?.find((data: any) => data.index == index);
    return data;
  };

  const findcreatedroutindex = (index: number) => {
    const data = allcreatedroutes.findIndex(data => data.index == index);
    return data;
  };
  const findupdatedindex = (index: number) => {
    const data = allupdatedroutes.findIndex(data => data.index == index);
    return data;
  };
  const createlistocore = (x: number) => {
    let data = [];
    for (let i = 1; i < x + 1; i++) {
      data.push(i);
    }
    return data;
  };
  // ------------------------------------------------------------

  const {
    request,
    state: {stations},
  } = useHttpRequest({
    selector: state => ({
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      if (networkId) {
        request('allStations', undefined);
      }
    },
  });

  const add = (index: number) => {
    setAllroutes(prev => [
      ...prev,
      {
        index: index,
        new: true,
        link_id: '',
        cable: '',
        core: 0,
        id: '',
        source: {
          id:
            index == 0
              ? ''
              : allroutes?.find(data => data.index == index - 1)?.destination
                  ?.id || '',
          name:
            index == 0
              ? ''
              : allroutes?.find(data => data.index == index - 1)?.destination
                  ?.name || '',
        },
        destination: {
          id: '',
          name: '',
        },
      },
    ]);
    if (allroutes.length > 0) {
      setAllselectedsource(prev => [
        ...prev,
        {
          index: index,
          cableid: '',
          sourceId:
            index == 0
              ? ''
              : allroutes?.find(data => data.index == index - 1)?.destination
                  ?.id || '',
          linkId: '',
          data: [],
          cableandducts: {cables: null, ducts: null},
        },
      ]);
    }
  };

  const deleteroute = (index: number, id: string) => {
    const old = deepcopy(allroutes);
    const findroute = finrouteIndex(index);
    if (old[findroute].new) {
      //first check if the route is new we dont need to send delete request api and we just delete that from front
      const newroutsdata = old.filter((data: any) => data.index != index);
      setAllroutes(newroutsdata);
      // ------------------------
      const oldcreated = deepcopy(allcreatedroutes);
      const newdata = oldcreated.filter((data: any) => data.index != index);
      setAllCreatedroutes(newdata);
    } else {
      let finddataindex = alldeleteroutes.findIndex(data => data == id);
      if (finddataindex > -1) {
      } else {
        setAllDeleteroutes(prev => [...prev, id]);
      }
    }
  };

  const onclicksource = async (id: string, index: number, name: string) => {
    // ---------------------------------------------------------------------------------
    // We first find the desired route among all the routes and change the name of its source station
    const finddataaallroutesindex = finrouteIndex(index);
    let oldallroutesindex = deepcopy(allroutes);
    oldallroutesindex[finddataaallroutesindex].source.name = name;
    setAllroutes(oldallroutesindex);
    // ---------------------------------------------------------------------------------------
    //Here we save the source and the links related to this source.
    const finddataaindex = fndseletedsourceIndex(index);
    if (finddataaindex > -1) {
      let old = deepcopy(allselectedsource);
      old[finddataaindex] = {
        index: index,
        sourceId: id,
        linkId: '',
        data: [],
        cableid: '',
        cableandducts: {},
      };
      setAllselectedsource(old);
    } else {
      setAllselectedsource(prev => [
        ...prev,
        {
          cableid: '',
          index: index,
          sourceId: id,
          linkId: '',
          data: [],
          cableandducts: {cables: null, ducts: null},
        },
      ]);
    }
    // ----------------------------------------------------------
    //firse find the route among allroutese
    const findroute = finroute(index);
    //we chek that this route is new rout or not
    if (findroute?.new) {
      //If this route was new, we would add it to the list of routes that need to be created.
      const findincreatedrouteid = findcreatedroutindex(index);

      if (findincreatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallcreatedroutes = [...allcreatedroutes];
        oldallcreatedroutes[findincreatedrouteid] = {
          index: index,
          link_id: '',
          cable: '',
          core: 0,
        };
        setAllCreatedroutes(oldallcreatedroutes);
      } else {
        setAllCreatedroutes(prev => [
          ...prev,
          {
            index: index,
            link_id: '',
            cable: '',
            core: 0,
          },
        ]);
      }
    } else {
      //If this route was not new, we would add it to the list of routes that need to be updated.
      const findinupdatedrouteid = findupdatedindex(index);

      if (findinupdatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallupdatedroutes = [...allupdatedroutes];
        oldallupdatedroutes[findinupdatedrouteid] = {
          id: allupdatedroutes[findinupdatedrouteid].id,
          index: index,
          link_id: '',
          cable: '',
          core: 0,
        };
        setAllUpdatedroutes(oldallupdatedroutes);
      } else {
        setAllUpdatedroutes(prev => [
          ...prev,
          {
            id: oldallroutesindex[finddataaallroutesindex].id,
            index: index,
            link_id: '',
            cable: '',
            core: 0,
          },
        ]);
      }
    }
  };

  const onclickdestination = async (index: number) => {
    const old = deepcopy(allselectedsource);
    const findroute = fndseletedsourceIndex(index);
    if (findroute > -1) {
      //We first get the list of links that have the same source as the desired source.
      const getdataa = await $Get(
        `otdr/link/network/${networkId}?source_id=${old[findroute].sourceId}`,
      );
      let getdata = await getdataa?.json();

      old[findroute].data = getdata;
      setAllselectedsource(old);
    }
  };

  const onclickcabel = async (index: number) => {
    const old = deepcopy(allselectedsource);
    const findroute = fndseletedsourceIndex(index);
    if (findroute > -1) {
      try {
        //We get the link specifications because we need the cable and duct specifications of it.
        const getdataresponse = await $Get(
          `otdr/link/${old[findroute].linkId}`,
        );
        const getdata = await getdataresponse?.json();
        let cables =
          getdata?.data?.cables == null
            ? null
            : getdata.data.cables.map((data: any) => ({
                id: data.id,
                number_of_cores: data.number_of_cores,
              }));
        let ducts =
          getdata.data.ducts == null
            ? null
            : getdata.data.ducts.map((data: any) => ({
                id: data.id,
                mini_ducts: data.mini_ducts,
              }));
        old[findroute].cableandducts = {cables: cables, ducts: ducts};
        setAllselectedsource(old);
      } catch (error) {
        console.log(`error is:${error}`);
      }
    }
  };

  const onchangecabel = (index: number, value: string) => {
    // ----------1 ------------------------1 ------------------
    // We first find the desired route among all the routes and change the name of its cabel
    const finddataaallroutesindex = finrouteIndex(index);
    let oldallroutesindex = deepcopy(allroutes);
    oldallroutesindex[finddataaallroutesindex].cable = value;
    setAllroutes(oldallroutesindex);
    // -----------------2-------------------2-------------------2-----
    const old = deepcopy(allselectedsource);
    const findselectedroute = fndseletedsourceIndex(index);
    old[findselectedroute].cableid = value;
    setAllselectedsource(old);
    // ------------ 3------------------------- 3-----------
    //firse find the route among allroutese
    const findroute = finroute(index);
    //we chek that this route is new rout or not
    if (findroute?.new) {
      //If this route was new, we would add it to the list of routes that need to be created.
      const findincreatedrouteid = findcreatedroutindex(index);

      if (findincreatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallcreatedroutes = [...allcreatedroutes];
        oldallcreatedroutes[findincreatedrouteid] = {
          index: index,
          link_id: allcreatedroutes[findincreatedrouteid].link_id,
          cable: value,
          core: allcreatedroutes[findincreatedrouteid].core,
        };
        setAllCreatedroutes(oldallcreatedroutes);
      } else {
        setAllCreatedroutes(prev => [
          ...prev,
          {
            index: index,
            link_id: '',
            cable: value,
            core: 0,
          },
        ]);
      }
    } else {
      //If this route was not new, we would add it to the list of routes that need to be updated.
      const findinupdatedrouteid = findupdatedindex(index);

      if (findinupdatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallupdatedroutes = [...allupdatedroutes];
        oldallupdatedroutes[findinupdatedrouteid] = {
          id: allupdatedroutes[findinupdatedrouteid].id,
          index: index,
          link_id: allupdatedroutes[findinupdatedrouteid].link_id,
          cable: value,
          core: allupdatedroutes[findinupdatedrouteid].core,
        };
        setAllUpdatedroutes(oldallupdatedroutes);
      } else {
        setAllUpdatedroutes(prev => [
          ...prev,
          {
            id: oldallroutesindex[finddataaallroutesindex].id,
            index: index,
            link_id: oldallroutesindex[finddataaallroutesindex].link_id,
            cable: value,
            core: oldallroutesindex[finddataaallroutesindex].core,
          },
        ]);
      }
    }
  };

  const onchangedestination = async (index: number, id: string) => {
    // --------------------------1-------------------1 -----------------
    // We first find the desired route among all the routes and change the name of its destination station
    const finddataaallroutesindex = finrouteIndex(index);
    let oldallroutesindex = deepcopy(allroutes);
    oldallroutesindex[finddataaallroutesindex].destination.name =
      id.split('_')[1];
    oldallroutesindex[finddataaallroutesindex].destination.id =
      id.split('_')[2];
    if (allroutes.length > index + 1) {
      oldallroutesindex[finddataaallroutesindex + 1].source.id =
        id.split('_')[2];
      oldallroutesindex[finddataaallroutesindex + 1].source.name =
        id.split('_')[1];
    }
    setAllroutes(oldallroutesindex);
    // --------------------------2------------------2------------------
    let olddata = deepcopy(allselectedsource);
    let finselected = fndseletedsourceIndex(index);

    olddata[finselected] = {
      index: index,
      sourceId: olddata[finselected]?.sourceId,
      linkId: id.split('_')[0],
      data: olddata[finselected]?.data,
      cableandducts: olddata[finselected]?.cableandducts,
    };
    if (allroutes.length > index + 1) {
      let finselectednext = fndseletedsourceIndex(index + 1);
      olddata[index + 1] = {
        index: index + 1,
        sourceId: id.split('_')[2],
        linkId: olddata[index + 1]?.link_id || '',
        data: olddata[index + 1]?.data,
        cableandducts: olddata[index + 1]?.cableandducts,
      };
    }

    setAllselectedsource(olddata);
    // --------3-----------------------3------------------3---------------3----
    //firse find the route among allroutese
    const findroute = finroute(index);
    //we chek that this route is new rout or not
    if (findroute?.new) {
      //If this route was new, we would add it to the list of routes that need to be created.
      const findincreatedrouteid = findcreatedroutindex(index);

      if (findincreatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallcreatedroutes = [...allcreatedroutes];
        oldallcreatedroutes[findincreatedrouteid] = {
          index: index,
          link_id: id.split('_')[0],
          cable: '',
          core: 0,
        };
        setAllCreatedroutes(oldallcreatedroutes);
      } else {
        setAllCreatedroutes(prev => [
          ...prev,
          {
            index: index,
            link_id: id.split('_')[0],
            cable: '',
            core: 0,
          },
        ]);
      }
    } else {
      //If this route was not new, we would add it to the list of routes that need to be updated.
      const findinupdatedrouteid = findupdatedindex(index);

      if (findinupdatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallupdatedroutes = [...allupdatedroutes];
        oldallupdatedroutes[findinupdatedrouteid] = {
          id: allupdatedroutes[findinupdatedrouteid].id,
          index: index,
          link_id: id.split('_')[0],
          cable: '',
          core: 0,
        };
        setAllUpdatedroutes(oldallupdatedroutes);
      } else {
        setAllUpdatedroutes(prev => [
          ...prev,
          {
            id: oldallroutesindex[finddataaallroutesindex].id,
            index: index,
            link_id: id.split('_')[0],
            cable: '',
            core: 0,
          },
        ]);
      }
    }
  };

  const onclickcore = async (index: number) => {
    const old = deepcopy(allselectedsource);
    const findroute = fndseletedsourceIndex(index);
    if (findroute > -1) {
      try {
        //We get the link specifications because we need the cable and duct specifications of it.
        const getdataresponse = await $Get(
          `otdr/link/${old[findroute].linkId}`,
        );
        const getdata = await getdataresponse?.json();

        let cables =
          getdata.data.cables == null
            ? null
            : getdata.data.cables.map((data: any) => ({
                id: data.id,
                number_of_cores: data.number_of_cores,
              }));
        let ducts =
          getdata.data.ducts == null
            ? null
            : getdata.data.ducts.map((data: any) => ({
                id: data.id,
                mini_ducts: data.mini_ducts,
              }));
        old[findroute].cableandducts = {cables: cables, ducts: ducts};
        setAllselectedsource(old);
      } catch (error) {
        console.log(`error is :${error}`);
      }
    }
  };

  const onchangecore = async (index: number, value: string) => {
    const old = deepcopy(allroutes);
    const findrouteindex = finrouteIndex(index);
    old[findrouteindex].core = value;
    setAllroutes(old);
    const findroute = finroute(index);
    //we chek that this route is new rout or not
    if (findroute?.new) {
      //If this route was new, we would add it to the list of routes that need to be created.
      const findincreatedrouteid = findcreatedroutindex(index);

      if (findincreatedrouteid > -1) {
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallcreatedroutes = [...allcreatedroutes];
        oldallcreatedroutes[findincreatedrouteid] = {
          index: index,
          link_id: allcreatedroutes[findincreatedrouteid].link_id,
          cable: allcreatedroutes[findincreatedrouteid].cable,
          core:
            value.indexOf('-') > -1
              ? Number(value.split('-')[1])
              : Number(value),
        };
        setAllCreatedroutes(oldallcreatedroutes);
      } else {
        setAllCreatedroutes(prev => [
          ...prev,
          {
            index: index,
            link_id: '',
            cable: '',
            core:
              value.indexOf('-') > -1
                ? Number(value.split('-')[1])
                : Number(value),
          },
        ]);
      }
    } else {
      //If this route was not new, we would add it to the list of routes that need to be updated.
      const findinupdatedrouteid = findupdatedindex(index);

      if (findinupdatedrouteid > -1) {
        alert('uuu');
        //If this route was already in the list of routes that need to be created, we would edit it. If not, we would add it to the list of routes that need to be created.
        let oldallupdatedroutes = [...allupdatedroutes];

        oldallupdatedroutes[findinupdatedrouteid] = {
          id: allupdatedroutes[findinupdatedrouteid].id,
          index: index,
          link_id: allupdatedroutes[findinupdatedrouteid].link_id,
          cable: allupdatedroutes[findinupdatedrouteid].cable,
          core:
            value.indexOf('-') > -1
              ? Number(value.split('-')[1])
              : Number(value),
        };

        setAllUpdatedroutes(oldallupdatedroutes);
      } else {
        setAllUpdatedroutes(prev => [
          ...prev,
          {
            id: old[findrouteindex].id,
            index: index,
            link_id: old[findrouteindex].link_id,
            cable: old[findrouteindex].cable,
            core:
              value.indexOf('-') > -1
                ? Number(value.split('-')[1])
                : Number(value),
          },
        ]);
      }
    }
  };

  const getallroute = async () => {
    try {
      setLoading(true);
      const allroutesrespone = await $Get(
        `otdr/optical-route/${
          params.opticalRouteId! || ''
        }/routes`,
      );
      if(allroutesrespone?.status == 200){
        const allroutes = await allroutesrespone?.json();
        setAllroutes(
          allroutes.map((data: any, index: any) => ({
            index: Number(index),
            ...data,
          })),
        );
        setAllselectedsource([]);
        for (let i = 0; i < allroutes.length; i++) {
          setAllselectedsource(prev => [
            ...prev,
            {
              index: Number(i),
              sourceId: allroutes[i].source.id,
              linkId: allroutes[i].link_id,
              cableid: allroutes[i].cable,
              data: [],
              cableandducts: {
                cables: null,
                ducts: null,
              },
            },
          ]);
        }
      }
     
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getallroute();
  }, []);

  const save = async() => {
    try {
      setLoading(true)
      if (alldeleteroutes.length > 0) {
        const deleteroute=await $Delete(`otdr/optical-route/${params.opticalRouteId!}/routes`,alldeleteroutes)
        // request('opticalrouteDeleteRoute', {
        //   params: {
        //     optical_route_id: params.opticalRouteId! || '',
        //   },
        //   data: alldeleteroutes,
        // });
      }
      if (allcreatedroutes.length > 0) {
       const newdata= allcreatedroutes.map((data, index) => ({
          link_id: data.link_id,
          cable: data.cable,
          core: data.core,
          route_number: index,
        }))
        const createroute=await $Post(`otdr/optical-route/${params.opticalRouteId!}/routes`,newdata)
        // request('opticalrouteCreateRoute', {
        //   params: {
        //     optical_route_id: params.opticalRouteId!|| '',
        //   },
        //   data: allcreatedroutes.map((data, index) => ({
        //     link_id: data.link_id,
        //     cable: data.cable,
        //     core: data.core,
        //     route_number: index,
        //   })),
        // });
      }

      if (allupdatedroutes.length > 0) {
        const updatedata= allupdatedroutes.map((data, index) => ({
          link_id: data.link_id,
          cable: data.cable,
          core: data.core,
          id: data.id,
        }))
        const updaterote=$Put(`otdr/optical-route/${params.opticalRouteId!}/routes`,updatedata)
        // request('opticalrouteUpdateRoute', {
        //   params: {
        //     optical_route_id: params.opticalRouteId! || '',
        //   },
          // data: allupdatedroutes.map((data, index) => ({
          //   link_id: data.link_id,
          //   cable: data.cable,
          //   core: data.core,
          //   id: data.id,
          // })),
        // });
      }
     
    } catch (error) {
    } finally {
      setAllroutes([])
      setAllCreatedroutes([]);
      setAllUpdatedroutes([]);
      setAllDeleteroutes([]);
      getallroute();
    //  navigate(`/config/optical-routes/${params.opticalRouteId!}/${params.networkId!}/route`)
    }
  };
  // ###################################################################################################
  if (loading) {
    return <h1 className="mt-6 font-bold">Loading..</h1>;
  }

  return (
    <div className="flex flex-grow flex-col">
      <div className="relative flex w-11/12 flex-grow flex-col gap-y-4">
        <div className="flex gap-x-4 px-4">
          <span className="basis-10"></span>
          <span className="flex-1 text-[20px] leading-[24.2px]">
            Source Station
          </span>
          <span className="flex-1 text-[20px] leading-[24.2px]">
            Destination Station
          </span>
          <span className="flex-1 text-[20px] leading-[24.2px]">
            Cable (Duct)
          </span>
          <span className="basis-30 text-[20px] leading-[24.2px]">
            Core (Fiber)
          </span>
          <span className="basis-10"></span>
        </div>
        {allroutes.map((data, index) => (
          <div
            key={index}
            className="flex items-center gap-x-4 rounded-lg bg-arioCyan p-4">
            <span className="basis-10">{index + 1}</span>
            <div className="w-[25%]">
              <Select
                onChange={
                  index == 0
                    ? e => {
                        onclicksource(
                          e.target.value.split('_')[0],
                          index,
                          e.target.value.split('_')[1],
                        );
                      }
                    : () => {}
                }
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  {data.source.name}
                </option>
                <option value={undefined} className="hidden">
                  {data.source.name}
                </option>
                {index == 0 &&
                  stations?.data?.map(data => (
                    <option value={`${data.id}_${data.name}`}>
                      {data.name}
                    </option>
                  ))}
              </Select>
            </div>

            <div className="w-[25%]">
              <Select
                onClick={() => onclickdestination(index)}
                onChange={e => onchangedestination(index, e.target.value)}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  {fndseletedsource(index)?.linkId == ''
                    ? ''
                    : data.destination.name}
                </option>
                <option value={undefined} className="hidden">
                  {fndseletedsource(index)?.linkId == ''
                    ? ''
                    : data.destination.name}{' '}
                </option>

                {fndseletedsource(index)?.data?.map(data => (
                  <option
                    value={`${data.id}_${data?.destination.name}_${data?.destination.id}`}>
                    {data?.destination.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className="w-[25%]">
              <Select
                defaultValue="kklklk"
                onClick={() => onclickcabel(index)}
                onChange={e => onchangecabel(index, e.target.value)}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  {findupdatedindex(index) > -1
                    ? allupdatedroutes[index].cable
                    : findcreatedroutindex(index) > -1
                    ? allcreatedroutes[index]?.cable
                    : data?.cable}{' '}
                </option>
                <option value={undefined} className="hidden">
                  {findupdatedindex(index) > -1
                    ? allupdatedroutes[index].cable
                    : findcreatedroutindex(index) > -1
                    ? allcreatedroutes[index]?.cable
                    : data?.cable}
                </option>

                {fndseletedsource(index)?.cableandducts?.cables != null
                  ? fndseletedsource(index)?.cableandducts?.cables?.map(
                      data => <option value={data.id}>{data.id}</option>,
                    )
                  : fndseletedsource(index)?.cableandducts?.ducts?.map(data => (
                      <option value={data.id}>{data.id}</option>
                    ))}
              </Select>
            </div>

            <div className="w-[150px]">
              <Select
                onClick={() => onclickcore(index)}
                onChange={e => onchangecore(index, e.target.value)}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  {findupdatedindex(index) > -1
                    ? allupdatedroutes[index].core
                    : findcreatedroutindex(index) > -1
                    ? allcreatedroutes[index]?.core
                    : data?.core}
                </option>
                <option value={undefined} className="hidden">
                  {findupdatedindex(index) > -1
                    ? allupdatedroutes[index].core
                    : findcreatedroutindex(index) > -1
                    ? allcreatedroutes[index]?.core
                    : data?.core}
                </option>
                {fndseletedsource(index)?.cableandducts?.cables != null
                  ? createlistocore(
                      Number(
                        fndseletedsource(index)?.cableandducts?.cables?.find(
                          data => data.id == fndseletedsource(index)?.cableid,
                        )?.number_of_cores,
                      ),
                    ).map(data => <option>{data}</option>)
                  : fndseletedsource(index)
                      ?.cableandducts?.ducts?.find(
                        data => data.id == fndseletedsource(index)?.cableid,
                      )
                      ?.mini_ducts.map(data => (
                        <option
                          value={`${data.id}-${data.number_of_fibers}`}>{`${data.id}-${data.number_of_fibers}`}</option>
                      ))}
              </Select>
            </div>
            <div className="w-[150px]">
              <IoTrashOutline
                onClick={() => deleteroute(index, data.id)}
                className="cursor-pointer text-red-500"
                size={24}
              />
            </div>
          </div>
        ))}

        <Addbox
          classname={'ml-[calc(5%-56px)]  h-[30px] xl:ml-[calc(6%-56px)]'}
          onclick={() => add(allroutes.length)}
        />
      </div>
      <div className="flex flex-row gap-x-4 self-end">
        <SimpleBtn onClick={save}>Save</SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default OpticalRouteRoutePage;
