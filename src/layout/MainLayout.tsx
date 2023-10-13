import {FC} from 'react';
import {navbarItems} from '~/constant';
import {NavItem} from '~/components';
import {IoPersonOutline} from 'react-icons/io5';
import {httpClear} from '~/store/slices';
import {useAppDispatch, useHttpRequest} from '~/hooks';
import {Outlet} from 'react-router-dom';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';

const MainLayout: FC = () => {
  const dispatch = useAppDispatch();

  const {state} = useHttpRequest({
    selector: state => state.http.verifyToken,
    initialRequests: request => {
      request('verifyToken', undefined);
    },
  });

  const handleLogout = () => {
    localStorage.removeItem('refresh');
    localStorage.removeItem('login');
    dispatch(httpClear(['login', 'refresh']));
  };

  if (state?.httpRequestStatus === 'error') {
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

  return (
    <div style={{minHeight:"100vh"}} className="flex h-full flex-col bg-p">
      <nav className="flex h-20 flex-row items-center bg-p px-4 ">
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
      <div  className="flex min-h-[calc(90vh-39px)] flex-row bg-b">
        <Outlet />
      </div>
      <div className="h-6 bg-p">footer</div>
    </div>
  );
};

export default MainLayout;
