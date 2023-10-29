import {useState} from 'react';
import {FC} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {NavLink} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {Opticalroute} from '~/components/chart';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import {$GET} from '~/util/requestapi';
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
};

// ----- main ----- main ----- main ------ main ------- main ------- main
const OpticalRouteLayout: FC = () => {
  const {
    request,
    state: {list, deleteRequest},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      deleteRequest: state.http.networkDelete,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
    onUpdate: (lastState, state) => {
      if (
        lastState.deleteRequest?.httpRequestStatus === 'loading' &&
        state.deleteRequest!.httpRequestStatus === 'success'
      ) {
        request('networkList', undefined);
      }
    },
  });

  const [openall, setOpenall] = useState(false);
  const [networkselectedlist, setNetworkselectedlist] = useState<string[]>([]);
  const [networkoptical, setNetworkoptical] = useState<
    {networkid: string; opticalrouts: {name: string; id: string}[]}[]
  >([]);

  const Itembtn = ({name, id, classname}: Itembtntype) => {
    return (
      <div
        className={`flex h-[70px] w-auto flex-row items-center  text-[20px] text-[#000000] ${classname}`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(id) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => opennetworkopticallist(id)}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
        {networkselectedlist.indexOf(id) > -1 ? (
          <NavLink to={`create/${id}`} end>
            <BsPlusLg color="#18C047" className="ml-[10px]" />
          </NavLink>
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = async (id: string) => {
    const findnetwork = networkselectedlist.findIndex(data => data == id);
    if (findnetwork > -1) {
      let old = [...networkselectedlist];
      old.splice(findnetwork, 1);
      setNetworkselectedlist(old);
    } else {
      setNetworkselectedlist(prev => [...prev, id]);
    }
    const findopt = networkoptical.findIndex(data => data.networkid == id);
    const opticals = await $GET(`otdr/optical-route/?network_id=${id}`);
    let old = [...networkoptical];
    if (findopt > -1) {
      old[findopt].opticalrouts = opticals;
      setNetworkoptical(old);
    } else {
      const opticals = await $GET(`otdr/optical-route/?network_id=${id}`);
      setNetworkoptical(prev => [...prev, {networkid: id, opticalrouts:opticals}]);
    }
  };
  console.log(networkoptical, 'fff');

  const lastnetwork =
    (list?.data && list?.data[list?.data?.length - 1].id) || '';
  // ######################################################################
  return (
    <SidebarLayout createTitle="" canAdd>
      {/* <div className="flex h-[calc(100vh-140px)] relative w-1/4 flex-col overflow-y-auto border-r-2  border-g p-4"> */}

      <div className="flex flex-row items-center ">
        <label htmlFor="search" className="mr-2">
          Search
        </label>

        <TextInput
          id="search"
          className="mr-10 w-full"
          onChange={event => {
            console.log(event);
          }}
        />
      </div>

      <div className={`relative mt-[30px] flex w-full flex-col`}>
        <div
          className={`absolute h-[40px] w-[10px] ${
            networkselectedlist.indexOf(lastnetwork) > -1
              ? 'bottom-[-20px]'
              : 'bottom-[-15.5px]'
          }  left-[-5px] bg-[#E7EFF7]`}></div>
        <button
          onClick={() => setOpenall(!openall)}
          className="flex w-[95px] flex-row text-[20px] font-bold text-[#000000]">
          {openall ? (
            <span className="ml-[-4px] mr-[5px] font-light">-</span>
          ) : (
            <span className="mb-[5px] ml-[3px] mr-[5px] font-light">+</span>
          )}

          <span>Networks</span>
        </button>

        {openall ? (
          <>
            {list?.data?.map((dataaa, index) => (
              <div
                key={index}
                className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                  list?.data && index == list?.data?.length - 1
                    ? 'border-none'
                    : 'border-[#000000]'
                }  `}>
                {list?.data && index == list?.data?.length - 1 ? (
                  <div className="absolute ml-[0px] h-[36px] border-l-[1px] border-dotted border-[#000000]"></div>
                ) : null}
                <div
                  className={`absolute z-10 ${
                    networkselectedlist.indexOf(dataaa.id) > -1
                      ? 'bottom-[-2px]'
                      : 'bottom-[-7px]'
                  }  left-[15px] h-[25px] w-[5px] bg-[#E7EFF7]`}></div>

                <div className="relative flex flex-col">
                  <Itembtn
                    classname="mb-[-10px]"
                    name={dataaa.name}
                    id={dataaa.id}
                  />

                  {networkselectedlist.indexOf(dataaa.id) > -1 ? (
                    <div className="relative ml-[18px] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                      <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                      {networkoptical
                        ?.find(dataa => dataa.networkid == dataaa.id)
                        ?.opticalrouts.map((data, index) => (
                          <div
                            key={index}
                            className="flex w-full flex-row items-center">
                            <span className="w-[15px] text-[12px]">.....</span>

                            <SidebarItem
                              className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                              name={data.name}
                              to={data.id}
                            />
                          </div>
                        ))}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </>
        ) : null}
      </div>
      {/* </div> */}
    </SidebarLayout>
  );
};

export default OpticalRouteLayout;
