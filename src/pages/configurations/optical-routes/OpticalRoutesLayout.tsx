import {useState} from 'react';
import {FC} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {NavLink} from 'react-router-dom';
import {SidebarItem, TextInput} from '~/components';
import {Opticalroute} from '~/components/chart';
import {useHttpRequest} from '~/hooks';
import {SidebarLayout} from '~/layout';
import Checkbox from '~/components/checkbox/checkbox';
import {$DELETE, $GET} from '~/util/requestapi';
import {IoTrashOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import {
  setNetworkselectedlist,
  setNetworkoptical,
  setAlldeleteopticalroute,
  setAllcheckednetwork,
} from './../../../store/slices/opticalroutslice';


type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

// ----- main ----- main ----- main ------ main ------- main ------- main
const OpticalRouteLayout: FC = () => {
  const dispatch = useDispatch();
  const [checkallnetwork, setChekallnetwork] = useState(false);
  const {
    networkselectedlist,
    networkoptical,
    alldeleteopticalroute,
    allcheckednetwork,
  } = useSelector((state: any) => state.opticalroute);
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

  const checkallnetworkopticall = async (e: any, id: string) => {
    let oldoptical: any;
    let oldnetwork = JSON.parse(JSON.stringify(allcheckednetwork));
    // if we check that checkbox is checked or not
    if (e) {
      oldnetwork.push(id);
      dispatch(setAllcheckednetwork(oldnetwork));

      const opticals = await $GET(`otdr/optical-route/?network_id=${id}`);
      const all = opticals.map((data: any) => ({id:data.id}));
      oldoptical = [...alldeleteopticalroute.filter((data:any)=> data.networkid != id), {networkid:id,opticalrouts:all}];
      dispatch(setAlldeleteopticalroute(oldoptical));
    } else {
      const newnetworklist = oldnetwork.filter((data: any) => data != id);
      dispatch(setAllcheckednetwork(newnetworklist));
      oldoptical = [...alldeleteopticalroute];
      const newopticallist=alldeleteopticalroute.filter((data:any)=>  data.networkid != id)
      // We delete all the opticalroutes related to this network from the list of all opticalroutes
   
      dispatch(setAlldeleteopticalroute(newopticallist));

    }
  };

  const [openall, setOpenall] = useState(false);


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
        <Checkbox
          checkstatus={
            allcheckednetwork.findIndex((data: any) => data == id) > -1
              ? true
              : false
          }
          onclick={(e: boolean) => checkallnetworkopticall(e, id)}
          iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
          classname={
            'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
          }
        />
        <button
          onClick={() => opennetworkopticallist(id)}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
        {networkselectedlist.indexOf(id) > -1 ? (
          <NavLink to={`create/${id}`} end>
            {allcheckednetwork.findIndex((data: any) => data == id) >
            -1 ? null : (
              <BsPlusLg color="#18C047" className="ml-[10px]" />
            )}
          </NavLink>
        ) : null}

        {allcheckednetwork.findIndex((data: any) => data == id) > -1 ? (
          <IoTrashOutline
          onClick={()=>deletenetworkoptical(id)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = async (id: string) => {
    const findnetwork = networkselectedlist.findIndex(
      (data: any) => data == id,
    );
    //We first check whether network has been clicked before or not.
    if (findnetwork > -1) {
      let old = [...networkselectedlist];
      old.splice(findnetwork, 1);
      dispatch(setNetworkselectedlist(old));
    } else {
      let old = [...networkselectedlist];
      old.push(id);
      dispatch(setNetworkselectedlist(old));
    }
    // -------------------
    const findopt = networkoptical.findIndex(
      (data: any) => data.networkid == id,
    );
    const opticals = await $GET(`otdr/optical-route/?network_id=${id}`);
//Here we add or remove the opticalroutes related to this network to the list.
    if (findopt > -1) {
      let old = [...networkoptical];
      let newdata = old.filter(data => data.networkid != id);
      newdata.push({networkid: id, opticalrouts: opticals});
      dispatch(setNetworkoptical(newdata));
    } else {
      let old = [...networkoptical];
      const opticals = await $GET(`otdr/optical-route/?network_id=${id}`);
      old.push({networkid: id, opticalrouts: opticals});
      dispatch(setNetworkoptical(old));
    }
  };

  const onclickopticalchecbox = (e: boolean, opticalid: string,networkid:string) => {
    let oldoptical:any =JSON.parse(JSON.stringify(alldeleteopticalroute));
   
    let finddataindex=oldoptical.findIndex((data:any)=> data.networkid ==networkid )
    if(finddataindex>-1){
      if (e) {
        console.log(oldoptical[finddataindex],'lklkooo');
        const newdata=JSON.parse(JSON.stringify(oldoptical[finddataindex].opticalrouts)) 
        newdata.push({id:opticalid})
        oldoptical[finddataindex].opticalrouts=newdata
        dispatch(setAlldeleteopticalroute(oldoptical));
      } else {
        const newdata=oldoptical[finddataindex].opticalrouts.filter((data:any)=> data.id != opticalid)
        oldoptical[finddataindex].opticalrouts=newdata
        dispatch(setAlldeleteopticalroute(oldoptical));
      }
    }else{
      oldoptical.push({networkid:networkid,opticalrouts:[{id:opticalid}]})
      dispatch(setAlldeleteopticalroute(oldoptical));
    }
   
  };

  console.log(alldeleteopticalroute, 'fff');

  const deleteoneopticalroute = async (
    opticalid: string,
    networkid: string,
  ) => {
    const deleteoptical = await $DELETE(`otdr/optical-route/${opticalid}`);
    let old = JSON.parse(JSON.stringify(networkoptical));
    const finddataindex = old.findIndex(
      (data: any) => data.networkid == networkid,
    );
    const newnetworkopticaldata = old[finddataindex].opticalrouts.filter(
      (data: any) => data.id != opticalid,
    );
    const newdata = old.filter((data: any) => data.networkid != networkid);
    newdata.push({networkid: networkid, opticalrouts: newnetworkopticaldata});
    dispatch(setNetworkoptical(newdata));
  };


  const deletenetworkoptical=(id:string)=>{
    let oldoptical:any =JSON.parse(JSON.stringify(alldeleteopticalroute));
    const finddata=oldoptical.find((data:any)=> data.networkid == id) 
  }
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
        <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
          {openall ? (
            <span className="ml-[-4px] mr-[5px] font-light">-</span>
          ) : (
            <span className="mb-[5px] ml-[3px] mr-[5px] font-light">+</span>
          )}
          <Checkbox
            checkstatus={checkallnetwork}
            onclick={() => setChekallnetwork(!checkallnetwork)}
            iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
            classname={
              'w-[20px] h-[20px] mr-[4px]  border-[1px] border-[#000000]'
            }
          />
          <button onClick={() => setOpenall(!openall)}>
            <span>Networks</span>
          </button>
          <IoTrashOutline
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        </div>

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
                        ?.find((dataa: any) => dataa.networkid == dataaa.id)
                        ?.opticalrouts.map((data: any, index: number) => (
                          <div
                            key={index}
                            className="flex w-full flex-row items-center">
                            <span className="w-[15px] text-[12px]">.....</span>

                            <SidebarItem
                              onclick={e => onclickopticalchecbox(e, data.id,dataaa.id)}
                              checkstatus={alldeleteopticalroute.find((data:any) => data.networkid == dataaa.id)?.opticalrouts.findIndex((data2:any) => data2.id == data.id) > -1?true:false
                            
                              }
                              onDelete={() =>
                                deleteoneopticalroute(data.id, dataaa.id)
                              }
                              enabelcheck={true}
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
