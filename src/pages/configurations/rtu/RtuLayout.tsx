import {FC, useState} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
type Itembtntype = {
  name: string;
};
const RtuLayout: FC = () => {
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

  console.log(list, 'listlistlist');

  const [openall, setOpenall] = useState(false);
  const [networkselectedlist, setNetworkselectedlist] = useState<string[]>([]);

  const Itembtn = ({name}: Itembtntype) => {
    return (
      <div
        className={`flex h-[60px] w-auto flex-row items-center  text-[20px] text-[#000000]`}>
        <span className="mt-[-6px] text-[12px] ">...</span>
        {networkselectedlist.indexOf(name) > -1 ? (
          <span className="mx-[3px] font-light">-</span>
        ) : (
          <span className="mx-[3px] mt-[-2px] font-light">+</span>
        )}

        <button
          onClick={() => opennetworkopticallist(name)}
          className={`${
            networkselectedlist.indexOf(name) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
        {networkselectedlist.indexOf(name) > -1 ? (
          <BsPlusLg color="#18C047" className="ml-[10px]" />
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = (name: string) => {
    const findnetwork = networkselectedlist.findIndex(data => data == name);
    if (findnetwork > -1) {
      let old = [...networkselectedlist];
      old.splice(findnetwork, 1);
      setNetworkselectedlist(old);
    } else {
      setNetworkselectedlist(prev => [...prev, name]);
    }
  };
  return (
    // <SidebarLayout createTitle="Remote Test Units" canAdd>
    //   <SidebarItem name="RTU1" to="rtu-id-goes-here" />
    // </SidebarLayout>
    <div className="flex h-[calc(100vh-140px)] w-1/4 flex-col overflow-y-auto border-r-2  border-g p-4">
      <div className="flex flex-row items-center">
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
            className={` mt-[-10px] w-full border-l-[1px] border-dotted border-[#000000]`}>
            <div className="flex flex-col">
              <Itembtn name={'Network1'} />
              <div className=" relative ml-[17px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                {networkselectedlist.indexOf('Network1') > -1 ? (
                  <div className="absolute left-[-1px] top-[-23px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                ) : null}
                {/* <div className="absolute bottom-[-7px] left-[-2.5px] z-20 h-[30px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div> */}
                {networkselectedlist.indexOf('Network1') > -1 ? (
                  <>
                    <div className="flex w-full flex-row items-center">
                      {/* <span className="mt-[-6px] w-[25px] text-[12px]">
                      .....
                    </span> */}
                      <Itembtn name={'Region 1'} />
                    </div>
                    {networkselectedlist.indexOf('Region 1') > -1 ? (
                      <div className=" relative ml-[16px] mt-[2px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                        <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                        <div className="absolute bottom-[-11px]  left-[-2.5px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div>
                        <div className="flex w-full flex-row items-center ">
                          <span className="mt-[-6px] w-[10px] text-[12px]">
                            ...
                          </span>
                          <Itembtn name={'Station1'} />
                        </div>
                        {networkselectedlist.indexOf('Station1') > -1 ? (
                          <div className=" relative ml-[28px] flex  flex-col border-l-[1px] border-dotted  border-[#000000]">
                            <div className="absolute left-[-1px] top-[-28px] z-10 h-[27px] w-[5px]  border-l-[1px] border-dotted border-[#000000]"></div>
                            {/* <div className="absolute bottom-[-5.5px] left-[-2.5px] z-10 h-[40px] w-[5px] border-l-[1px] bg-[#E7EFF7]"></div> */}
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

                        <div className="flex w-full flex-row items-center  ">
                          <span className="mt-[-6px] w-[10px] text-[12px]">
                            ...
                          </span>
                          <Itembtn name={'Station2'} />
                        </div>
                      </div>
                    ) : null}

                    <div className="flex w-full flex-row items-center">
                      {/* <span className="mt-[-6px] w-[25px] text-[12px]">
                      .....
                    </span> */}
                      <Itembtn name={'Region 2'} />
                    </div>
                  </>
                ) : null}
              </div>
            </div>

            <Itembtn name={'Network2'} />

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
    </div>
  );
};

export default RtuLayout;
