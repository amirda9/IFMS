import React, { FC } from 'react';
import { navbarItems } from '~/constant';
import { NavItem } from '~/components';
import { IoPersonOutline } from 'react-icons/io5';
import { httpClear } from '~/store/slices';
import { useAppDispatch } from '~/hooks';
import { Outlet } from 'react-router-dom';

const MainLayout: FC = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex h-screen flex-col">
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
            { label: 'Profile', to: '/profile' },
            { label: 'Logout', handelSelf: true },
          ]}
          onClick={() => {
            localStorage.removeItem('refresh');
            localStorage.removeItem('login');
            dispatch(httpClear(['login', 'refresh']));
          }}
        />
      </nav>
      <div className="flex h-full flex-row bg-b">
        <Outlet />
      </div>
      <div className="h-6 bg-p">footer</div>
    </div>
  );
};

export default MainLayout;
