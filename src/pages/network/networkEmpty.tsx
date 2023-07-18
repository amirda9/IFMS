import React from 'react';
import {TabItem} from '~/components';
import {Outlet} from 'react-router-dom';

const NetworkEmpty = () => {
  return (
    <div className="h-full w-full">
      <div className="mb-8 flex h-fit  [&_*]:mx-[0.5px]">
        <TabItem to="detail" name="Detail" />
        <TabItem to="access" name="Access" />
        <TabItem to="stations" name="Stations" />
        <TabItem to="links" name="Links" />
      </div>
      <Outlet />
    </div>
  );
};

export default NetworkEmpty;
