import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import {SidebarItem} from '~/components';
import { useHttpRequest } from '~/hooks';
import { RootState } from '~/store';
import {deepcopy} from '~/util';
import {
  setNetworkregions,
  setRegionstations,
  setStationsrtu,
} from './../../store/slices/networktreeslice';

const allregions = ['13', '14', '15', '16'];
const allstation = ['17', '18', '19', '20'];
type ItemspROPS = {
  to: string;
  selected: boolean;
  key: number;
  onDelete: () => void;
  onclick: () => void;
  id: string;
  name: string;
  enabelcheck?:boolean,
  checkstatus?:boolean,
  pluse?:boolean
};
type Iprops={
  children:React.ReactNode
}

function NetworkLayout() {
  const dispatch = useDispatch();
  const [showAllnetworks, setShowallnetworks] = useState(false);
  const [allselectedId, setAllselectedId] = useState<string[]>([]);
  const [networkId, setNetworkId] = useState('');
  const [mount, setMount] = useState(false);
  const {stationsrtu, regionstations, networkregions} = useSelector(
    (state: RootState) => state.networktree,
  );
  const {
    request,
    state: {list, regions},
  } = useHttpRequest({
    selector: state => ({
      list: state.http.networkList,
      regions: state.http.regionList,
    }),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
  });
  const onclicknetwork = async (id: string) => {
    request('regionList', {params: {network_id: id}});
  };
  
  useEffect(() => {

    if (mount) {
      const finddata = networkregions.filter(
        data => data.networkid == networkId,
      );
      const maindata = regions?.data || [];

      let allregionsid: any = [];
      if (maindata.length > 0 && finddata.length == 0) {
        for (let i = 0; i < maindata?.length; i++) {
          allregionsid.push({id: maindata[i].id, name: maindata[i].name});
        }
        const old = deepcopy(networkregions);
        old.push({
          networkid: (regions?.data && regions?.data[0]?.network_id) || '',
          regions: allregionsid,
        });
        dispatch(setNetworkregions(old));
      }
    } else {
      setMount(true);
    }
  }, [regions]);


  const Items = ({
    to,
    selected,
    key,
    onDelete,
    onclick,
    id,
    name,
    enabelcheck=false,
    checkstatus=false,
    pluse=true
  }: ItemspROPS) => {
    return (
      <div className="mb-[15px] flex h-[40px] flex-row items-center">
        <span className="mr-[4px] text-[20px]">....</span>
        {pluse?
        <>
         {allselectedId.indexOf(id) > -1 ? (
          <span
            // onClick={() => onclikitems(id)}
            className="mt-[-4px] cursor-pointer text-[20px]">
            _
          </span>
        ) : (
          <>
            <span
              // onClick={() => onclikitems(id)}
              className="mb-[-5px] cursor-pointer text-[20px]">
              +
            </span>
          </>
        )}
        </>:null}
       
        <SidebarItem
          onclick={() => onclick()}
          selected={true}
    
          className="flex-start mb-[-5px] ml-[5px] w-full pl-[2px]"
          name={name}
          to={to}
          key={key}
          enabelcheck={enabelcheck}
          checkstatus={checkstatus}
          onDelete={() => onDelete()}
        />
      </div>
    );
  };

  const onclikitems = (id: string) => {
    const findId = allselectedId.findIndex(data => data == id);
    if (findId > -1) {
      let allselectedIdCopy: string[] = deepcopy(allselectedId);
      const newlist = allselectedIdCopy.filter(data => data != id);
      setAllselectedId(newlist);
    } else {
      setAllselectedId(prev => [...prev, id]);
    }
  };
  return (
    <>
    <div className="flex h-[calc(100vh-120px)] w-1/4 flex-col overflow-y-auto border-r-2  border-g p-4">
      <div className="flex flex-row">
        {showAllnetworks ? (
          <span
            onClick={() => setShowallnetworks(!showAllnetworks)}
            className="mt-[-7px] cursor-pointer text-[20px]">
            _
          </span>
        ) : (
          <span
            onClick={() => setShowallnetworks(!showAllnetworks)}
            className="cursor-pointer text-[20px]">
            +
          </span>
        )}

        <span
          onClick={() => setShowallnetworks(!showAllnetworks)}
          className="ml-[5px] cursor-pointer text-[20px] font-bold">
          Networks
        </span>
      </div>

      {showAllnetworks ? (
        <div className="flex relative  w-full flex-col border-l-2 border-dashed border-black">
        <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
          {list?.data?.map(networkdata => (
            <>
              <Items
                key={Number(networkdata.id)}
                to={networkdata.id}
                selected={false}
                onDelete={() => {}}
                onclick={() => {
                  onclikitems(networkdata.id),
                  onclicknetwork(networkdata.id),
                    () => setNetworkId(networkdata.id);
                }}
                // onclick={() => onclikitems(data.id)}
                id={networkdata.id}
                name={networkdata.name}
              />

              {allselectedId.indexOf(networkdata.id) > -1 ? (
                <>
                  <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                    <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
                    {networkregions
                        .find(
                          networkregionsdata =>
                            networkregionsdata.networkid == networkdata.id,
                        )
                        ?.regions.map(regionsdata => (
                      <>
                        <Items
                          key={Number(regionsdata.id)}
                          to={`../regions/${regionsdata.id}`}
                          selected={false}
                          onDelete={() => {}}
                          onclick={() => onclikitems(regionsdata.id)}
                          id={regionsdata.id}
                          name={regionsdata.name}
                        />
                        {allselectedId.indexOf(regionsdata.id) > -1 ? (
                          <div className="relative ml-[32px]  mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                              <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
                            <Items
                              key={Number(regionsdata.id)}
                              to={'dede'}
                              selected={false}
                              onDelete={() => {}}
                              onclick={() => onclikitems('888888')}
                              id={'888888'}
                              name="Stations"
                            />

                            {allselectedId.indexOf('888888') > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>

                                {allstation.map(data => (
                                  <Items
                                    key={Number(data)}
                                    to={'dede'}
                                    selected={false}
                                    onDelete={() => {}}
                                    enabelcheck={true}
                                    checkstatus={true}
                                    pluse={false}
                                    onclick={() => onclikitems(data)}
                                    id={data}
                                    name="station1"
                                  />
                                ))}
                              </div>
                            ) : null}
                            <Items
                              key={Number(regionsdata.id)}
                              to={'dede'}
                              selected={false}
                              onDelete={() => {}}
                              onclick={() => onclikitems('99999')}
                              id={'99999'}
                              name="Links"
                            />
                               {allselectedId.indexOf('99999') > -1 ? (
                              <div className="relative ml-[32px] mt-[-25px] flex flex-col border-l-[2px] border-dashed border-black pt-[20px]">
                                <div className="absolute bottom-[-3px] left-[-10px] z-10 h-[30px] w-[20px] bg-[#E7EFF7]"></div>
                                <div className="absolute bottom-[3px] left-[-40px] z-10 h-full w-[20px] bg-[#E7EFF7]"></div>
                                {allstation.map(data => (
                                  <Items
                                    key={Number(data)}
                                    to={'dede'}
                                    selected={false}
                                    onDelete={() => {}}
                                    enabelcheck={true}
                                    checkstatus={true}
                                    onclick={() => onclikitems(data)}
                                    id={data}
                                    pluse={false}
                                    name="link1"
                                
                                  />
                                ))}
                              </div>
                            ) : null}
                          </div>
                        ) : null}
                      </>
                    ))}
                    <Items
                      key={Number(networkdata.id)}
                      to={'dede'}
                      selected={false}
                      onDelete={() => {}}
                      onclick={() => onclikitems("iioio")}
                      id={"ikuiuiu"}
                      name="Default Region"
                    />
                  </div>
                </>
              ) : null}
            </>
          ))}
        </div>
      ) : null}
      
            {/* <div className="ml-[5px] mt-[-6px] border-l-[1px]  border-dashed border-black  pt-[20px]">
               {children}
            </div> */}
       
    </div>
         <div className="flex w-full px-8 py-6">
         <Outlet />
       </div>
       </>
  );
}

export default NetworkLayout;

// import {FC, ReactNode, useState} from 'react';
// import {TextInput} from '~/components';
// import {Link, Outlet} from 'react-router-dom';
// import {IoAddOutline} from 'react-icons/io5';

// type PropsType = {
//   children: ReactNode;
//   createTitle?: string;
//   searchOnChange?: (text: string) => void;
//   canAdd?: boolean;
//   addButtonLink?: string;
//   hideSidebar?: boolean;
// };
// const NetworkLayout: FC<PropsType> = ({
//   children,
//   createTitle,
//   searchOnChange,
//   canAdd,
//   addButtonLink,
//   hideSidebar = false,
// }) => {
//   const [show, setShow] = useState(false);
//   return (
//     <>
//       {!hideSidebar && (
//         <div className="flex min-h-[calc(100vh-120px)] w-1/4 flex-col overflow-y-auto border-r-2  border-g p-4">
//           {searchOnChange ? (
//             <div className="flex flex-row items-center">
//               <label htmlFor="search" className="mr-2">
//                 Search
//               </label>

//               <TextInput
//                 id="search"
//                 className="mr-10 w-full"
//                 onChange={event => {
//                   searchOnChange(event.target.value);
//                 }}
//               />
//             </div>
//           ) : null}

//           {createTitle ? (
//             <div className="ml-[-10px]  mt-14 flex w-fit flex-row items-center rounded-md px-3 py-2 pb-[0px]">
//               {show ? (
//                 <span
//                   onClick={() => setShow(!show)}
//                   className="mr-[5px] mt-[-10px] cursor-pointer">
//                   _
//                 </span>
//               ) : (
//                 <span
//                   onClick={() => setShow(!show)}
//                   className="mr-[5px] cursor-pointer text-[20px]">
//                   +
//                 </span>
//               )}

//               <button
//                 onClick={() => setShow(!show)}
//                 className="text-md font-semibold">
//                 {createTitle}
//               </button>
//               {canAdd ? (
//                 <Link
//                   to={addButtonLink || 'create'}
//                   className="ml-3 rounded-md">
//                   <IoAddOutline className="text-2xl text-green-500 active:text-green-300" />
//                 </Link>
//               ) : null}
//             </div>
//           ) : null}
//           {show ? (
//             <div className="ml-[5px] mt-[-6px] border-l-[1px]  border-dashed border-black  pt-[20px]">
//               {children}
//             </div>
//           ) : null}
//         </div>
//       )}
//       <div className="flex w-full px-8 py-6">
//         <Outlet />
//       </div>
//     </>
//   );
// };

// export default NetworkLayout;
