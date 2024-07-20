import {FC} from 'react';
import {navbarItems} from '~/constant';
import {NavItem} from '~/components';
import {IoPersonOutline} from 'react-icons/io5';
import {httpClear} from '~/store/slices';
import {useAppDispatch, useHttpRequest} from '~/hooks';
import {Outlet} from 'react-router-dom';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import { $Get } from '~/util/requestapi';
import { toast } from 'react-toastify';

const MainLayout: FC = () => {
  const dispatch = useAppDispatch();
  const {state} = useHttpRequest({
    selector: state => state.http.verifyToken,
    initialRequests: request => {
      request('verifyToken', undefined);
    },
  });

  const handleLogout = async() => {
    try {
      const logoutapi=await $Get(`auth/users/auth/logout`)
      if(logoutapi?.status == 200){
        localStorage.removeItem('refresh');
        localStorage.removeItem('login');
        dispatch(httpClear(['login', 'refresh']));
      } else{
        toast('Encountered an error', {type: 'error', autoClose: 1000});
      }
    } catch (error) {
      console.log(`logout error is:${error}`);
    }
  };


  if (state?.httpRequestStatus && state?.httpRequestStatus === 'error') {
    handleLogout();
    return <></>;
  }

  if (!state || state.httpRequestStatus === 'loading') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-y-4 bg-b">
        <GeneralLoadingSpinner size="h-20 w-20" />
        <span>Verifying token...</span>
      </div>
    );
  }

  const randomdata=Math.floor(Math.random()* 100) 
  const randomdata2=Math.floor(Math.random()* 10) 
  return (
    <div style={{minHeight:"100vh"}} className="flex h-full flex-col bg-[#E7EFF7]">
      <nav className="flex h-20 z-[10000] flex-row items-center fixed top-0 left-0 right-0 bg-p px-4 ">
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
      <div  className="flex min-h-[100vh] pt-[20px] pb-[20px] flex-row bg-[#E7EFF7]">
        <Outlet />
      </div>
      <div className="h-[25px] z-[1000] fixed bottom-0 right-0 left-0 flex flex-row bg-[#006BBC]">
      <span className='text-white text-[16px] ml-6'>Total Alarms: {randomdata+25}</span>
      <span className='text-white text-[16px] ml-6'>High Severity Alarms: {randomdata}</span>
      <span className='text-white text-[16px] ml-6'>Medium Severity Alarms: {randomdata+7}</span>
      <span className='text-white text-[16px] ml-6'>Low Severity Alarms: {randomdata+7}</span>
      <span className='text-white text-[16px] ml-6'>Effected Stations: {randomdata2}</span>
      <span className='text-white text-[16px] ml-6'>Effected Links: {randomdata2+4}</span>
      </div>
    </div>
  );
};

export default MainLayout;
