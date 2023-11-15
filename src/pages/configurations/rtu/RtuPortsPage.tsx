import {FC, useEffect, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import RtuPortItem, {RtuItemProps} from './RtuPortItem';
import {useHttpRequest} from '~/hooks';
import {useParams} from 'react-router-dom';
import {log} from 'console';
import {$GET, $POST, $PUT} from '~/util/requestapi';
import {string} from 'yup';
import classNames from '~/util/classNames';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {ControlledSelect} from '~/components';
import {BsPlusLg} from 'react-icons/bs';
const ports: RtuItemProps[] = [
  {
    index: 1,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 4',
    length: 203,
    isActive: true,
  },
  {
    index: 2,
    opticalRoute: 'Optical Route 2',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 5',
    length: 24,
    isActive: true,
  },
  {
    index: 3,
    opticalRoute: 'Optical Route 3',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 6',
    length: 43,
    isActive: true,
  },
  {
    index: 4,
    opticalRoute: 'Optical Route 4',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
      {label: 'Optical Route 4'},
    ],
    endStation: 'Station 1',
    length: 63,
    isActive: false,
  },
  {
    index: 4,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
    ],
    endStation: 'Station 4',
    length: 203,
    isEmpty: true,
  },
  {
    index: 5,
    opticalRoute: 'Optical Route 1',
    opticalRouteOptions: [
      {label: 'Optical Route 1'},
      {label: 'Optical Route 2'},
      {label: 'Optical Route 3'},
    ],
    endStation: 'Station 4',
    length: 203,
    isEmpty: true,
  },
];

type Iprops = {
  classname: string;
  onclick: Function;
};

type allportstype = {
  optical_route_id: string;
  state: string;
  index: number;
  id: string;
  new?: boolean;
  end_station: {
    id: string;
    name: string;
  };
  optical_route: {
    id: string;
    name: string;
  };
  length: number;
};

type allupdatesportstype = {
  index: number;
  optical_route_id: string;
  state: string;
  id: string;
};

type allcreateportstype = {
  index: number;
  optical_route_id: string;
  state: string;
};

type alldeletedports={
  
}
const opticalRouteOptions = [
  {label: 'Optical Route 1', id: '11111'},
  {label: 'Optical Route 2', id: '22222'},
  {label: 'Optical Route 3', id: '33333'},
  {label: 'Optical Route 4', id: '44444'},
];
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
// -------- main ------------------ main -------------------- main -------------main --------
const RtuPortsPage: FC = () => {
  const params = useParams();
  const [allrtuports, setAllrtuports] = useState<allportstype[]>([]);
  const [allcreateports, setAllcreateports] = useState<allcreateportstype[]>([]);
  const [allupdatesports, setAllupdatesports] = useState<allupdatesportstype[]>([]);
  const [alldeletedports,setAlldeletedports]=useState([])
  console.log(allrtuports, 'allrtuports');
  console.log(allupdatesports, 'allupdatesports');
  console.log(allcreateports, 'allcreatertu');

  // const {
  //   state: {rtuports},
  //   request,
  // } = useHttpRequest({
  //   selector: state => ({
  //     rtuports: state.http.rtuPorts,
  //   }),
  //   initialRequests: request => {
  //     request('rtuPorts', {params: {rtu_id: params.rtuId || ''}});
  //   },
  // });
  const getrtuports = async () => {
    const getdata = await $GET(`otdr/rtu/${params.rtuId}/ports`);
    setAllrtuports(
      getdata.map((data: allportstype, index: number) => ({...data, index})),
    );
    console.log(getdata, '');
  };

  useEffect(() => {
    getrtuports();
  }, []);
  // console.log(rtuports, 'rtuportsrtuportsrtuports');

  const save = async () => {
    if (allcreateports && allcreateports?.length > 0) {
      const sencreate = await $POST(
        `otdr/rtu/${params.rtuId}/ports`,
        allcreateports,
      );
    }
    if (allrtuports && allrtuports?.length > 0) {
      const sendupdates = await $PUT(
        `otdr/rtu/${params.rtuId}/ports`,
        allrtuports,
      );
    }
    getrtuports();
  };

  const add = (x: number) => {
    setAllcreateports(prev => [
      ...prev,
      {index: x, optical_route_id: '', state: ''},
    ]);
    setAllrtuports(prev => [
      ...prev,
      {
        index: x,
        optical_route_id: '',
        state: '',
        id: '',
        new: true,
        end_station: {
          id: '',
          name: '',
        },
        optical_route: {
          id: '',
          name: '',
        },
        length: 0,
      },
    ]);
  };
  

  const changeupticalroute = (index: number, id: string, name: string) => {
    //We first update the data that we have mapped on the page.
    const oldallports = JSON.parse(JSON.stringify(allrtuports));
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    oldallports[findportIndex].optical_route_id = id;
    oldallports[findportIndex].optical_route.name = name;
    oldallports[findportIndex].optical_route.id = id;
    setAllrtuports(oldallports);
    // ------------------------------------------------------------------
    if (oldallports[findportIndex].new) {
      //If this port was among the new ports, we would update this port in the list of new ports.
      const oldcreatedports = JSON.parse(JSON.stringify(allcreateports));
      const fincreateports = oldcreatedports.findIndex(
        (data: any) => data.index == index,
      );
      oldcreatedports[fincreateports].optical_route_id = id;
      setAllcreateports(oldcreatedports);
    } else {
      const oldupdates = JSON.parse(JSON.stringify(allupdatesports));
      const find = oldupdates.findIndex((data: any) => data.index == index);
      if (find > -1) {
        //If this port was among the updated ports, we would update this port in the list of updated ports.
        oldupdates[find].optical_route_id = id;
        setAllupdatesports(oldupdates);
      } else {
        //else we add this port in the list of updated ports
        setAllupdatesports(prev => [
          ...prev,
          {index: index, optical_route_id: id, state: '', id: ''},
        ]);
      }
    }
  };

  const changestate = (index: number, state: string) => {
    //We first update the data that we have mapped on the page.
    const oldallports = JSON.parse(JSON.stringify(allrtuports));
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    oldallports[findportIndex].state = state;
    setAllrtuports(oldallports);
    // ------------------------------------------------------------------
    if (oldallports[findportIndex].new) {
      //If this port was among the new ports, we would update this port in the list of new ports.
      const oldcreatedports = JSON.parse(JSON.stringify(allcreateports));
      const fincreateports = oldcreatedports.findIndex(
        (data: any) => data.index == index,
      );
      oldcreatedports[fincreateports].state = state;
      setAllcreateports(oldcreatedports);
    } else {
      const oldupdates = JSON.parse(JSON.stringify(allupdatesports));
      const find = oldupdates.findIndex((data: any) => data.index == index);
      if (find > -1) {
        //If this port was among the updated ports, we would update this port in the list of updated ports.
        oldupdates[find].state = state;
        setAllupdatesports(oldupdates);
      } else {
        //else we add this port in the list of updated ports
        setAllupdatesports(prev => [
          ...prev,
          {index: index, optical_route_id: '', state: state, id: ''},
        ]);
      }
    }
  };


  const deleteports=(index:number,id:string)=>{
    const oldallports = JSON.parse(JSON.stringify(allrtuports));
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    if(oldallports[findportIndex].new){
      const newallports=oldallports.filter((data:any) => data.index != index);
      setAllrtuports(newallports)

      const newcreatedport=allcreateports.filter(data => data.index != index)
      setAllcreateports(newcreatedport)
    }else{

    }
  }
  // ####################################################################
  return (
    <div className="flex flex-col gap-y-8">
      <div className="flex min-h-[60vh] flex-grow flex-col gap-y-4">
        <div className="flex items-center px-4">
          <span className="basis-16">Index</span>
          <span className="basis-64">Optical Route</span>
          <span className="basis-44">End Station</span>
          <span className="basis-32">Length (km)</span>
          <span className="basis-40">State</span>
          <span className="basis-40"></span>
        </div>
        {Array.isArray(allrtuports) &&
          allrtuports.length > 0 &&
          allrtuports?.map((data: allportstype, index: any) => (
            <div
              className={classNames(
                'flex items-center rounded-lg p-4',
                data.state == 'deactivate'
                  ? 'bg-red-300'
                  : data.state == 'activate'
                  ? 'bg-success'
                  : 'bg-[#E59D9D]',
              )}>
              <span className="basis-16">{index}</span>
              <div className="basis-64 pr-[20px]">
                <Select
                  onChange={e =>
                    changeupticalroute(
                      index,
                      e.target.value.split('_')[0],
                      e.target.value.split('_')[1],
                    )
                  }
                  className="h-10 w-full">
                  <option value="" className="hidden">
                  {data.optical_route_id == ''?'select':data.optical_route.name}
                  </option>
                  <option value={undefined} className="hidden">
                  {data.optical_route_id == ''?'select':data.optical_route.name}
                  </option>
                  {opticalRouteOptions.map((data, index) => (
                    <option
                      value={`${data.id}_${data.label}`}
                      key={index}
                      className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                      {data.label}
                    </option>
                  ))}
                </Select>
              </div>
              {data.optical_route_id.length > 0 ? (
                <>
                  <span className="basis-44 ">
                    {data.state != 'deactivate' && data.end_station.name}
                  </span>
                  <span className="basis-32">
                    {data.state != 'deactivate' && data.length}
                  </span>
                  <div className="basis-40">
                    {data.state != 'deactivate' && (
                      <ControlledSelect
                        className="h-10 w-[80%]"
                        value={data.optical_route.name}
                        options={[
                          {label: 'Activated', payload: {active: true}},
                          {label: 'Deactivated', payload: {active: true}},
                        ]}
                        onChange={e =>
                          changestate(index, e.toString().toLowerCase())
                        }
                        setValueProp={option => option.label}
                      />
                    )}
                  </div>
                  <div className="flex basis-40 flex-row justify-around gap-x-4">
                    {data.state != 'deactivate' && (
                      <>
                        <IoOpenOutline size={30} />
                        <IoTrashOutline onClick={()=>deleteports(index,data.id)} className="text-red-500 cursor-pointer" size={30} />
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ))}
        <Addbox
          classname={'ml-[calc(5%-56px)]  h-[30px] xl:ml-[calc(6%-56px)]'}
          onclick={() => add(allrtuports.length)}
        />
      </div>
      <div className="flex gap-x-4 self-end">
        <SimpleBtn type="button" onClick={save}>
          Save
        </SimpleBtn>
        <SimpleBtn>Cancel</SimpleBtn>
      </div>
    </div>
  );
};

export default RtuPortsPage;
