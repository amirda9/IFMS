import React, {FC} from 'react';
import {NetworkItem, TextInput} from '~/components';
import {Outlet} from 'react-router-dom';
import {IoAddOutline} from 'react-icons/io5';
import {useHttpRequest} from '~/hooks';

const NetworksPage: FC = () => {

  const {
    state: {list},
  } = useHttpRequest({
    selector: state => ({list: state.http.networkList}),
    initialRequests: request => {
      if (list?.httpRequestStatus !== 'success') {
        request('networkList', undefined);
      }
    },
  });
  return (
    <div className="flex h-screen flex-col">
      <div className="flex h-20 flex-row items-center bg-p px-4 ">
        <h2 className="mr-16 font-s text-2xl text-white">ARIO-IFMS</h2>
        <span className="mr-10 text-white">Network</span>
        <span className="mr-10 text-white">Configuration</span>
        <span className="mr-10 text-white">Monitoring</span>
        <span className="mr-10 text-white">Reporting</span>
        <span className="mr-10 text-white">User Management</span>
        <span className="mr-10 text-white">Help</span>
      </div>
      <div className="flex h-full flex-row bg-b">
        <div className="flex w-1/5 flex-col border-r-2 border-g p-4">
          <div className="flex flex-row items-center">
            <label htmlFor="search" className="mr-2">
              Search
            </label>
            <TextInput id="search" className="mr-10 flex-grow" />
          </div>

          <button className="mt-14 flex flex-row items-center">
            <span className="text-md active:opacity-50">Networks</span>
            <IoAddOutline className="ml-10 text-2xl text-green-500 active:text-green-300" />
          </button>
          <div className="mt-2">
            {list?.data?.map(value => (
              <NetworkItem name={value.name} to={value.id} key={value.id} />
            ))}
          </div>
        </div>
        <div className="flex w-full p-4">
          <Outlet />
        </div>
      </div>
      <div className="h-6 bg-p">footer</div>
    </div>
  );
};

export default NetworksPage;
