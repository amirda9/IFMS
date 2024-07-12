import {useEffect, useMemo, useState} from 'react';
import {FC} from 'react';
import {BsPlusLg} from 'react-icons/bs';
import {NavLink, useNavigate} from 'react-router-dom';
import {SidebarItem, SimpleBtn, TextInput} from '~/components';
import {SidebarLayout} from '~/layout';
import Swal from 'sweetalert2';
import {$Delete, $Get} from '~/util/requestapi';
import {IoTrashOutline} from 'react-icons/io5';
import {useDispatch, useSelector} from 'react-redux';
import {
  setNetworkselectedlist,
  setNetworkoptical,
  setAlldeleteopticalroute,
  alldeleteopticalroutetype,
  networkopticaltype,
  setopenall,
} from './../../../store/slices/opticalroutslice';
import {deepcopy} from '~/util';
import {RootState} from '~/store';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
type networklisttype = {
  id: string;
  name: string;
  time_created: string;
  time_updated: string;
};
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

// ----- main ----- main ----- main ------ main ------- main ------- main
const swalsetting: any = {
  title: 'Are you sure you want to delete these components?',
  // text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
};

const OpticalRouteLayout: FC = () => {
  const dispatch = useDispatch();
  const navigte = useNavigate();
  const [selectedId, setSelectedId] = useState('');
  const [list, setList] = useState<networklisttype[]>([]);
  const [loadingid, setLoadingid] = useState('');
  const [loadingdata, setLoadingdata] = useState(false);
  const [skip, setSkip] = useState(0);
  const [networkloading, setNetworkloading] = useState(false);
  const {networkselectedlist, networkoptical, alldeleteopticalroute, openall} =
    useSelector((state: RootState) => state.opticalroute);

  useEffect(() => {
    const getnetworklist = async () => {
      try {
        setLoadingdata(true);
        setNetworkloading(true);
        const response = await $Get(`otdr/network?limit=10&skip=${skip}`);
        if (response?.status == 200) {
          const responsedata = await response?.json();
          const listCopy = deepcopy(list);
          const newlist = [...listCopy, ...responsedata];
          setList(newlist);
        }
      } catch (error) {
      } finally {
        setLoadingdata(false);
        setNetworkloading(false);
      }
    };
    getnetworklist();
  }, [skip]);

  const findoptical = (networkId: string, opticalId: string) => {
    const findopt = alldeleteopticalroute
      ?.find(data => data.networkid == networkId)
      ?.opticalrouts?.findIndex((data2: string) => data2 == opticalId);
    if (findopt != undefined && findopt > -1) {
      return true;
    } else {
      return false;
    }
  };

  // const [openall, setOpenall] = useState(false);

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
          onClick={() => {
            opennetworkopticallist(id), setSelectedId(id), setLoadingid(id);
          }}
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
        {selectedId == id ? (
          <IoTrashOutline
            onClick={() => deletenetworkoptical(id)}
            color="#FF0000"
            size={24}
            className="ml-[20px] cursor-pointer"
          />
        ) : null}
      </div>
    );
  };

  const opennetworkopticallist = async (id: string) => {
    try {
      setLoadingdata(true);
      const findnetwork = networkselectedlist.findIndex(data => data == id);
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
      const findopt = networkoptical.findIndex(data => data.networkid == id);
      const opticals = await $Get(`otdr/optical-route/?network_id=${id}`);
      if (opticals?.status == 200) {
        const opticalslist = await opticals?.json();
        //Here we add or remove the opticalroutes related to this network to the list.
        if (findopt > -1) {
          let old = [...networkoptical];
          let newdata = old.filter(data => data.networkid != id);
          newdata.push({networkid: id, opticalrouts: opticalslist});
          dispatch(setNetworkoptical(newdata));
        } else {
          let old = [...networkoptical];
          old.push({networkid: id, opticalrouts: opticalslist});
          dispatch(setNetworkoptical(old));
        }
      }
    } catch (error) {
      console.log(`error is :${error}`);
    } finally {
      setLoadingdata(false);
    }
  };

  const onclickopticalchecbox = (
    e: boolean,
    opticalid: string,
    networkid: string,
  ) => {
    let oldoptical: alldeleteopticalroutetype = deepcopy(alldeleteopticalroute);

    let finddataindex = alldeleteopticalroute.findIndex(
      data => data.networkid == networkid,
    );
    if (finddataindex > -1) {
      if (e) {
        const newdata = deepcopy(oldoptical[finddataindex].opticalrouts);
        newdata.push(opticalid);
        oldoptical[finddataindex].opticalrouts = newdata;
        dispatch(setAlldeleteopticalroute(oldoptical));
      } else {
        const newdata = oldoptical[finddataindex].opticalrouts.filter(
          data => data != opticalid,
        );
        oldoptical[finddataindex].opticalrouts = newdata;
        dispatch(setAlldeleteopticalroute(oldoptical));
      }
    } else {
      oldoptical.push({networkid: networkid, opticalrouts: [opticalid]});
      dispatch(setAlldeleteopticalroute(oldoptical));
    }
  };

  const deleteoneopticalroute = async (
    opticalid: string,
    networkid: string,
  ) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        //First, we find the list of optical routes of this network that have their checkboxes checked.
        const findopticalroute = alldeleteopticalroute.findIndex(
          data => data.networkid == networkid,
        );
        const alldeleteopticalrouteCopy = deepcopy(alldeleteopticalroute);

        try {
          const promises = alldeleteopticalroute[
            findopticalroute
          ]!.opticalrouts!.map((data: string) =>
            $Delete(`otdr/optical-route/${data}`),
          );
          const results = await Promise.all(promises);
          let networkopticalCopy = deepcopy(networkoptical);
          const finddataindex = networkoptical.findIndex(
            data => data.networkid == networkid,
          );
          networkopticalCopy[finddataindex].opticalrouts = [];
          const networkselectedlistCopy = deepcopy(networkselectedlist);
          const newnetworkselectedlistCopy = networkselectedlistCopy.filter(
            (data: string) => data != networkid,
          );
          dispatch(setNetworkselectedlist(newnetworkselectedlistCopy));

          dispatch(setNetworkoptical(networkopticalCopy));
          //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
          alldeleteopticalrouteCopy[findopticalroute].opticalrouts = [];
          dispatch(setAlldeleteopticalroute(alldeleteopticalrouteCopy));
        } catch (error) {
          console.log(error);
        } finally {
          navigte(`/config/optical-routes`);
        }
      }
    });
  };

  const deletenetworkoptical = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        try {
          let networkopticalCopy: networkopticaltype = deepcopy(networkoptical);
          const finddata = networkoptical.findIndex(
            (data: any) => data.networkid == id,
          );
          //delete all rtues related to this netwok

          const promises = networkopticalCopy[finddata].opticalrouts!.map(
            data => $Delete(`otdr/optical-route/${data.id}`),
          );
          const results = await Promise.all(promises);
          // if (deleteOticalroute?.status == 201) {
          networkopticalCopy[finddata].opticalrouts = [];
          // }
          dispatch(setNetworkoptical(networkopticalCopy));
          // -------------------------------
          //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
          const alldeleteopticalrouteCopy: alldeleteopticalroutetype = deepcopy(
            alldeleteopticalroute,
          );
          const finddeleteopticalrout = alldeleteopticalrouteCopy.findIndex(
            data => data.networkid == id,
          );
          const networkselectedlistCopy = deepcopy(networkselectedlist);
          const newnetworkselectedlistCopy = networkselectedlistCopy.filter(
            (data: string) => data != id,
          );
          dispatch(setNetworkselectedlist(newnetworkselectedlistCopy));
          alldeleteopticalrouteCopy[finddeleteopticalrout].opticalrouts = [];
          dispatch(setAlldeleteopticalroute(alldeleteopticalrouteCopy));
        } catch (error) {
          console.log(`deletenetworkError is:${error}`);
        } finally {
          navigte(`/config/optical-routes`);
        }
      }
    });
  };

  const lastnetwork = useMemo(() => {
    return (list && list[list.length - 1]?.id) || '';
  }, [list]);

  return (
    <SidebarLayout createTitle="" canAdd>
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

          <button
            onClick={() => {
              dispatch(setopenall(!openall)), setLoadingid('allnetworks');
            }}>
            <span>Optical Routes</span>
          </button>
        </div>

        {openall ? (
          <>
            {loadingid == 'allnetworks' && loadingdata ? (
              <GeneralLoadingSpinner size="w-8 h-8" className="ml-8 mt-2" />
            ) : (
              <>
                {Array.isArray(list) &&
                  list?.map((networkdata, index) => (
                    <div
                      key={index}
                      className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                        list && index == list?.length - 1
                          ? 'border-none'
                          : 'border-[#000000]'
                      }  `}>
                      {list && index == list?.length - 1 ? (
                        <div className="absolute ml-[0px] h-[36px] border-l-[1px] border-dotted border-[#000000]"></div>
                      ) : null}
                      <div
                        className={`absolute z-10 ${
                          networkselectedlist.indexOf(networkdata.id) > -1
                            ? 'bottom-[-2px]'
                            : 'bottom-[-7px]'
                        }  left-[15px] h-[25px] w-[5px] bg-[#E7EFF7]`}></div>

                      <div className="relative flex flex-col">
                        <Itembtn
                          classname="mb-[-10px]"
                          name={networkdata.name}
                          id={networkdata.id}
                        />
                        <div className='overflow-y-hidden'>
                         
                            <>
                              {networkselectedlist.indexOf(networkdata.id) >
                              -1 ? (
                                <>
                                {(loadingid == networkdata.id && loadingdata) ?
                                   <GeneralLoadingSpinner
                                   size="w-8 h-8"
                                   className="ml-8 mt-2"
                                 />
                                :
                                <div className="relative ml-[18px] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                                <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                                {networkoptical
                                  ?.find(
                                    dataa =>
                                      dataa.networkid == networkdata.id,
                                  )
                                  ?.opticalrouts.map(
                                    (data, index: number) => (
                                      <div
                                        key={index}
                                        className="flex w-full flex-row items-center">
                                        <span className="w-[15px] text-[12px]">
                                          .....
                                        </span>

                                        <SidebarItem
                                          selected={
                                            selectedId == data.id
                                              ? true
                                              : false
                                          }
                                          onclick={() =>
                                            setSelectedId(data.id)
                                          }
                                          onclickcheckbox={e =>
                                            onclickopticalchecbox(
                                              e,
                                              data.id,
                                              networkdata.id,
                                            )
                                          }
                                          checkstatus={findoptical(
                                            networkdata.id,
                                            data.id,
                                          )}
                                          onDelete={() =>
                                            deleteoneopticalroute(
                                              data.id,
                                              networkdata.id,
                                            )
                                          }
                                          enabelcheck={true}
                                          className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                                          name={data.name}
                                          to={`${data.id}/${networkdata.id}`}
                                        />
                                      </div>
                                    ),
                                  )}
                              </div>
                              }
                                </>
                           
                              ) : null}
                            </>
                       
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </>
        ) : null}

        {openall && list.length >= 10 ? (
          <SimpleBtn
            loading={networkloading}
            onClick={() => setSkip(skip + 10)}
            className="mx-auto mt-4">
            more
          </SimpleBtn>
        ) : null}
      </div>
      {/* </div> */}
    </SidebarLayout>
  );
};

export default OpticalRouteLayout;
