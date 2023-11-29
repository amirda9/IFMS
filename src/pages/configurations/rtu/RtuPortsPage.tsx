import {FC, useEffect, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {$Delete, $Get, $Put} from '~/util/requestapi';
import classNames from '~/util/classNames';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {deepcopy} from '~/util';
import Cookies from 'js-cookie';
import {networkExplored} from '~/constant';
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
}[];
type opticalroutlistType = {
  id: string;
  name: string;
  end_station: {
    id: string;
    name: string;
  } | null;
  length: number;
}[];

type allupdatesportstype = {
  index: number;
  optical_route_id: string;
  state: string;
  id: string;
};

// -------- main ------------------ main -------------------- main -------------main --------


const RtuPortsPage: FC = () => {
  const params = useParams();
  const networkId = Cookies.get(networkExplored);
  const [allrtuports, setAllrtuports] = useState<allportstype>([]);
  const [selectedboxoptions, setSelectedboxoptions] =
    useState<opticalroutlistType>([]);
  const [allupdatesports, setAllupdatesports] = useState<allupdatesportstype[]>(
    [],
  );
  const [alldeletedports, setAlldeletedports] = useState<string[]>([]);

  const getrtuports = async () => {
    try {
      //get rtu ports
      const getdata = await $Get(
        `otdr/rtu/${params?.rtuId?.split('_')[0]}/ports`,
      );
      const allrtuports: allportstype = await getdata.json();
      let rtuports: allportstype = deepcopy(allrtuports);

      if (allrtuports.length < 8) {
        for (let i = 0; i < 8 - allrtuports.length; i++) {
          rtuports.push({
            optical_route_id: '',
            state: '',
            index: 0,
            id: '',
            new: false,
            end_station: {
              id: '',
              name: '',
            },
            optical_route: {
              id: '',
              name: '',
            },
            length: 0,
          });
        }
      }

      if (getdata.status == 200) {
        setAllrtuports(
          rtuports.map((data, index: number) => ({
            ...data,
            index,
          })),
        );
        //get allrtu  optical routes
        // rtu_station_id=${params?.rtuId?.split(
        //   '_',
        // )[1]}&
        const getrtuopticalrote = await $Get(
          `otdr/optical-route?network_id=${params?.rtuId?.split('_')[2]}`,
        );
        const getopticaldata: opticalroutlistType =
          await getrtuopticalrote.json();

        if (getrtuopticalrote.status == 200) {
          // remove the optical-routes of the ports from the list of optical-routes that should be shown in the select boxes. Because the selected optical routes should not be repeated.
          let data: opticalroutlistType = [];
          for (let i = 0; i < getopticaldata.length; i++) {
            if (
              rtuports.findIndex(
                dataa => dataa.optical_route_id == getopticaldata[i].id,
              ) < 0
            ) {
              data.push({
                id: getopticaldata[i].id,
                name: getopticaldata[i].name,
                end_station: getopticaldata[i].end_station || null,
                length: getopticaldata[i].length,
              });
            }
          }

          setSelectedboxoptions(data);
        } else {
        }
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
          `otdr/rtu/${params?.rtuId?.split('_')[0]}/ports`,
          allupdatesports,
        );
      } catch (error) {
        console.log(error,'error');
      }
    }
    // ممکن است بجای آپتیکال روت بیایم پورت رو حذف کنیم این کد موقتیست
    if (alldeletedports.length > 0) {
      try {
        const deletports = await $Delete(
          `otdr/optical-route/batch_delete`,
          alldeletedports,
        );
      } catch (error) {
        
      }
   
     
    }
    getrtuports();
  };

  const changeupticalroute = (
    index: number,
    id: string,
    name: string,
    end_station: {id: string; name: string},
    length: number,
  ) => {
    const allportsCopy = deepcopy(allrtuports);
    const findportIndex = allportsCopy.findIndex(
      (data: any) => data.index == index,
    );

    //update selectedbox options
    const selectedboxoptionsCopy = selectedboxoptions.filter(
      data => data.id != id,
    );
    if (allportsCopy[findportIndex].optical_route_id.length > 0) {
      selectedboxoptionsCopy.push({
        id: allportsCopy[findportIndex].optical_route_id,
        name: allportsCopy[findportIndex].optical_route.name,
        length: allportsCopy[findportIndex].length,
        end_station: (allportsCopy[findportIndex].end_station = end_station),
      });
    }

    setSelectedboxoptions(selectedboxoptionsCopy);
    // -------------------------------------------------------------------
    //We first update the data that we have mapped on the page.

    allportsCopy[findportIndex].optical_route_id = id;
    allportsCopy[findportIndex].optical_route.name = name;
    allportsCopy[findportIndex].optical_route.id = id;
    allportsCopy[findportIndex].end_station = end_station;
    allportsCopy[findportIndex].length = length;
    if (allportsCopy[findportIndex].state == '') {
      allportsCopy[findportIndex].state = 'deactivate';
    }
    setAllrtuports(allportsCopy);
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
          state: allportsCopy[findportIndex].state,
          id: allportsCopy[findportIndex].id,
        },
      ]);
    }
    // ----------------------------------------------------------------------------
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
          allrtuports?.map((data, index: any) => (
            <div
              className={classNames(
                'flex items-center rounded-lg p-4',
                data.state == 'deactivate'
                  ? 'bg-[#B8B8B8]'
                  : data.state == 'activate'
                  ? 'bg-[#ADE2BC]'
                  : 'bg-[#E59D9D]',
              )}>
              <span className="basis-16">{index + 1}</span>

              <div className="basis-64 pr-[20px]">
                <Select
                  value={data.optical_route.name}
                  onChange={e =>
                    changeupticalroute(
                      index,
                      e.target.value.split('_')[0],
                      e.target.value.split('_')[1],
                      JSON.parse(e.target.value.split('_')[2]),
                      Number(e.target.value.split('_')[3]),
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
                  {selectedboxoptions.map((data, index) => (
                    <option
                      value={`${data.id}_${data.name}_${data.end_station}_${data.length}`}
                      key={index}
                      className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                      {data.name}
                    </option>
                  ))}
                </Select>
              </div>

              {data.optical_route_id.length > 0 ? (
                <>
                  <span className="basis-44 ">
                    {data.end_station?.name || null}
                  </span>

                  <span className="basis-32">{data.length}</span>

                  <div className="basis-40">
                    {/* {data.state != 'deactivate' && ( */}
                      <Select
                        // value={
                        //   data.state == 'activate' ? 'Activate' : 'Deactivate'
                        // }
                        onChange={e =>
                          changestate(
                            index,
                            e.target.value.toString().toLowerCase(),
                          )
                        }
                        className="h-10 w-full">
                        <option value="" className="hidden">
                          {data.state == 'activate' ? 'Activate' : 'Deactivate'}
                        </option>
                        <option value={undefined} className="hidden">
                          {data.state == 'activate' ? 'Activate' : 'Deactivate'}
                        </option>
                        {[{label: 'Activate'}, {label: 'Deactivate'}].map(
                          (data, index) => (
                            <option
                              value={`${data.label}`}
                              key={index}
                              className="text-[20px] font-light leading-[24.2px] text-[#000000]">
                              {data.label}
                            </option>
                          ),
                        )}
                      </Select>
                    {/* // )} */}
                  </div>
                  <div className="flex basis-40 flex-row justify-around gap-x-4">
                    {/* {data.state != 'deactivate' && ( */}
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
                    {/* )} */}
                  </div>
                </>
              ) : null}
            </div>
          ))}
      </div>
      <div className="flex flex-col ">
        {/* {errortext.length > 0 ? (
          <span className="my-[4px] text-[20px] text-[red]">{errortext}</span>
        ) : null} */}
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
