import {FC, useEffect, useState} from 'react';
import {navbarItems} from '~/constant';
import {NavItem} from '~/components';
import {IoPersonOutline} from 'react-icons/io5';
import {httpClear} from '~/store/slices';
import {useAppDispatch, useHttpRequest} from '~/hooks';
import {Outlet} from 'react-router-dom';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {$Get} from '~/util/requestapi';
import {toast} from 'react-toastify';

const MainLayout: FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const login = localStorage.getItem('login');
  const accesstoken = login && (JSON.parse(login)?.data?.access_token || '');

  // useEffect(() => {
  //   const handleOnline = () => setIsOnline(true);
  //   const handleOffline = () => setIsOnline(false);

  //   window.addEventListener('online', handleOnline);
  //   window.addEventListener('offline', handleOffline);

  //   return () => {
  //   window.removeEventListener('online', handleOnline);
  //   window.removeEventListener('offline', handleOffline);
  //   };
  //   }, []);

  console.log('isOnline', isOnline);
  const dispatch = useAppDispatch();
  const {state} = useHttpRequest({
    selector: state => state.http.verifyToken,
    initialRequests: request => {
      request('verifyToken', undefined);
    },
  });

  const handleLogout = async () => {
    // if(isOnline){
    //   if (accesstoken && accesstoken.length>0){
    try {
      const logoutapi = await $Get(`auth/users/auth/logout`);
      if (logoutapi?.status == 200) {
      
      } else {
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
      localStorage.removeItem('refresh');
      localStorage.removeItem('login');
      dispatch(httpClear(['login', 'refresh']));
    } catch (error) {
      console.log(`logout error is:${error}`);
    }
    // } else{
    //   localStorage.removeItem('refresh');
    //   localStorage.removeItem('login');
    //   dispatch(httpClear(['login', 'refresh']));
    // }
    // }
  };

  if (state?.httpRequestStatus && state?.httpRequestStatus === 'error') {
    localStorage.removeItem('refresh');
    localStorage.removeItem('login');
    dispatch(httpClear(['login', 'refresh']));
    return <></>;
  }

  // useEffect(() => {
  //   if (isOnline) {
  //   if (state?.httpRequestStatus && state?.httpRequestStatus === 'error') {
  //   handleLogout();
  //   }
  //   } else {
  //   toast('network error', { type: 'error', autoClose: 1000 });
  //   }
  //   }, [isOnline])

  // useEffect(() => {
  //   if (!isOnline) {
  //     toast('network error', {type: 'error', autoClose: 1000});
  //   }
  // }, [isOnline]);

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
      <nav className="fixed left-0 right-0 top-0 z-[10000] flex h-20 flex-row items-center bg-p px-4 ">
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
      </nav>
      <div className="flex min-h-[100vh] flex-row bg-[#E7EFF7] pb-[20px] pt-[20px]">
        <Outlet />
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-[1000] flex h-[25px] flex-row bg-[#006BBC]">
        <span className="ml-6 text-[16px] text-white">
          Total Alarms: {randomdata + 25}
        </span>
        <span className="ml-6 text-[16px] text-white">
          High Severity Alarms: {randomdata}
        </span>
        <span className="ml-6 text-[16px] text-white">
          Medium Severity Alarms: {randomdata + 7}
        </span>
        <span className="ml-6 text-[16px] text-white">
          Low Severity Alarms: {randomdata + 7}
        </span>
        <span className="ml-6 text-[16px] text-white">
          Effected Stations: {randomdata2}
        </span>
        <span className="ml-6 text-[16px] text-white">
          Effected Links: {randomdata2 + 4}
        </span>
      </div>
    </div>
  );
};

export default MainLayout;
