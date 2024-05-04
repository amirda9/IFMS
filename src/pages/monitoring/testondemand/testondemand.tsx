import React, {useEffect, useRef, useState} from 'react';
import {SidebarItem, SimpleBtn, Table} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import Checkbox from '~/components/checkbox/checkbox';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {Link, NavLink, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import {RootState} from '~/store';
import {useHttpRequest} from '~/hooks';
import {
  setNetworkselectedlist,
  setNetworkoptical,
  setAlldeleteopticalroute,
  alldeleteopticalroutetype,
  networkopticaltype,
  setSelectedId,
  setTestid,
  setSetuplist,
  setSelectedtest,
  setSelectednetworkid,
  setOpenall
} from './../../../store/slices/testondemand';
import {$Delete, $Get} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {BsPlusLg} from 'react-icons/bs';
import {NetworkType} from '~/types/NetworkType';
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

function Testondemand() {
  const dispatch = useDispatch();
  const [setuploading, setSetuploading] = useState(false);
  const [networklist, setNetworklist] = useState<NetworkType[]>([]);
  const {networkselectedlist, networkoptical, alldeleteopticalroute,testid,selectedId,setuplist,selectedtest,selectednetworkid,openall} =
    useSelector((state: RootState) => state.testondemandSlice);
  // const {
  //   request,
  //   state: {list, deleteRequest},
  // } = useHttpRequest({
  //   selector: state => ({
  //     list: state.http.networkList,
  //     deleteRequest: state.http.networkDelete,
  //   }),
  //   initialRequests: request => {
  //     if (list?.httpRequestStatus !== 'success') {
  //       request('networkList', undefined);
  //     }
  //   },
  //   onUpdate: (lastState, state) => {
  //     if (
  //       lastState.deleteRequest?.httpRequestStatus === 'loading' &&
  //       state.deleteRequest!.httpRequestStatus === 'success'
  //     ) {
  //       request('networkList', undefined);
  //     }
  //   },
  // });

  useEffect(() => {
    const getnetworklist = async () => {
      try {
        const networkListResponse = await $Get(`otdr/network/`);
        const networkListResponseDate = await networkListResponse.json();
        setNetworklist(networkListResponseDate);
      } catch (error) {
        console.log(`getNetworklistError is:${error}`);
      }
    };
    getnetworklist();
  }, []);
  const deletenetworkoptical = async (id: string) => {
    Swal.fire(swalsetting).then(async result => {
      if (result.isConfirmed) {
        let networkopticalCopy: networkopticaltype = deepcopy(networkoptical);
        const finddata = networkoptical.findIndex(data => data.networkid == id);
        //delete all rtues related to this netwok
        const deleteOticalroute = await $Delete(
          `otdr/optical-route/batch_delete`,
          networkopticalCopy[finddata].opticalrouts.map(data => data.id),
        );
        if (deleteOticalroute.status == 201) {
          networkopticalCopy[finddata].opticalrouts = [];
        }
        dispatch(setNetworkoptical(networkopticalCopy));
        // -------------------------------
        //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
        const alldeleteopticalrouteCopy: alldeleteopticalroutetype = deepcopy(
          alldeleteopticalroute,
        );
        const finddeleteopticalrout = alldeleteopticalrouteCopy.findIndex(
          data => data.networkid == id,
        );
        alldeleteopticalrouteCopy[finddeleteopticalrout].opticalrouts = [];
        dispatch(setAlldeleteopticalroute(alldeleteopticalrouteCopy));
      }
    });
  };

  const swalsetting: any = {
    title: 'Are you sure you want to delete these components?',
    // text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  };

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
            opennetworkopticallist(id), dispatch(setSelectedId(id)) 
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
          const deleteOticalroute = await $Delete(
            `otdr/optical-route/batch_delete`,
            alldeleteopticalroute[findopticalroute]!.opticalrouts,
          );
          if (deleteOticalroute.status == 201) {
            let networkopticalCopy = deepcopy(networkoptical);
            const finddataindex = networkoptical.findIndex(
              data => data.networkid == networkid,
            );
            //we update the networks uptical route
            let newnetworkopticalroute = [];
            for (
              let i = 0;
              i < networkoptical[finddataindex].opticalrouts.length;
              i++
            ) {
              if (
                alldeleteopticalroute[
                  findopticalroute
                ]!.opticalrouts!.findIndex(
                  data =>
                    data == networkoptical[finddataindex].opticalrouts[i].id,
                ) < 0
              ) {
                newnetworkopticalroute.push({
                  id: networkoptical[finddataindex].opticalrouts[i].id,
                  name: networkoptical[finddataindex].opticalrouts[i].name,
                });
              }
            }
            networkopticalCopy[finddataindex].opticalrouts =
              newnetworkopticalroute;
            dispatch(setNetworkoptical(networkopticalCopy));
            //We update the list of opticalroutes that need to be deleted because their checkboxes are clicked.
            alldeleteopticalrouteCopy[findopticalroute].opticalrouts = [];
            dispatch(setAlldeleteopticalroute(alldeleteopticalrouteCopy));
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const opennetworkopticallist = async (id: string) => {
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
    if (opticals.status == 200) {
      const opticalslist = await opticals.json();
      console.log(opticalslist, 'opticalslist');

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
  };
  const navigate = useNavigate();
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);
  const Thirdref: any = useRef(null);
  const topcolumns = {
    index: {label: 'Index', size: 'w-[2%]'},
    date: {label: 'Date', size: 'w-[17%]'},
    opticalroute: {label: 'Optical Route', size: 'w-[28%]'},
    testsetup: {label: 'Test Setup', size: 'w-[17%]'},
    user: {label: 'User', size: 'w-[18%]'},
    status: {label: 'Status', size: 'w-[6%]'},
    detail: {label: 'Detail', size: 'w-[2%]'},
    delete: {label: 'Delete', size: 'w-[2%]'},
  };

  const topitems = [
    {
      index: 0,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 1,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 2,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 3,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 4,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 5,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      tabbodybg: [{name: 'status', bg: '#FFE600'}],
      index: 6,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 7,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 8,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
    {
      index: 7,
      date: '2022-10-29 22:59:59',
      opticalroute: 'Optical Route 1',
      testsetup: 'Test Setup 1',
      user: 'Station1',
      status: 'Pending',
      detail: '',
      delete: '',
    },
  ];

  const onclickoptical = async (id: string,networkid:string) => {
    dispatch(setSelectedId(id))
    dispatch(setSelectednetworkid(networkid))
    dispatch(setTestid(''))
    dispatch(setSelectedtest(''))
    try {
      setSetuploading(true);
      const opticasetupresponse = await $Get(
        `otdr/optical-route/${id}/test-setups`,
      );
      const opticasetupresponseData = await opticasetupresponse.json();
      const newopticasetupresponseData = opticasetupresponseData.map(
        (data: any) => ({id: data.id, name: data.name}),
      );
      dispatch(setSetuplist(newopticasetupresponseData))
      
    } catch (error) {
      console.log(`getTestsetupError=${error}`);
    } finally {
      setSetuploading(false);
    }
  };
  console.log('👗🆚', setuplist);
  console.log('🚵', testid);
  const onclickParameters = () => {
    if (selectedId != '' && testid != '') {
      navigate(
        `/monitoring/${selectedId}_${selectednetworkid}/test-setup/${testid}`,
      );
    }
  };
  const lastnetwork = networklist[networklist.length - 1]?.id || '';
  return (
    <div className="flex w-full flex-col p-[20px] pt-[100px]">
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[calc(50%-100px)] flex-col">
          <span className="mb-[10px] text-[20px] font-normal leading-[24.2px]">
            Optical Route
          </span>
          <div className="h-[400px] w-full bg-white">
            <div className={`relative ml-4 mt-[30px] flex w-full flex-col`}>
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
                  <span className="mb-[5px] ml-[3px] mr-[5px] font-light">
                    +
                  </span>
                )}

                <button onClick={() =>dispatch(setOpenall(!openall)) }>
                  <span>Networks</span>
                </button>
              </div>

              {openall ? (
                <>
                  {networklist.map((networkdata, index) => (
                    <div
                      key={index}
                      className={`relative mt-[-10px] w-full  border-l-[1px] border-dotted   ${
                        index == networklist.length - 1
                          ? 'border-none'
                          : 'border-[#000000]'
                      }  `}>
                      {index == networklist.length - 1 ? (
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

                        {networkselectedlist.indexOf(networkdata.id) > -1 ? (
                          <div className="relative ml-[18px] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                            <div className="absolute left-[-1px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                            {networkoptical
                              ?.find(dataa => dataa.networkid == networkdata.id)
                              ?.opticalrouts.map((data, index: number) => (
                                <div
                                  key={index}
                                  className="flex w-full flex-row items-center">
                                  <span className="w-[15px] text-[12px]">
                                    .....
                                  </span>

                                  <SidebarItem
                                    selected={
                                      selectedId == data.id ? true : false
                                    }
                                    isLink={false}
                                    onclick={() => onclickoptical(data.id,networkdata.id)}
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
                                      deleteoneopticalroute(data.id, networkdata.id)
                                    }
                                    enabelcheck={true}
                                    className="ml-[5px] mt-[10px] w-[calc(100%-20px)]"
                                    name={data.name}
                                    to={'#'}
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
          </div>

          <div className="mt-4 flex w-full flex-row items-center">
            <span className="text-[20px] font-normal leading-6">From</span>
            <input
              ref={firstdateref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-4 h-8 w-[150px] cursor-pointer rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => firstdateref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px] cursor-pointer"
            />

            <span className="ml-10 text-[20px] font-normal leading-6">to</span>
            <input
              ref={secenddateref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-4 h-8 w-[150px] rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => secenddateref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex w-[calc(50%-100px)] flex-col">
          <span className="mb-[10px] text-[20px] font-normal leading-[24.2px]">
            Test Setup
          </span>
          <div className="h-[400px] w-full bg-white p-2">
            {setuploading ? (
              <h1 className="font-bold">Loading...</h1>
            ) : (
              setuplist.map(data => (
                <button
                  onClick={() => {
                    dispatch(setSelectedtest(data.name))
                    ,dispatch(setTestid(data.id)) 
                  }}
                  className={`w-full ${
                    selectedtest == data.name
                      ? 'bg-[#C0E7F2] font-bold'
                      : 'bg-white font-normal'
                  } h-[40px] text-left`}>
                  {data.name}
                </button>
              ))
            )}
          </div>
          <div className="mt-4 flex w-full flex-row items-center">
            <Checkbox
              checkstatus={true}
              onclick={e => {}}
              iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
              classname={
                'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
              }
            />
            <span className="text-[20px] font-normal leading-6">
              Show Completed Tests From
            </span>
            <input
              ref={Thirdref}
              onChange={e => {}}
              value={''}
              type="date"
              className="ml-6 h-8 w-48 rounded-md border border-black px-2"
            />
            <img
              src={dateicon}
              onClick={() => Thirdref.current.showPicker()}
              className="ml-[5px] h-[35px] w-[35px] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex  w-[134px] flex-col justify-between pt-[34px]">
          <div className="flex flex-col ">
            <SimpleBtn onClick={onclickParameters} className="mb-[30px]">
              Parameters
            </SimpleBtn>
            <SimpleBtn className="px-[34px]">Start Test</SimpleBtn>
          </div>

          <SimpleBtn className="mb-1 px-[47px]">Apply</SimpleBtn>
        </div>
      </div>
      <Table
        // loading={state.regionstationlist?.httpRequestStatus !== 'success'}
        // onclicktitle={(tabname: string, sortalfabet: boolean) => {
        //   const dataa = [...reightstationsorted];
        //   if (sortalfabet) {
        //     dataa.sort((a, b) => -a.name.localeCompare(b.name, 'en-US'));
        //   } else {
        //     dataa.sort((a, b) => a.name.localeCompare(b.name, 'en-US'));
        //   }
        //   setReightstationssorted(dataa);
        // }}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={topitems}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left min-h-[72px]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
        dynamicColumns={['detail', 'delete']}
        renderDynamicColumn={({key, value}) => {
          if (key === 'detail')
            return (
              <Link to={value.detail}>
                <IoOpenOutline size={22} className="mx-auto" />
              </Link>
            );
          else if (key === 'delete')
            return (
              <IoTrashOutline
                onClick={() => {}}
                className="mx-auto cursor-pointer text-red-500"
                size={22}
              />
            );
          else return <></>;
        }}
      />
    </div>
  );
}

export default Testondemand;
