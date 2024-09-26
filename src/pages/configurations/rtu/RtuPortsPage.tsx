import {FC, useEffect, useState} from 'react';
import {Select, SimpleBtn} from '~/components';
import {useParams} from 'react-router-dom';
import {$Delete, $Get, $Post, $Put} from '~/util/requestapi';
import classNames from '~/util/classNames';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {deepcopy} from '~/util';
import Swal from 'sweetalert2';
import {useSelector} from 'react-redux';
import ErrorPage403 from './../../errors/403';
import {RootState} from '~/store';
import {useAppSelector} from '~/hooks';
import {UserRole} from '~/constant/users';
type allportstype = {
  optical_route_id: string;
  optical_switch_port_index?:number,
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
  optical_switch_port_index: number;
};

type allcreateports = {
  optical_route_id: string;
  state: string;
  optical_switch_port_index: number;
}[];

type Iprops={
  rtuId:string
  stationId:string
  regionId:string
  networkId:string
}
// -------- main ------------------ main -------------------- main -------------main --------
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};
const RtuPortsPage: FC = () => {
  const params = useParams<Iprops>();
  const [allrtuports, setAllrtuports] = useState<allportstype>([]);
  const [loading, setLoading] = useState(false);
  const [selectedboxoptions, setSelectedboxoptions] =
    useState<opticalroutlistType>([]);
  const [allupdatesports, setAllupdatesports] = useState<allupdatesportstype[]>(
    [],
  );
  const [allcreateport, setAllcreateport] = useState<allcreateports>([]);
  const [alldeletedports, setAlldeletedports] = useState<string[]>([]);

  const {rtunetworkidadmin, rturegionidadmin, rtustationidadmin} = useSelector(
    (state: RootState) => state.rtu,
  );
  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data)!;
  const getrtuports = async () => {
    try {
      setLoading(true);
      //get rtu ports
      const [getdata, getrtuopticalrote] = await Promise.all([
        $Get(`otdr/rtu/${params?.rtuId!}/ports`),
        $Get(
          `otdr/optical-route?rtu_station_id=${params?.stationId!}&network_id=${params?.networkId!}`,
        ),
      ]);
      const allrtuports: allportstype = await getdata?.json();
      console.log('🖌️', allrtuports);

      // let rtuports: allportstype = deepcopy(allrtuports);
      let rtuports: allportstype =  [];
      if (allrtuports.length < 8) {
        for (let i = 0; i < 8; i++) {
          const findsweachindex=allrtuports.findIndex((data) => data.optical_switch_port_index == i+1)
        console.log("findsweachindex",findsweachindex,{...allrtuports[findsweachindex],index:i});
        
        if(findsweachindex>-1){
  rtuports.push({...allrtuports[findsweachindex],index:i+1});
        }else{
       rtuports.push({
            optical_route_id: '',
            optical_switch_port_index:i+1,
            state: '',
            index: i+1,
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
        // for (let i = 0; i < 8 - allrtuports.length; i++) {
        //   const findswichindex=allrtuports
        //   rtuports.push({
        //     optical_route_id: '',
        //     state: '',
        //     index: 0,
        //     id: '',
        //     new: false,
        //     end_station: {
        //       id: '',
        //       name: '',
        //     },
        //     optical_route: {
        //       id: '',
        //       name: '',
        //     },
        //     length: 0,
        //   });
        // }
      }

      setAllrtuports(
        rtuports
        // rtuports.map((data, index: number) => ({
        //   ...data,
        //   optical_switch_port_index:index,
        //   index,
        // })),
      );
      //get allrtu  optical routes

      const getopticaldata: opticalroutlistType =
        await getrtuopticalrote?.json();
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
    } catch (error) {
      console.log(`error is:${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getrtuports();
  }, []);

  const save = async () => {
    if (allcreateport.length > 0) {
      try {
        await $Post(
          `otdr/rtu/${params?.rtuId!}/ports`,
          allcreateport,
        );
      } catch (error) {
        console.log(error, 'error');
      }
    }
    if (allupdatesports && allupdatesports?.length > 0) {
      try {
        await $Put(
          `otdr/rtu/${params?.rtuId!}/ports`,
          allupdatesports.map(data => ({
            id: data?.id,
            state: data.state,
            optical_route_id: data.optical_route_id,
            optical_switch_port_index: data.optical_switch_port_index,
          })),
        );
      } catch (error) {
        console.log(error, 'error');
      }
    }

    if (alldeletedports.length > 0) {
    
      try {
        const deleteports=await $Delete(`otdr/rtu/${params.rtuId}/ports`,alldeletedports)
      } catch (error) {
        console.log(error);
      }
    }
    getrtuports();
    setAllcreateport([]);
    setAllupdatesports([]);
  };

  const changeupticalroute = (
    index: number,
    id: string,
    name: string,
    end_station_name: string,
    end_station_id: string,
    length: number,
    olid: string,
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
        end_station: (allportsCopy[findportIndex].end_station = {
          name: end_station_name,
          id: end_station_id,
        }),
      });
    }

    setSelectedboxoptions(selectedboxoptionsCopy);

    // ------------------------------------------------------------------
    const allupdatesportsCopy = deepcopy(allupdatesports);

    if (allportsCopy[findportIndex].id.length > 0) {
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
            optical_switch_port_index: index,
          },
        ]);
      }
    } else {
      const allcreateportCopy = deepcopy(allcreateport);
      const findcreateports = allcreateport.findIndex(
        data => data.optical_route_id == olid,
      );

      if (findcreateports > -1) {
        allcreateportCopy[findcreateports].optical_route_id = id;
        setAllcreateport(allcreateportCopy);
      } else {
        setAllcreateport(prev => [
          ...prev,
          {
            optical_route_id: id,
            state: 'deactivate',
            optical_switch_port_index: index,
          },
        ]);
      }
    }
    // ----------------------------------------------------------------------
    // -------------------------------------------------------------------
    //We first update the data that we have mapped on the page.

    allportsCopy[findportIndex].optical_route_id = id;
    allportsCopy[findportIndex].optical_route.name = name;
    allportsCopy[findportIndex].optical_route.id = id;
    allportsCopy[findportIndex].end_station = {
      name: end_station_name,
      id: end_station_id,
    };
    allportsCopy[findportIndex].length = length;
    if (allportsCopy[findportIndex].state == '') {
      allportsCopy[findportIndex].state = 'deactivate';
    }
    setAlldeletedports([])
    setAllrtuports(allportsCopy);
    // ----------------------------------------------------------------------------
  };

  const changestate = (index: number, state: string, opticalroutid: string) => {
    //We first update the data that we have mapped on the page.
    const oldallports = deepcopy(allrtuports);
    const findportIndex = oldallports.findIndex(
      (data: any) => data.index == index,
    );
    oldallports[findportIndex].state = state;
    setAllrtuports(oldallports);
    // ------------------------------------------------------------------
    if (oldallports[findportIndex].id.length > 0) {
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
            optical_route_id: opticalroutid,
            state: state,
            id: oldallports[findportIndex].id,
            optical_switch_port_index: index,
          },
        ]);
      }
    } else {
      const allcreateportCopy = deepcopy(allcreateport);
      const findcreateports = allcreateport.findIndex(
        data => data.optical_route_id == opticalroutid,
      );

     
      allcreateportCopy[findcreateports].state = state;
      setAllcreateport(allcreateportCopy);
    }
    setAlldeletedports([])
  };

  const deleteopticalroute = (id: string, opticalrouteid: string) => {
    if (id == '') {
      //
      const allrtuportsCopy = deepcopy(allrtuports);
      const findport = allrtuports.findIndex(
        data => data.optical_route_id == opticalrouteid,
      );
      // --------------------------
      const selectedoptionsCopy = deepcopy(selectedboxoptions);

      selectedoptionsCopy.push({
        id: opticalrouteid,
        name: allrtuports[findport].optical_route.name,

        end_station: {
          id: allrtuports[findport]?.end_station?.id,
          name: allrtuports[findport]?.end_station?.name,
        },
        length: allrtuports[findport].length,
      });

      setSelectedboxoptions(selectedoptionsCopy);
      // --------------------------------------
      allrtuportsCopy[findport] = {
        optical_route_id: '',
        state: '',
        index: allrtuportsCopy[findport].index,
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
      };
      setAllrtuports(allrtuportsCopy);
      // -----------------------------
      const newcreatedlist = allcreateport.filter(
        data => data.optical_route_id != opticalrouteid,
      );
      setAllcreateport(newcreatedlist);
    } else {
      // Swal.fire(swalsetting).then(async result => {
      //   if (result.isConfirmed) {
          const findid = alldeletedports.findIndex(data => data == id);
          if (findid < 0) {
            setAlldeletedports(prev => [...prev, id]);
          }
      //   }
      // });
    }
  };

  console.log("allrtuports",allrtuports);
  console.log("allcreateport",allcreateport);
  

  if (loading) {
    return <h1>Loading ...</h1>;
  }
  if (
    loggedInUser.role === UserRole.SUPER_USER ||
    rtunetworkidadmin.includes(params?.networkId!) ||
    rturegionidadmin.includes(params?.regionId!) ||
    rtustationidadmin.includes(params?.rtuId!)
  ) {
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
            allrtuports?.map((data, index: number) => (
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
                        index+1,
                        e.target.value.split('_')[0],
                        e.target.value.split('_')[1],
                        e.target.value.split('_')[2],
                        e.target.value.split('_')[3],
                        Number(e.target.value.split('_')[4]),
                        data.optical_route.id,
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
                        value={`${data.id}_${data.name}_${
                          data.end_station?.name || ''
                        }_${data.end_station?.id || ''}_${data.length}`}
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

                    <span className="basis-32">{data.length.toFixed(3)}</span>

                    <div className="basis-40">
                      <Select
                        onChange={e =>
                          changestate(
                            index+1,
                            e.target.value.toString().toLowerCase(),
                            data.optical_route_id,
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

                    </div>
                    <div className="flex basis-40 flex-row justify-around gap-x-4">
                      <>
                        <IoOpenOutline size={30} />
                        <div className={`p-2  border-[red] border-solid ${data.id != "" && alldeletedports.findIndex(deletedportsdata => deletedportsdata == data.id)>-1?"border-[2px]":"border-[0px]"}`}>
                        <IoTrashOutline
                          onClick={() =>
                            deleteopticalroute(data.id, data.optical_route_id)
                          }
                          className="cursor-pointer text-red-500"
                          size={30}
                        />
                        </div>
                      
                      </>
                      {/* )} */}
                    </div>
                  </>
                ) : null}
              </div>
            ))}
        </div>
        <div className="flex flex-col ">
          <div className="flex gap-x-4 self-end">
            {loggedInUser.role === UserRole.SUPER_USER ||
            rtunetworkidadmin.includes(params?.networkId!) ||
            rturegionidadmin.includes(params?.regionId!) ? (
              <SimpleBtn type="button" onClick={save}>
                Save
              </SimpleBtn>
            ) : null}

            <SimpleBtn>Cancel</SimpleBtn>
          </div>
        </div>
      </div>
    );
  } else return <ErrorPage403 />;
};

export default RtuPortsPage;
