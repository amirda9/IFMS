import {FC, useState, useEffect} from 'react';
import {navbarItems} from '~/constant';
import {NavItem, SimpleBtn, TextInput} from '~/components';
import {IoPersonOutline} from 'react-icons/io5';
import {httpClear} from '~/store/slices';
import {IoNotificationsOutline} from 'react-icons/io5';
import {useAppDispatch, useAppSelector, useHttpRequest} from '~/hooks';
import {Outlet} from 'react-router-dom';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {$Get, $Post, $Put} from '~/util/requestapi';
import {toast} from 'react-toastify';
import AppDialog from '~/components/modals/AppDialog';
import {IoMdClose} from 'react-icons/io';
import Selectbox from '~/components/selectbox/selectbox';
import {getPrettyDateTime} from '~/util/time';
import {io} from 'socket.io-client';
import {deepcopy} from '~/util';
import React from 'react';

// *************** types *************** types ******************** types ******
type alarmstype = {
  id: string;
  secondary_source: string;
  severity: string;
  status: string;
  region_name: string;
  region_admin: string;
  station_name: string;
  time_created: string;
  time_modified: string;
  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
  contributing_conditions: [
    {
      parameter: string;
      operator: string;
      fault: string;
      coef: number;
      value: string;
      reference_value: number;
      measured_value: number;
    },
  ];
}[];

type alldataType = {
  details: {
    source_name: string;
    severity: string;
    status: string;
    measurement_fk: string;
    rtu_fk: string;
    link_fk: string;
    network_id: string;
    region_id: string;
    alarm_type_list: string[];
    id_list: string[];
    acting_user: string;
    network_name: string;
    alarm_number: number;
    time_created: string;
    time_modified: string;
    region_name: string;
    link_name: string;
    station_name: string;
    cable: string;
    rtu_name: string;
    core: number;
    port: number;
    to_escalation: {
      days: number;
      hours: number;
      minutes: number;
    };
    to_time_out: {
      days: number;
      hours: number;
      minutes: number;
    };
  };
  alarms: alarmstype;
};

type modalvalue = {
  contributing_conditions: {
    coef: number;
    parameter: string;
    value: string;
    reference_value: number;
    measured_value: number;
  }[];

  id: string;

  region_admin: string;

  region_name: string;

  secondary_source: string;

  severity: string;

  station_name: string;

  status: string;

  time_created: string;

  time_modified: string;

  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
};

type notificationstype = {
  alarm_event_id: string;
  id: string;
  time_created: string;
};
// *************** types *************** types ******************** types ******

const options = [
  {value: 'Pending', label: 'Pending'},
  {value: 'Acknowledged', label: 'Acknowledged'},
  {value: 'In progress', label: 'In progress'},
  {value: 'Resolved', label: 'Resolved'},
];

const MainLayout: FC = () => {
  const AlarmRow: FC<{
    title: string;
    data: string | number;
    onChange?: (value: string | number) => void;
  }> = React.memo(({title, data, onChange = () => {}}) => {
    return (
      <div className="mt-8 flex flex-row items-center justify-between">
        <span className="text-[20px] font-normal leading-[24.2px]">
          {title}
        </span>
        <TextInput
          type="text"
          onChange={e => onChange(e.target.value)}
          value={data}
          className="h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white"
        />
      </div>
    );
  });
  const [openalarms, setOpenalarms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [modaldata, setModaldata] = useState<modalvalue | null>(null);
  const [allalarmdata, setAllalarmdata] = useState<alldataType>();
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token);
  const loggedInUser = useAppSelector(state => state.http.verifyToken)!;
  const [notificationsdata, setNotifiationsdata] = useState<
    notificationstype[]
  >([]);
  const [openalarndetail, setOpenalarmdetail] = useState(false);
  const [showmodal, setShowmodal] = useState(false);

  const dispatch = useAppDispatch();
  const {state} = useHttpRequest({
    selector: state => state.http.verifyToken,
    initialRequests: request => {
      request('verifyToken', undefined);
    },
  });

  const handleLogout = async () => {
    try {
      const logoutapi = await $Get(`auth/users/auth/logout`);
      if (logoutapi?.status == 200) {
        toast('Logged out successfully', {type: 'success', autoClose: 1000});
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
      localStorage.removeItem('refresh');
      localStorage.removeItem('login');
      dispatch(httpClear(['login', 'refresh']));
    } catch (error) {
      console.log(`logout error is:${error}`);
    }
  };

  const geralarmsdetail = async (alarmid: string, id: string) => {
    setLoading(true);
    try {
      const response = await $Post(`otdr/alarm/events/details`, [alarmid]);
      if (response?.status == 200) {
        const responsedata: alldataType = await response?.json();
        setAllalarmdata(responsedata);
        const newnotificationsdata = notificationsdata.filter(
          data => data.id != id,
        );
        setNotifiationsdata(newnotificationsdata);
       const seennotifResponse=await $Put(`otdr/notification/${id}`,[])
       console.log("seennotifResponse",seennotifResponse);
       
       if(seennotifResponse?.status != 201){
        toast('Encountered an error', {type: 'error', autoClose: 1000});
       }
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
      console.log(`get alarms detail error:${error}`);
    } finally {
      setLoading(false);
    }
  };

  if (state?.httpRequestStatus && state?.httpRequestStatus === 'error') {
    localStorage.removeItem('refresh');
    localStorage.removeItem('login');
    dispatch(httpClear(['login', 'refresh']));
    return <></>;
  }

  useEffect(() => {
    const getallnotifications = async () => {
      const notificationsresponse = await $Get(`otdr/notification`);
      if (notificationsresponse?.status == 200) {
        const notificationsresponsedata = await notificationsresponse.json();
        setNotifiationsdata(notificationsresponsedata);
      } else {
        toast('Encountered an error when getting notification', {
          type: 'error',
          autoClose: 1000,
        });
      }
    };
if(accesstoken){
  getallnotifications();
}
    
  }, []);



  // useEffect(() => {
  //   const socket = io("ws://37.32.27.143:8080", {
  //     path: "/api/otdr/notification/ws/alarm",
  //     // transports: ["websocket"],
  //     query: {
  //       token: accesstoken,
  //     },
  //   });

  //   socket.on("connect", () => {
  //     console.log("Socket connected");
  //   });

  //   socket.on("message", (data) => {
  //     console.log("Message received:", data);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("Socket disconnected");
  //   });

  //   socket.on("connect_error", (error) => {
  //     console.error("Connection errorrr:", error.message);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, [accesstoken]);

  if (!state || state.httpRequestStatus === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-y-4 bg-b">
        <GeneralLoadingSpinner size="h-20 w-20" />
        <span>Verifying token...</span>
      </div>
    );
  }

  const randomdata = Math.floor(Math.random() * 100);
  const randomdata2 = Math.floor(Math.random() * 10);
 
  return (
    <div
      style={{minHeight: '100vh'}}
      className="flex h-full flex-col bg-[#E7EFF7]">
      <nav className="fixed left-0 right-0 top-0 z-[10000] flex h-20 flex-row items-center bg-p px-4 pr-12 ">
        <h2 className="mr-16 font-s text-2xl text-white">ARIO-IFMS</h2>
        {navbarItems.map(item => (
          <NavItem
            key={item.name}
            name={item.name}
            to={item.to}
            items={item.items}
          />
        ))}

        <NavItem
          to="#"
          name="Anonymous User"
          className="ml-auto"
          icon={IoPersonOutline}
          items={[
            {label: 'Profile', to: '/profile'},
            {label: 'Logout', handleSelf: true},
          ]}
          onClick={handleLogout}
        />
        <div className="relative">
          <IoNotificationsOutline
            onClick={() => setOpenalarms(!openalarms)}
            size={27}
            color="white"
            className="ml-[-30px] cursor-pointer"
          />
          {notificationsdata.length != 0 ? (
            <div className="absolute right-[-14px] top-[5px] h-[24px] w-[24px] rounded-[12px] bg-[#dd25a6] text-center text-white">
              {notificationsdata.length}
            </div>
          ) : null}
        </div>
      </nav>
      <div className="flex min-h-[100vh] flex-row bg-[#E7EFF7] pb-[20px] pt-[20px]">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[1000] flex h-[25px] flex-row bg-[#006BBC]">
        <span className="ml-6 text-[14px] text-white">
          Total Alarms: {randomdata + 25}
        </span>
        <span className="ml-6 text-[14px] text-white">
          High Severity Alarms: {randomdata}
        </span>
        <span className="ml-6 text-[14px] text-white">
          Medium Severity Alarms: {randomdata + 7}
        </span>
        <span className="ml-6 text-[14px] text-white">
          Low Severity Alarms: {randomdata + 7}
        </span>
        <span className="ml-6 text-[14px] text-white">
          Effected Stations: {randomdata2}
        </span>
        <span className="ml-6 text-[14px] text-white">
          Effected Links: {randomdata2 + 4}
        </span>
      </div>
      {openalarms ? (
        <div className="absolute right-[10px] top-[85px] z-[200000] h-auto max-h-[450px] w-[350px] overflow-y-auto bg-[#006bbc]">
          {notificationsdata.map((data, index) => (
            <button
              onClick={() => {
                setOpenalarms(false),
                  setOpenalarmdetail(true),
                  setLoading(true);
                geralarmsdetail(data.alarm_event_id, data.id);
              }}
              className="h-[50px] w-full  pl-3 text-left text-white">
              Alarm {index + 1}
            </button>
          ))}
        </div>
      ) : null}

      {openalarndetail ? (
        <>
          <div className="absolute right-[2.5%]  top-[calc(50vh-230px)] z-[20000] h-[500px] w-[95%] overflow-hidden rounded-xl bg-[#e7eff7]">
            <div className="flex h-[31px] w-full flex-row items-center justify-end bg-[#006bbc] px-2">
              <IoMdClose
                size={25}
                onClick={() => {
                  setOpenalarmdetail(false);
                }}
                color="white"
                className="cursor-pointer"
              />
            </div>
            <div className="h-auto w-full">
              <>
                {showmodal && modaldata ? (
                  <AppDialog
                    closefunc={() => {
                      setModaldata(null), setShowmodal(false);
                    }}>
                    <div className="ml-[80px]  w-[calc(100%-80px)]">
                      <div className="mt-8 flex w-full flex-row justify-between">
                        <div className="w-[40%] text-center text-[20px] font-normal leading-[24.2px]">
                          Parameter
                        </div>
                        <div className="w-[50%] text-center text-[20px] font-normal leading-[24.2px]">
                          Value
                        </div>
                      </div>

                      {modaldata?.contributing_conditions?.map(
                        contributingdata => (
                          <>
                            {contributingdata.coef ? (
                              <div className="mt-8 flex w-full flex-row items-center justify-between">
                                <TextInput
                                  onChange={() => {}}
                                  value={`${contributingdata.parameter}: ${contributingdata.measured_value} km`}
                                  className="h-[40px] w-[40%]"
                                />
                                <div className="flex w-[50%] flex-row justify-between">
                                  <TextInput
                                    type="text"
                                    onChange={() => {}}
                                    value={contributingdata.coef}
                                    className="h-[40px] w-[20%]"
                                  />
                                  <span className="mt-2">x</span>

                                  <TextInput
                                    type="text"
                                    onChange={() => {}}
                                    value={`${contributingdata.value}: ${contributingdata.reference_value} km`}
                                    className="h-[40px] w-[70%]"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="mt-8 flex w-full flex-row justify-between">
                                <TextInput
                                  type="text"
                                  onChange={() => {}}
                                  value={contributingdata.parameter}
                                  className="h-[40px] w-[40%]"
                                />
                                <TextInput
                                  type="text"
                                  onChange={() => {}}
                                  value={contributingdata.value}
                                  className="h-[40px] w-[50%]"
                                />
                              </div>
                            )}
                          </>
                        ),
                      )}
                    </div>
                  </AppDialog>
                ) : null}

                <div className="mt-4 box-border flex w-full flex-col px-2  pb-8">
                  {loading ? (
                    <h1>loading...</h1>
                  ) : (
                    allalarmdata?.alarms &&
                    allalarmdata?.alarms.map(data => {
                      let checkescalation =
                        data?.to_escalation?.days == 0 &&
                        data?.to_escalation?.minutes == 0 &&
                        data?.to_escalation?.hours == 0
                          ? false
                          : true;
                      let checketimeout =
                        data?.to_timeout?.days == 0 &&
                        data?.to_timeout?.minutes == 0 &&
                        data?.to_timeout?.hours == 0
                          ? false
                          : true;

                      return (
                        <>
                          <div
                            className={`mt-4 flex w-full flex-row justify-between  rounded-[10px] ${
                              !checketimeout
                                ? 'bg-[#F48F8F]'
                                : !checkescalation
                                ? 'bg-[#FCC483]'
                                : 'bg-[#C0E7F2]'
                            }  p-8 pb-4 pt-[0px]`}>
                            <div className="w-[46%]">
                              <AlarmRow
                                title="Secondary Source"
                                data={data.secondary_source}
                              />
                              <AlarmRow
                                title="Network"
                                data={allalarmdata?.details?.network_name}
                              />
                              <AlarmRow
                                title="Station"
                                data={data.station_name}
                              />
                              <AlarmRow
                                title="Last Modified"
                                data={
                                  getPrettyDateTime(data?.time_modified) || ''
                                }
                              />
                              <AlarmRow
                                title="To Escalation"
                                data={`${
                                  data?.to_escalation?.days || 0
                                } Day - ${
                                  data?.to_escalation?.hours || 0
                                } Hours - ${
                                  data?.to_escalation?.minutes || 0
                                } Minutes`}
                              />
                            </div>

                            <div className="flex w-[46%]  flex-col">
                              <div className="mt-8 flex flex-row items-center justify-between">
                                <span className="text-[20px]  font-normal leading-[24.2px]">
                                  State
                                </span>
                                <Selectbox
                                  defaultvalue={data.status}
                                  onclickItem={(e: {
                                    value: string;
                                    label: string;
                                  }) => {
                                    // setAllupdateallarms(prev => [
                                    //   ...prev,
                                    //   {alarm_id: data.id, new_status: e.value},
                                    // ]);
                                    // dispatch(changestate({id: data.id, value: e.value}));
                                    // dispatch(changealarmstatus(false));
                                  }}
                                  options={options}
                                  classname={
                                    'h-[40px] w-[calc(100%-200px)] rounded-[10px] bg-white'
                                  }
                                />
                              </div>
                              <AlarmRow
                                title="Region"
                                data={data?.region_name}
                              />
                              <AlarmRow
                                title="Region Admin"
                                data={data.region_admin}
                              />
                              <AlarmRow
                                title="Alarm Time"
                                data={
                                  getPrettyDateTime(data?.time_created) || ''
                                }
                              />
                              <AlarmRow
                                title="To Time Out"
                                data={`${
                                  data?.to_escalation?.days || 0
                                } Day - ${
                                  data?.to_escalation?.hours || 0
                                } Hours - ${
                                  data?.to_escalation?.minutes || 0
                                } Minutes`}
                              />
                              <SimpleBtn
                                onClick={() => {
                                  setModaldata(data);
                                  setShowmodal(true);
                                }}
                                className="ml-[calc(100%-130px)] mt-4">
                                Parameters
                              </SimpleBtn>
                            </div>
                          </div>
                        </>
                      );
                    })
                  )}
                </div>
              </>
            </div>
          </div>

          <div className="fixed right-0 top-0 z-[19000] h-[100vw] w-[100vw] bg-[#D9D9D9] opacity-80"></div>
        </>
      ) : null}
    </div>
  );
};

export default MainLayout;
