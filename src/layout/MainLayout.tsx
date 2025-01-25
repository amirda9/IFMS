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
import React from 'react';
import Alarmsparameters from '~/components/alarmsparameters';
import Alarmadetail from '~/components/alarmadetail';
import {setAlarmmodaldata, setShowParameters} from '~/store/slices/alarmsslice';
import {RootState} from '~/store';
import {useSelector} from 'react-redux';
import { useLocation } from 'react-router-dom';
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


type notificationstype = {
  alarm_event_id: string;
  id: string;
  time_created: string;
};
// *************** types *************** types ******************** types ******


const MainLayout: FC = () => {
  const location = useLocation();
  const [openalarms, setOpenalarms] = useState(false);
  const {alarmstatus, showparameters, alarmmodaldata} = useSelector(
    (state: RootState) => state.alarmsslice,
  );

  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [allalarmdata, setAllalarmdata] = useState<alldataType>();
  const login = localStorage.getItem('login');
  const accesstoken = login && JSON.parse(login)?.data?.access_token;
  const loggedInUser = useAppSelector(state => state.http.verifyToken)!;
  const [count, setrCount] = useState(0);
  const [messages, setMessages] = useState<any>([]); // برای ذخیره داده‌های دریافتی
  const [notificationsdata, setNotifiationsdata] = useState<
    notificationstype[]
  >([]);
  const [openalarndetail, setOpenalarmdetail] = useState(false);

  // const [allupdateallarms, setAllupdateallarms] = useState<
  //   {
  //     alarm_id: string;
  //     new_status: string;
  //   }[]
  // >([]);
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
        // const seennotifResponse = await $Put(`otdr/notification/${id}`, []);
        // if (seennotifResponse?.status != 201) {
        //   toast('Encountered an error', {type: 'error', autoClose: 1000});
        // }
      }
    } catch (error) {
      toast('Encountered an error', {type: 'error', autoClose: 1000});
      console.log(`get alarms detail error:${error}`);
    } finally {
      setLoading(false);
    }
  };

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

useEffect(()=>{
  setOpenalarmdetail(false)
},[location.pathname])

  useEffect(() => {
    // Attach event listener for the 'online' event
    window.addEventListener('online', getallnotifications);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('online', getallnotifications);
    };
  }, []);

  if (state?.httpRequestStatus && state?.httpRequestStatus === 'error') {
    localStorage.removeItem('refresh');
    localStorage.removeItem('login');
    dispatch(httpClear(['login', 'refresh']));
    return <></>;
  }

  useEffect(() => {
    if (accesstoken) {
      getallnotifications();
    }
  }, []);

  // const cahngeAllupdateallarms = (alarm_id: string, new_status: string) => {
  //   setAllupdateallarms(prev => [
  //     ...prev,
  //     {alarm_id: alarm_id, new_status: new_status},
  //   ]);
  // };

  // useEffect(()=>{
  //   const seenall=async ()=>{
  //     for( let i=0 ;i<notificationsdata.length;i++){
  //       const seennotifResponse = await $Put(`otdr/notification/${notificationsdata[i].id}`, []);
  //     }

  //   }
  //   seenall()
  // },[])

  // setTimeout(async()=>{
  //   const seennotifResponse = await $Put(`otdr/notification/${notificationsdata[0].id}`, []);
  //   const seennotifResponse2 = await $Put(`otdr/notification/${notificationsdata[1].id}`, []);
  //   const seennotifResponse3 = await $Put(`otdr/notification/${notificationsdata[2].id}`, []);
  //   const seennotifResponse4 = await $Put(`otdr/notification/${notificationsdata[3].id}`, []);

  // },2000)

  useEffect(() => {
    let socket: any;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    if (accesstoken) {
      const connectWebSocket = () => {
        socket = new WebSocket(
          `ws://37.32.27.143:8080/api/otdr/notification/ws/alarm?token=${accesstoken}`,
        );

        socket.onopen = () => {
          console.log('WebSocket connected');
          reconnectAttempts = 0; // ریست تعداد تلاش‌های اتصال
        };

        socket.onmessage = (event: any) => {
          console.log('Message received:', event.data);
          setrCount(prev => prev + 1);
          // داده‌های دریافتی را ذخیره کنید
          setNotifiationsdata((prevMessages: notificationstype[]) => [
            ...prevMessages,
            JSON.parse(event.data),
          ]);
        };

        // socket.onclose = (event: any) => {
        //   console.log('WebSocket disconnected:', event.reason || 'Closed');
        //   if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
        //     reconnectAttempts++;
        //     console.log(`Reconnecting... Attempt ${reconnectAttempts}`);
        //     setTimeout(connectWebSocket, 2000); // تلاش دوباره برای اتصال
        //   }
        // };

        socket.onerror = (error: any) => {
          console.error('WebSocket error:', error);
        };
      };

      connectWebSocket();
    }

    return () => {
      if (socket) {
        socket.close(); // بستن اتصال هنگام unmount
      }
    };
  }, []);

  console.log('count', count);

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
        <div
          onMouseLeave={() => setOpenalarms(false)}
          className="absolute right-[10px] top-[85px] z-[200000] h-auto max-h-[450px] w-[350px] overflow-y-auto bg-[#006bbc]">
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
          <div className="fixed right-[2.5%]  top-[calc(50vh-230px)] z-[20000] h-[500px] w-[95%] overflow-hidden rounded-xl bg-[#e7eff7]">
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
                {showparameters && alarmmodaldata ? (
                  <AppDialog
                    closefunc={() => {
                      dispatch(setAlarmmodaldata(null)), dispatch(setShowParameters(false));
                    }}>
                    <Alarmsparameters />
                  </AppDialog>
                ) : null}

                <div className="mt-4 box-border flex w-full flex-col px-2  pb-8">
                  {loading ? (
                    <h1>loading...</h1>
                  ) : (
                    <>
                      <Alarmadetail
                        // @ts-ignore
                        allalarmdata={allalarmdata}
                      />
                    </>
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
