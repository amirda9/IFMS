import {useEffect, useRef, useState} from 'react';
import {SidebarItem, SimpleBtn, Table} from '~/components';
import dateicon from '~/assets/images/dateicon.png';
import Checkbox from '~/components/checkbox/checkbox';
import {IoOpenOutline, IoTrashOutline} from 'react-icons/io5';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import {RootState} from '~/store';
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
  setOpenall,
  setStarttestdate,
  setEndtestdate,
  setShowCompletedTestsFrom,
  setFromtimeupdated,
} from './../../../store/slices/testondemand';
import {$Delete, $Get, $Post} from '~/util/requestapi';
import {deepcopy} from '~/util';
import {NetworkType} from '~/types/NetworkType';
import {getPrettyDateTime} from '~/util/time';
import {toast} from 'react-toastify';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
type Itembtntype = {
  name: string;
  id: string;
  classname?: string;
  onclickcheck?: (e: boolean) => void;
};

type testondemand = {
  id: string;
  time_created: string;
  optical_route: {
    id: string;
    name: string;
  };
  test_setup: {id: string; name: string; station: {id: string; name: string}};
  status: string;
  type: string;
};

type tabelrow = {
  id: string;
  index: number;
  date: string;
  opticalrouteid: string;
  opticalroute: string;
  testsetup: string | null;
  station: string | null;
  measurmenttestid: string;
  status: string;
  detail: string;
  delete: string;
};

function Testondemand() {
  const dispatch = useDispatch();
  const [setuploading, setSetuploading] = useState(false);
  const [networklist, setNetworklist] = useState<NetworkType[]>([]);
  const [alltestondemand, setAlltestondemand] = useState<tabelrow[]>([]);
  const [getmeasurmentloading, setGetmeasurmentloading] = useState(false);
  const {
    networkselectedlist,
    starttestdate,
    networkoptical,
    alldeleteopticalroute,
    testid,
    selectedId,
    setuplist,
    selectedtest,
    selectednetworkid,
    openall,
    endtestdate,
    showCompletedTestsFrom,
    fromtimeupdated,
  } = useSelector((state: RootState) => state.testondemandSlice);

  useEffect(() => {
    const getnetworklist = async () => {
      try {
        setLoadingdata(true);
        const networkListResponse = await $Get(`otdr/network/`);
        const networkListResponseDate = await networkListResponse?.json();
        setNetworklist(networkListResponseDate);
      } catch (error) {
        toast('An error was encountered', {type: 'error', autoClose: 1000});
      } finally {
        setLoadingdata(false);
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
        if (deleteOticalroute?.status == 201) {
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
            opennetworkopticallist(id), dispatch(setSelectedId(id)),setLoadingid(id);
          }}
          className={`${
            networkselectedlist.indexOf(id) > -1 ? 'font-bold' : 'font-light'
          }`}>
          {name}
        </button>
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
          if (deleteOticalroute?.status == 201) {
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
          toast('An error was encountered', {type: 'error', autoClose: 1000});
          console.log(`error is:${error}`);
        }
      }
    });
  };

  const opennetworkopticallist = async (id: string) => {

    try {
      setLoadingdata(true)
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
      
    } finally {
      setLoadingdata(false)
    }

  };
  const navigate = useNavigate();
  const firstdateref: any = useRef(null);
  const secenddateref: any = useRef(null);
  const [loadingid, setLoadingid] = useState('');
  const [loadingdata, setLoadingdata] = useState(false);
  const Thirdref: any = useRef(null);
  const topcolumns = {
    index: {label: 'Index', size: 'w-[2%]'},
    date: {label: 'Date', size: 'w-[17%]'},
    opticalroute: {label: 'Optical Route', size: 'w-[28%]'},
    testsetup: {label: 'Test Setup', size: 'w-[17%]'},
    station: {label: 'Station', size: 'w-[18%]'},
    status: {label: 'Status', size: 'w-[6%]'},
    detail: {label: 'Detail', size: 'w-[2%]'},
    delete: {label: 'Delete', size: 'w-[2%]'},
  };


  const onclickoptical = async (id: string, networkid: string) => {
    dispatch(setSelectedId(id));
    dispatch(setSelectednetworkid(networkid));
    dispatch(setTestid(''));
    dispatch(setSelectedtest(''));
    try {
      setSetuploading(true);
      const opticasetupresponse = await $Get(
        `otdr/optical-route/${id}/test-setups`,
      );
      const opticasetupresponseData = await opticasetupresponse?.json();
      const newopticasetupresponseData = opticasetupresponseData.map(
        (data: any) => ({id: data.id, name: data.name}),
      );
      dispatch(setSetuplist(newopticasetupresponseData));
    } catch (error) {
      toast('An error was encountered', {type: 'error', autoClose: 1000});
      console.log(`getTestsetupError=${error}`);
    } finally {
      setSetuploading(false);
    }
  };

  const onclickParameters = () => {
    if (selectedId != '' && testid != '') {
      navigate(
        `/monitoring/${selectedId}_${selectednetworkid}/test-setup/${testid}`,
      );
    }
  };
  const lastnetwork = networklist[networklist.length - 1]?.id || '';

  const getmeasurments = async () => {
    try {
      setGetmeasurmentloading(true);
      let allpathes = `${
        endtestdate.length > 0 ? `&to_time=${endtestdate}` : ''
      }${starttestdate.length > 0 ? `&from_time=${starttestdate}` : ''}${
        showCompletedTestsFrom && fromtimeupdated.length > 0
          ? `&from_time_updated=${fromtimeupdated}`
          : ''
      }`;
      const response = await $Get(
        `otdr/optical-route/measurement/measurements?measurement_type=on_demand${allpathes}&status=SUCCESS`,
      );

      const responsedata: testondemand[] = await response?.json();

      setAlltestondemand(
        responsedata.map((data, index) => ({
          tabbodybg: [
            {
              name: 'status',
              bg:
                data?.status == 'PENDING'
                  ? '#FFE600'
                  : data?.status == 'SUCCESS'
                  ? '#18C047'
                  : data?.status == 'STARTED'
                  ? '#4296FF'
                  : 'white',
            },
          ],
          id: data.id,
          index: index + 1,
          date: getPrettyDateTime(data.time_created),
          opticalroute: data.optical_route.name,
          opticalrouteid: data.optical_route.id,
          measurmenttestid: data.id,
          testsetup: data?.test_setup?.name || null,
          station: data?.test_setup?.station?.name || null,
          status: data?.status,
          detail: '',
          delete: '',
        })),
      );
    } catch (error) {
      toast('An error was encountered', {type: 'error', autoClose: 1000});
    } finally {
      setGetmeasurmentloading(false);
    }
  };

  const getallmeasurements = async () => {
    if (selectedId != '' && testid != '') {
      try {
        setGetmeasurmentloading(true);
        const testsetupresponse = await $Get(
          `otdr/optical-route/${selectedId}/test-setups/${testid}`,
        );
        if (testsetupresponse?.status == 200) {
          const testsetupresponseData = await testsetupresponse?.json();
          const createondemandmeasurmentresponse = await $Post(
            `otdr/optical-route/${selectedId}/on-demand-measurements?measurement_type=on_demand`,
            {
              optical_route_id: selectedId,
              rtu_id: testsetupresponseData.rtu.id,
              parameters: {
                distance_mode: testsetupresponseData.parameters.distance_mode,
                range: testsetupresponseData.parameters.range,
                pulse_width_mode:
                  testsetupresponseData.parameters.pulse_width_mode,
                pulse_width: testsetupresponseData.parameters.pulse_width,
                test_mode: testsetupresponseData.parameters.test_mode,
                IOR: testsetupresponseData.parameters.IOR,
                RBS: testsetupresponseData.parameters.RBS,
                wavelength: testsetupresponseData.parameters.wavelength,
                event_reflection_threshold:
                  testsetupresponseData.parameters.event_reflection_threshold,
                fiber_end_threshold:
                  testsetupresponseData.parameters.fiber_end_threshold,
                event_loss_threshold:
                  testsetupresponseData.parameters.event_loss_threshold,
                sampling_mode: testsetupresponseData.parameters.sampling_mode,
                sampling_duration:
                  testsetupresponseData.parameters.sampling_duration,
                run_mode: testsetupresponseData.parameters.run_mode,
              },
            },
          );
          if (createondemandmeasurmentresponse?.status == 201) {
            const createondemandmeasurmentresponseData =
              await createondemandmeasurmentresponse?.json();
            getmeasurments();
          }
        }
      } catch (error) {
        toast('An error was encountered', {type: 'error', autoClose: 1000});
      }
    }
  };

  useEffect(() => {
    getmeasurments();
  }, []);

  const deletehistory = async (id: string) => {
    try {
      const deleteonehistory = await $Delete(
        `otdr/optical-route/${selectedId}/measurements`,
        [id],
      );

      if (deleteonehistory?.status == 201) {
        getmeasurments();
      }
      toast('It was done successfully', {type: 'success', autoClose: 1000});
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
    } finally {
      // setDeletelist([]);
    }
  };

  return (
    <div className="flex w-full flex-col p-[20px] pt-[100px]">
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[calc(50%-100px)] flex-col">
          <span className="mb-[10px] text-[20px] font-normal leading-[24.2px]">
            Optical Route
          </span>
          <div className="h-[400px] w-full overflow-y-auto overflow-x-hidden bg-white">
            <div className={`relative ml-4 mt-[30px] flex w-full flex-col`}>
              <div
                className={`absolute h-[40px] w-[10px] ${
                  networkselectedlist.indexOf(lastnetwork) > -1
                    ? 'bottom-[-20px]'
                    : 'bottom-[-15.5px]'
                }  left-[-5px] bg-[#FFFFFF]`}></div>
              <div className="flex w-[205px] flex-row items-center text-[20px] font-bold text-[#000000]">
                {openall ? (
                  <span className="ml-[-4px] mr-[5px] font-light">-</span>
                ) : (
                  <span className="mb-[5px] ml-[3px] mr-[5px] font-light">
                    +
                  </span>
                )}

                <button
                  onClick={() => {
                    dispatch(setOpenall(!openall)), setLoadingid('all');
                  }}>
                  <span>Networks</span>
                </button>
              </div>

              {openall ? (
                <>
                  {loadingid == 'all' && loadingdata ? (
                    <GeneralLoadingSpinner
                      size="w-8 h-8"
                      className="ml-8"
                    />
                  ) : (
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
                            }  left-[15px] h-[25px] w-[5px] bg-[#FFFFFF]`}></div>

                          <div className="relative flex flex-col">
                            <Itembtn
                              classname="mb-[-10px]"
                              name={networkdata.name}
                              id={networkdata.id}
                            />

                            {networkselectedlist.indexOf(networkdata.id) >
                            -1 ? (
                              <>
                              {loadingid == networkdata.id && loadingdata?
                               <GeneralLoadingSpinner
                               size="w-8 h-8"
                               className="ml-8 mt-2"
                             />
                            :
                            <div className="relative ml-[18px] flex flex-col border-l-[1px] border-dotted border-[#000000]">
                            <div className="absolute left-[-.8px] top-[-20px] h-[18px] border-l-[1px] border-dotted border-[#000000]"></div>
                            {networkoptical
                              ?.find(
                                dataa => dataa.networkid == networkdata.id,
                              )
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
                                    enabelcheck={false}
                                    isLink={false}
                                    onclick={() =>
                                      onclickoptical(
                                        data.id,
                                        networkdata.id,
                                      )
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
                                    className="ml-[5px] mt-[10px] w-[calc(100%-50px)]"
                                    name={data.name}
                                    to={'#'}
                                  />
                                </div>
                              ))}
                          </div>
                            }
                              </>
                           
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : null}
            </div>
          </div>

          <div className="mt-4 flex w-full flex-row items-center">
            <span className="text-[20px] font-normal leading-6">From</span>
            <input
              ref={firstdateref}
              onChange={e => dispatch(setStarttestdate(e.target.value))}
              value={starttestdate}
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
              onChange={e => dispatch(setEndtestdate(e.target.value))}
              value={endtestdate}
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
          <div className="h-[400px] w-full overflow-y-auto overflow-x-hidden bg-white p-2">
            {setuploading ? (
              <h1 className="font-bold">Loading...</h1>
            ) : (
              setuplist.map(data => (
                <button
                  onClick={() => {
                    dispatch(setSelectedtest(data.name)),
                      dispatch(setTestid(data.id));
                    dispatch(setFromtimeupdated(''));
                    dispatch(setShowCompletedTestsFrom(false));
                    dispatch(setStarttestdate(''));
                    dispatch(setEndtestdate(''));
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
              checkstatus={showCompletedTestsFrom}
              onclick={() =>
                dispatch(setShowCompletedTestsFrom(!showCompletedTestsFrom))
              }
              iconclassnam="w-[15px] h-[15px] ml-[1px] mt-[1px]"
              classname={
                'w-[20px] h-[20px] mr-[4px] mt-[5px] border-[1px] border-[#000000]'
              }
            />
            <span className="text-[20px] font-normal leading-6">
              Show Completed Tests From
            </span>
            <input
              disabled={!showCompletedTestsFrom}
              ref={Thirdref}
              onChange={e => dispatch(setFromtimeupdated(e.target.value))}
              value={fromtimeupdated}
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
            <div className={`${testid.length>0?"opacity-100":"opacity-40"}`}>
            <SimpleBtn  onClick={getallmeasurements} className="px-[34px]">
              Start Test
            </SimpleBtn>
            </div>
            
          </div>

          <SimpleBtn onClick={getmeasurments} className="mb-1 px-[47px]">
            Apply
          </SimpleBtn>
        </div>
      </div>
      <Table
        loading={getmeasurmentloading}
        bordered={true}
        cols={topcolumns}
        tabicon={'Name'}
        items={alltestondemand}
        thclassname="pl-2 text-left"
        tdclassname="pl-2 text-left"
        containerClassName="w-full text-left min-h-[72px]  ml-[5px] pb-0 overflow-y-auto mt-[20px]"
        dynamicColumns={['detail', 'delete']}
        renderDynamicColumn={({key, value}) => {
          if (key === 'detail')
            return (
              <IoOpenOutline
                onClick={() =>
                  navigate('/config/chart', {
                    state: {
                      opticalrout_id: value.opticalrouteid,
                      measurement_id: value.id,
                    },
                  })
                }
                size={22}
                className="mx-auto cursor-pointer"
              />
            );
          else if (key === 'delete')
            return (
              <IoTrashOutline
                onClick={
                  async () => {
                    deletehistory(value.measurmenttestid);
                  }
                }
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
