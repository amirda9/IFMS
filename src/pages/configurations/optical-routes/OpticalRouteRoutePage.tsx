import {FC, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import RouteItem from './RouteItem';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {IoTrashOutline} from 'react-icons/io5';
import {ControlledSelect} from '~/components';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
import {BsPlusLg} from 'react-icons/bs';
import Selectbox from '~/components/selectbox/selectbox';
import {number} from 'yup';
type Iprops = {
  classname: string;
  onclick: Function;
};
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
const OpticalRouteRoutePage: FC = () => {
  const params = useParams();
  const networkId = Cookies.get(networkExplored);
  const [allroutes, setAllroutes] = useState<
    {
      index:number;
      new:boolean;
      link_id: string;
      cable: string;
      core: number;
      id: string;
      source: {
        id: string;
        name: string;
      };
      destination: {
        id: string;
        name: string;
      };
    }[]
  >([]);
  const [alldeleteroutes, setAllDeleteroutes] = useState<string[]>([]);

  const [allselectedsource, setAllselectedsource] = useState<
    {index: number; id: string; data: {}}[]
  >([]);
  const [allcreatedroutes, setAllCreatedroutes] = useState<
    {
      index: number;
      link_id: string;
      cable: string;
      core: number;
    }[]
  >([]);
  const [allupdatedroutes, setAllUpdatedroutes] = useState<string[]>([]);
  const {
    request,
    state: {opticalrouteRoute, stations},
  } = useHttpRequest({
    selector: state => ({
      opticalrouteRoute: state.http.opticalrouteRoute,
      stations: state.http.allStations,
    }),
    initialRequests: request => {
      // if (list?.httpRequestStatus !== 'success') {
      request('opticalrouteRoute', {
        params: {optical_route_id: params.opticalRouteId || ''},
      });
      if (networkId) {
        request('allStations', undefined);
      }
      // }
    },
    // onUpdate: (lastState, state) => {
    //   if (
    //     lastState.deleteRequest?.httpRequestStatus === 'loading' &&
    //     state.deleteRequest!.httpRequestStatus === 'success'
    //   ) {
    //     request('networkList', undefined);
    //   }
    // },
  });
  // console.log(opticalrouteRoute, 'opticalrouteRoute😵‍💫');

  const add = (index:number) => {
    setAllroutes(prev => [...prev,    {
      index:index,
      new:true,
      link_id: "",
      cable: "",
      core: 0,
      id: "",
      source: {
        id: "",
        name: "",
      },
      destination: {
        id: "",
        name: ""
      }
    }]);
  };

  const deleteroute = (id: string) => {
    let finddataindex = alldeleteroutes.findIndex(data => data == id);
    if (finddataindex > -1) {
    } else {
      setAllDeleteroutes(prev => [...prev, id]);
    }
  };

  console.log(stations, 'params😵‍💫🤑');
  const save = () => {
    if (alldeleteroutes.length > 0) {
      request('opticalrouteDeleteRoute', {
        params: {optical_route_id: params.opticalRouteId || ''},
        data: alldeleteroutes,
      });
    }
  };

  const setallupdatedroutid = (id: string) => {
    const findupdated = allupdatedroutes.findIndex(data => data == id);
    if (findupdated > -1) {
    } else {
      setAllUpdatedroutes(prev => [...prev]);
    }
  };

  const onclicksource = (id: string, index: number,name:string) => {
    const finddataaallroutesindex = allroutes.findIndex(
      data => data.index == index,
    );
    let oldallroutesindex=JSON.parse(JSON.stringify(allroutes))
    oldallroutesindex[finddataaallroutesindex].source.name=name
    setAllroutes(oldallroutesindex)


    const finddataaindex = allselectedsource.findIndex(
      data => data.index == index,
    );
    if (finddataaindex > -1) {
      let old = JSON.parse(JSON.stringify(allselectedsource));
      old[finddataaindex] = {index: index, id: id, data: {}};
      setAllselectedsource(old);
    } else {
      setAllselectedsource(prev => [...prev, {index: index, id: id, data: {}}]);
    }
  };

  console.log(allroutes,'allroutesallroutesallroutes');
  
  const onclickdestination = (index: number) => {
    const finddataaindex = allselectedsource.findIndex(
      data => data.index == index,
    );
    if (finddataaindex > -1) {
    }


    const findincreatedrouteid = allcreatedroutes.findIndex(
      data => data.index == index,
    );

    if (findincreatedrouteid > -1) {
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
  };
  return (
    <div className="flex flex-grow flex-col">
      <div className="relative flex w-10/12 flex-grow flex-col gap-y-4">
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
          <div className="flex items-center gap-x-4 rounded-lg bg-arioCyan p-4">
            <span className="basis-10">{index}</span>
            <div className="flex-1">
              <Select
                onChange={e => onclicksource(e.target.value.split("_")[0], index,e.target.value.split("_")[1])}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  select
                </option>
                <option value={undefined} className="hidden">
                  select
                </option>
                {stations?.data?.map(data => (
                  <option value={`${data.id}_${data.name}`}>{data.name}</option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Select
                onClick={() => onclickdestination(index)}
                onChange={e => {}}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  select
                </option>
                <option value={undefined} className="hidden">
                  select
                </option>

                {[{label: 'Station 1'}, {label: 'Station 2'}].map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            <div className="flex-1">
              <Select
                onChange={e => {}}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  select
                </option>
                <option value={undefined} className="hidden">
                  select
                </option>
                {[{label: 'Cable 1'}, {label: 'Cable 2'}].map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            <div className="basis-30">
              <Select
                onChange={e => {}}
                className="w-full text-[20px] leading-[24.2px]">
                <option value="" className="hidden">
                  select
                </option>
                <option value={undefined} className="hidden">
                  select
                </option>
                {[{label: 'Fiber 1'}, {label: 'Fiber 2'}].map(data => (
                  <option>{data.label}</option>
                ))}
              </Select>
            </div>
            <div className="basis-10">
              <IoTrashOutline
                onClick={() => deleteroute(index.toString())}
                className="text-red-500"
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
