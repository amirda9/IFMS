import {useState} from 'react';
import {FC} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {NavLink} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
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

  const lastnetwork =
    (list?.data && list?.data[list?.data?.length - 1].id) || '';
  // ######################################################################
  return (
    <SidebarLayout  createTitle="" canAdd>
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
            {list?.data?.map((data, index) => (
              <div
                key={index}
                className={`mt-[-10px] relative w-full  border-l-[1px] border-dotted   ${ list?.data && index == list?.data?.length-1?"border-none":"border-[#000000]"}  `}>
               { list?.data && index == list?.data?.length-1?
                  <div className='border-l-[1px] ml-[0px] border-dotted border-[#000000] absolute h-[36px]'></div>:null}
                <div className={`z-10 absolute ${networkselectedlist.indexOf(data.id) > -1?"bottom-[-2px]":"bottom-[-7px]"}  bg-[#E7EFF7] left-[15px] h-[25px] w-[5px]`}></div>
              
              
                <div className="flex flex-col relative">

                  <Itembtn
                    classname="mb-[-10px]"
                    name={data.name}
                    id={data.id}
                  />
                 

                  {networkselectedlist.indexOf(data.id) > -1 ? (
                    <div className='flex relative flex-col border-l-[1px] ml-[18px] border-dotted border-[#000000]'>
                     
                       <div className='border-dotted border-[#000000] h-[18px] border-l-[1px] absolute top-[-20px] left-[-1px]'></div>
                      <div className="flex w-full flex-row items-center">
                        <span className="w-[15px] text-[12px]">.....</span>

                        <SidebarItem
                          className="ml-[5px] w-[calc(100%-20px)] mt-[10px]"
                          name="Optical Route 1"
                          to={data.name}
                        />
                      </div>
                      <div className="flex w-full flex-row items-center">
                        <span className="w-[15px] text-[12px]">.....</span>

                        <SidebarItem
                          className="ml-[5px] w-[calc(100%-20px)] mt-[10px]"
                          name="Optical Route 1"
                          to={data.name}
                        />
                      </div>
                   
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
