import {FC, useEffect, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {$Delete, $Get, $Put} from '~/util/requestapi';
import classNames from '~/util/classNames';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {ControlledSelect} from '~/components';
import {deepcopy} from '~/util';

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


const opticalRouteOptions = [
  {label: 'Optical Route 1', id: '11111'},
  {label: 'Optical Route 2', id: '22222'},
  {label: 'Optical Route 3', id: '33333'},
  {label: 'Optical Route 4', id: '44444'},
];

// -------- main ------------------ main -------------------- main -------------main --------
const RtuPortsPage: FC = () => {
  const params = useParams();
  const [allrtuports, setAllrtuports] = useState<allportstype[]>([]);
  const [errortext, setErrortext] = useState('');
 const [allupdatesports, setAllupdatesports] = useState<allupdatesportstype[]>(
    [],
  ); const [alldeletedports, setAlldeletedports] = useState<string[]>([]);

  const getrtuports = async () => {
    try {
      const getdata = await $Get(`otdr/rtu/${params.rtuId}/ports`);
      if (getdata.status == 200) {
        const rtuports = await getdata.json();
        setAllrtuports(
          rtuports.map((data: allportstype, index: number) => ({
            ...data,
            index,
          })),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getrtuports();
  }, []);

  const save = async () => {
    if (allupdatesports && allupdatesports?.length > 0) {
      try {
        const sendupdates = await $Put(
          `otdr/rtu/${params.rtuId}/ports`,
          allupdatesports,
        );
        if (sendupdates.status != 201) {
          const errormessage = await sendupdates.json();
          setErrortext(errormessage.detail[0].msg);
        }else{
          setErrortext("");
        }
      } catch (error) {
        console.log(error);
      }
    }
    if (alldeletedports.length > 0) {
      const deletports = await $Delete(
        `otdr/optical-route/batch_delete`,
        alldeletedports,
      );
      if (deletports.status != 201) {
        const errormessage = await deletports.json();
        setErrortext(errormessage.detail[0].msg);
      }else{
        setErrortext("");
      }
    }
    getrtuports();
  };

  const changeupticalroute = (index: number, id: string, name: string) => {
    //We first update the data that we have mapped on the page.
    const oldallports = deepcopy(allrtuports);
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    oldallports[findportIndex].optical_route_id = id;
    oldallports[findportIndex].optical_route.name = name;
    oldallports[findportIndex].optical_route.id = id;
    setAllrtuports(oldallports);
    // ------------------------------------------------------------------
    const allupdatesportsCopy = deepcopy(allupdatesports);
    const find = allupdatesportsCopy.findIndex(
      (data: any) => data.index == index,
    );
    if (find > -1) {
      //If this port was among the updated ports, we would update this port in the list of updated ports.
      allupdatesportsCopy[find].optical_route_id = id;
      setAllupdatesports(allupdatesportsCopy);
    } else {
      //else we add this port in the list of updated ports
      setAllupdatesports(prev => [
        ...prev,
        {
          index: index,
          optical_route_id: id,
          state: oldallports[findportIndex].state,
          id: oldallports[findportIndex].id,
        },
      ]);
    }
  };

  const changestate = (index: number, state: string) => {
    //We first update the data that we have mapped on the page.
    const oldallports = deepcopy(allrtuports);
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    oldallports[findportIndex].state = state;
    setAllrtuports(oldallports);
    // ------------------------------------------------------------------

    const oldupdates = deepcopy(allupdatesports);
    const find = oldupdates.findIndex((data: any) => data.index == index);
    if (find > -1) {
      //If this port was among the updated ports, we would update this port in the list of updated ports.
      oldupdates[find].state = state;
      setAllupdatesports(oldupdates);
    } else {
      //else we add this port in the list of updated ports
      setAllupdatesports(prev => [
        ...prev,
        {
          index: index,
          optical_route_id: oldallports[findportIndex].optical_route.id,
          state: state,
          id: oldallports[findportIndex].id,
        },
      ]);
    }
  };

  const deleteopticalroute = (optical_route_id: string) => {
    const alldeletedportsCopy = deepcopy(alldeletedports);
    const findid = alldeletedportsCopy.findIndex(
      (data: any) => data == optical_route_id,
    );
    if (findid < 0) {
      setAlldeletedports(prev => [...prev, optical_route_id]);
    }
  };

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
                  ? 'bg-[#B8B8B8]'
                  : data.state == 'activate'
                  ? 'bg-[#ADE2BC]'
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
                    {data.optical_route_id == ''
                      ? 'select'
                      : data.optical_route.name}
                  </option>
                  <option value={undefined} className="hidden">
                    {data.optical_route_id == ''
                      ? 'select'
                      : data.optical_route.name}
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
                        <IoTrashOutline
                          onClick={() =>
                            deleteopticalroute(data.optical_route_id)
                          }
                          className="cursor-pointer text-red-500"
                          size={30}
                        />
                      </>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ))}
      </div>
      <div className="flex flex-col ">
        {errortext.length > 0 ? (
          <span className="my-[4px] text-[20px] text-[red]">
            {errortext}
          </span>
        ) : null}
        <div className="flex gap-x-4 self-end">
          <SimpleBtn type="button" onClick={save}>
            Save
          </SimpleBtn>
          <SimpleBtn>Cancel</SimpleBtn>
        </div>
      </div>
    </div>
  );
};

export default RtuPortsPage;
